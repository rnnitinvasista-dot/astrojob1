
from nadi_core import NadiEngine
import datetime
import pytz
import json

def debug_pavan():
    engine = NadiEngine(ayanamsa="KP")
    # Pavan: 04 May 2007, 23:21, Kolkata
    lat, lon = 22.5726, 88.3639
    timezone = "Asia/Kolkata"
    dt_str = "2007-05-04 23:21"
    
    print(f"--- Firing Debug for Pavan Chart ({dt_str}) ---")
    res = engine.calculate_kundli(dt_str, timezone, lat, lon)
    
    # Check Rahu/Ketu data
    planets = {p["planet"]: p for p in res["planets"]}
    rahu = planets["Rahu"]
    ketu = planets["Ketu"]
    
    print("\n--- Planet Degrees ---")
    for p in res["planets"]:
        print(f"{p['planet']:10} | {p['degree_dms']:20} | Sign: {p['sign']:10} | Star: {p['star_lord']:10} | HP: {p['house_placed']}")
        
    print("\n--- Rahu Agents ---")
    agents_rahu = engine.get_node_agents("Rahu", rahu, res["planets"])
    print(json.dumps(agents_rahu, indent=2))
    
    print("\n--- Ketu Agents ---")
    agents_ketu = engine.get_node_agents("Ketu", ketu, res["planets"])
    print(json.dumps(agents_ketu, indent=2))
    
    print("\n--- Significators (4-Level) ---")
    for sig in res["significations"]:
        if sig["planet"] in ["Rahu", "Ketu"]:
            print(f"{sig['planet']:10} | Agent: {sig.get('agent')} | Houses: {sig['total']}")
            print(f"           | L1: {sig['levels']['L1']} | L2: {sig['levels']['L2']} | L3: {sig['levels']['L3']} | L4: {sig['levels']['L4']}")

if __name__ == "__main__":
    debug_pavan()
