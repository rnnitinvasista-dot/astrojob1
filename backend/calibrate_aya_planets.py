import swisseph as swe
import datetime
import pytz

# Target Time: 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

# If Sun is 19 33 30 Sidereal, and Tropical is 343.126
# Custom Ayanamsa = 343.1264 - 319.5583 = 23.5681?
# Let's try to find Ayanamsa that makes Sun = 19 33 30
res_sun_trop, _ = swe.calc_ut(jd, 0, 0) # Tropical Sun
target_sid_sun = 319.558333 # 19 33 30 Aquarius
aya_required = (res_sun_trop[0] - target_sid_sun) % 360
print(f"Required Ayanamsa for Sun 19 33 30: {aya_required}")

def test_aya(a):
    swe.set_sid_mode(swe.SIDM_USER, a, 0)
    res, _ = swe.calc_ut(jd, 0, swe.FLG_SIDEREAL)
    lon = res[0] % 30
    d = int(lon)
    m = int((lon-d)*60)
    s = round((lon-d-m/60)*3600)
    print(f"Sidereal Sun with Aya {a}: {d:02} {m:02} {s:02}")
    
    # Check Moon
    res_m, _ = swe.calc_ut(jd, 1, swe.FLG_SIDEREAL)
    lon_m = res_m[0] % 30
    dm = int(lon_m)
    mm = int((lon_m-dm)*60)
    sm = round((lon_m-dm-mm/60)*3600)
    print(f"Sidereal Moon with Aya {a}: {dm:02} {mm:02} {sm:02}")

test_aya(aya_required)
