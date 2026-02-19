from nadi_core import NadiEngine
import json
from datetime import datetime
import pytz

engine = NadiEngine()
res = engine.calculate_kundli("1990-01-01 12:00", "Asia/Kolkata", 12.9716, 77.5946)

# Check Nadi data
nadi = res['nakshatra_nadi']
print(f"Nadi items: {len(nadi)}")
for n in nadi[:3]:
    print(f"Planet: {n['planet']}, PL Sigs: {len(n['pl_signified'])} {n['pl_signified']}")

# Check Dasha tree
dasha = res['dasha']
md_seq = dasha['mahadasha_sequence']
print(f"\nMD Count: {len(md_seq)}")
for md in md_seq:
    print(f"MD: {md['planet']}, Bukthis: {len(md['bukthis'])}")
    if md['planet'] == dasha['current_dasha']:
        for ad in md['bukthis']:
            print(f"  AD: {ad['planet']} ({len(ad['antaras'])} PDs)")
