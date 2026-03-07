
import sys
import os
from nadi_core import NadiEngine
import swisseph as swe

def trace():
    engine = NadiEngine(ayanamsa="KP")
    print("Calculating for Nitin: 1990-12-15 17:30:00")
    res = engine.calculate_kundli("1990-12-15 17:30:00", "Asia/Kolkata", 28.6, 77.2)
    
    planets = res['planets']
    houses = res['houses']
    house_owners = {h['house_number']: h['sign_lord'] for h in houses}
    
    print("\n--- PLANET POSITIONS ---")
    for p in planets:
        print(f"{p['planet']}: House {p['house_placed']}, Sign {p['sign']}")
        
    print("\n--- HOUSE OWNERS ---")
    for h, o in house_owners.items():
        print(f"House {h}: {o}")
        
    print("\n--- RAHU AGENTS TRACE ---")
    rahu_data = next(p for p in planets if p['planet'] == "Rahu")
    agents = engine.get_node_agents("Rahu", rahu_data, planets)
    for a in agents:
        p_name = a['planet']
        p_data = next(p for p in planets if p['planet'] == p_name)
        p_occ = p_data['house_placed']
        p_own = [h for h, o in house_owners.items() if o == p_name]
        print(f"Agent: {p_name} ({a['type']}) -> Placed: {p_occ}, Owns: {p_own}")
        
    print("\n--- KETU AGENTS TRACE ---")
    ketu_data = next(p for p in planets if p['planet'] == "Ketu")
    agents = engine.get_node_agents("Ketu", ketu_data, planets)
    for a in agents:
        p_name = a['planet']
        p_data = next(p for p in planets if p['planet'] == p_name)
        p_occ = p_data['house_placed']
        p_own = [h for h, o in house_owners.items() if o == p_name]
        print(f"Agent: {p_name} ({a['type']}) -> Placed: {p_occ}, Owns: {p_own}")

if __name__ == "__main__":
    trace()
