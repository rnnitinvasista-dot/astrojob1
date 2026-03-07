from nadi_core import NadiEngine
import json

engine = NadiEngine()
# Test case: 1990-01-01 12:00, Bangalore
result = engine.calculate_kundli("1990-01-01 12:00", "Asia/Kolkata", 12.9716, 77.5946)

print("\n--- Planetary Positions ---")
for p in result['planets']:
    print(f"{p['planet']:<10} | House: {p['house_placed']}")

# Diagnostic for house owners
# In my current calculate_kundli, I don't return house_owners anymore in the result.
# I'll just check significations instead.
print("\n--- Significations ---")
for s in result['significations']:
    print(f"{s['planet']:<10}: {s['total']}")

# Check specific Ketu agents manually
planets_res_map = {p['planet']: p for p in result['planets']}
ketu_data = planets_res_map['Ketu']
agents = engine.get_node_agents('Ketu', ketu_data, result['planets'])
print("\n--- Ketu Agents ---")
for a in agents:
    print(f"{a['type']:<15}: {a['planet']}")
