import swisseph as swe
import datetime
import pytz

# Target Time: 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

# What if Time is different? 10:37 AM from the screenshot top?
# The screenshot header shows 10:37.
# Let's test 10:37:00 (Morning)
jd_morning = swe.julday(2026, 3, 4, 5.11666) # 10:37 AM IST is 5:07 UTC

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
def test_jd(j, label):
    res, _ = swe.calc_ut(j, 0, swe.FLG_SIDEREAL)
    lon = res[0] % 30
    d = int(lon); m = int((lon-d)*60); s = round((lon-d-m/60)*3600)
    print(f"{label} Sun: {d:02} {m:02} {s:02}")
    
test_jd(jd, "22:35 PM")
test_jd(jd_morning, "10:37 AM")
