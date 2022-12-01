import pprint, os
from geopy.geocoders import Nominatim
import time as time_t
from datetime import datetime, timedelta, time

from pathlib import Path

class Helpers():
    def fetch_files(path):
        files = []
        try:
            files = os.listdir(path)

        except FileNotFoundError:
            files = []
        except Exception as err:
            raise(err)

        return files


    def rename_file_type(f_type):
        temp = f_type.lower()
        file_types_dict = {
            "txt": "Text",
            "pdf": "PDF",
            "ppt": "PowerPoint Presentation",
            "pptx": "PowerPoint Presentation",
            "doc": "Document",
            "docx": "Document",
            "json": "JSON"
        }
        try:
            return_type = file_types_dict[temp]
        except KeyError:
            return_type = "undefined"

        return return_type


    def upload(file, file_path):
        try:
            directory = file_path
            filename = file.filename

            count = filename.count(".")
            name_list = filename.split(".", count)
            file_type = f".{name_list[count]}"
            name_list.pop()
            filename = f"{'.'.join(name_list)}"

            # If the directory does not exist, create it.
            try:
                os.makedirs(file_path)
            except FileExistsError as fserr:
                pass
            except Exception as err:
                raise

            temp = f"{filename}{file_type}"
            uniq = 1
            print("temp:", temp)
            while os.path.exists(Path(directory) / temp):
                temp = '%s_%d%s' % (filename, uniq, file_type)
                uniq += 1

            final_path = os.path.join(Path(directory), temp)
            file.save(final_path)

        except Exception as err:
            raise(err)
            final_path = "ERROR"

        return final_path
    
    
    def delete_file(full_path):
        try:
            os.remove(full_path)
        except Exception as err:
            raise(err)


    def round_down_data_ts(date_time):
        """
        Rounds time to HH:00 or HH:30.
        Args:
            date_time (datetime): Timestamp to be rounded off. Rounds to HH:00
            if before HH:30, else rounds to HH:30.
        Returns:
            datetime: Timestamp with time rounded off to HH:00 or HH:30.
        """

        hour = date_time.hour
        minute = date_time.minute
        minute = 0 if minute < 30 else 30
        date_time = datetime.combine(date_time.date(), time(hour, minute))
        return date_time


    def round_to_nearest_release_time(data_ts, interval=4):
        """
        Round time to nearest 4/8/12 AM/PM (default)
        Or any other interval
        Args:
            data_ts (datetime)
            interval (Integer)
        Returns datetime
        """
        hour = data_ts.hour

        quotient = int(hour / interval)
        hour_of_release = (quotient + 1) * interval

        if hour_of_release < 24:
            date_time = datetime.combine(
                data_ts.date(), time((quotient + 1) * interval, 0))
        else:
            date_time = datetime.combine(data_ts.date() + timedelta(1), time(0, 0))

        return date_time


    def var_checker(var_name, var, have_spaces=True):
        """
        A function used to check variable value including
        title and indentation and spacing for faster checking
        and debugging.
        Args:
        var_name (String): the variable name or title you want display
        var (variable): variable (any type) to display
        have_spaces (Boolean): keep False is you dont need spacing for each display.
        """
        if have_spaces:
            print()
            print(f"===== {var_name} =====")
            printer = pprint.PrettyPrinter(indent=4)
            printer.pprint(var)
            print()
        else:
            print(f"===== {var_name} =====")
            printer = pprint.PrettyPrinter(indent=4)
            printer.pprint(var)

    def str_to_dt(string_value):
        if isinstance(string_value, datetime):
            return string_value
        else:
            return datetime.strptime(string_value, "%Y-%m-%d %H:%M:%S")

    def dt_to_str(datetime_value):
        if isinstance(datetime_value, str):
            return datetime_value
        else:
            return datetime.strftime(datetime_value, "%Y-%m-%d %H:%M:%S")

    def timedelta_to_str(timedelta_value):
        return str(timedelta_value)

    def str_to_timedelta(string_value):
        return datetime.strptime(string_value, "%H:%M:%S").time()

    def get_location_from_geocode(latitude, longitude):
        geolocator = Nominatim(user_agent="CBEWSL")
        location = geolocator.reverse(f"{latitude}, {longitude}")
        return location.address