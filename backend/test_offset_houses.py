import swisseph as swe
from nadi_core import NadiEngine

engine = NadiEngine()
lat = 12.9716
jd = swe.julday(2026, 3, 4, 17.09666) # 22:35:48 IST
target_sid_c1 = 64.896388

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)

# Test +44 arcseconds offset
offset = 44.0 / 3600.0
ayan_calibrated = ayan_kp + offset

target_trop_c1 = (target_sid_c1 + ayan_calibrated) % 360
res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res[0]

def get_asc(r):
    cusps, ascmc = swe.houses_armc(r, lat, eps, b'P')
    return ascmc[0]

best_r = 0
min_err = 999
for r in range(0, 360000, 1):
    tr = r / 1000.0
    err = abs((get_asc(tr) - target_trop_c1 + 180) % 360 - 180)
    if err < min_err:
        min_err = err
        best_r = tr

print(f"Best RAMC: {best_r}")
cusps_trop, ascmc = swe.houses_armc(best_r, lat, eps, b'P')
print("Calculated Cusps (Sidereal):")
for i in range(12):
    s = (cusps_trop[i] - ayan_calibrated) % 360
    print(f"H{i+1}: {engine.decimal_to_dms(s, True)}")
