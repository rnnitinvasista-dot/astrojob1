import swisseph as swe
import datetime
import pytz

# Test for 04/03/2026 22:35:48 Bengaluru
dt = datetime.datetime(2026, 3, 4, 22, 35, 48)
tz = pytz.timezone("Asia/Kolkata")
birth_dt_loc = tz.localize(dt)
utc_dt = birth_dt_loc.astimezone(pytz.UTC)
jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)
res_sun, _ = swe.calc_ut(jd, 0, swe.FLG_SIDEREAL)

print(f"KP Ayanamsa: {ayan_kp}")
print(f"Sun Sidereal: {res_sun[0]}")
print(f"Sun Tropical: {res_sun[0] + ayan_kp}")

# Try Today (March 4, 2026) vs Actually what user might be using.
# Wait, let me check the Julian Date logic again.
# UTC for 22:35:48 IST (+5:30) is 17:05:48 UTC.
jd_test = swe.julday(2026, 3, 4, 17.09666)
print(f"JD for 17:05 UTC: {jd_test}")
res_sun_test, _ = swe.calc_ut(jd_test, 0, swe.FLG_SIDEREAL)
print(f"Sun Sidereal 17:05: {res_sun_test[0]}")
