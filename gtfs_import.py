from collections import defaultdict
from datetime import datetime, timedelta
from pprint import pprint
from geopy.geocoders import Nominatim
import csv


geolocator = Nominatim(user_agent="menetrendek")


def coords_to_address(lat, lon):
    address: str = geolocator.reverse(f"{lat}, {lon}").address
    # Példa input:
    # 	'Tavasz utca, Kossuth Lajos sugárút, Franciahögy lakópark, Rókus, Szeged, 'Szegedi járás, Csongrád-Csanád megye, Dél-Alföld, Alföld és Észak, 6724, 'Magyarország'
    # Output
    # 	'Rókus, Franciahögy lakópark, Kossuth Lajos sugárút, Tavasz utca'
    right = address.find(", Szeged,")
    if right == -1:
        right = len(address-1)

    return ", ".join(reversed([x.strip() for x in address[:right].split(",")]))


def csv_to_dict(path: str):
    with open(path, mode='r', newline='\n') as file:
        return list(csv.DictReader(file, delimiter=',', quotechar='"'))


def filter_keys(data: list[dict], *keys):
    return [{k: v for k, v in d.items() if k in keys} for d in data]


def write(path: str, data: list[dict], fields):
    with open(f"szeged_gtfs/processed/{path}", mode="w") as file:
        writer = csv.DictWriter(file, fieldnames=fields,
                                delimiter=',', quotechar='"', dialect='excel')
        writer.writeheader()
        writer.writerows(data)


def get_routes(path: str):
    # route_types = {"3": "Busz", "0": "Villamos",
    #                "109": "Villamos", "800": "Troli"}
    route_types = {"3": 1, "0": 2,
                   "109": 2, "800": 3}

    data = filter_keys(csv_to_dict(path), "route_id",
                       "route_short_name", "route_long_name", "route_type")
    for route in data:
        route["route_type"] = route_types.get(route["route_type"])
    return data


def get_stops(path: str):
    data = filter_keys(csv_to_dict(path), "stop_id",
                       "stop_name", "stop_lat", "stop_lon")

    for stop in data:
        lat, lon = stop["stop_lat"], stop["stop_lon"]
        stop["address"] = coords_to_address(lat, lon)

    # return filter_keys(data, "stop_id", "stop_name", "address")
    return data


def get_trips(path: str):
    data = filter_keys(csv_to_dict(path), "route_id",
                       "trip_id", "direction_id")

    trip_to_route_id = get_pairs("trip_id", "route_id", data)
    trip_direction = get_pairs("trip_id", "direction_id", data)

    return trip_to_route_id, trip_direction


def parse_time(time: str):
    if time.startswith("24"):
        time = "00" + time[2:]
    return datetime.strptime(time, "%H:%M:%S")


def get_start_stop_times(path: str):
    data = filter_keys(csv_to_dict(path), "trip_id",
                       "arrival_time", "stop_id", "stop_sequence")

    start_times = dict((row["trip_id"], parse_time(row["arrival_time"]))
                       for row in data if int(row["stop_sequence"]) == 1)

    for row in data:
        row["arrival_time"] = (parse_time(
            row["arrival_time"]) - start_times[row["trip_id"]]).seconds // 60

    return start_times, data


def write_routes():  # Járatok
    write("routes.csv", get_routes("szeged_gtfs/raw/routes.txt"),
          ["route_id", "route_short_name", "route_long_name", "route_type"])


def write_stops():  # Megállók
    write("stops.csv", get_stops("szeged_gtfs/raw/stops.txt"),
          ["stop_id", "stop_name", "address", "stop_lat", "stop_lon"])


def write_str(path: str, s):
    with open(path, "w") as file:
        file.write(s)


def get_pairs(key, val, data: list[dict],):
    return dict((row[key], row[val]) for row in data)


def sqlify(table: str, dicts: list[dict], key_translations: dict):
    rows = {f"({','.join([repr(d[k]) for k in key_translations.values()])})"
            for d in dicts}

    return f"INSERT INTO {table} ({', '.join(key_translations.keys())}) VALUES\n"+',\n'.join(rows)+";"


if __name__ == "__main__":

    folder = "szeged_gtfs/raw/"
    dest = "szeged_gtfs/processed/"

    start_times, stop_times = get_start_stop_times(folder + "stop_times.csv")

    # write_routes()

    stops = csv_to_dict("szeged_gtfs/processed/stops.csv")
    routes = csv_to_dict("szeged_gtfs/processed/routes.csv")

    # print(len(stops))
    # for i, a in enumerate(stops):
    #      if any(a["stop_name"] == b["stop_name"] for b in stops[:i]):
    #         # pprint(a)
    #         stops.remove(a)

    # pprint(len(stops))

    # write_str(dest + "insert_megallo.sql", sqlify("megallo", stops,
    #           {"cim": "address", "megallonev": "stop_name"}))

    # write_str(dest + "insert_jarat.sql", sqlify("jarat", routes,
    #           {"jaratszam": "route_short_name", "tipus": "route_type"}))


    route_numbers = get_pairs("route_id", "route_short_name", routes)
    route_types = get_pairs("route_id", "route_type", routes)
    stop_names = get_pairs("stop_id", "stop_name", stops)

    trip_to_route_id, trip_direction = get_trips(folder + "trips.csv")

    trip_to_route_number = {trip: route_numbers.get(
        trip_to_route_id.get(trip)) for trip in trip_to_route_id.keys()}

    # Indulások tábla
    # start_table = [{"route_number": trip_to_route_number[trip_id],
    #                 "hour": time.hour,
    #                 "minute": time.minute,
    #                 "direction": trip_direction[trip_id]}
    #                for trip_id, time in start_times.items()]

    # write_str(dest + "insert_indulas.sql", sqlify("indulas", start_table,
    #           {"jaratszam": "route_number", "ora": "hour", "perc": "minute", "irany": "direction"}))


    # Útvonal tábla

    paths_table = [{"route_number": trip_to_route_number[row["trip_id"]],
                    "arrival_time": int(row["arrival_time"]),
                    "stop_sequence": int(row["stop_sequence"]) - 1,
                    "stop_name": stop_names.get(row["stop_id"])} for row in stop_times if trip_direction[row["trip_id"]] == '1']

    write_str(dest + "insert_utvonal.sql", sqlify("utvonal", paths_table,
              {"megallo": "stop_name", "jaratszam": "route_number", "erkezes":"arrival_time", "sorszam": "stop_sequence"}))

    # Befogad tábla
    # compatibility = [*set((stop_names.get(row["stop_id"]),
    #                       route_types[trip_to_route_id[row["trip_id"]]]) for row in stop_times)]

    # compatibility = [dict(zip(("megallo", "jarmutipus"), (m,j))) for m,j in compatibility]

    # write_str(dest + "insert_befogad.sql", sqlify("befogad", compatibility,
    #           {"megallo": "megallo", "jarmutipus": "jarmutipus"}))

    
