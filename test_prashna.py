
import json
from nadi_core import NadiEngine

def test_prashna():
    engine = NadiEngine(node_type="Mean", ayanamsa="KP")
    # Test case: Prashna Number 1, today's date
    dt_str = "2026-03-04 12:00:00"
    tz = "Asia/Kolkata"
    lat = 28.6139
    lon = 77.2090
    
    print(f"Testing Prashna for No. 1 at {dt_str}...")
    result = engine.calculate_kundli(dt_str, tz, lat, lon, horary_number=1)
    
    if "planets" in result:
        print(f"Success! Found {len(result['planets'])} planets.")
        for p in result['planets']:
            print(f"  - {p['planet']}: {p['degree_dms']} | SL: {p.get('sign_lord')} NL: {p.get('star_lord')} SB: {p.get('sub_lord')} SS: {p.get('sub_sub_lord')}")
    
    if "houses" in result:
        print(f"\nFound {len(result['houses'])} houses.")
        for h in result['houses']:
            print(f"  - House {h['house_number']}: {h['cusp_degree_dms']} | SL: {h.get('sign_lord')} NL: {h.get('star_lord')} SB: {h.get('sub_lord')} SS: {h.get('sub_sub_lord')}")

    if "significations" in result:
        print(f"\nFound {len(result['significations'])} significations.")
        for s in result['significations'][:3]: # Check first 3
            print(f"  - {s['planet']}: {s['total']}")
    
    if "status" == "error":
        print(f"Error: {result.get('message')}")

if __name__ == "__main__":
    test_prashna()
