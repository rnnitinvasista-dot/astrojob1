
import sys
from nadi_core import NadiEngine
import swisseph as swe

def debug_new_chart():
    # 04th may 2007 bangaluru urban 10 30 am
    dt = "2007-05-04 10:30:00"
    lat = 12.9716  # Bengaluru Latitude
    lon = 77.5946  # Bengaluru Longitude
    
    print(f"\n--- DEBUGGING CHART FOR: {dt}, Bengaluru ---")
    engine = NadiEngine(ayanamsa="KP")
    res = engine.calculate_kundli(dt, "Asia/Kolkata", lat, lon)
    
    asc_sign = res['ascendant']['sign']
    print(f"Ascendant: {asc_sign} (Sign Lord: {res['ascendant']['sign_lord']})")
    
    # Check if Gemini Ascendant
    # Gemini Asc houses: 5th (Libra - Venus), 12th (Taurus - Venus)
    # So if Asc is Gemini, and Venus is an Agent, we get 5, 12.
    
    # Find Ketu
    ketu_data = next(p for p in res['planets'] if p['planet'] == "Ketu")
    print(f"\nKETU DETAILS:")
    print(f"Sign: {ketu_data['sign']} (Lord: {ketu_data['sign_lord']})")
    print(f"Star: {ketu_data['nakshatra']} (Lord: {ketu_data['star_lord']})")
    print(f"Placed: House {ketu_data['house_placed']}")
    
    # Find Agents
    all_planets = res['planets']
    agents = engine.get_node_agents("Ketu", ketu_data, all_planets)
    
    print("\n--- KETU AGENTS ---")
    venus_is_agent = False
    for a in agents:
        print(f"Agent: {a['planet']} ({a['type']})")
        if a['planet'] == "Venus":
            venus_is_agent = True
            
    # Check Houses Owned by Agents (Whole Sign Logic)
    # Need to verify if Venus owns 5 and 12 for this Ascendant
    if venus_is_agent:
        print("\n>>> VENUS IS AN AGENT! <<<")
        # Check Venus Ownership relative to Ascendant
        # If Asc is Gemini: H5=Lib(Ven), H12=Tau(Ven).
        if asc_sign == "Gemini":
            print("Ascendant is Gemini. Venus owns 5th and 12th Houses.")
            print("Since Venus is an agent, Ketu signifies 5 and 12.")
            print("REASON CONFIRMED.")
        else:
            print(f"Ascendant is {asc_sign}. Check Venus owned houses.")

if __name__ == "__main__":
    debug_new_chart()
