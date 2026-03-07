
import swisseph as swe
import datetime
import pytz

def check_ayanamsa():
    # Pavan: 04 May 2007, 23:30, Bangalore
    dt_str = "2007-05-04 23:30:00"
    tz = pytz.timezone("Asia/Kolkata")
    dt = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)
    
    modes = {
        "KP (SIDM_KRISHNAMURTI)": swe.SIDM_KRISHNAMURTI,
        "LAHIRI": swe.SIDM_LAHIRI,
        "KP_NEW (23.8627 target)": -1 # Special check
    }
    
    print(f"Date: {dt_str} Bangalore")
    print(f"JD: {jd}")
    
    for name, mode in modes.items():
        if mode != -1:
            swe.set_sid_mode(mode, 0, 0)
            ayan = swe.get_ayanamsa_ut(jd)
            print(f"{name}: {ayan:.4f} ({swe.format_deg(ayan, swe.DEG_DMS)})")
            
    # Calculate Lagna with KP
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
    cusps, ascmc = swe.houses_ex(jd, 12.9716, 77.5946, b'P', swe.FLG_SIDEREAL)
    print(f"\nLagna (KP Traditional): {ascmc[0]:.4f} ({swe.format_deg(ascmc[0], swe.DEG_DMS)})")
    
    # Check if a custom offset matches the 22:00 target
    # Target Lagna = 82.00 (22 Gemini)
    # Current Lagna = 84.32 (24 Gemini)
    # Difference = 2.32 degrees.
    
    # If we shift ayanamsa by 2.32, does it match 23.86?
    # Current Ayan = 23.8655. 
    # Wait! My Ayan is 23.8655. The target is 23.8627.
    # Difference = 0.0028 degrees. ONLY 10 arc-seconds!
    # So Ayanamsa is NOT the reason for the 2 degree Lagna shift.

    # What if the TIME is different?
    # Maybe 11:30 PM is not the time for "correct" results.
    # User provided 11:30 PM in a previous audio? Or text?
    # Let's check previous task logs.
    
if __name__ == "__main__":
    check_ayanamsa()
