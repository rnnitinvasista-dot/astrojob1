import swisseph as swe
from nadi_core import NadiEngine
import math

engine = NadiEngine()
lat = 12.9716
lon = 77.5946
# Target Horary 45 Lagna (Tropical)
# Horary Lagna (Sidereal) = 64.896388
# Ayanamsa (SIDM 5) = 24.1258
target_sid_lagna = 64.896388
jd = swe.julday(2026, 3, 4, 22.5966)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
aya = swe.get_ayanamsa_ut(jd)
target_trop_lagna = target_sid_lagna + aya

# Solve for RAMC:
# SwissEph houses_ex(..., h_sys)
def get_lagna_for_ramc(ramc):
    # This is hard because houses_ex takes JD/Lat/Lon
    # But we can use swe.houses_armc(armc, lat, eps, h_sys)
    _, eps = swe.get_tip_ut(jd)
    cusps, ascmc = swe.houses_armc(ramc, lat, eps, b'P')
    return ascmc[0] # Ascendant

# Simple search for RAMC
best_ramc = 0
min_diff = 999
for r in range(0, 36000):
    ramc = r / 100.0
    lag = get_lagna_for_ramc(ramc)
    diff = abs(lag - target_trop_lagna)
    if diff < min_diff:
        min_diff = diff
        best_ramc = ramc

print(f"Target Trop Lagna: {target_trop_lagna}")
print(f"Best RAMC: {best_ramc} (Diff: {min_diff})")

# Calculate all cusps for this RAMC
_, eps = swe.get_tip_ut(jd)
cusps, ascmc = swe.houses_armc(best_ramc, lat, eps, b'P')
print("Cusps for Best RAMC (Sidereal):")
for i in range(12):
    s_cusp = (cusps[i] - aya) % 360
    print(f"H{i+1}: {engine.decimal_to_dms(s_cusp, True)}")
