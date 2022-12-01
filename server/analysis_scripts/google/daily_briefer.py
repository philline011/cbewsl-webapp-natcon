from datetime import datetime, timedelta
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import dynadb.db as db
import volatile.memory as mem

conn = mem.get('DICT_DB_CONNECTIONS')
curr_date = datetime.now()

query = "SELECT validity, data_ts, site_code, (pub_sym_id - 1) as alert_level, "
query += "barangay, municipality, province, region "
query += "FROM {common}.sites "
query += "INNER JOIN {web}.monitoring_events USING (site_id) "
query += "INNER JOIN {web}.monitoring_event_alerts USING (event_id) "
query += "INNER JOIN "
query += "  (SELECT * FROM {web}.monitoring_releases "
query += "  LEFT JOIN {web}.monitoring_triggers USING (release_id) "
query += "  LEFT JOIN {web}.internal_alert_symbols USING (internal_sym_id)) AS trig  "
query += "USING (event_alert_id) "
query += "WHERE data_ts between '{start}' and '{end}' "
query += "and site_code != 'umi' "
query += "AND event_id IN ( "
query += "  SELECT event_id FROM {web}.monitoring_events "
query += "  INNER JOIN {web}.monitoring_event_alerts USING (event_id) "
query += "  INNER JOIN {web}.monitoring_releases USING (event_alert_id) "
query += "  WHERE pub_sym_id != 1) "
query += "ORDER BY site_code, data_ts"
query = query.format(common=conn['common']['schema'], web=conn['website']['schema'],
                     start=pd.to_datetime(curr_date.date()) - timedelta(hours=24.5),
                     end=pd.to_datetime(curr_date.date()) - timedelta(minutes=31))
event_df = db.df_read(query, resource='website_analysis')
with_bulletin = event_df.loc[(event_df.alert_level != 0) | (event_df.data_ts < event_df.validity), :]
extended_df = event_df.loc[~((event_df.alert_level != 0) | (event_df.data_ts < event_df.validity)), :]

query = "SELECT validity, data_ts, site_code, (pub_sym_id - 1) as alert_level, "
query += "barangay, municipality, province, region "
query += "FROM {common}.sites "
query += "INNER JOIN {web}.monitoring_events USING (site_id) "
query += "INNER JOIN {web}.monitoring_event_alerts USING (event_id) "
query += "INNER JOIN "
query += "  (SELECT * FROM {web}.monitoring_releases "
query += "  LEFT JOIN {web}.monitoring_triggers USING (release_id) "
query += "  LEFT JOIN {web}.internal_alert_symbols USING (internal_sym_id)) AS trig  "
query += "USING (event_alert_id) "
query += "WHERE data_ts between '{start}' and '{end}' "
query += "and site_code != 'umi' "
query += "AND event_id NOT IN ( "
query += "  SELECT event_id FROM {web}.monitoring_events "
query += "  INNER JOIN {web}.monitoring_event_alerts USING (event_id) "
query += "  INNER JOIN {web}.monitoring_releases USING (event_alert_id) "
query += "  WHERE pub_sym_id != 1) "
query += "ORDER BY site_code, data_ts"
query = query.format(common=conn['common']['schema'], web=conn['website']['schema'],
                     start=pd.to_datetime(curr_date.date()) - timedelta(hours=24.5),
                     end=pd.to_datetime(curr_date.date()) - timedelta(minutes=31))
routine_df = db.df_read(query, resource='website_analysis')


summary = "{} EWIs sent to stakeholders\n".format(len(routine_df) + len(event_df))
summary += "{} bulletins issued\n".format(len(with_bulletin))


if len(with_bulletin) != 0:
    with_bulletin = with_bulletin.sort_values('alert_level', ascending=False).drop_duplicates(['barangay', 'municipality', 'province'])
    event_summary = []
    for alert_level in sorted(set(with_bulletin.alert_level), reverse=True):
        site_list = '; '.join(sorted(set(with_bulletin.loc[with_bulletin.alert_level == alert_level, ['barangay', 'municipality', 'province']].apply(lambda row: ', '.join([row.barangay, row.municipality, row.province]), axis=1))))
        event_summary += ['Alert {alert_level} in a site in: {site_list}'.format(alert_level=alert_level, site_list=site_list)]
    event_summary = '{event_count} events ({site_list})'.format(event_count=len(with_bulletin), site_list='. '.join(event_summary))
    summary += '\n{}'.format(event_summary)

if len(extended_df) != 0:
    extended_summary = '{extended_count} extended ({site_list})'.format(extended_count=len(extended_df), site_list=', '.join(sorted(set(extended_df.site_code.str.upper()))))
    summary += '\n{}'.format(extended_summary)

if len(routine_df) != 0:
    routine_summary = '{routine_count} routine (excluding UMI)'.format(routine_count=len(routine_df))
    summary += '\n{}'.format(routine_summary)


province_list = sorted(set(pd.concat([event_df.province, routine_df.province])))
if len(province_list) != 0:
    summary += '\n\nEWI sent to {province_count} provinces ({province_list})'.format(province_count=len(province_list), province_list=', '.join(province_list))
if len(with_bulletin) != 0:
    summary += '\nBulletins issued within PHIVOLCS, OCD main office and regional offices ({})'.format(', '.join(sorted(set(with_bulletin.region))))

print(summary)


query = "SELECT link from olivia_link where link_id = 3"
python_path = db.read(query, connection = "gsm_pi")[0][0]

file_path = os.path.dirname(__file__)

#c_id = 'UgxqJR21UfI_8m20uHR4AaABAagByre4Cg'
c_id = 'Ugy4F9af0evNOO0nHVh4AaABAagBksbQDA'
cmd = "{} {}/send_message.py --conversation-id {} --message-text '{}'".format(python_path, file_path, c_id, summary)
os.system(cmd)
