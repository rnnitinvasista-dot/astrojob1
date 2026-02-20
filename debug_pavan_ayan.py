
import swisseph as swe
import datetime
import pytz

def check_pavan():
    # Pavan: May 4, 2007, 10:30 AM, Bangalore
    # Lat: 12.9716, Lon: 77.5946
    year, month, day = 2007, 5, 4
    hour, minute, sec = 10, 30, 0
    
    tz = pytz.timezone("Asia/Kolkata")
    dt = datetime.datetime(year, month, day, hour, minute, sec)
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)
    
    modes = {
        "KP NEW (5)": 5,
        "KP VARAHA (36)": 36, # SIDM_KP_VARAHAMIRA
        "LAHIRI (0)": 0,
    }
    
    # Try SIDM_KRISHNAMURTI (5) and others
    for name, mode in modes.items():
        swe.set_sid_mode(mode, 0, 0)
        ayan = swe.get_ayanamsa_ut(jd)
        print(f"Mode: {name} | Ayanamsa: {swe.format_deg(ayan)}")
        
        # Check cusps (Placidus)
        cusps, ascmc = swe.houses_ex(jd, 12.9716, 77.5946, b'P', swe.FLG_SIDEREAL)
        print(f"  Asc (House 1): {swe.format_deg(ascmc[0])}")
        print(f"  House 2: {swe.format_deg(cusps[1])}")
        print(f"  House 3: {swe.format_deg(cusps[2])}")
        
        # Check Ketu (180 from Rahu)
        res, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
        rahu = res[0]
        ketu = (rahu + 180) % 360
        print(f"  Rahu: {rahu:.4f} | Ketu: {ketu:.4f}")
        
        # Find Ketu House
        hp = 0
        for i in range(12):
            c_curr = cusps[i]
            c_next = cusps[(i+1)%12]
            if c_next < c_curr:
                if ketu >= c_curr or ketu < c_next:
                    hp = i + 1
                    break
            else:
                if c_curr <= ketu < c_next:
                    hp = i + 1
                    break
        print(f"  Ketu House: {hp}")
        print("-" * 30)

if __name__ == "__main__":
    check_pavan()
