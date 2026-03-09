
import swisseph as swe

jd = swe.julday(2007, 5, 4, 5.0)
lat, lon = 12.9666, 77.5833
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res_nut[0]
gmst_hrs = swe.sidtime(jd)
base_ramc = ((gmst_hrs + lon / 15.0) * 15.0) % 360.0
base_ayan = swe.get_ayanamsa_ut(jd)

targets = {
    "Sun": 19.509444, # 19°30'34"
    "H1": 84.311667,  # 84°18'42"
    "H2": 110.575278, # 110°34'31"
    "H10": 351.659167 # 351°39'33"
}

def get_diffs(a_sec, r_sec):
    a_off = a_sec / 3600.0
    r_off = r_sec / 3600.0
    ayan = base_ayan + a_off
    ramc = (base_ramc + r_off) % 360.0
    
    # Sun
    res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
    sun = (res[0] - ayan) % 360.0
    
    # Houses
    cusps, _ = swe.houses_armc(ramc, lat, eps, b'P')
    h1 = (cusps[0] - ayan) % 360.0
    h2 = (cusps[1] - ayan) % 360.0
    h10 = (cusps[9] - ayan) % 360.0
    
    return [abs(sun-targets["Sun"])*3600, abs(h1-targets["H1"])*3600, abs(h2-targets["H2"])*3600, abs(h10-targets["H10"])*3600]

min_err = 999999
best = None
for a in range(-60, 60):
    for r in range(-60, 60):
        errs = get_diffs(a, r)
        total = sum(errs)
        if total < min_err:
            min_err = total
            best = (a, r, errs)

print(f"Best Ayan Offset: {best[0]}s, RAMC Offset: {best[1]}s")
print(f"Errors (s): Sun:{best[2][0]:.1f}, H1:{best[2][1]:.1f}, H2:{best[2][2]:.1f}, H10:{best[2][3]:.1f}")
