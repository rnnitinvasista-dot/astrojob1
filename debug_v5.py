
from nadi_core import NadiEngine
import datetime

def debug_v5():
    # Setup Engine
    # User mentioned "Engine bhi diya" - referring to swisseph-master (Zip). 
    # We are using pyswisseph which is correct.
    # Discrepancy likely due to Location (Chittoor vs Bangalore) or Ayanamsa logic.
    
    engine = NadiEngine(node_type="Mean", ayanamsa="Lahiri")
    
    # User's Target: Bangalore
    # Date: 16/08/2007, Time: 04:20
    dt_str = "2007-08-16 04:20:00"
    tz = "Asia/Kolkata"
    
    # Bangalore Coordinates
    lat_ban = 12.9716
    lon_ban = 77.5946
    
    # Chittoor Coordinates (Previous)
    lat_chi = 13.2172
    lon_chi = 79.1003
    
    print(f"--- DEBUGGING FOR DATE: {dt_str} ---")
    
    # Run for Bangalore
    print(f"\n--- BANGALORE ({lat_ban}, {lon_ban}) ---")
    res_ban = engine.calculate_kundli(dt_str, tz, lat_ban, lon_ban)
    print_metrics(res_ban)
    
    # Run for Chittoor
    print(f"\n--- CHITTOOR ({lat_chi}, {lon_chi}) ---")
    res_chi = engine.calculate_kundli(dt_str, tz, lat_chi, lon_chi)
    print_metrics(res_chi)

def print_metrics(res):
    if res["status"] == "error":
        print(f"Error: {res['message']}")
        return

    # 1. Degrees
    asc = res["ascendant"]["degree_dms"]
    sun = next(p["degree_dms"] for p in res["planets"] if p["planet"] == "Sun")
    moon = next(p["degree_dms"] for p in res["planets"] if p["planet"] == "Moon")
    rahu = next(p["degree_dms"] for p in res["planets"] if p["planet"] == "Rahu")
    
    print(f"Ascendant: {asc}")
    print(f"Sun:       {sun}")
    print(f"Moon:      {moon}")
    print(f"Rahu:      {rahu}")
    
    # 2. Dasha
    d = res["dasha"]
    print(f"Balance:   {d['balance_at_birth']}")
    print(f"Current:   MD={d['current_dasha']}, AD={d['current_bukthi']}")
    
    # 3. Rahu Agents
    r_nadi = next(p for p in res["nakshatra_nadi"] if p["planet"] == "Rahu")
    print(f"Rahu Agents (Houses): {r_nadi['planet_houses']}")
    # Also print the raw agent planets if possible (need to tweak engine or infer)

if __name__ == "__main__":
    debug_v5()
