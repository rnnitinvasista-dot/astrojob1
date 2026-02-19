import sys
import os
import json
from nadi_core import NadiEngine

def run_verify():
    print("\n--- VERIFYING USER RULES (RAHU:SIGN | KETU:HOUSE) ---")
    try:
        engine = NadiEngine(ayanamsa="KP") # KP Ayanamsa for Nitin chart
        res = engine.calculate_kundli("1990-12-15 15:30:00", "Asia/Kolkata", 28.6, 77.2)
        
        rah = next(s for s in res['significations'] if s['planet'] == "Rahu")
        ket = next(s for s in res['significations'] if s['planet'] == "Ketu")
        
        print(f"Rahu Total: {rah['total']}")
        print(f"Ketu Total: {ket['total']}")
        
        # Check constraints
        k_target = {2, 3, 6, 9, 10, 11}
        k_actual = set(ket['total'])
        k_extra = k_actual - k_target
        k_missing = k_target - k_actual
        
        print(f"Ketu Missing: {k_missing}")
        print(f"Ketu Extra: {k_extra}")

        # Print Details
        print("\n--- DETAILS ---")
        p_map = {p['planet']: p for p in res['planets']}
        print(f"Ketu House: {p_map['Ketu']['house_placed']}")
        print(f"Ketu Sign Lord: {p_map['Ketu']['sign_lord']}")
        print(f"Ketu Star Lord: {p_map['Ketu']['star_lord']}")
        
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    run_verify()
