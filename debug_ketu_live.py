
import sys
import os
from nadi_core import NadiEngine
import swisseph as swe

def debug_ketu():
    # Simulate Main.py call structure
    # Attempt to reproduce 12, 5 appearing in Ketu
    
    # Try the verified Gemini Time first
    dt = "1990-12-15 17:30:00"
    lat = 28.6
    lon = 77.2
    
    engine = NadiEngine(ayanamsa="KP") # Default used in main.py logic? 
    # main.py initializes: request_engine = NadiEngine(..., ayanamsa="Lahiri", house_system=req.calculation_settings.house_system)
    
    # We should simulate "Lahiri" as main.py does!
    engine_lahiri = NadiEngine(ayanamsa="Lahiri")
    
    print(f"--- DEBUGGING KETU FOR {dt} (LAHIRI) ---")
    res = engine_lahiri.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    ketu_sigs = next(s['total'] for s in res['significations'] if s['planet'] == "Ketu")
    print(f"Ketu Sigs (Lahiri): {sorted(list(ketu_sigs))}")
    
    # Extract Agents to explain
    kd = next(p for p in res['planets'] if p['planet'] == "Ketu")
    agents = engine_lahiri.get_node_agents("Ketu", kd, res['planets'])
    for a in agents:
        print(f"Agent: {a['planet']} ({a['type']})")
        
    # Check House Owners
    # We updated NadiEngine to use Whole Sign for ownership.
    # Check if 12 or 5 is owned by an Agent.
    
    print("\n--- DEBUGGING KETU FOR 1990-12-15 17:30:00 (TRUE NODE CAUTION) ---")
    # Simulate "TRUE NODE"
    engine_true = NadiEngine(node_type="True", ayanamsa="KP")
    res_true = engine_true.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    ketu_true = next(p for p in res_true['planets'] if p['planet'] == "Ketu")
    print(f"Ketu (True Node) Sign: {ketu_true['sign']} (Degree: {ketu_true['degree_decimal'] % 30:.2f})")
    print(f"Ketu Placement: {ketu_true['house_placed']}")
    
    # Check if True Node makes Ketu in Gemini (Sign 3)
    if ketu_true['sign'] == "Gemini":
        print(">>> KETU IS IN GEMINI! <<<")
        print("Wait, if Ketu is in Gemini (1st House), it aspects Sagittarius (7th).")
        print("Or Sagittarius aspects Gemini. (Opposition).")
        print("Venus is in Sagittarius.")
        print("So Venus aspects Ketu (Conlnct/Opp).")
        print("Venus owns 5 and 12 for Gemini Ascendant.")
        print("So Venus is an Agent -> 5, 12 added.") 
    
    # Also check Lahiri Mean Node Degree
    print(f"\n--- DEBUGGING KETU MEAN NODE DEGREE (KP) ---")
    res_kp = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    ketu_data = next(p for p in res_kp['planets'] if p['planet'] == "Ketu")
    print(f"Ketu (Mean Node) Sign: {ketu_data['sign']} (Degree: {ketu_data['degree_decimal'] % 30:.2f})")

if __name__ == "__main__":
    debug_ketu()
