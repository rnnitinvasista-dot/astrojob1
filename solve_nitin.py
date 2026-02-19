import sys
import os
import json
from nadi_core import NadiEngine

def solve():
    target_rahu = {6, 8, 9, 11}
    target_ketu = {2, 3, 6, 9, 10, 11}
    
    ayanamsas = ["Lahiri", "KP", "True Chitra", "Raman", "Krishnamurti"]
    
    for ayan in ayanamsas:
        engine = NadiEngine(ayanamsa=ayan)
        res = engine.calculate_kundli("1990-12-15 17:30:00", "Asia/Kolkata", 28.6, 77.2)
        
        rahu = set(next(s['total'] for s in res['significations'] if s['planet'] == "Rahu"))
        ketu = set(next(s['total'] for s in res['significations'] if s['planet'] == "Ketu"))
        
        print(f"Ayanamsa: {ayan}")
        print(f"Rahu: {sorted(list(rahu))}")
        print(f"Ketu: {sorted(list(ketu))}")
        
        print("-" * 20)
        
        # match_rahu = target_rahu.issubset(rahu)
        # match_ketu = target_ketu.issubset(ketu)
        
        # if match_rahu and match_ketu:
        #     print(">>> POTENTIAL MATCH <<<")
        # print("-" * 20)

if __name__ == "__main__":
    solve()
