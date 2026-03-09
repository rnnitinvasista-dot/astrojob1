import datetime
import pytz
from nadi_core import NadiEngine

def test_final_integration():
    engine = NadiEngine()
    
    # 04/05/2007 10:30 AM Bengaluru
    dob = "2007-05-04"
    tob = "10:30:00"
    tz = "Asia/Kolkata"
    lat = 12.9716
    lon = 77.5946
    
    res = engine.calculate_kundli(f"{dob} {tob}", tz, lat, lon)
    dasha = res['dasha']
    
    print("\n--- INTEGRATED DASHA CHECK ---")
    mercury_md = next((md for md in dasha['mahadasha_sequence'] if md['planet'] == 'Mercury'), None)
    if mercury_md:
        print(f"Mercury MD: {mercury_md['start_date']} to {mercury_md['end_date']}")
    else:
        print("Mercury MD not found in current sequence")
        
    print("\n--- VARGA CHART COUNT CHECK ---")
    if 'varga_charts' in res:
        print(f"Total Varga Charts: {len(res['varga_charts'])}")
        print(f"Charts: {', '.join(res['varga_charts'].keys())}")

if __name__ == "__main__":
    test_final_integration()
