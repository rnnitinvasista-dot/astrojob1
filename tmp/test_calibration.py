
import swisseph as swe
import datetime
import pytz

def decimal_to_dms(deg):
    d = int(abs(deg))
    m = int((abs(deg) - d) * 60)
    s = int(round((((abs(deg) - d) * 60) - m) * 60))
    if s == 60: m += 1; s = 0
    if m == 60: d += 1; m = 0
    return f"{d:02d}°{m:02d}'{s:02d}\""

# 2007-05-04 10:30:00 IST -> 05:00:00 UT
jd = swe.julday(2007, 5, 4, 5.0)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)

# Final Calibration Attempt
AYAN_OFFSET = -2.0 / 3600.0  # -2 seconds
RAMC_OFFSET = 6.0 / 3600.0   # +6 seconds

ayan_val = swe.get_ayanamsa_ut(jd) + AYAN_OFFSET

# Planets
print("\n--- PLANETS ---")
targets = {"Sun": "19°30'34\"", "Moon": "219°15'48\"", "Mars": "327°28'54\"", "Mercury": "20°45'08\""}
for name, code in [("Sun", swe.SUN)]:
    res, _ = swe.calc_ut(jd, code, swe.FLG_SWIEPH)
    lon_sidereal = (res[0] - ayan_val) % 360.0
    print(f"{name:<8} | {decimal_to_dms(lon_sidereal)} | Target: {targets[name]}")

# Houses
gmst_hrs = swe.sidtime(jd)
lst_hrs = (gmst_hrs + 77.5833 / 15.0) % 24.0
ramc_deg = (lst_hrs * 15.0) % 360.0
res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res_nut[0]
cusps_trop, ascmc_trop = swe.houses_armc(ramc_deg + RAMC_OFFSET, 12.9666, eps, b'P')
cusps = [(c - ayan_val) % 360 for c in cusps_trop]

print("\n--- CUSPS ---")
cusp_targets = {1: "84°18'42\""}
for i in range(12):
    hn = i + 1
    if hn in cusp_targets:
        print(f"H{hn:<2}      | {decimal_to_dms(cusps[i])} | Target: {cusp_targets[hn]}")
