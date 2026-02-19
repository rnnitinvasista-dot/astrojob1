import sys
import os
import json
from nadi_core import NadiEngine

def run_verify():
    print("\n--- VERIFYING HOUSE CUSPS AND OWNERS ---")
    try:
        engine = NadiEngine(ayanamsa="KP")
        res = engine.calculate_kundli("1990-12-15 15:30:00", "Asia/Kolkata", 28.6, 77.2)
        
        houses = res['houses']
        print("\nHOUSES:")
        for h in houses:
            print(f"House {h['house_number']}: {h['sign']} ({h['sign_lord']})")
            
        p_map = {p['planet']: p for p in res['planets']}
        print("\nPLANET POSITIONS:")
        for p in res['planets']:
            print(f"{p['planet']}: House {p['house_placed']}")
            
        ket = next(s for s in res['significations'] if s['planet'] == "Ketu")
        print(f"\nKETU TOTAL: {ket['total']}")
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    run_verify()
