
import sys
import os
import json

# Add current directory to path
sys.path.insert(0, os.getcwd())

from nadi_core import NadiEngine

engine = NadiEngine()
# 2007-05-04 10:30 Bengaluru
res = engine.calculate_kundli('2007-05-04 10:30:00', 'Asia/Kolkata', 12.9666, 77.5833)

print("--- KP CUSPS COMPARISON ---")
for h in res['houses']:
    print(f"House {h['house_number']}: {h['cusp_degree_dms']} | SL: {h['sign_lord']} | NL: {h['star_lord']} | SB: {h['sub_lord']} | SS: {h['sub_sub_lord']}")

print("\n--- KP PLANETS COMPARISON ---")
for p in res['planets']:
    print(f"{p['planet']}: {p['degree_dms']} | SL: {p['sign_lord']} | NL: {p['star_lord']} | SB: {p['sub_lord']} | SS: {p['sub_sub_lord']}")

print(f"\nAyanamsa: {res['metadata']['ayanamsa_value']}")
