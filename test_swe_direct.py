import swisseph as swe
import os

# Set Ephe Path if needed (using default or env)
# swe.set_ephe_path(...) 

date = "1990-01-01"
jd = 2447892.7708333335 # From Log

print(f"Testing Mars for JD: {jd}")

# Force KP
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
res_kp, _ = swe.calc_ut(jd, swe.MARS, swe.FLG_SIDEREAL | swe.FLG_SPEED)
print(f"Mars KP: {res_kp[0]}")

# Force Lahiri
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
res_lahiri, _ = swe.calc_ut(jd, swe.MARS, swe.FLG_SIDEREAL | swe.FLG_SPEED)
print(f"Mars Lahiri: {res_lahiri[0]}")

# Force Tropical
res_trop, _ = swe.calc_ut(jd, swe.MARS, swe.FLG_SPEED)
print(f"Mars Tropical: {res_trop[0]}")
