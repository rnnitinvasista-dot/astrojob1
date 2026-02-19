import sys
import os
import json
from nadi_core import NadiEngine

def run_trace():
    print("\n--- TRACING KETU HOUSES 8 & 12 ---")
    try:
        engine = NadiEngine(ayanamsa="KP")
        res = engine.calculate_kundli("1990-12-15 15:30:00", "Asia/Kolkata", 28.6, 77.2)
        
        p_map = {p['planet']: p for p in res['planets']}
        h_owners = {h['house_number']: h['sign_lord'] for h in res['houses']}
        
        ket = next(s for s in res['significations'] if s['planet'] == "Ketu")
        print(f"Ketu Final Total: {ket['total']}")
        
        # Manually trace agents
        print("\n--- AGENT ANALYSIS ---")
        agents = engine.get_node_agents("Ketu", p_map["Ketu"], list(p_map.values()))
        
        occupied = set(p['house_placed'] for p in p_map.values() if p['planet'] not in ["Rahu", "Ketu"])
        
        for agent in agents:
            a_name = agent['planet']
            a_type = agent['type']
            if a_name not in p_map: continue
            
            a_data = p_map[a_name]
            a_occ = int(a_data["house_placed"])
            a_own = [int(h) for h, o in h_owners.items() if o == a_name]
            
            # Simulate filter logic
            contrib = []
            if True: # Placement always
                contrib.append(f"{a_occ}(Occ)")
            
            for h in a_own:
                if h not in occupied:
                     contrib.append(f"{h}(Own-Vac)")
                else:
                     contrib.append(f"{h}(Own-Occ-BLOCKED)")
            
            print(f"Agent ({a_type}): {a_name} -> {contrib}")
            
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    run_trace()
