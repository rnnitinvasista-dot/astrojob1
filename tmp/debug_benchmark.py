
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
import swisseph as swe
from nadi_core import NadiEngine
import datetime
import pytz

def debug_benchmark():
    engine = NadiEngine()
    
    # User Benchmark: 04/05/2007 10:30 AM Bengaluru
    # Bengaluru Lat: 12.9716, Lon: 77.5946
    
    dob = "2007-05-04"
    tob = "10:30:00"
    tz_name = "Asia/Kolkata"
    lat, lon = 12.9716, 77.5946
    
    # Calculate chart
    result = engine.calculate_kundli(f"{dob} {tob}", tz_name, lat, lon)
    
    dasha = result['dasha']
    print(f"Status: {result['status']}")
    print(f"Moon Lon: {dasha['moon_lon']:.4f}")
    print(f"Nakshatra: {dasha['nakshatra']}")
    print(f"Balance: {dasha['balance_at_birth']}")
    
    print("\nBenchmark End Dates (from screenshot):")
    # Screenshot says Sa ends 08/01/2018 (DD/MM/YYYY)
    
    print("\nOur Calculated Sequence:")
    for md in dasha['mahadasha_sequence']:
        print(f"{md['planet'][:2]}: {md['end_date']}")
        
if __name__ == "__main__":
    debug_benchmark()
