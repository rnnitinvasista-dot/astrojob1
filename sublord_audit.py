
import swisseph as swe
import datetime
import pytz
from nadi_core import NadiEngine

def run_audit():
    # Test Data: 04/03/2026 22:35:48 Bengaluru
    # Lat: 12.9716, Lon: 77.5946
    jd = swe.julday(2026, 3, 4, 17.096666) # 22:35:48 IST -> 17:05:48 UTC (Approx)
    # Actually let's use the local time string to be safe as per nadi_core
    dt_str = "2026-03-04 22:35:48"
    tz = "Asia/Kolkata"
    lat, lon = 12.9716, 77.5946
    
    engine = NadiEngine()
    res = engine.calculate_kundli(dt_str, tz, lat, lon)
    
    print(f"--- NadiEngine (Mode 39) Audit ---")
    print(f"{'Planet':<8} | {'Degree':<15} | {'Star Lord':<10} | {'Sub Lord':<10}")
    print("-" * 50)
    for p in res["planets"]:
        print(f"{p['planet']:<8} | {p['degree_dms']:<15} | {p['star_lord']:<10} | {p['sub_lord']:<10}")

    print("\n--- House Cusps ---")
    for h in res["houses"]:
        print(f"Cusp {h['house_number']:<2}: {h['cusp_degree_dms']:<15} | SL: {h['star_lord']:<10} | Sub: {h['sub_lord']:<10}")

if __name__ == "__main__":
    run_audit()
