import swisseph as swe
import datetime
import pytz
from nadi_core import NadiEngine

def test_dasha():
    engine = NadiEngine()
    
    # 04/05/2007 10:30 AM Bengaluru
    dob = "2007-05-04"
    tob = "10:30:00"
    tz = "Asia/Kolkata"
    lat = 12.9716
    lon = 77.5946
    
    dt_str = f"{dob} {tob}"
    local_tz = pytz.timezone(tz)
    dt_obj = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    dt_loc = local_tz.localize(dt_obj)
    
    res = engine.calculate_kundli(dt_str, tz, lat, lon)
    
    dasha = res['dasha']
    print(f"Current Mercury MD End Date: {dasha['mahadasha_sequence'][5]['end_date']}") # Mercury is usually the 6th in Ketu start
    
    print("\nFull Mahadasha Sequence:")
    for md in dasha['mahadasha_sequence']:
        print(f"{md['planet']}: {md['start_date']} to {md['end_date']}")

if __name__ == "__main__":
    test_dasha()
