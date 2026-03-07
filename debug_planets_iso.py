import swisseph as swe
import datetime
import pytz

# Target: Sun 19 33 30 (Aquarius) for 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
# SUN is 0 in swisseph
res, _ = swe.calc_ut(jd, 0, swe.FLG_SIDEREAL)
lon = res[0]
sign_idx = int(lon/30)
d = int(lon % 30)
m = int((lon % 30 - d) * 60)
s = (lon % 30 - d - m/60)*3600
print(f"Sun (Sidereal): {d:02}°{m:02}'{s:05.2f}\" (Sign {sign_idx})")
