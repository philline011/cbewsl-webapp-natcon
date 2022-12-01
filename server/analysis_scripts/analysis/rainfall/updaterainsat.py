from datetime import datetime
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import analysis.querydb as qdb

    
def upload_srm_data(site_srm):
    """Updates data of table gauge_name.
    
    Args:
        noah_gauges (dataframe): Rain gauge properties- id, name, data source.
    
    """
    
    gauge_name = 'rain_sat_{}'.format(site_srm['site_code'].values[0])
    #check if table gauge_name exists
    if qdb.does_table_exist(gauge_name) == False:
        #Create a NOAH table if it doesn't exist yet
        qdb.print_out("Creating %s table" %gauge_name)
        qdb.create_NOAH_table(gauge_name)
    else:
        qdb.print_out('rain_sat_%s exists' %gauge_name)
    
    qdb.write_rain_data(gauge_name, site_srm.loc[:, ['ts', 'rain']])

def main():
    """Updates data of NOAH rain gauges.
        
    """
    
    start_time = datetime.now()
    qdb.print_out(start_time)
    
    #get the list of rainfall NOAH rain gauge IDs
    srm_data = pd.read_csv(os.path.dirname(__file__) + '/Dynaslope_Sat_RainFile.csv', names=['site_code', 'ts', 'rain'], skiprows=1)
    srm_data.loc[:, 'ts'] = pd.to_datetime(srm_data.ts)
    
    site_srm = srm_data.groupby('site_code', as_index=False)
    site_srm.apply(upload_srm_data)
    
    qdb.print_out('runtime = %s' %(datetime.now() - start_time))
    
######################################

if __name__ == "__main__": 
    main()