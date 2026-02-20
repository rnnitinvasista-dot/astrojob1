
import swisseph as swe
import datetime
import pytz

def scan_time():
    # Pavan: 04 May 2007, Bangalore
    lat = 12.9716
    lon = 77.5946
    target_lagna = 82.00 # 22 Gemini
    
    tz = pytz.timezone("Asia/Kolkata")
    
    print("Scanning May 04 2007 for Gemini 22:00 Lagna...")
    for h in range(21, 24): # 9 PM to 12 PM
        for m in range(0, 60):
            dt_str = f"2007-05-04 {h:02d}:{m:02d}:00"
            dt = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
            dt_loc = tz.localize(dt)
            utc_dt = dt_loc.astimezone(pytz.UTC)
            jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60)
            
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
            cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
            lagna = ascmc[0]
            
            if abs(lagna - target_lagna) < 0.2:
                print(f"Time: {dt_str} | Lagna: {lagna:.4f} ({swe.format_deg(lagna, swe.DEG_DMS)})")

if __name__ == "__main__":
    scan_time()
