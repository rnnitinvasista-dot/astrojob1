import swisseph as swe
import datetime
import pytz

dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)
res_sun_trop, _ = swe.calc_ut(jd, 0, 0) # Tropical Sun
sun_trop = res_sun_trop[0]

def test_offset(off_arc):
    off = off_arc / 3600.0
    a = ayan_kp + off
    lon = (sun_trop - a) % 360
    lon_in_sign = lon % 30
    d = int(lon_in_sign); m = int((lon_in_sign-d)*60); s = round((lon_in_sign-d-m/60)*3600)
    if s >= 60: s -= 60; m += 1
    if m >= 60: m -= 60; d += 1
    return f"{d:02} {m:02} {s:02}"

# Target Sun: 19 33 30
for minutes_off in range(24, 28):
    for sec in [0, 15, 30, 45]:
        total_sec = minutes_off * 60 + sec
        print(f"Offset {minutes_off}m {sec}s: Sun = {test_offset(total_sec)}")
