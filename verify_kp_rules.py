
from nadi_core import NadiEngine
import json

def verify_kp_rules():
    engine = NadiEngine(node_type="Mean", ayanamsa="KP")
    
    # Example: Pavan Chart (04/05/2007 10:30 AM Bengaluru)
    dt_str = "2007-05-04 10:30:00" 
    tz = "Asia/Kolkata"
    lat, lon = 13.0, 80.0 # Chennai
    
    res = engine.calculate_kundli(dt_str, tz, lat, lon)
    
    print("--- KP SIGNIFICATOR VERIFICATION ---")
    
    for entry in res["nakshatra_nadi"]:
        p = entry["planet"]
        pl_houses = [s["house"] for s in entry["pl_signified"]]
        nl_houses = [s["house"] for s in entry["nl_signified"]]
        sl_houses = [s["house"] for s in entry["sl_signified"]]
        
        print(f"\nPlanet: {p} (Star: {entry['star_lord']}, Sub: {entry['sub_lord']})")
        print(f"  Level 2 (Planet): {pl_houses}")
        print(f"  Level 1 (Star):   {nl_houses}")
        print(f"  Sub Lord:         {sl_houses}")
        
    # Specifically check Rahu/Ketu for Conjunctions
    rahu = next(p for p in res["planets"] if p["planet"] == "Rahu")
    ketu = next(p for p in res["planets"] if p["planet"] == "Ketu")
    
    print(f"\n--- NODE SPECIAL CHECK ---")
    print(f"Rahu Sign: {rahu['sign']}, House: {rahu['house_placed']}")
    print(f"Ketu Sign: {ketu['sign']}, House: {ketu['house_placed']}")
    
    # Check if any other planet is in Rahu's sign
    conj_rahu = [p["planet"] for p in res["planets"] if p["sign"] == rahu["sign"] and p["planet"] not in ["Rahu", "Ketu"]]
    print(f"Planets Conjunct Rahu: {conj_rahu}")
    
    rahu_sigs = next(e for e in res["nakshatra_nadi"] if e["planet"] == "Rahu")
    rahu_pl_houses = [s["house"] for s in rahu_sigs["pl_signified"]]
    
    for cp in conj_rahu:
        cp_pos = next(p["house_placed"] for p in res["planets"] if p["planet"] == cp)
        if cp_pos in rahu_pl_houses:
            print(f"  SUCCESS: Conjunct {cp}'s house {cp_pos} added to Rahu's significators.")
        else:
            print(f"  FAILURE: Conjunct {cp}'s house {cp_pos} MISSING from Rahu's significators.")

if __name__ == "__main__":
    verify_kp_rules()
