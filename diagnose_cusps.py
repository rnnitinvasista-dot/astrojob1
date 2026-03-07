import swisseph as swe
import datetime
import pytz

def check():
    # Bengaluru Coordinates
    lat = 12.9716
    lon = 77.5946
    
    # Time from Image: 04/03/2026 01:58:52
    dt_str = "2026-03-04 01:58:52"
    tz = pytz.timezone("Asia/Kolkata")
    dt = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, 
                    utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0)
    
    # Test different Ayanamsas
    ayan_modes = {
        "Lahiri": swe.SIDM_LAHIRI,
        "KP": swe.SIDM_KRISHNAMURTI,
        "Fagan": swe.SIDM_FAGAN_BRADLEY
    }
    
    print(f"Time: {dt_str} Bengaluru")
    print("-" * 40)
    
    for name, mode in ayan_modes.items():
        swe.set_sid_mode(mode, 0, 0)
        ayan_val = swe.get_ayanamsa_ut(jd)
        cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
        
        print(f"Ayanamsa: {name} ({ayan_val:.4f})")
        print(f"Real-Time Ascendant: {ascmc[0]:.4f}")
        print(f"Real-Time MC: {ascmc[1]:.4f}")
        print(f"Real-Time Cusp 2: {cusps[1]:.4f}")
        print("-" * 40)

if __name__ == "__main__":
    check()
