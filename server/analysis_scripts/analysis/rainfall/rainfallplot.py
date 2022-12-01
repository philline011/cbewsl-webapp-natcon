##### IMPORTANT matplotlib declarations must always be FIRST to make sure that matplotlib works with cron-based automation
import platform
curOS = platform.system()
if curOS != "Windows":
    import matplotlib as mpl
    mpl.use('Agg')

from datetime import datetime, timedelta
import matplotlib.dates as md
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))
import rainfallalert as ra


def stitch_intervals(ranges):
    """Stiches overlapping timestamp ranges without data.
    
    Args:
        ranges (list): Timestamp ranges without data.

    Returns:
        list: List of tuples containing ranges of timestamp without data.
    
    """

    result = []
    cur_start = -1
    cur_stop = -1
    for start, stop in sorted(ranges):
        if start != cur_stop:
            result.append((start,stop))
            cur_start, cur_stop = start, stop
        else:
            result[-1] = (cur_start,stop)
            cur_stop = max(cur_stop,stop)
    return result

def plot_shade(df, ax):
    """Shades timestamp range without data.
    
    Args:
        df (dataframe): Dataframe containing timestamp ranges without data.
        ax (matplotlib.axes._subplots.AxesSubplot): Subplot used in plotting.
    
    """

    ax.axvspan(pd.to_datetime(df['shaded_range'].values[0][0]),
               pd.to_datetime(df['shaded_range'].values[0][1]),
               alpha = 0.5, color='#afeeee', label='no data')

def rain_subplot(rain_gauge_props, offsetstart, start, end, threshold,
                 insax, cumax, fig, site_code, save_plot):
    """Plots instantaneous, 1-day cumulative and 3-day cumulative rainfall.
    
    Args:
        rain_gauge_props (dataframe): Contains name and ID of rain gauge.
        offsetstart (datetime): Start of data used to compute for 
                                cumulative rainfall.
        start (datetime): Start timestamp of plot.
        end (datetime): End timestamp of plot.
        threshold (dataframe): Contains threshold for 1-day and 3-day
                               cumulative rainfall
        insax (matplotlib.axes._subplots.AxesSubplot): For instantaneous rainfall.
        cumax (matplotlib.axes._subplots.AxesSubplot): For cumulative rainfall.
        fig (matplotlib.figure.Figure): Figure used in plotting.
        site_code (str): Three-letter code per site.

    """

    gauge_name = rain_gauge_props['gauge_name'].values[0]
    rain_id = rain_gauge_props['rain_id'].values[0]
    gauge_distance = rain_gauge_props['distance'].values[0]
    data_source = rain_gauge_props['data_source'].values[0]
    # resampled data
    data = ra.get_resampled_data(rain_id, gauge_name, offsetstart, start, end,
                                 check_nd=False, analysis=False)
    if len(data) == 0:
        data = pd.DataFrame(columns=['ts', 'rain']).set_index('ts')

    # 1-day cumulative rainfall
    rainfall2 = data.rolling(min_periods=1, window=48).sum()
    rainfall2 = np.round(rainfall2,4)
    
    # 3-day cumulative rainfall
    rainfall3 = data.rolling(min_periods=1, window=144).sum()
    rainfall3 = np.round(rainfall3,4)

    # instantaneous, 1-day, and 3-day cumulative rainfall in one dataframe
    data['24hr cumulative rainfall'] = rainfall2.rain
    data['72hr cumulative rainfall'] = rainfall3.rain
    data = data[(data.index >= start)]
    data = data[(data.index <= end)]
    plot1 = data['rain']
    plot2 = data['24hr cumulative rainfall']
    plot3 = data['72hr cumulative rainfall']
    plot4 = threshold['half of 2yr max rainfall']
    plot5 = threshold['2yr max rainfall']
    
    ylabel = gauge_name.upper()
    if data_source == 'satellite':
        gauge_distance = 'REDAS satellite data'
    elif site_code.lower() in gauge_name.lower():
        gauge_distance = 'on-site rain gauge'
    else:
        gauge_distance = str(gauge_distance) + 'km away from site'
    ylabel += '\n ({})'.format(gauge_distance)
    ylabel = ylabel.replace('RAIN_NOAH_', '*NOAH ').replace('RAIN_', '')

    if save_plot:
        RG_num = rain_gauge_props.index[0]
        inscurax = insax[RG_num]
        cumcurax = cumax[RG_num]
        
        # shade range without data
        try:
            nan_data = data[pd.isnull(data).rain]
            nan_data = nan_data.reset_index()
            nan_range = nan_data['ts'].apply(lambda x: (x, x+timedelta(hours=0.5)))
            shaded_range = stitch_intervals(nan_range)
            shaded_df = pd.DataFrame({'shaded_range': shaded_range})
            shaded_grp = shaded_df.groupby('shaded_range')
            shaded_grp.apply(plot_shade, ax=inscurax)
        except:
            pass
    
        try:
            # instantaneous, 1-day & 3-day cumulative rainfall
            inscurax.bar(plot1.index,plot1,width=0.02,color='k', label='instantaneous rainfall')
            cumcurax.plot(plot2.index,plot2,color='b', label='1-day cumulative rainfall')
            cumcurax.plot(plot3.index,plot3,color='r', label='3-day cumulative rainfall')
            # 1-day & 3-day cumulative rainfall threshold
            cumcurax.plot(plot4.index,plot4,color='b',linestyle='--', label='1-day rainfall threshold')
            cumcurax.plot(plot5.index,plot5,color='r',linestyle='--', label='3-day rainfall threshold')
                        
        except:
            pass
        
        inscurax.set_ylabel(ylabel, fontsize=12)
        
        # formats major axis to Month-day
        dfmt = md.DateFormatter('%m-%d')
        inscurax.xaxis.set_major_formatter(dfmt)
        cumcurax.xaxis.set_major_formatter(dfmt)
    
    data = data.reset_index()
    data.loc[:, 'ts'] = data['ts'].apply(lambda x: x.strftime("%Y-%m-%d %H:%M"))
    
    rain_id = rain_gauge_props['rain_id'].values[0]
    data_source = rain_gauge_props['data_source'].values[0]
    threshold_value = rain_gauge_props['threshold_value'].values[0]
    return pd.DataFrame({'gauge_name': [gauge_name], 'data': [data],
                         'distance': [gauge_distance], 'data_source': [data_source],
                         'threshold_value': [threshold_value], 'rain_id': [rain_id]})
    
def rain_stack_plot(site_code, gauges, offsetstart, start, end, tsn, threshold,
                    sc, output_path, save_plot):
    """Plots instantaneous, 1-day cumulative and 3-day cumulative rainfall.
    
    Args:
        site_code (str): Three-letter code per site.
        gauges (dataframe): Contains nearest rain gauges per site.
        offsetstart (datetime): Start of data used to compute for 
                                cumulative rainfall.
        start (datetime): Start timestamp of plot.
        end (datetime): End timestamp of plot.
        tsn (str): Timestamp format used in naming plots to be saved.
        threshold (dataframe): Contains threshold for 1-day and 3-day
                               cumulative rainfall
        sc (str): Configurations of server.
        output_path (str): File path to save plots.

    """

    # assigning axis name per subplot
    plt.xticks(rotation=70, size=5)       
    fig = plt.figure(figsize = (15,20))
    # assigning axis name for instantaneous rainfall of each rain gauge
    ins1 = fig.add_subplot(4,2,1)
    ins2 = fig.add_subplot(4,2,3, sharex=ins1, sharey=ins1)
    ins3 = fig.add_subplot(4,2,5, sharex=ins1, sharey=ins1)
    ins4 = fig.add_subplot(4,2,7, sharex=ins1, sharey=ins1)
    # assigning axis name for cumulative rainfall of each rain gauge
    cum1 = fig.add_subplot(4,2,2)
    cum2 = fig.add_subplot(4,2,4, sharex=cum1, sharey=cum1)
    cum3 = fig.add_subplot(4,2,6, sharex=cum1, sharey=cum1)
    cum4 = fig.add_subplot(4,2,8, sharex=cum1, sharey=cum1)

    insax = [ins1, ins2, ins3, ins4]
    cumax = [cum1, cum2, cum3, cum4]
    # range of x and y axis
    try:
        ins1.set_xlim([start - timedelta(hours=2), end + timedelta(hours=2)])
        cum1.set_xlim([start - timedelta(hours=2), end + timedelta(hours=2)])
    except:
        pass

    rain_gauge_props = gauges.groupby('rain_id')
    
    # plotting per rain gauge
    rain_gauge_data = rain_gauge_props.apply(rain_subplot, start=start, 
                          offsetstart=offsetstart, end=end, threshold=threshold,
                          insax=insax, cumax=cumax, fig=fig, site_code=site_code,
                          save_plot=save_plot).reset_index(drop=True)
    
    # trim plot if cumulative rainfall above 500mm
    max_ins = []
    max_cum = []
    for data in rain_gauge_data.data:
        max_ins += [np.nanmax(data.rain)]
        max_cum += [np.nanmax([np.nanmax(data['24hr cumulative rainfall']), np.nanmax(data['72hr cumulative rainfall'])])]
    max_ins = np.nanmax(max_ins+[4])
    ins1.set_ylim(0, max_ins+1)
    max_cum = np.nanmax(max_cum+[gauges['threshold_value'].values[0]])
    if max_cum > 475:
        max_cum = 475
    cum1.set_ylim(0, max_cum+25)
    
    if save_plot:
        # adjusts subplots
        fig.subplots_adjust(top=0.93, right=0.92, left=0.08, bottom=0.1,
                            hspace=0.23, wspace=0.13)
        # title of plot
        fig.suptitle(site_code.upper()+" as of "+str(end),fontsize=30)
    
        #legend and footnote
        lines_labels = [ax.get_legend_handles_labels() for ax in [ins4, cum4]]
        temp_lines, temp_labels = [sum(lol, []) for lol in zip(*lines_labels)]
        lines = []
        labels = []
        for i in range(len(temp_labels)):
            if temp_labels[i] not in labels:
                labels += [temp_labels[i]]
                lines += [temp_lines[i]]
        fig.legend(lines, labels, bbox_to_anchor=(0.5, 0.05), ncol=3,
                         fontsize=12, loc='upper center')
        plt.figtext(0.5, 0.005, "*NOAH rain gauge data: Philippine Copyright {} by DOST-ASTI".format(datetime.now().year), ha="center", fontsize=12)
    
        for ax in fig.axes:
            plt.sca(ax)
            plt.xticks(rotation=90)
            
        # save plot on file path for monitoring output or event monitoring
        plt.savefig(output_path+sc['fileio']['rainfall_path'] + 'rainfall_' +
                    tsn + '_' + site_code, dpi=100, facecolor='w',
                    edgecolor='w',orientation='landscape')
    
#    plt.close()
    
    return rain_gauge_data

################################     MAIN     ################################

def main(gauges, offsetstart, start, end, tsn, sc, output_path, save_plot):
    """Plots instantaneous, 1-day cumulative and 3-day cumulative rainfall.
    
    Args:
        gauges (dataframe): Contains nearest rain gauges per site.
        offsetstart (datetime): Start of data used to compute for 
                                cumulative rainfall.
        start (datetime): Start timestamp of plot.
        end (datetime): End timestamp of plot.
        tsn (str): Timestamp format used in naming plots to be saved.
        sc (str): Configurations of server.
        output_path (str): File path to save plots.

    """

    #rainfall properties from siterainprops
    site_code = gauges['site_code'].values[0]
    twoyrmax = gauges['threshold_value'].values[0]
    halfmax=twoyrmax/2
    index = [start, end]
    columns=['half of 2yr max rainfall','2yr max rainfall']
    threshold = pd.DataFrame(index=index, columns=columns)
    threshold['half of 2yr max rainfall'] = halfmax  
    threshold['2yr max rainfall'] = twoyrmax

    gauges.index = range(len(gauges))
    rain_data = rain_stack_plot(site_code, gauges, offsetstart, start, end,
                                tsn, threshold, sc, output_path, save_plot)
    rain_data.loc[:, 'source'] = rain_data.distance.map({'REDAS satellite data': 2, 'on-site rain gauge': 0}).fillna(1)
    rain_data = rain_data.sort_values(['source', 'distance'])
    rain_data = rain_data.drop('source', axis=1)
    
    return pd.DataFrame({'site_id': [gauges['site_id'].values[0]],
                         'plot': [rain_data]})
