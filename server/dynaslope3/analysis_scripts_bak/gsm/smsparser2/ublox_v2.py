import re
import os
import sys
import memcache
import numpy as np
import pandas as pd
from datetime import datetime as dt

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import smsclass
import volatile.memory as mem

mc = memcache.Client(['127.0.0.1:11211'],debug=1)


def ublox_v2_parser(sms):
    
    line = sms.msg
    split_line = line.split('*')
    data_line = split_line[0]
    ts = dt.strptime(split_line[1],'%y%m%d%H%M%S').strftime('%Y-%m-%d %H:%M:%S')       
    trash_search = re.search("(\w*(?:[^a-zA-Z0-9_ \t\n\r\f\v,.?!;:]\w*)+)", data_line)  #search for trash in data line
    
    if (trash_search == None):
        try:
            split_data = data_line.split(':')
            logger_name = split_data[0]
            ublox_data = split_data[1]
            split_ublox_data = ublox_data.split(',')
        except:
            print ("Moving to different line")
              
    elif (trash_search != None):
        try:
            split_data = data_line.split(':')
            logger_name = split_data[0]
            ublox_data = split_data[1]
            null_sub = re.sub("(\w*(?:[^a-zA-Z0-9_ \t\n\r\f\v,.?!;:]\w*)+)", "", ublox_data) #replace trash with Null
            split_ublox_data = null_sub.split(',')
    
        except:
            print("Moving to different line")
    
    trans_ublox_data = pd.DataFrame(split_ublox_data).transpose()  
    trans_ublox_data = trans_ublox_data.rename(columns={0: "fix_type",
                                                        1: "latitude", 
                                                        2: "longitude", 
                                                        3: "accuracy",
                                                        4: "msl",
                                                        5: "temp",
                                                        6: "volt"})
    trans_ublox_data["ts"] = ts
    df = pd.concat([trans_ublox_data], axis = 1)
    df = df.replace(r'^\s*$', np.nan, regex = True) #replace empty strings to Null
    df = df[["ts","fix_type","latitude","longitude","accuracy","msl","temp","volt"]]
    
    usplit = logger_name.split('U')
    usplit_site = usplit[0]
    usplit_no = usplit[1]
    
    
    db_logger_data = mc.get("DF_LOGGERS").loc[:,('logger_name','date_deactivated')]
    active_sites = db_logger_data[db_logger_data['date_deactivated'].isna()]
    logger_name = active_sites.logger_name.loc[active_sites['logger_name'].str.contains(usplit_site,case=False)].\
                    loc[active_sites['logger_name'].str.contains('{}$'.format(usplit_no), case=False)].iloc[0]
    
    name_df = "gnss_{}".format(logger_name.lower())     #new table name

    data = smsclass.DataTable(name_df,df)
    return data



