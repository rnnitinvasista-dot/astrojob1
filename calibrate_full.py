import swisseph as swe
import datetime
import pytz

# Target Time: 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

# 24.57 was close for something. 
# Let's try SIDM 5 (24.125) vs User's 19 33 30.
# 19 33 30 in Aquarius is 319.5583
# Sun Tropical is 344.1264
# Aya = 344.1264 - 319.5583 = 24.5681

target_aya = 24.5681

def test_aya(a):
    swe.set_sid_mode(swe.SIDM_USER, a, 0)
    # Sun
    res, _ = swe.calc_ut(jd, 0, swe.FLG_SIDEREAL)
    lon = res[0] % 30
    d = int(lon); m = int((lon-d)*60); s = round((lon-d-m/60)*3600)
    print(f"Sun   : {d:02} {m:02} {s:02}")
    
    # Moon
    res_m, _ = swe.calc_ut(jd, 1, swe.FLG_SIDEREAL)
    lon_m = res_m[0] % 30
    d = int(lon_m); m = int((lon_m-d)*60); s = round((lon_m-d-m/60)*3600)
    print(f"Moon  : {d:02} {m:02} {s:02}")
    
    # Houses at lat 12.9716
    _, eps = swe.calc_ut(jd, swe.ECL_NUT, 0)
    # Find RAMC that gives H1 = 64.896388 with this Aya
    target_trop_h1 = (64.896388 + a) % 360
    # Search for RAMC
    best_r = 0; min_err = 999
    for r in range(0, 360000, 5):
        tr = r / 1000.0
        cusps, ascmc = swe.houses_armc(tr, 12.9716, eps[0], b'P')
        err = abs((ascmc[0] - target_trop_h1 + 180) % 360 - 180)
        if err < min_err:
            min_err = err
            best_r = tr
            
    cusps, ascmc = swe.houses_armc(best_r, 12.9716, eps[0], b'P')
    print(f"House 2: {int((cusps[1]-a)%30)} {int(((cusps[1]-a)%30-int((cusps[1]-a)%30))*60)} {round(((cusps[1]-a)%30-int((cusps[1]-a)%30)-int(((cusps[1]-a)%30-int((cusps[1]-a)%30))*60)/60)*3600)}")

test_aya(target_aya)
