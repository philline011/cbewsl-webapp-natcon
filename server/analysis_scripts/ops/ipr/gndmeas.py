# -*- coding: utf-8 -*-
"""
Created on Wed Jun 24 11:08:27 2020

@author: Meryll
"""

from datetime import timedelta
import numpy as np
import os
import pandas as pd

import smstags


output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..//input_output//'))


def main(start, end, sched, eval_df, mysql=False):
    inbox_tag = smstags.inbox_tag(start, end, mysql=mysql)
    inbox_tag = inbox_tag.loc[inbox_tag.tag.isin(['#GroundMeas', '#GroundObs']), :]
    
    monitoring_ipr = pd.read_excel(output_path + 'monitoring_ipr.xlsx', sheet_name=None)

    for name in monitoring_ipr.keys():
        indiv_ipr = monitoring_ipr[name]
        indiv_ipr.columns = indiv_ipr.columns.astype(str)
        for ts in indiv_ipr.columns[5:]:
            ts = pd.to_datetime(ts)
            ts_end = ts + timedelta(0.5)
            shift_release = sched.loc[(sched.data_ts > ts) & (sched.data_ts <= ts_end), :]
            shift_meas = inbox_tag.loc[(inbox_tag.ts_sms >= ts) & (inbox_tag.ts_sms < ts_end), :]
            if len(shift_meas) >= 10:
                mult = 3
            else:
                mult = 5
            shift_eval = eval_df.loc[(eval_df.shift_ts >= ts) & (eval_df.shift_ts <= ts+timedelta(1)) & ((eval_df['evaluated_MT'] == name) | (eval_df['evaluated_CT'] == name) | (eval_df['evaluated_backup'] == name)), :].drop_duplicates('shift_ts', keep='last')
            shift_eval = shift_eval.drop_duplicates('shift_ts', keep='last')[0:1]
            deduction = min(6, np.nansum(shift_eval[['aim_surficial_data', 'routine_surficial_data', 'surficial_data', 'aim_moms', 'routine_moms', 'moms']].fillna(0).apply(lambda x: int(x)).values))
            if deduction != 0 or len(shift_meas) != 0:
                grade = 1 - np.round(mult*deduction/30, 2)
            else:
                grade = np.nan
            if len(shift_release) != 0:
                indiv_ipr.loc[indiv_ipr.Output1 == 'Ground measurement', str(ts)] = grade
            else:
                indiv_ipr.loc[indiv_ipr.Output2 == 'ground measurement', str(ts)] = grade
        monitoring_ipr[name] = indiv_ipr
    
    writer = pd.ExcelWriter(output_path + 'monitoring_ipr.xlsx')
    for sheet_name, xlsxdf in monitoring_ipr.items():
        xlsxdf.to_excel(writer, sheet_name, index=False)
    writer.save()
