
import swisseph as swe
import datetime
import pytz

def decimal_to_dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = (deg - d - m/60) * 3600
    return f"{d:02d}°{m:02d}'{s:05.2f}\""

def check_all_planets():
    # Pavan: 16/08/2007 04:20 Chittoor
    lat, lon = 13.2172, 79.1003
    dt = datetime.datetime(2007, 8, 16, 4, 20, 0)
    tz = pytz.timezone('Asia/Kolkata')
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

    # Screenshot values to target
    # Sun: 28°45'55"
    # Moon: 03°22'57"
    # Rahu: 13°41'12" (Check both Mean and True)
    # Mars: 11°36'34"
    # Mercury: 28°53'36"
    # Jupiter: 16°05'07"
    # Venus: 02°14'29"
    # Saturn: 03°47'48"
    
    print(f"--- Benchmarking Ayanamsas for 16/08/2007 04:20 ---")
    
    ayanamsas = {
        "Lahiri": swe.SIDM_LAHIRI,
        "KP_New": swe.SIDM_KRISHNAMURTI_VP291,
        "KP_Old": swe.SIDM_KRISHNAMURTI,
        "Raman": swe.SIDM_RAMAN,
        "Fagan_Bradley": swe.SIDM_FAGAN_BRADLEY
    }

    for name, mode in ayanamsas.items():
        swe.set_sid_mode(mode, 0, 0)
        print(f"\n[{name}]")
        
        # Sun
        res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)
        print(f"Sun: {decimal_to_dms(res[0]%30)} (Target: 28°45'55\")")
        
        # Moon
        res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
        print(f"Moon: {decimal_to_dms(res[0]%30)} (Target: 03°22'57\")")
        
        # Rahu (Mean)
        res, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
        print(f"Rahu (Mean): {decimal_to_dms(res[0]%30)} (Target: 13°41'12\")")
        
        # Rahu (True)
        res, _ = swe.calc_ut(jd, swe.TRUE_NODE, swe.FLG_SIDEREAL)
        print(f"Rahu (True): {decimal_to_dms(res[0]%30)} (Target: 13°41'12\")")
        
        # Jupiter (Check Retrograde)
        res, _ = swe.calc_ut(jd, swe.JUPITER, swe.FLG_SIDEREAL)
        print(f"Jupiter: {decimal_to_dms(res[0]%30)} Speed: {res[3]} (Target: 16°05'07\")")

if __name__ == "__main__":
    check_all_planets()
