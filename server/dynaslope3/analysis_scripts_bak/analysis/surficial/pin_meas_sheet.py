#### Import essential libraries
from datetime import datetime, timedelta
import os
import pandas as pd
import sys

#### Import local codes
sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import analysis.surficial.markeralerts as ma
import dynadb.db as db
import gsm.smsparser2.smsclass as smsclass
import volatile.memory as mem


def main(ts=''):
    conn = mem.get('DICT_DB_CONNECTIONS')
    
    site_code = 'pin'
    query = "SELECT * FROM {analysis}.site_markers where site_id in "
    query += "(select site_id from {common}.sites "
    query += "where site_code = '{site_code}')"
    query += "and in_use = 1"
    query = query.format(analysis=conn['analysis']['schema'], common=conn['common']['schema'], site_code=site_code)
    site_markers = db.df_read(query, resource='sensor_data')
    site_id = site_markers['site_id'].values[0]
    
    key = '1a7Rk48Mucfz2hyUQzj5UiqMTsPvExx1xmWtEzBrhGik'
    url = 'https://docs.google.com/spreadsheets/d/{key}/export?format=csv&gid=0'.format(key=key)
    df = pd.read_csv(url)
    
    df = df.loc[:, :(df.columns[df.columns.str.contains('agwat', case=False)].values[0])]
    marker_names = df.loc[:, df.columns[df.columns.str.contains('marker', case=False)].values[0]:][2:3].values[0]
    df.columns = ['ts', 'weather', 'observer_name'] + list(marker_names)
    df = df.loc[~df.ts.isnull(), :marker_names[-2]]
    df.loc[:, 'ts'] = pd.to_datetime(df.ts)
    if ts == '':
        df = df.loc[df.ts >= datetime.now() - timedelta(2), :]
    else:
        df = df.loc[df.ts == ts, :]
    df = df.sort_values('ts')
    df.loc[:, 'meas_type'] = 'routine'
    df.loc[:, 'data_source'] = 'DRS'
    df.loc[:, 'reliability'] = 1
    df.loc[:, 'site_id'] = site_id
    
    marker_names = marker_names[:-1]
    
    for ts in df.ts:
        temp_df = df.loc[df.ts == ts, :]
        temp_df = temp_df.fillna(0)
        marker_observations = temp_df.loc[:, ['site_id', 'ts', 'meas_type', 'observer_name', 'data_source', 'reliability', 'weather']]

        # Check if existing entry
        query = ("SELECT marker_observations.mo_id FROM marker_observations "
            "WHERE ts = '{}' and site_id = '{}'".format(ts, site_id)
            )    
        mo_id = db.read(query, resource="sensor_data")
        
        if len(mo_id) == 0:    
            mo_id = db.df_write(data_table=smsclass.DataTable("marker_observations", 
                marker_observations), resource="sensor_data", last_insert=True)
        else:
            mo_id = int(mo_id[0][0])
    
        marker_data = temp_df[marker_names].transpose().reset_index()
        marker_data.columns = ['marker_name', 'measurement']
        marker_data = pd.merge(marker_data, site_markers[['marker_name', 'marker_id']], how='left', on='marker_name')
        marker_data.loc[:, "mo_id"] = mo_id
        marker_data = marker_data.loc[(marker_data.measurement.apply(lambda x: str(x).replace('.', '')).str.isnumeric()) & (marker_data.measurement != 0), ['mo_id', 'marker_id', 'measurement']]
        db.df_write(data_table = smsclass.DataTable("marker_data", marker_data), resource="sensor_data")
    
        ma.generate_surficial_alert(site_id=site_id, ts=ts)

if __name__ == "__main__":
    main()