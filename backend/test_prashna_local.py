from nadi_core import NadiEngine
import json
import swisseph as swe

def test_prashna():
    engine = NadiEngine()
    # Test date, lat, lon
    dt_str = "2026-03-04 14:00:00"
    timezone = "Asia/Kolkata"
    lat = 12.9716
    lon = 77.5946
    horary_number = 1
    
    try:
        # Check if 249 table is generated correctly
        # print("Horary Table size:", len(engine.HORARY_TABLE))
        
        result = engine.calculate_kundli(dt_str, timezone, lat, lon, horary_number=horary_number)
        # Check for specific fields used in frontend
        print("Status:", result.get("status"))
        print("Ascendant Sign:", result.get("ascendant", {}).get("sign"))
        print("Ascendant Degree:", result.get("ascendant", {}).get("degree_dms"))
        print("First House Star Lord:", result.get("houses", [{}])[0].get("star_lord"))
        print("First House Sub Sub Lord:", result.get("houses", [{}])[0].get("sub_sub_lord"))
        
        # Print full JSON summary
        summary = {
            "house_count": len(result.get("houses", [])),
            "planet_count": len(result.get("planets", [])),
            "metadata": result.get("metadata")
        }
        print("Summary:", json.dumps(summary, indent=2))
        
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_prashna()
