import swisseph as swe
from nadi_core import NadiEngine

engine = NadiEngine()
lat = 12.9716
jd = swe.julday(2026, 3, 4, 17.09666) # 22:35:48 IST

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_kp = swe.get_ayanamsa_ut(jd)
res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res[0]

def check_offset(off_arc):
    off = off_arc / 3600.0
    a = ayan_kp + off
    target_sid_h1 = 64.896388
    target_trop_h1 = (target_sid_h1 + a) % 360
    
    # Precise search for RAMC
    best_r = 0; min_err = 999
    for r in range(3532100, 3532200, 1): # Zoomed in area
        tr = r / 10000.0
        cusps, ascmc = swe.houses_armc(tr, lat, eps, b'P')
        err = abs((ascmc[0] - target_trop_h1 + 180) % 360 - 180)
        if err < min_err:
            min_err = err
            best_r = tr
            
    cusps, ascmc = swe.houses_armc(best_r, lat, eps, b'P')
    h2_sid = (cusps[1] - a) % 360
    return h2_sid

print(f"Base KP Ayanamsa: {ayan_kp}")
# Test larger negative offsets to reach 27"
for o in [-24.6, -24.7, -24.8, -24.9, -25.0]:
    res_h2 = check_offset(o)
    print(f"Offset {o}\": House 2 = {engine.decimal_to_dms(res_h2, True)}")
