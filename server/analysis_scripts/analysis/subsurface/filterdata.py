# -*- coding: utf-8 -*-
"""
Created on Thu Jun 18 14:39:48 2015

@author: senslope
"""

import numpy as np
import pandas as pd
import memcache


def volt_filter(df):
    dff = df.copy()
    if not dff.empty:
        if len(dff['tsm_name'].values[0]) == 4:
            return dff
        else:
            memc = memcache.Client(['127.0.0.1:11211'], debug=1)
            accelerometers = memc.get('DF_ACCELEROMETERS')
            dff = dff.merge(accelerometers[["accel_id","voltage_min","voltage_max"]],
							how = 'inner', on='accel_id')
            dff.batt[dff.batt >=56] = (dff.batt[dff.batt >=56]+200)/100                 #if not parsed properly
            dff = dff[(dff.batt==2) | ((dff.batt>=dff['voltage_min']) &
					   (dff.batt<=dff['voltage_max']))]
        return dff
    else:
        return dff

def outlier_filter(df):
    dff = df.copy()
#    df['ts'] = pandas.to_datetime(df['ts'], unit = 's')
#    df = df.set_index('ts')
#    df = df.resample('30min').first()
##    df = df.reset_index()
#    df = df.resample('30Min', how='first', fill_method = 'ffill')
    
    dfmean = dff[['x','y','z']].rolling(min_periods=1,window=48,center=False).mean()
    dfsd = dff[['x','y','z']].rolling(min_periods=1,window=48,center=False).std()
    #setting of limits
    dfulimits = dfmean + (3*dfsd)
    dfllimits = dfmean - (3*dfsd)

    dff.x[(dff.x > dfulimits.x) | (dff.x < dfllimits.x)] = np.nan
    dff.y[(dff.y > dfulimits.y) | (dff.y < dfllimits.y)] = np.nan
    dff.z[(dff.z > dfulimits.z) | (dff.z < dfllimits.z)] = np.nan
    
    dflogic = dff.x * dff.y * dff.z
    
    dff = dff[dflogic.notnull()]
   
    return dff

#def range_filter_accel(df):
#    dff = df.copy()
#    ## adjust accelerometer values for valid overshoot ranges
#    dff.x[(dff.x<-2970) & (dff.x>-3072)] = dff.x[(dff.x<-2970) & (dff.x>-3072)] + 4096
#    dff.y[(dff.y<-2970) & (dff.y>-3072)] = dff.y[(dff.y<-2970) & (dff.y>-3072)] + 4096
#    dff.z[(dff.z<-2970) & (dff.z>-3072)] = dff.z[(dff.z<-2970) & (dff.z>-3072)] + 4096
#    
#    
#    dff.x[abs(dff.x) > 1126] = np.nan
#    dff.y[abs(dff.y) > 1126] = np.nan
#    dff.z[abs(dff.z) > 1126] = np.nan
#
#    
##    return dff[dfl.x.notnull()]
#    return dff[dff.x.notnull()]
    

def range_filter_accel(df):
#    add condition if v4 or v5
    
#    dff = df.copy()
#    v4
#    1024 = 2^12 / 4  # for 2g
#    3072 = 4096 - 1024
#    2970 = 4096 - 1126
#    4096 = 2^12

#   13107.2 = 2^16 / 5 # for 2.5g    
#   65536 = 2^16
#    52379 = 65536 - 13107.2
    
    df.loc[:, 'type_num'] = df.type_num.astype(str)
    
    if df.type_num.str.contains('32').any() | df.type_num.str.contains('33').any():

    
    ## adjust accelerometer values for valid overshoot ranges
        df.x[(df.x<-2970) & (df.x>-3072)] = df.x[(df.x<-2970) & (df.x>-3072)] + 4096
        df.y[(df.y<-2970) & (df.y>-3072)] = df.y[(df.y<-2970) & (df.y>-3072)] + 4096
        df.z[(df.z<-2970) & (df.z>-3072)] = df.z[(df.z<-2970) & (df.z>-3072)] + 4096
        
        df.x[abs(df.x) > 1126] = np.nan
        df.y[abs(df.y) > 1126] = np.nan
        df.z[abs(df.z) > 1126] = np.nan
        
    if df.type_num.str.contains('11').any() | df.type_num.str.contains('12').any():

    
    ## adjust accelerometer values for valid overshoot ranges
    ## adjust accelerometer values for valid overshoot ranges
        df.x[(df.x<-2970) & (df.x>-3072)] = df.x[(df.x<-2970) & (df.x>-3072)] + 4096
        df.y[(df.y<-2970) & (df.y>-3072)] = df.y[(df.y<-2970) & (df.y>-3072)] + 4096
        df.z[(df.z<-2970) & (df.z>-3072)] = df.z[(df.z<-2970) & (df.z>-3072)] + 4096
        
        df.x[abs(df.x) > 1126] = np.nan
        df.y[abs(df.y) > 1126] = np.nan
        df.z[abs(df.z) > 1126] = np.nan
        
        
    if df.type_num.str.contains('41').any() | df.type_num.str.contains('42').any():

    
    ## adjust accelerometer values for valid overshoot ranges
    ## adjust accelerometer values for valid overshoot ranges
        df.x[(df.x<-2970) & (df.x>-3072)] = df.x[(df.x<-2970) & (df.x>-3072)] + 4096
        df.y[(df.y<-2970) & (df.y>-3072)] = df.y[(df.y<-2970) & (df.y>-3072)] + 4096
        df.z[(df.z<-2970) & (df.z>-3072)] = df.z[(df.z<-2970) & (df.z>-3072)] + 4096
        
        df.x[abs(df.x) > 1126] = np.nan
        df.y[abs(df.y) > 1126] = np.nan
        df.z[abs(df.z) > 1126] = np.nan
        
    if df.type_num.str.contains('51').any() | df.type_num.str.contains('52').any():

    
    ## adjust accelerometer values for valid overshoot ranges
        df.loc[df.x<-32768, 'x'] = df.loc[df.x<-32768, 'x'] + 65536
        df.loc[df.x<-32768, 'y'] = df.loc[df.x<-32768, 'y'] + 65536
        df.loc[df.x<-32768, 'z'] = df.loc[df.x<-32768, 'z'] + 65536
        
        df.loc[abs(df.x) > 13158, 'x'] = np.nan
        df.loc[abs(df.x) > 13158, 'y'] = np.nan
        df.loc[abs(df.x) > 13158, 'z'] = np.nan
    
#    dff.xval[(dff.xval<-2970) & (dff.xval>-3072)] = dff.xval[(dff.xval<-2970) & (dff.xval>-3072)] + 65536
#    dff.yval[(dff.yval<-2970) & (dff.yval>-3072)] = dff.yval[(dff.yval<-2970) & (dff.yval>-3072)] + 65536
#    dff.zval[(dff.zval<-2970) & (dff.zval>-3072)] = dff.zval[(dff.zval<-2970) & (dff.zval>-3072)] + 65536


    
#    return dff[dfl.x.notnull()]
#    print (dff.xval, dff.yval, dff.zval)
    return df.loc[df.x.notnull(), :]
### Prado - Created this version to remove warnings
def range_filter_accel2(df):
    dff = df.copy()
    x_index = (dff.x<-2970) & (dff.x>-3072)
    y_index = (dff.y<-2970) & (dff.y>-3072)
    z_index = (dff.z<-2970) & (dff.z>-3072)
    
    ## adjust accelerometer values for valid overshoot ranges
    dff.loc[x_index,'x'] = dff.loc[x_index,'x'] + 4096
    dff.loc[y_index,'y'] = dff.loc[y_index,'y'] + 4096
    dff.loc[z_index,'z'] = dff.loc[z_index,'z'] + 4096
    
#    x_range = ((dff.x > 1126) | (dff.x < 100))
    x_range = abs(dff.x) > 1126
    y_range = abs(dff.y) > 1126
    z_range = abs(dff.z) > 1126
    
    ## remove all invalid values
    dff.loc[x_range,'x'] = np.nan
    dff.loc[y_range,'y'] = np.nan
    dff.loc[z_range,'z'] = np.nan
    
    return dff[dff.x.notnull()]
    
#def orthogonal_filter(df):
#
#    # remove all non orthogonal value
#    dfo = df[['x','y','z']]/1024.0
#    mag = (dfo.x*dfo.x + dfo.y*dfo.y + dfo.z*dfo.z).apply(np.sqrt)
#    lim = .08
#    
#    return df[((mag>(1-lim)) & (mag<(1+lim)))]

def orthogonal_filter(df):

    lim = .08
    df.type_num = df.type_num.astype(str)
    
    
    if df.type_num.str.contains('51').any() | df.type_num.str.contains('52').any() :
        div = 13158
        
    else: 
        div = 1024
        

    dfa = df[['x','y','z']]/div
    mag = (dfa.x*dfa.x + dfa.y*dfa.y + dfa.z*dfa.z).apply(np.sqrt)
#    print (df[((mag>(1-lim)) & (mag<(1+lim)))], "div = ",div)
    return (df[((mag>(1-lim)) & (mag<(1+lim)))])

def resample_df(df):
    df.ts = pd.to_datetime(df['ts'], unit = 's')
    df = df.set_index('ts')
    df = df.resample('30min').first()
    df = df.reset_index()
    return df
    
def apply_filters(dfl, orthof=True, rangef=True, outlierf=True):

    if dfl.empty:
        return dfl[['ts','tsm_name','node_id','x','y','z']]
        
  
    if rangef:
        dfl = range_filter_accel(dfl)
        #dfl = dfl.reset_index(level=['ts'])
        if dfl.empty:
            return dfl[['ts','tsm_name','node_id','x','y','z']]

    if orthof: 
        dfl = orthogonal_filter(dfl)
        if dfl.empty:
            return dfl[['ts','tsm_name','node_id','x','y','z']]
            
    
    if outlierf:
        dfl = dfl.groupby(['node_id'])
        dfl = dfl.apply(resample_df)
        dfl = dfl.set_index('ts').groupby('node_id').apply(outlier_filter)
        dfl = dfl.reset_index(level = ['ts'])
        if dfl.empty:
            return dfl[['ts','tsm_name','node_id','x','y','z']]

    
    dfl = dfl.reset_index(drop=True)     
    try:
        dfl = dfl[['ts','tsm_name','node_id','x','y','z','batt']]
    except KeyError:
        dfl = dfl[['ts','tsm_name','node_id','x','y','z']]
    return dfl