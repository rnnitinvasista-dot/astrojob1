
import sys
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine

engine = NadiEngine()
res = engine.calculate_kundli('2007-08-16 04:20:00', 'Asia/Kolkata', 13.2172, 79.1003)

print("PLANET DEGREES (should be sign-based like '03*27'38\" Aquarius'):")
for p in res['planets']:
    print(f"  {p['planet']:<8}: {p['degree_dms']}")

print("\nCUSP DEGREES (should be absolute 0-360 like '94*35'26\"'):")
for h in res['houses'][:6]:
    print(f"  H{h['house_number']}: {h['cusp_degree_dms']}")
    
print("\nDASHA BALANCE:", res['dasha']['balance_at_birth'])
print("CURRENT:", f"D/{res['dasha']['current_dasha']} B/{res['dasha']['current_bukthi']}")
