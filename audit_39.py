import swisseph as swe
import datetime
import pytz

# Birth Time: 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

swe.set_sid_mode(39, 0, 0) # KP SIDM 39
ayan_39 = swe.get_ayanamsa_ut(jd)
print(f"KP 39 Ayanamsa: {ayan_39}")

def get_pos(code, name):
    res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL)
    lon = res[0]
    if name == "Ketu": lon = (lon + 180) % 360
    d = int(lon % 30)
    m = int((lon % 30 - d) * 60)
    s = round((lon % 30 - d - m/60)*3600)
    if s >= 60: s-=60; m+=1
    if m >= 60: m-=60; d+=1
    return f"{d:02}°{m:02}'{s:02}\""

print(f"Sun    : {get_pos(0, 'Sun')}")
print(f"Moon   : {get_pos(1, 'Moon')}")
print(f"Mars   : {get_pos(4, 'Mars')}")
print(f"Mercury: {get_pos(2, 'Mercury')}")
print(f"Jupiter: {get_pos(5, 'Jupiter')}")
print(f"Venus  : {get_pos(3, 'Venus')}")
print(f"Saturn : {get_pos(6, 'Saturn')}")
print(f"Rahu   : {get_pos(10, 'Rahu')}")
print(f"Ketu   : {get_pos(11, 'Ketu')}")
