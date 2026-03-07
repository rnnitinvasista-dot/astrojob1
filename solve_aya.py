import swisseph as swe
from nadi_core import NadiEngine
import math

lat = 12.9716
jd = swe.julday(2026, 3, 4, 22.5966)
# Fix: calc_ut returns (results, flags) where results is a 6-element list
res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res[0]

# Targets (Sidereal)
target_h1 = 64.896388
target_h10 = 328.49222

def check(aya, ramc):
    h1_trop = (target_h1 + aya) % 360
    h10_trop = (target_h10 + aya) % 360
    cusps, ascmc = swe.houses_armc(ramc, lat, eps, b'P')
    diff_h1 = abs((ascmc[0] - h1_trop + 180) % 360 - 180)
    diff_h10 = abs((ascmc[1] - h10_trop + 180) % 360 - 180)
    return diff_h1 + diff_h10

best_aya = 0
best_ramc = 0
min_err = 999

for a in range(2380, 2460): 
    aya = a / 100.0
    for r in range(0, 3600): 
        ramc = r / 10.0
        err = check(aya, ramc)
        if err < min_err:
            min_err = err
            best_aya = aya
            best_ramc = ramc

low_a, high_a = best_aya - 0.1, best_aya + 0.1
low_r, high_r = best_ramc - 1.0, best_ramc + 1.0

for _ in range(500):
    best_aya_r = best_aya
    best_ramc_r = best_ramc
    for da in [-0.0001, 0, 0.0001]:
        for dr in [-0.001, 0, 0.001]:
            e = check(best_aya + da, best_ramc + dr)
            if e < min_err:
                min_err = e
                best_aya_r = best_aya + da
                best_ramc_r = best_ramc + dr
    best_aya, best_ramc = best_aya_r, best_ramc_r

print(f"Best Ayanamsa: {best_aya}")
print(f"Best RAMC: {best_ramc}")
print(f"Min Error: {min_err}")
