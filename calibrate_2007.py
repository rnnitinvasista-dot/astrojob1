
import swisseph as swe
from nadi_core import NadiEngine

# May 4, 2007, 10:18:00 AM IST, Bengaluru
jd = swe.julday(2007, 5, 4, 4.8) 
lat, lon = 12.9716, 77.5946

engine = NadiEngine()

# Test with pure SIDM_KRISHNAMURTI (5)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan = swe.get_ayanamsa_ut(jd)

planets = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE
}

print("Object  | Our Deg | Target Deg | Diff (Sec)")
print("-" * 50)

targets = {
    "Sun": 19 + 30/60 + 5/3600,     
    "Moon": 219 + 9/60 + 43/3600,   
    "Mars": 327 + 28/60 + 31/3600,   
    "Mercury": 20 + 44/60 + 3/3600, 
    "Jupiter": 234 + 44/60 + 37/3600, 
    "Venus": 61 + 32/60 + 36/3600,   
    "Saturn": 114 + 26/60 + 2/3600, 
    "Rahu": 319 + 16/60 + 12/3600    
}

for name, code in planets.items():
    res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL)
    diff_sec = (res[0] - targets[name]) * 3600.0
    print(f"{name:8} | {engine.decimal_to_dms(res[0])} | {engine.decimal_to_dms(targets[name])} | {diff_sec:8.1f}")

# Cusp 1
gmst = swe.sidtime(jd)
lst = (gmst + lon / 15.0) % 24.0
armc = lst * 15.0
nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = nut[0]
cusps_trop, ascmc_trop = swe.houses_armc(armc, lat, eps, b'P')
cusp1_our = (cusps_trop[0] - ayan) % 360
cusp1_target = 81 + 35/60 + 36/3600
diff_cusp1 = (cusp1_our - cusp1_target) * 3600.0
print(f"Cusp 1   | {engine.decimal_to_dms(cusp1_our)} | {engine.decimal_to_dms(cusp1_target)} | {diff_cusp1:8.1f}")
