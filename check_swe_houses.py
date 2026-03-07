
import swisseph as swe
import datetime

# Test with 1990-12-15 15:30:00 (user's likely test case based on screenshot results if 1990)
# Lat: 28.6139, Lon: 77.2090 (New Delhi)
jd = swe.julday(1990, 12, 15, 15.5) 
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
cusps, ascmc = swe.houses_ex(jd, 28.6, 77.2, b'P', swe.FLG_SIDEREAL)

print(f"Cusps type: {type(cusps)}")
print(f"Cusps length: {len(cusps)}")
print(f"Cusps elements: {cusps}")
print(f"Index 0: {cusps[0]}")
print(f"Index 1: {cusps[1]}")
print(f"Index 12: {cusps[12]}")

# Check if index 0 is valid house 1
# Standard SWE docs say index 1-12 are houses.
# But python-swisseph might return a different length or 0-indexed.
