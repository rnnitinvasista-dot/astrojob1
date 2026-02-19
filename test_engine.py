
from nadi_core import NadiEngine
import json

engine = NadiEngine()
# Sample: 1990-12-15 15:30:00 (New Delhi)
res = engine.calculate_kundli("1990-12-15 15:30:00", "Asia/Kolkata", 28.6, 77.2)

print("SIGNIFICATIONS (KETU):")
ketu_sig = next(s for s in res['significations'] if s['planet'] == "Ketu")
print(json.dumps(ketu_sig, indent=2))
print("\nNAKSHATRA NADI (KETU):")
ketu_nadi = next(n for n in res['nakshatra_nadi'] if n['planet'] == "Ketu")
print(json.dumps(ketu_nadi, indent=2))
print("\nDASHA (CURRENT):")
print(f"{res['dasha']['current_dasha']} / {res['dasha']['current_bukthi']} / {res['dasha']['current_antara']}")
