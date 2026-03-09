from nadi_core import NadiEngine

# Test using internal house_owners (full names) directly
e = NadiEngine()
res = e.calculate_kundli('04-05-2007 10:20:00', 'Asia/Kolkata', 12.9716, 77.5946)

p_map = {p['planet']: p for p in res['planets']}

# Build house_owners using SIGN_RULERS with full names - just like nadi_core internally does
from nadi_core import NadiEngine
import swisseph as swe
import pytz, datetime

e2 = NadiEngine()
jd = 2454225.4305556  # Approximate JD for 2007-05-04 10:20 IST
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_val = swe.get_ayanamsa_ut(jd) - 11.18/3600.0

# Get houses
lat, lon_c = 12.9716, 77.5946
h_sys = b'P'
gmst_hrs = swe.sidtime(jd)
lst_hrs = (gmst_hrs + lon_c / 15.0) % 24.0
ramc_deg = (lst_hrs * 15.0) % 360.0
res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res_nut[0]
cusps_trop, _ = swe.houses_armc(ramc_deg + 13.5/3600.0, lat, eps, h_sys)
cusps = [(c - ayan_val) % 360 for c in cusps_trop]

signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
asc_sn = signs[int(cusps[0] / 30)]
asc_idx = signs.index(asc_sn)

house_owners_internal = {}
for i in range(12):
    curr_sign = signs[(asc_idx + i) % 12]
    house_owners_internal[i+1] = e2.SIGN_RULERS[curr_sign]

print("=== INTERNAL house_owners (full names) ===")
for h, o in sorted(house_owners_internal.items()):
    print(f"House {h}: {o}")

# Now test the actual get_eff_sigs_detailed with these
print("\n=== RAHU sigs via real function ===")
rahu_sigs = e.get_eff_sigs_detailed("Rahu", p_map, house_owners_internal)
print("Rahu:", [x['house'] for x in rahu_sigs])

print("\n=== KETU sigs via real function ===")
ketu_sigs = e.get_eff_sigs_detailed("Ketu", p_map, house_owners_internal)
print("Ketu:", [x['house'] for x in ketu_sigs])

# Compare to what API actually returns
nadi = {n['planet']: n for n in res['nakshatra_nadi']}
print("\n=== API returned ===")
print("Rahu pl_signified:", [h['house'] for h in nadi['Rahu']['pl_signified']])
print("Ketu  pl_signified:", [h['house'] for h in nadi['Ketu']['pl_signified']])
