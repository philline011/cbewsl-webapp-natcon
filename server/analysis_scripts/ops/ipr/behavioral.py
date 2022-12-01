from collections import Counter
import numpy as np
import os
import pandas as pd

import lib as ipr_lib
import ipr

output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..//input_output//'))

def get_grades(personnel, behavioral):
    name = personnel.Nickname.values[0]
    lst_grade = []
    for col_name in ['monitoring partner', 'previous mt', 'previous ct', 'backup monitoring personnel', 'backup monitoring personnel.1', 'monitoring partner (2)']:
        col_filt = behavioral.columns.str.contains('rating')
        col_filt = col_filt & behavioral.columns.str.contains(col_name.replace(r'(2)', '').replace('.1', '').strip())
        if '1' in col_name:
            col_filt = col_filt & behavioral.columns.str.contains('1')
        else:
            col_filt = col_filt & ~(behavioral.columns.str.contains('1'))
        if '2' in col_name:
            col_filt = col_filt & behavioral.columns.str.contains('2')
        else:
            col_filt = col_filt & ~(behavioral.columns.str.contains('2'))
        temp_grade = np.array(list(behavioral.loc[behavioral[col_name] == name, col_filt].values.flatten()))
        lst_grade += list(temp_grade[~np.isnan(temp_grade)])
    personnel.loc[:, 'grade'] = np.round(100*np.mean(lst_grade)/5, 2)
    return personnel


def main(start, end):
    
    key = '1wZhFAvBDMF03fFxlnXoJJ1sH4iOSlN8a2DmOMYW_IxM'
    behavioral = ipr_lib.get_sheet(key, 'Monitoring Behavior')
    behavioral.columns = behavioral.columns.str.lower()
    
    key = "1UylXLwDv1W1ukT4YNoUGgHCHF-W8e3F8-pIg1E024ho"
    personnel = ipr_lib.get_personnel()
    personnel = personnel.loc[:, ['Nickname', 'Name']].dropna().set_index('Name')
    per_personnel = personnel.groupby('Nickname', as_index=False)
    
    behavioral.loc[:, ['name', 'monitoring partner', 'previous mt', 'previous ct', 'backup monitoring personnel', 'backup monitoring personnel.1', 'monitoring partner (2)']] = behavioral.loc[:, ['name', 'monitoring partner', 'previous mt', 'previous ct', 'backup monitoring personnel', 'backup monitoring personnel.1', 'monitoring partner (2)']].replace(personnel.to_dict()['Nickname'])
    behavioral.loc[:, behavioral.columns[behavioral.columns.str.contains('rating for')]] = behavioral.loc[:, behavioral.columns[behavioral.columns.str.contains('rating for')]].replace({'5 - Outstanding': 5, '4 - Very satisfactory': 4, '4 - Very Satisfactory': 4, '4': 4, '3 - Satisfactory': 3, '3 - Average': 3, '2 - Unsatisfactory': 2, '2': 2, '1 - Poor': 1})
    behavioral = behavioral.loc[(pd.to_datetime(behavioral['date of shift']) >= start) & (pd.to_datetime(behavioral['date of shift']) <= end), :]
    behavioral = behavioral.drop_duplicates(['date of shift', 'name'], keep='last')
    
    personnel_grade = per_personnel.apply(get_grades, behavioral=behavioral).reset_index(drop=True)
    
    behavioral.loc[:, 'remarks'] = behavioral.loc[:, behavioral.columns.str.contains('remarks')].fillna('').astype(str).sum(axis=1)
    behavioral.loc[:, 'rating'] = behavioral.loc[:, behavioral.columns.str.contains('rating')].mean(axis=1)
    
    month_list = pd.date_range(start=pd.to_datetime(start), end=pd.to_datetime(end), freq='1M')
    month_list = list(map(lambda x: x.strftime('%B %Y'), month_list[month_list>='2021-09-01']))
    shift_sched = pd.DataFrame()
    for sheet_name in month_list:
        shift_sched = shift_sched.append(ipr.get_shift(key, sheet_name))
    total_shifts = pd.DataFrame(Counter(list(shift_sched['IOMP-MT'].values) + list(shift_sched['IOMP-CT'].values)).items(), columns=['Nickname', 'shifts'])
    rated = pd.DataFrame(Counter(behavioral.name).items(), columns=['Nickname', 'rated'])
    personnel_grade = pd.merge(personnel_grade, total_shifts, on='Nickname', how='left')
    personnel_grade = pd.merge(personnel_grade, rated, on='Nickname', how='left')
    personnel_grade.to_csv('behavioral.csv', index=False)
    
    return personnel_grade
    

if __name__ == '__main__':
    start = '2021-12-01'
    end = '2022-06-01'
    df = main(start, end)
    print(df)