
import swisseph as swe
import datetime

# March 9, 2026
jd = swe.julday(2026, 3, 9)

print(f"Date: March 9, 2026")
print("-" * 30)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)
print(f"KP (Original - 5): {ayan_kp:.6f}")

swe.set_sid_mode(39, 0, 0) # SIDM_VP291
ayan_vp291 = swe.get_ayanamsa_ut(jd)
print(f"KP New (VP291 - 39): {ayan_vp291:.6f}")

diff = (ayan_vp291 - ayan_kp) * 3600.0
print(f"Difference: {diff:.2f} arcsecs")
