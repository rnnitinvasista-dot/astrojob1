import swisseph as swe
from nadi_core import NadiEngine
engine = NadiEngine()
dt_str = "2026-03-04 22:35:48"
tz = "Asia/Kolkata"
lat = 12.9716
lon = 77.5946

# Get Time Lagna (no horary)
result = engine.calculate_kundli(dt_str, tz, lat, lon)
print(f"Time Lagna: {result['houses'][0]['cusp_degree_dms']}")
print(f"Time House 10: {result['houses'][9]['cusp_degree_dms']}")
for idx, h in enumerate(result['houses']):
    print(f"H{idx+1}: {h['cusp_degree_decimal']}")
