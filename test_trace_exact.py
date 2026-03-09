from nadi_core import NadiEngine
import json

e = NadiEngine()
res = e.calculate_kundli('04-05-2007 10:20:00', 'Asia/Kolkata', 12.9716, 77.5946)

p_map = {p['planet']: p for p in res['planets']}
h_owners = {h['house_number']: h['sign_lord'] for h in res['houses']}

print("=== HOUSE OWNERS ===")
for h, o in sorted(h_owners.items()):
    print(f"House {h}: {o}")

occupied = set(int(p['house_placed']) for p in res['planets'] if p['planet'] not in ['Rahu', 'Ketu'])
print(f"\nOccupied Houses (non-node): {sorted(occupied)}")

print("\n=== PLANET POSITIONS ===")
for p in res['planets']:
    print(f"{p['planet']:10s}: House {p['house_placed']}, Sign {p['sign']}, SignLord {p['sign_lord']}")

for node in ['Rahu', 'Ketu']:
    print(f"\n=== {node} ===")
    nd = p_map[node]
    agents = e.get_node_agents(node, nd, list(p_map.values()))
    print(f"Agents: {[a['planet'] for a in agents]}")
    
    for agent in agents:
        a_name = agent['planet']
        if a_name not in p_map:
            print(f"  Agent {a_name}: NOT IN PLANET MAP!")
            continue
        a_data = p_map[a_name]
        a_occ = int(a_data['house_placed'])
        a_own = [h for h, o in h_owners.items() if o == a_name]
        vacant_owned = [h for h in a_own if h not in occupied]
        blocked_owned = [h for h in a_own if h in occupied]
        print(f"  Agent {a_name}: placed={a_occ}, owns={a_own}, vacant_own={vacant_owned}, blocked_own={blocked_owned}")
    
    sigs_detail = e.get_eff_sigs_detailed(node, p_map, h_owners)
    print(f"  FINAL pl_signified: {[x['house'] for x in sigs_detail]}")
