import swisseph as swe
from nadi_core import NadiEngine

engine = NadiEngine()
lat = 12.9716
jd = swe.julday(2026, 3, 4, 22.5966)
aya = 24.21
ramc = 353.298
res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res[0]

cusps, ascmc = swe.houses_armc(ramc, lat, eps, b'P')
print("Cusps with Ayanamsa 24.21 (Sidereal):")
for i in range(12):
    s_cusp = (cusps[i] - aya) % 360
    print(f"H{i+1}: {engine.decimal_to_dms(s_cusp, True)}")

# User Reference:
# 1: 64 53 47
# 2: 90 34 27
# 3: 117 50 15
# 4: 148 29 32
# 5: 181 45 17
# 6: 214 30 05
# 7: 244 53 47
# 8: 270 34 27
# 9: 297 50 15
# 10: 328 29 32
# 11: 01 45 17
# 12: 34 30 05
