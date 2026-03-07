
import sys
from nadi_core import NadiEngine
import swisseph as swe

def debug_ankita():
    # 17th June 2002, 22:30, Bengaluru
    dt = "2002-06-17 22:30:00"
    lat = 12.9716
    lon = 77.5946
    
    print(f"\n--- DEBUGGING CHART FOR ANKITA: {dt}, Bengaluru ---")
    engine = NadiEngine(ayanamsa="KP")
    res = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    print(f"Ascendant: {res['ascendant']['sign']} ({res['ascendant']['degree_dms']})")
    
    # Mars Details
    mars_data = next(p for p in res['planets'] if p['planet'] == "Mars")
    print(f"\nMARS DETAILS:")
    print(f"Sign: {mars_data['sign']} (Lord: {mars_data['sign_lord']})")
    print(f"Star: {mars_data['nakshatra']} (Lord: {mars_data['star_lord']})")
    print(f"Sub: {mars_data['sub_lord']}")
    print(f"Placed: House {mars_data['house_placed']}")
    
    # Nadi Entry for Mars
    nadi_mars = next(item for item in res['nakshatra_nadi'] if item['planet'] == "Mars")
    print("\n--- NAKSHATRA NADI (MARS) ---")
    print(f"Planet (PL) Sigs: {[h['house'] for h in nadi_mars['pl_signified']]}")
    print(f"Star (NL) Sigs: {[h['house'] for h in nadi_mars['nl_signified']]}")
    print(f"Sub (SL) Sigs: {[h['house'] for h in nadi_mars['sl_signified']]}")

    # Full House Cusps for context
    print("\n--- HOUSE CUSPS ---")
    for h in res['houses']:
        print(f"House {h['house_number']}: {h['cusp_degree_dms']} ({h['sign_lord']})")

if __name__ == "__main__":
    debug_ankita()
