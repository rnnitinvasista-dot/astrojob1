import swisseph as swe
import datetime

jd = swe.julday(2026, 3, 4, 12, 0) # March 4, 2026

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)

swe.set_sid_mode(41, 0, 0) # SIDM_KP_NEW
ayan_kp_new = swe.get_ayanamsa_ut(jd)

def dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = (deg - d - m/60) * 3600
    return f"{d:02}:{m:02}:{s:04.1f}"

print(f"KP (5):     {ayan_kp:.6f} ({dms(ayan_kp)})")
print(f"KP NEW (41): {ayan_kp_new:.6f} ({dms(ayan_kp_new)})")
