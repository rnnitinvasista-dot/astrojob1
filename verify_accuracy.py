
import sys
import os
# Add root to path
sys.path.append(os.getcwd())

from nadi_core import NadiEngine
import datetime

def verify():
    engine = NadiEngine()
    # 04/03/2026 22:35:48 Bengaluru
    # Lat: 12.9716, Lon: 77.5946, TZ: Asia/Kolkata
    dt_str = "2026-03-04 22:35:48"
    lat, lon = 12.9716, 77.5946
    tz = "Asia/Kolkata"
    
    res = engine.calculate_kundli(dt_str, tz, lat, lon)
    
    # Sun target: 19 33 30 Aquarius (Sign Lord SU, NL RA, SL MA)
    # Aquarius is indices 300 to 330. 19 33 30 is 319.5583
    sun = next(p for p in res["planets"] if p["planet"] == "Sun")
    print(f"Sun Degree: {sun['degree_dms']}")
    print(f"Sun SL/NL/Sub: {sun['sign_lord']}/{sun['star_lord']}/{sun['sub_lord']}")
    
    # Check H3 owner for Gemini Asc
    # If Asc is Gemini, H3 should be Sun.
    asc_sign = res["ascendant"]["sign"]
    print(f"Ascendant Sign: {asc_sign}")
    h3_owner = next(h for h in res["houses"] if h["house_number"] == 3)["sign_lord"]
    print(f"House 3 Owner: {h3_owner}")

if __name__ == "__main__":
    verify()
