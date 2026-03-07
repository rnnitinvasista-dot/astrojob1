from nadi_core import NadiEngine
engine = NadiEngine()
dt_str = "2026-03-04 12:00:00"
tz = "Asia/Kolkata"
lat = 12.9716
lon = 77.5946

print("--- Horary #1 ---")
res1 = engine.calculate_kundli(dt_str, tz, lat, lon, horary_number=1)
h1 = res1['houses'][0]
print(f"H1 Degree: {h1['cusp_degree_dms']} | Lords: {h1['sign_lord']}-{h1['star_lord']}-{h1['sub_lord']}")

print("\n--- Horary #45 ---")
# Using the user's specific time for #45
dt_str_45 = "2026-03-04 22:35:48"
res45 = engine.calculate_kundli(dt_str_45, tz, lat, lon, horary_number=45)
h45 = res45['houses'][0]
print(f"H45 Degree: {h45['cusp_degree_dms']} | Lords: {h45['sign_lord']}-{h45['star_lord']}-{h45['sub_lord']}")
