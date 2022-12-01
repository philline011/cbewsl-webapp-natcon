from datetime import datetime
import os
import pandas as pd
import sys

sys.path.append(os.path.dirname(os.path.realpath(__file__)))

import dynadb.db as db
import gsm.gsmserver_dewsl3.sms_data as sms
import analysis.querydb as qdb
import analysis.rainfall.rainfallgauges as gauges
import analysis.rainfall.rainfallpriorities as prio
#------------------------------------------------------------------------------

def create_tilt_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,"	
    query += "  `ts_written` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `node_id` TINYINT(3) UNSIGNED NULL,"	
    query += "  `type_num` TINYINT(3) UNSIGNED NULL,"	
    query += "  `xval` SMALLINT(6) NULL,"	
    query += "  `yval` SMALLINT(6) NULL,"	
    query += "  `zval` SMALLINT(6) NULL,"	
    query += "  `batt` FLOAT NULL,"	
    query += "  `is_live` TINYINT(4) NULL DEFAULT 1,"	
    query += "  PRIMARY KEY (`data_id`),"
    query += "  UNIQUE INDEX `uq_tilt` (`ts` ASC, `node_id` ASC, `type_num` ASC))"
    db.write(query, connection=schema)
    
def create_piezo_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, "
    query += "  `ts` TIMESTAMP NULL, "
    query += "  `frequency_shift` DECIMAL(6,2) UNSIGNED NULL, "
    query += "  `temperature` FLOAT NULL, "
    query += "  PRIMARY KEY (`data_id`), "
    query += "  UNIQUE INDEX `uq_piezo` (`ts`))"
    db.write(query, connection=schema)

def create_soms_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(11) NOT NULL AUTO_INCREMENT,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `node_id` INT(11) NULL,"	
    query += "  `type_num` INT(11) NULL,"	
    query += "  `mval1` INT(11) NULL,"	
    query += "  `mval2` INT(11) NULL,"	
    query += "  PRIMARY KEY (`data_id`),"
    query += "  UNIQUE INDEX `uq_soms` (`ts` ASC, `node_id` ASC, `type_num` ASC))"
    db.write(query, connection=schema)

def create_gnss_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(10) NOT NULL AUTO_INCREMENT,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `fix_type` TINYINT(4) NULL,"
    query += "  `latitude` DOUBLE NULL,"
    query += "  `longitude` DOUBLE NULL,"
    query += "  `accuracy` FLOAT NULL,"	
    query += "  `msl` FLOAT NULL,"	
    query += "  `temp` FLOAT NULL,"	
    query += "  `volt` FLOAT NULL,"	
    query += "  PRIMARY KEY (`data_id`),"
    query += "  UNIQUE INDEX `uq_soms` (`ts`))"
    db.write(query, connection=schema)

def create_stilt_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(10) NOT NULL AUTO_INCREMENT,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `node_id` INT(1) NULL,"
    query += "  `ac_x` INT(11) NULL,"
    query += "  `ac_y` INT(11) NULL,"
    query += "  `ac_z` INT(11) NULL,"
    query += "  `mg_x` INT(11) NULL,"
    query += "  `mg_y` INT(11) NULL,"
    query += "  `mg_z` INT(11) NULL,"
    query += "  `gr_x` INT(11) NULL,"
    query += "  `gr_y` INT(11) NULL,"
    query += "  `gr_z` INT(11) NULL,"
    query += "  `temp` INT(11) NULL,"
    query += "  `taps` INT(11) NULL,"
    query += "  `temp_rtc` FLOAT NULL,"	
    query += "  `volt` FLOAT NULL,"	
    query += "  PRIMARY KEY (`data_id`),"
    query += "  UNIQUE INDEX `uq_soms` (`ts`))"
    db.write(query, connection=schema)
    
def create_temp_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `node_id` TINYINT(3) UNSIGNED NULL,"	
    query += "  `type_num` TINYINT(3) UNSIGNED NULL,"	
    query += "  `temp_val` SMALLINT(6) NULL,"	
    query += "  PRIMARY KEY (`data_id`))"
    db.write(query, connection=schema)

def create_volt_table(table_name, schema):
    query = "CREATE TABLE `{}` (".format(table_name)
    query += "  `data_id` INT(11) NOT NULL AUTO_INCREMENT,"	
    query += "  `ts` TIMESTAMP NULL,"	
    query += "  `stat` INT(2) NULL,"	
    query += "  `curr_draw` FLOAT NULL,"	
    query += "  `batt_volt` FLOAT NULL,"	
    query += "  PRIMARY KEY (`data_id`))"
    db.write(query, connection=schema)

def main():
    query = "SELECT * FROM trigger_table"
    trigger_table = db.df_read(query, connection='common')
    
    for table_id in trigger_table.id:
        new_table = trigger_table.loc[trigger_table.id == table_id, :]
        table_name = new_table['table_name'].values[0]
        schema = new_table['schema_name'].values[0]
        ts = new_table['date_activated'].values[0]
        # TILT DATA TABLE
        if 'tilt_' in table_name and not qdb.does_table_exist(table_name):
            # create tilt data table
            qdb.create_NOAH_table(table_name)
            # insert dummy data
            tilt_data = pd.DataFrame(data={'ts': [ts], 'node_id': [-1]}) 
            data_table = sms.DataTable(table_name, tilt_data)
            db.df_write(data_table, connection=schema)
        # TILT ACCELEROMETER
        if table_name == 'accelerometers':
            tsm_id = new_table['tsm_id'].values[0]
            num_nodes = new_table['num_nodes'].values[0]
            # insert accelerometer data
            accel_data = pd.DataFrame(data={'tsm_id': [tsm_id]*num_nodes*2, 
                                           'node_id': list(range(num_nodes))+list(range(num_nodes)),
                                           'accel_number': [1]*num_nodes+[2]*num_nodes,
                                           'ts_updated': [datetime.now()]*num_nodes*2,
                                           'voltage_max': [3.4]*num_nodes*2,
                                           'voltage_min': [3.14]*num_nodes*2,
                                           'in_use': [1]*num_nodes+[0]*num_nodes})
            data_table = sms.DataTable(table_name, accel_data)
            db.df_write(data_table, connection=schema)
        # RAIN DATA TABLE
        if 'rain_' in table_name and not qdb.does_table_exist(table_name):
            # create rain data table
            qdb.create_NOAH_table(table_name)
            # insert dummy data
            rain_data = pd.DataFrame(data={'ts': [ts], 'rain': [-1]})
            data_table = sms.DataTable(table_name, rain_data)
            db.df_write(data_table, connection=schema)
        # PIEZO DATA TABLE
        if 'piezo_' in table_name and not qdb.does_table_exist(table_name):
            create_temp_table(table_name, schema)
        # SOMS DATA TABLE
        if 'soms_' in table_name and not qdb.does_table_exist(table_name):
            create_temp_table(table_name, schema)
        # GNSS DATA TABLE
        if 'gnss_' in table_name and not qdb.does_table_exist(table_name):
            create_temp_table(table_name, schema)
        # STILT DATA TABLE
        if 'stilt_' in table_name and not qdb.does_table_exist(table_name):
            create_temp_table(table_name, schema)
        # VOLT DATA TABLE
        if 'volt_' in table_name and not qdb.does_table_exist(table_name):
            create_temp_table(table_name, schema)
        # TEMP DATA TABLE
        if 'temp_' in table_name and not qdb.does_table_exist(table_name):
            create_volt_table(table_name, schema)

        # set processed = 1
        query = "UPDATE trigger_table SET processed = 1 WHERE id = {}".format(table_id)
        db.write(query, connection='common')
    
    if any(trigger_table.table_name.apply(lambda x: 'rain' in x)):
        gauges.main()
        prio.main()
        
if __name__ == '__main__':
    main()