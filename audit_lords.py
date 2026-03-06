from nadi_core import NadiEngine
import swisseph as swe

def audit():
    # Force UTC
    jd = swe.julday(2026, 3, 4, 6.5)
    lat = 12.9716
    lon = 77.5946
    
    engine = NadiEngine()
    # Call internal method to skip API/pytz overhead
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
    
    res = engine.calculate_kundli("2026-03-04 12:00:00", "UTC", lat, lon, horary_number=1)
    
    print("\n--- PLANET LORDS ---")
    for p in res["planets"]:
        print(f"{p['planet']:<10} {p['degree_dms']:<15} SL: {p['sign_lord']:<10} NL: {p['star_lord']:<10} SB: {p['sub_lord']:<10}")
        
    print("\n--- CUSP LORDS (Num 1) ---")
    for h in res["houses"]:
        print(f"House {h['house_number']:<2} {h['cusp_degree_dms']:<15} SL: {h['sign_lord']:<10} NL: {h['star_lord']:<10} SB: {h['sub_lord']:<10}")

if __name__ == "__main__":
    audit()

if __name__ == "__main__":
    audit()
