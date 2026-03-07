from nadi_core import NadiEngine
import datetime

engine = NadiEngine()
dt_str = "2026-03-04 22:35:48"
tz = "Asia/Kolkata"
lat = 12.9716
lon = 77.5946

result = engine.calculate_kundli(dt_str, tz, lat, lon, horary_number=45)
houses = result['houses']

print("House Cusps for Horary 45:")
for h in houses:
    print(f"House {h['house_number']}: {h['cusp_degree_dms']} | {h['sign_lord']}-{h['star_lord']}-{h['sub_lord']}")
