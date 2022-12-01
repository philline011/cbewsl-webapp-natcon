from datetime import timedelta
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd











site_code = 'lun'











data = pd.read_csv('HISTORICAL_RAIN_{}_Excel_File.csv'.format(site_code.upper()))
data['ts'] = pd.to_datetime(data.DateTime)
data = data.rename(columns={'RAIN_VAL': 'rain'})
data = data.sort_values('ts')
data = data.set_index('ts')
data.resample('1h', closed='left').sum(min_count=1)
data = data.resample('1h', closed='left').sum(min_count=1)

# 1-day cumulative rainfall
rainfall2 = data.rolling(min_periods=1, window=24).sum()
rainfall2 = np.round(rainfall2,4)
# 3-day cumulative rainfall
rainfall3 = data.rolling(min_periods=1, window=72).sum()
rainfall3 = np.round(rainfall3,4)
data['24hr cumulative rainfall'] = rainfall2.rain
data['72hr cumulative rainfall'] = rainfall3.rain

data = data[(data.index >= '2021-12-15')]

plot1 = data['rain']
plot2 = data['24hr cumulative rainfall']
plot3 = data['72hr cumulative rainfall']
plot3 = plot3[(plot3.index >= '2021-12-17')]

index = [min(data.index), max(data.index)]
columns=['half of 2yr max rainfall','2yr max rainfall']
threshold = pd.DataFrame(index=index, columns=columns)
threshold['half of 2yr max rainfall'] = 60.5455  
threshold['2yr max rainfall'] = 121.0911
plot4 = threshold['half of 2yr max rainfall']
plot5 = threshold['2yr max rainfall']


fig = plt.figure(figsize=[12.8, 9.6])
ax = fig.add_subplot()
ax.set_xlim([min(data.index) - timedelta(hours=2), max(data.index) + timedelta(hours=2)])

ax.bar(plot1.index,plot1,width=0.02,color='k', label='instantaneous rainfall')
ax.plot(plot2.index,plot2,color='b', label='1-day cumulative rainfall')
ax.plot(plot3.index,plot3,color='r', label='3-day cumulative rainfall')
# 1-day & 3-day cumulative rainfall threshold
ax.plot(plot4.index,plot4,color='b',linestyle='--', label='1-day rainfall threshold')
ax.plot(plot5.index,plot5,color='r',linestyle='--', label='3-day rainfall threshold')

ax.axvspan(pd.to_datetime('2022-01-02 16:48'),
           pd.to_datetime('2022-01-06 16:00'),
           alpha = 0.2, color='red')

ax.set_ylabel('Rainfall (mm)', fontsize=12)
ax.tick_params(axis='both', labelsize=12)
ax.set_xlabel('Date', fontsize=12)

lines, labels = ax.get_legend_handles_labels()
plt.legend(lines, labels, borderaxespad=3, ncol=2, fontsize=12, loc='upper left')
plt.tight_layout()

plt.savefig('rain_{}_srm.png'.format(site_code.lower()), dpi=200, edgecolor='w', orientation='landscape')