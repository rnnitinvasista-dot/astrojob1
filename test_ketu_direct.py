import json
from nadi_core import NadiEngine

e = NadiEngine()
res = e.calculate_kundli('1990-12-15 17:30:00', 'Asia/Kolkata', 28.6, 77.2)

p_map = {p['planet']: p for p in res['planets']}
h_owners = {h['house_number']: h['sign_lord'] for h in res['houses']}

node_name = "Ketu"
p_data = p_map[node_name]
print("KETU PLACEMENT:", p_data['house_placed'])

agents = e.get_node_agents(node_name, p_data, list(p_map.values()))
for a in agents:
    print(f"AGENT: {a['planet']} ({a['type']})")
    
sigs = e.get_eff_sigs_detailed(node_name, p_map, h_owners)
print("FINAL SIGS FOR KETU:", sigs)
