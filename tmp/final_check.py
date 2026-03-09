
import sys
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine
import swisseph as swe

# Use the calibrated settings
engine = NadiEngine()
# The code in calculate_kundli now uses SIDM_KRISHNAMURTI (Mode 5) by default.
# I'll use the exact coordinates discovered: 12.9666, 77.5833 (Standard Bengaluru)

res = engine.calculate_kundli('2007-05-04 10:30:00', 'Asia/Kolkata', 12.9666, 77.5833)

print("AYANAMSA:", res['metadata']['ayanamsa_value'])

print("\n--- PLANETS ---")
print("Pla      | Current | Image Target")
targets = {
    "Sun": "19°30'34\"",
    "Moon": "219°15'48\"",
    "Mars": "327°28'54\"",
    "Mercury": "20°45'08\"",
    "Jupiter": "234°44'34\"",
    "Venus": "61°33'09\"",
    "Saturn": "114°26'03\"",
    "Rahu": "319°16'11\"",
    "Ketu": "139°16'11\""
}
for p in res['planets']:
    if p['planet'] in targets:
        print(f"{p['planet']:<8} | {p['degree_dms']:<18} | {targets[p['planet']]}")

print("\n--- CUSPS ---")
print("Hos | Current | Image Target")
cusp_targets = {
    1: "84°18'42\"",
    2: "110°34'31\"",
    3: "139°38'16\"",
    4: "171°39'33\"",
    5: "204°15'34\"",
    6: "235°07'51\""
}
for h in res['houses'][:6]:
    print(f"{h['house_number']:<3} | {h['cusp_degree_dms']:<18} | {cusp_targets[h['house_number']]}")
