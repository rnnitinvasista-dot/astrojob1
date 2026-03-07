
import sys
from nadi_core import NadiEngine
import swisseph as swe

def trace_ankita():
    # 17th June 2002, 22:30, Bengaluru
    dt = "2002-06-17 22:30:00"
    lat = 12.9716
    lon = 77.5946
    
    engine = NadiEngine(ayanamsa="KP")
    res = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    print(f"\n--- TRACING NODE AGENTS FOR ANKITA ---")
    
    rahu_data = next(p for p in res['planets'] if p['planet'] == "Rahu")
    ketu_data = next(p for p in res['planets'] if p['planet'] == "Ketu")
    
    for node_name, node_data in [("Rahu", rahu_data), ("Ketu", ketu_data)]:
        print(f"\n{node_name} in {node_data['sign']} ({node_data['degree_dms']}) House {node_data['house_placed']}")
        agents = engine.get_node_agents(node_name, node_data, res['planets'])
        print(f"Agents for {node_name}:")
        for a in agents:
            p_name = a['planet']
            a_data = next(p for p in res['planets'] if p['planet'] == p_name)
            a_own = [h['house_number'] for h in res['houses'] if h['sign_lord'] == p_name]
            print(f"  - {p_name} ({a['type']}): Placed in {a_data['house_placed']}, Owns {a_own}")

    print("\n--- ALL PLANET POSITIONS ---")
    for p in res['planets']:
        print(f"{p['planet']:10} | House {p['house_placed']:2} | {p['degree_dms']}")

if __name__ == "__main__":
    trace_ankita()
