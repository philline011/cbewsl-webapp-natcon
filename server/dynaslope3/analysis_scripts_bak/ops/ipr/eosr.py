# -*- coding: utf-8 -*-
"""
Created on Wed Jun 24 11:08:27 2020

@author: Meryll
"""

from datetime import timedelta
import numpy as np
import os
import pandas as pd

import lib as ipr_lib

output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..//input_output//'))

def main(start, end, sched, eval_df, mysql=False):
    monitoring_ipr = pd.read_excel(output_path + 'monitoring_ipr.xlsx', sheet_name=None)

    downtime = ipr_lib.system_downtime(mysql=mysql)
    sched = ipr_lib.remove_downtime(sched, downtime)

    
    for name in monitoring_ipr.keys():
        indiv_ipr = monitoring_ipr[name]
        indiv_ipr.columns = indiv_ipr.columns.astype(str)
        for ts in indiv_ipr.columns[5:]:
            ts = pd.to_datetime(ts)
            ts_end = ts + timedelta(0.5)
            shift_release = sched.loc[(sched.data_ts > ts) & (sched.data_ts <= ts_end), :]
            event_shift_release = shift_release.loc[shift_release.event == 1, :]

            shift_eval = eval_df.loc[(eval_df.shift_ts >= ts) & (eval_df.shift_ts <= ts+timedelta(1)) & ((eval_df['evaluated_MT'] == name) | (eval_df['evaluated_CT'] == name) | (eval_df['evaluated_backup'] == name)), :].drop_duplicates('shift_ts', keep='last')
            shift_eval = shift_eval.drop_duplicates('shift_ts', keep='last')[0:1]
            deduction = np.nansum(shift_eval[['routine_tag', 'surficial_tag', 'response_tag', 'rain_tag', 'call_log', 'fyi_tag', 'aim_tag', 'aim_surficial_tag', 'aim_response_tag']].values)
            if len(shift_release) != 0:
                indiv_ipr.loc[indiv_ipr.Output1.str.contains('narrative', na=False), str(ts)] = max(0, np.round((15*len(set(shift_release.site_code)) - deduction)/(15*len(set(shift_release.site_code))), 2))
                if len(event_shift_release) != 0:
                    indiv_ipr.loc[indiv_ipr.Output2 == 'EoSR', str(ts)] = np.round((len(set(shift_release.site_code)) - 0.1*np.nansum(shift_eval['eosr']))/len(set(shift_release.site_code)), 2)
                    indiv_ipr.loc[indiv_ipr.Output2 == 'narratives', str(ts)] = int(((shift_eval.mt_narrative == 'No').values.all()) & ((shift_eval.eosr_info == 'Yes').values.all()))
                    indiv_ipr.loc[indiv_ipr.Output2 == 'plot attachment', str(ts)] = np.round((len(set(shift_release.site_code)) - 0.25*np.nansum(shift_eval['plot']))/len(set(shift_release.site_code)), 2)
                    indiv_ipr.loc[indiv_ipr.Output2 == 'subsurface analysis', str(ts)] = np.round((3*len(set(shift_release.site_code)) - 0.75*np.nansum(shift_eval['eosr_subsurface']))/(3*len(set(shift_release.site_code))), 2)
                    indiv_ipr.loc[indiv_ipr.Output2 == 'surficial analysis', str(ts)] = np.round((3*len(set(shift_release.site_code)) - 0.75*np.nansum(shift_eval['eosr_surficial']))/(3*len(set(shift_release.site_code))), 2)
                    indiv_ipr.loc[indiv_ipr.Output2 == 'rainfall analysis', str(ts)] = np.round((3*len(set(shift_release.site_code)) - 0.75*np.nansum(shift_eval['eosr_rain']))/(3*len(set(shift_release.site_code))), 2)
                    moms_release = shift_release.loc[shift_release.moms == 1, :]
                    if len(moms_release) != 0:
                        indiv_ipr.loc[indiv_ipr.Output2 == 'moms analysis', str(ts)] = np.round((3*len(set(shift_release.loc[shift_release.moms == 1, 'site_code'])) - 0.75*np.nansum(shift_eval['eosr_moms']))/(3*len(set(shift_release.loc[shift_release.moms == 1, 'site_code']))), 2)
                    eq_release = shift_release.loc[shift_release.EQ == 1, :]
                    if len(eq_release) != 0:
                        indiv_ipr.loc[indiv_ipr.Output2 == 'eq analysis', str(ts)] = np.round((3*len(set(shift_release.loc[shift_release.EQ == 1, 'site_code'])) - 0.75*np.nansum(shift_eval['eosr_eq']))/(3*len(set(shift_release.loc[shift_release.EQ == 1, 'site_code']))), 2)
            else:
                indiv_ipr.loc[indiv_ipr.Output2 == 'gintag', str(ts)] = max(0, np.round((15-deduction)/15, 2))
        monitoring_ipr[name] = indiv_ipr
        
    writer = pd.ExcelWriter(output_path + 'monitoring_ipr.xlsx')
    for sheet_name, xlsxdf in monitoring_ipr.items():
        xlsxdf.to_excel(writer, sheet_name, index=False)
    writer.save()
