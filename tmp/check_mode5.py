
import sys
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine
import swisseph as swe

# Test with Mode 5 (KP OLD)
engine = NadiEngine(ayanamsa="KP_OLD") # I will modify nadi_core to support this or just force it here

# Manually force Mode 5 in SwissEph for this test
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)

# coords = 12.9716, 77.5946
jd = swe.julday(2007, 5, 4, 5.0)

def verify(lat, lon):
    print(f"\n--- Testing with Lat:{lat}, Lon:{lon} ---")
    res = engine.calculate_kundli('2007-05-04 10:30:00', 'Asia/Kolkata', lat, lon)
    
    targets = {
        "Sun": "19°30'34\"",
        "Moon": "219°15'48\"",
        "Mars": "327°28'54\"",
        "Mercury": "20°45'08\"",
    }
    for p in res['planets']:
        if p['planet'] in targets:
            print(f"{p['planet']:<8} | {p['degree_dms']:<15} | Target: {targets[p['planet']]}")

    cusp_targets = {1: "84°18'42\"", 2: "110°34'31\"", 10: "351°39'33\""}
    for h in res['houses']:
        if h['house_number'] in cusp_targets:
            print(f"H{h['house_number']:<2}      | {h['cusp_degree_dms']:<15} | Target: {cusp_targets[h['house_number']]}")

print("MODE 5 RESULTS:")
verify(12.9716, 77.5946)
verify(12.97, 77.59)
verify(12.98, 77.58)
