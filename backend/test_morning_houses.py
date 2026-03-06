import swisseph as swe
from nadi_core import NadiEngine

engine = NadiEngine()
lat = 12.9716
# 10:37:00 IST is 05:07:00 UTC
jd_morning = swe.julday(2026, 3, 4, 5.11666)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd_morning)

# Target Horary 45
target_sid_h1 = 64.896388

# Use 27" calibration as before
calibration_offset = 27.0 / 3600.0
# Trop Asc = Sid Asc + Aya
target_trop_h1 = (target_sid_h1 + ayan_kp + calibration_offset) % 360

res, _ = swe.calc_ut(jd_morning, swe.ECL_NUT, 0)
eps = res[0]

def get_ascmc(r):
    cusps, ascmc = swe.houses_armc(r, lat, eps, b'P')
    return ascmc

# Brute force search for RAMC
best_r = 0; min_err = 999
for r in range(0, 360000, 1):
    tr = r / 1000.0
    val = get_ascmc(tr)[0]
    err = abs((val - target_trop_h1 + 180) % 360 - 180)
    if err < min_err:
        min_err = err
        best_r = tr

print(f"Morning Best RAMC: {best_r}")
cusps_trop, ascmc = swe.houses_armc(best_r, lat, eps, b'P')
print("Calculated Cusps (Sidereal):")
for i in range(12):
    s = (cusps_trop[i] - ayan_kp - calibration_offset) % 360
    print(f"H{i+1}: {engine.decimal_to_dms(s, True)}")
