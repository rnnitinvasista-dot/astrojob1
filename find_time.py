
import sys
import os
import datetime
from nadi_core import NadiEngine
import swisseph as swe

def find_correct_chart():
    # Search on 1990-12-15
    base_date = datetime.datetime(1990, 12, 15, 0, 0, 0)
    
    engine = NadiEngine(ayanamsa="KP")
    
    print("Searching for Gemini Ascendant (Sign 3) and Jupiter in 5th House...")
    
    for minute in range(0, 1440, 15): # Check every 15 mins
        dt = base_date + datetime.timedelta(minutes=minute)
        dt_str = dt.strftime("%Y-%m-%d %H:%M:%S")
        
        res = engine.calculate_kundli(dt_str, "Asia/Kolkata", 28.6, 77.2)
        if "ascendant" not in res: continue
        
        asc_sign = res['ascendant']['sign']
        
        # Check Jupiter House
        jup_data = next(p for p in res['planets'] if p['planet'] == "Jupiter")
        jup_house = jup_data['house_placed']
        
        if asc_sign == "Gemini":
            print(f"Time: {dt_str} -> Asc: {asc_sign}, Jupiter House: {jup_house}")
            if jup_house == 5:
                print(">>> MATCH FOUND <<<")
                # Print details
                return

if __name__ == "__main__":
    find_correct_chart()
