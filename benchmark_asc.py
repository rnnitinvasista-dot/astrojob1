
import swisseph as swe
import datetime
import pytz

def decimal_to_dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = (deg - d - m/60) * 3600
    return f"{d:02d}°{m:02d}'{s:05.2f}\""

def check_asc_and_nodes():
    lat, lon = 13.2172, 79.1003
    dt = datetime.datetime(2007, 8, 16, 4, 20, 0)
    tz = pytz.timezone('Asia/Kolkata')
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    
    # Check Ascendant (Placidus)
    cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
    asc_lon = ascmc[0]
    print(f"Ascendant (Placidus): {decimal_to_dms(asc_lon % 30)} (Target: 04°30'50\")") # Screenshot says LA 04 30 50
    
    # Check Rahu
    res_mean, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
    print(f"Rahu (Mean): {decimal_to_dms(res_mean[0]%30)} (Target: 13°41'12\")")
    
    res_true, _ = swe.calc_ut(jd, swe.TRUE_NODE, swe.FLG_SIDEREAL)
    print(f"Rahu (True): {decimal_to_dms(res_true[0]%30)} (Target: 13°41'12\")")

if __name__ == "__main__":
    check_asc_and_nodes()
