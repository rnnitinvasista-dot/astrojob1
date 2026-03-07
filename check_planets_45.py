from nadi_core import NadiEngine
engine = NadiEngine()
dt_str = "2026-03-04 22:35:48"
tz = "Asia/Kolkata"
lat = 12.9716
lon = 77.5946

result = engine.calculate_kundli(dt_str, tz, lat, lon, horary_number=45)
for p in result['planets']:
    deg = p.get('degree_dms')
    print(f"{p['planet']:7}: {deg} | Lords: {p['sign_lord']}-{p['star_lord']}-{p['sub_lord']}")

# Expectations:
# Sun: 19 33 30 (Aquarius)
# Moon: 29 08 12 (Leo)
# Mars: 07 11 35 (Aquarius)
# Mercury: 14 07 50 (Pisces)
# Jupiter: 25 35 15 (Gemini)
# Venus: 03 42 41 (Aries)
# Saturn: 02 31 16 (Pisces)
# Rahu: 00 27 01 (Aquarius)
# Ketu: 00 27 01 (Leo)
