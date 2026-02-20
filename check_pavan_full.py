
from nadi_core import NadiEngine
import swisseph as swe

def check_pavan_full():
    dt = "2007-05-04 10:30:00"
    lat = 12.9716
    lon = 77.5946
    
    engine = NadiEngine(ayanamsa="KP")
    res = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    print("\n--- HOUSE CUSPS (PLACIDUS) ---")
    for h in res['houses']:
        print(f"House {h['house_number']}: {h['cusp_degree_dms']} (Cusp Lord: {h['sign_lord']})")
        
    print("\n--- PLANET DETAILS ---")
    for p in res['planets']:
        print(f"{p['planet']:<10} | {p['degree_dms']} | Star: {p['star_lord']} | House: {p['house_placed']}")
        
    print("\n--- NAKSHATRA NADI (BIFURCATED) ---")
    for n in res['nakshatra_nadi']:
        print(f"Planet {n['planet']:<8} | SL: {n['star_lord']:<8} | Sub: {n['sub_lord']:<8}")
        print(f"  PL Sigs (Level 2): {[s['house'] for s in n['pl_signified']]}")
        print(f"  NL Sigs (Level 1): {[s['house'] for s in n['nl_signified']]}")
        print(f"  SL Sigs (Material): {[s['house'] for s in n['sl_signified']]}")

if __name__ == "__main__":
    check_pavan_full()
