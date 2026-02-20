
from nadi_core import NadiEngine
import datetime
import pytz

def trace_pavan_node_logic():
    engine = NadiEngine()
    engine.ayanamsa = "KP"
    
    # Pavan: 04 May 2007, 23:21, Rajkot
    dt_str = "2007-05-04 23:21"
    lat = 22.3039
    lon = 70.8022
    
    res = engine.calculate_kundli(dt_str, "Asia/Kolkata", lat, lon)
    
    print(f"\nLAGNA: {res['ascendant']['degree_dms']}")
    print(f"AYANAMSA: {res['metadata']['ayanamsa']} ({res['metadata']['ayanamsa_value']})")
    
    print("\n--- PLANET LONGITUDES ---")
    for p in res["planets"]:
        print(f"{p['planet']:<10}: {p['degree_dms']} ({p['degree_decimal']:.4f})")

    print("\n--- NODES SIGNIFICATION TRACE (v1.60 Logic) ---")
    for sig in res["significations"]:
        if sig["planet"] in ["Rahu", "Ketu"]:
            print(f"\n{sig['planet']}:")
            print(f"  Agents List: {sig.get('agents_list', 'None')}")
            print(f"  Level 1 (SL Occ): {sig['levels']['L1']}")
            print(f"  Level 2 (P Occ): {sig['levels']['L2']} (CIRCLED IF IN NADI PL)")
            print(f"  Level 3 (SL Own): {sig['levels']['L3']}")
            print(f"  Level 4 (P Own): {sig['levels']['L4']}")
            print(f"  Total: {sig['total']}")

    print("\n--- GOLD NADI COMBINATION TRACE ---")
    for item in res["nakshatra_nadi"]:
        if item["planet"] in ["Rahu", "Ketu"]:
            print(f"\n{item['planet']}:")
            print(f"  PL Row (Should be circled if L1 or L2):")
            for h in item["pl_signified"]:
                print(f"    House {h['house']} - Placed: {h['is_placed']}")

if __name__ == "__main__":
    trace_pavan_node_logic()
