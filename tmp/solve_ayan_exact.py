
import swisseph as swe

# Target: 04/05/2007 10:30:00 Bengaluru (12.9666, 77.5833)
# Target H1: 84°18'42" -> 84.311667
target_h1 = 84.311667

jd = swe.julday(2007, 5, 4, 5.0) # 05:00 UT
lat, lon = 12.9666, 77.5833

res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res_nut[0]
gmst_hrs = swe.sidtime(jd)
lst_hrs = (gmst_hrs + lon / 15.0) % 24.0
ramc_deg = (lst_hrs * 15.0) % 360.0

# Tropically, what is H1?
cusps_trop, _ = swe.houses_armc(ramc_deg, lat, eps, b'P')
h1_trop = cusps_trop[0]

# Required Ayanamsa = h1_trop - target_h1
req_ayan = (h1_trop - target_h1) % 360.0

print(f"H1 Tropical: {h1_trop:.6f}")
print(f"H1 Target Sidereal: {target_h1:.6f}")
print(f"REQUIRED AYANAMSA: {req_ayan:.6f}")

# Check KP Mode 5 Ayanamsa
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_mode5 = swe.get_ayanamsa_ut(jd)
print(f"Mode 5 Ayanamsa: {ayan_mode5:.6f}")
print(f"Diff (Mode 5 - Required): {(ayan_mode5 - req_ayan)*3600:.2f} seconds")

# Check Lahiri Ayanamsa
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
ayan_lahiri = swe.get_ayanamsa_ut(jd)
print(f"Lahiri Ayanamsa: {ayan_lahiri:.6f}")
print(f"Diff (Lahiri - Required): {(ayan_lahiri - req_ayan)*3600:.2f} seconds")
