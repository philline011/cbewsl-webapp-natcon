# -*- coding: utf-8 -*-
"""
Created on Wed Jun 24 11:08:27 2020

@author: Meryll
"""

from datetime import timedelta
import numpy as np
import os
import pandas as pd
import sys

import lib as ipr_lib

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import ops.lib.lib as lib
import ops.lib.querydb as qdb
import ops.lib.raininfo as raininfo


add_start = 30 #number of minutes from data ts to start sending of rain info
due = 15 #target number of minutes from start to send all rain info
delay_deduction = 0.1 #deduction per delay_min in minutes
delay_min = 10

output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..//input_output//'))


def main(start, end, sched, site_names, eval_df, mysql=True, to_csv=False):

    sent_start = start - timedelta(hours=0.25)
    sent_end = end + timedelta(hours=4)
    sched.loc[:, 'ts_due'] = sched.data_ts + timedelta(minutes=add_start+due)
    
    rain_recipients = qdb.get_rain_recipients(mysql=mysql, to_csv=to_csv)
    rain_sent = qdb.get_rain_sent(sent_start, sent_end, mysql=mysql, to_csv=to_csv)
    rain_sent = rain_sent.loc[~rain_sent.ts_sent.isnull(), :]
    rain_sched = raininfo.ewi_sched(sched, rain_recipients, rain_sent, site_names)
    
    
    monitoring_ipr = pd.read_excel(output_path + 'monitoring_ipr.xlsx', sheet_name=None)
    
    downtime = ipr_lib.system_downtime(mysql=mysql)
    rain_sched = ipr_lib.remove_downtime(rain_sched, downtime)
    
    
    for name in monitoring_ipr.keys():
        indiv_ipr = monitoring_ipr[name]
        indiv_ipr.columns = indiv_ipr.columns.astype(str)
        for ts in indiv_ipr.columns[5:]:
            ts = pd.to_datetime(ts)
            sending_status = rain_sched.loc[(rain_sched.data_ts >= ts) & (rain_sched.data_ts < ts+timedelta(0.5)), :]
            # ewi bulletin timeliness
            if len(sending_status) == 0:
                # no scheduled
                grade_t = np.nan
            elif len(sending_status.loc[sending_status.ts_written.isnull(), :]) == 0 and all(sending_status.ts_written <= sending_status.ts_due):
                # all sent on time
                grade_t = 1
            else:
                grade_t = np.round(np.average(1 - sending_status.apply(lambda row: np.where(row.ts_written is pd.NaT, 1, delay_deduction * max(0, (row.ts_written - row.ts_due).total_seconds())/(60*delay_min)), axis=1)), 2)
            indiv_ipr.loc[indiv_ipr.Output2 == 'Rainfall info', str(ts)] = grade_t
            if ts >= pd.to_datetime('2021-04-01') and len(sending_status) != 0:
                shift_eval = eval_df.loc[(eval_df.shift_ts >= ts) & (eval_df.shift_ts <= ts+timedelta(1)) & ((eval_df['evaluated_MT'] == name) | (eval_df['evaluated_CT'] == name) | (eval_df['evaluated_backup'] == name)), :].drop_duplicates('shift_ts', keep='last')[0:1]
                shift_eval = shift_eval.drop_duplicates('shift_ts', keep='last')[0:1]
                unsent = len(set(sending_status.loc[sending_status.ts_written.isnull(), 'data_ts']))
                deduction = np.nansum(0.5*(shift_eval['rain_det']+unsent) + 0.05*shift_eval['rain_typo'])
                if len(sending_status) != 0 and np.nansum(shift_eval['rain_det'] + shift_eval['rain_typo']) == 0:
                    deduction = len(sending_status.loc[sending_status.ts_written.isnull(), :])
                indiv_ipr.loc[indiv_ipr.Output1 == 'Rainfall info', str(ts)] = max(0, np.round((len(sending_status.drop_duplicates(['data_ts', 'site_code'])) - deduction)/len(sending_status.drop_duplicates(['data_ts', 'site_code'])), 2))
        monitoring_ipr[name] = indiv_ipr
        
    writer = pd.ExcelWriter(output_path + 'monitoring_ipr.xlsx')
    for sheet_name, xlsxdf in monitoring_ipr.items():
        xlsxdf.to_excel(writer, sheet_name, index=False)
    writer.save()
