
import sys
from nadi_core import NadiEngine
import swisseph as swe

def verify_159():
    # Pavan: 04 May 2007, 23:30, Bangalore
    # (Note: Time might be slightly different in the browser, but we'll check the logic)
    dt = "2007-05-04 23:21:00"
    lat = 12.9716
    lon = 77.5946
    
    engine = NadiEngine(ayanamsa="KP")
    res = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    print(f"\n--- VERIFYING SIGNIFICATOR TABLE (STANDARD KP) ---")
    for sig in res['significations']:
        p_name = sig['planet']
        houses = sig['total']
        print(f"{p_name:10} | Houses: {houses}")

    print("\n--- VERIFYING NADI TABLE (AGENT LOGIC) ---")
    for entry in res['nakshatra_nadi']:
        p_name = entry['planet']
        pl_houses = [h['house'] for h in entry['pl_signified']]
        print(f"{p_name:10} | PL Houses: {pl_houses}")

if __name__ == "__main__":
    verify_159()
