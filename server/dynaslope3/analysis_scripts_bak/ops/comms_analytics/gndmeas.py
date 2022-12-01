# -*- coding: utf-8 -*-
"""
Created on Wed Jun 24 11:08:27 2020

@author: Meryll
"""

from datetime import datetime, timedelta
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import dynadb.db as db
import ops.lib.lib as lib
import volatile.memory as mem


output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..//input_output//'))


def get_gndmeas(start, end, mysql=True, to_csv=False):
    if mysql:
        conn = mem.get('DICT_DB_CONNECTIONS')
        query  = "select site_code, ts from "
        query += "  (select * from {analysis}.marker_observations "
        query += "  where ts between '{start}' and '{end}' "
        query += "  ) obs "
        query += "inner join {common}.sites using (site_id) "
        query = query.format(start=start, end=end, common=conn['common']['schema'], analysis=conn['analysis']['schema'])
        df = db.df_read(query, resource='sensor_analysis')
        if to_csv:
            df.to_csv(output_path+'gndmeas.csv', index=False)
    else:
        df = pd.read_csv(output_path+'gndmeas.csv')

    return df


def gndmeas_received(releases, gndmeas):
    ts_end = pd.to_datetime(releases.data_ts.values[0]) + timedelta(minutes=30)
    ts_start = ts_end - timedelta(hours=4)
    if releases.event.values[0] != 1:
        ts_start - timedelta(hours=4)
    site_code = releases.site_code.values[0]
    df = gndmeas.loc[(gndmeas.ts >= ts_start) & (gndmeas.ts < ts_end) & (gndmeas.site_code == site_code), :]
    releases.loc[:, 'gndmeas_received'] = abs(int(df.empty)-1)
    return releases


def gndmeas_stat(df):
    ts = (pd.to_datetime(df.data_ts.values[0])).strftime('%B %Y')
    site_code = df.site_code.values[0]
    expected = len(df)
    received = sum(df.gndmeas_received)
    stat = pd.DataFrame({'site_code': [site_code], 'ts': [ts], 'expected': [expected], 'received': [received]})
    return stat


def main(start, end, mysql=True, to_csv=False):
    sched = lib.release_sched(start, end, mysql=mysql, to_csv=to_csv)
    sched = sched.loc[sched.gndmeas == 1, :]

    gndmeas = get_gndmeas(start, end, mysql=mysql)
    
    ewi_sched_grp = sched.reset_index().groupby('index', as_index=False)
    gndmeas_sched = ewi_sched_grp.apply(gndmeas_received, gndmeas=gndmeas).reset_index(drop=True)

#    event = gndmeas_sched.loc[(gndmeas_sched.event == 1) | (gndmeas_sched.extended == 1), :]
#    routine = gndmeas_sched.loc[~((gndmeas_sched.event == 1) | (gndmeas_sched.extended == 1)), :]
#    event_stat = event.groupby('site_code', as_index=False).apply(gndmeas_stat).reset_index(drop=True)
#    routine_stat = routine.groupby('site_code', as_index=False).apply(gndmeas_stat).reset_index(drop=True)
#    event_stat.loc[:, 'monitoring_type'] = 'event'
#    routine_stat.loc[:, 'monitoring_type'] = 'routine'
#    event_stat.append(routine_stat).drop(columns='ts').to_csv('gndmeas2021.csv', index=False)
#    event_stat.loc[:, 'percent'] = event_stat.apply(lambda row: '{}%'.format(math.ceil(100*row.received/row.expected)), axis=1)
#    routine_stat.loc[:, 'percent'] = routine_stat.apply(lambda row: '{}%'.format(math.ceil(100*row.received/row.expected)), axis=1)

    gndmeas_sched.loc[:, 'month'] = gndmeas_sched.data_ts.dt.month
    gndmeas_sched.loc[:, 'year'] = gndmeas_sched.data_ts.dt.year    
    stat = gndmeas_sched.groupby(['month', 'year', 'site_code'], as_index=False).apply(gndmeas_stat).reset_index(drop=True)
    
    return stat


###############################################################################
if __name__ == "__main__":
    run_start = datetime.now()
    
    start = pd.to_datetime('2022-03-30')
    end = pd.to_datetime('2022-06-15')
    stat = main(start, end, mysql=True)
    stat.loc[:, 'ts'] = stat.ts.apply(lambda x: x.split(' ')[0][0:3] + ' ' + x.split(' ')[1])
    all_stat = stat.groupby('ts').sum().reset_index()
    all_stat.loc[:, 'dt'] = pd.to_datetime(all_stat.ts)
    all_stat = all_stat.loc[all_stat.dt != '2020-12-01']
#    #monthly comparison between diff yrs
#    all_stat.loc[:, 'dt'] = all_stat.dt.apply(lambda x: str(x)[5:7] + ' ' + str(x)[:4])
    all_stat = all_stat.sort_values('dt')
    #percent received / expected
    all_stat.loc[:, 'percentage'] = np.round(100 * all_stat.received / all_stat.expected, 2).apply(lambda x: str(x) + '%')
    
    site_stat = stat.groupby('site_code').sum()
    site_stat.loc[:, 'percentage'] = 100 * site_stat.received / site_stat.expected
    
    fig = plt.figure()
    ax = fig.add_subplot()
    width = 0.35
    expected2020 = ax.bar(np.arange(len(all_stat.loc[all_stat.ts.str.contains('2020'), 'ts']))-width/2, all_stat.loc[all_stat.ts.str.contains('2020'), 'expected'], color='#434348', alpha=0.5, width=width-0.02, label='expected 2020')
    received2020 = ax.bar(np.arange(len(all_stat.loc[all_stat.ts.str.contains('2020'), 'ts']))-width/2, all_stat.loc[all_stat.ts.str.contains('2020'), 'received'], color='#434348', width=width-0.1, label='received 2020')
    ax.bar_label(expected2020, labels=all_stat.loc[all_stat.ts.str.contains('2020'), 'percentage'], padding=8)
    expected2021 = ax.bar(np.arange(len(all_stat.loc[all_stat.ts.str.contains('2021'), 'ts']))+width/2, all_stat.loc[all_stat.ts.str.contains('2021'), 'expected'], color='#7CB5EC', alpha=0.5, width=width-0.02, label='expected 2021')
    received2021 = ax.bar(np.arange(len(all_stat.loc[all_stat.ts.str.contains('2021'), 'ts']))+width/2, all_stat.loc[all_stat.ts.str.contains('2021'), 'received'], color='#7CB5EC', width=width-0.1, label='received 2021')
    ax.bar_label(expected2021, labels=all_stat.loc[all_stat.ts.str.contains('2021'), 'percentage'], padding=8)      
    ax.legend(loc='lower right')
    plt.xticks(np.arange(len(all_stat.loc[all_stat.ts.str.contains('2021'), 'ts'])), all_stat.loc[all_stat.ts.str.contains('2021'), 'ts'].apply(lambda x: x[0:3]))    
    fig.suptitle('Number of received and expected ground measurement')
    
    fig = plt.figure()
    ax = fig.add_subplot()
    percentage2021 = ax.bar(all_stat.loc[all_stat.ts.str.contains('2021'), 'ts'].apply(lambda x: x[0:3]), all_stat.loc[all_stat.ts.str.contains('2021'), 'percentage'].apply(lambda x: np.round(float(x[0:len(x)-1]), 2)), color='#7CB5EC', width=0.85, label='2021')
    ax.bar_label(percentage2021, labels=all_stat.loc[all_stat.ts.str.contains('2021'), 'percentage'], padding=8)      
    percentage2020 = ax.bar(all_stat.loc[all_stat.ts.str.contains('2020'), 'ts'].apply(lambda x: x[0:3]), all_stat.loc[all_stat.ts.str.contains('2020'), 'percentage'].apply(lambda x: np.round(float(x[0:len(x)-1]), 2)), color='#434348', width=0.75, label='2020')
    ax.bar_label(percentage2020, labels=all_stat.loc[all_stat.ts.str.contains('2020'), 'percentage'], padding=8)
    ax.legend(loc='lower right')
    fig.suptitle('Percent received over expected ground measurement')

#    fig = plt.figure(figsize=[25, 15])
#    ax = fig.add_subplot()
#    width = 0.85
#    expected = ax.bar(np.arange(len(event_stat.site_code)), event_stat.expected, color='#7CB5EC', alpha=0.5, width=width-0.02, label='expected')
#    received = ax.bar(np.arange(len(event_stat.site_code)), event_stat.received, color='#7CB5EC', width=width-0.1, label='received')
#    ax.bar_label(expected, labels=event_stat.percent, padding=8, fontsize=12)
#    ax.legend(loc='lower right', fontsize=12)
#    plt.xticks(np.arange(len(event_stat.site_code)), event_stat.site_code.apply(lambda x: x.upper()), rotation=45, fontsize=12)
#    ax.set_ylabel('Count', fontsize=14)
#    ax.tick_params(axis='y', labelsize=12)
#    plt.title('Surficial measurements for event monitoring', fontsize=16)
#    plt.savefig('event_gndmeas2021', dpi=400, bbox_inches='tight')
#    
#    fig = plt.figure(figsize=[20, 15])
#    ax = fig.add_subplot()
#    width = 0.85
#    expected = ax.bar(np.arange(len(routine_stat.site_code)), routine_stat.expected, color='#7CB5EC', alpha=0.5, width=width-0.02, label='expected')
#    received = ax.bar(np.arange(len(routine_stat.site_code)), routine_stat.received, color='#7CB5EC', width=width-0.1, label='received')
#    ax.bar_label(expected, labels=routine_stat.percent, padding=8, fontsize=12)
#    ax.legend(loc='lower right', fontsize=12)
#    plt.xticks(np.arange(len(routine_stat.site_code)), routine_stat.site_code.apply(lambda x: x.upper()), rotation=45, fontsize=12)
#    ax.set_ylabel('Count', fontsize=14)
#    ax.tick_params(axis='y', labelsize=12)
#    plt.title('Surficial measurements for routine monitoring', fontsize=16)
#    plt.savefig('routine_gndmeas2021', dpi=400, bbox_inches='tight')

    runtime = datetime.now() - run_start
    print("runtime = {}".format(runtime))