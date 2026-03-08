
import sys
import datetime
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine

engine = NadiEngine()
res = engine.calculate_kundli('2007-08-16 04:20:00', 'Asia/Kolkata', 13.2172, 79.1003)
d = res['dasha']

print('STEP 19 VALIDATION: Sum of Bhuktis = Mahadasha')
all_ok = True
for md in d['mahadasha_sequence']:
    md_s = datetime.date.fromisoformat(md['start_date'])
    md_e = datetime.date.fromisoformat(md['end_date'])
    md_days = (md_e - md_s).days
    b_days = sum((
        datetime.date.fromisoformat(b['end_date']) - 
        datetime.date.fromisoformat(b['start_date'])
    ).days for b in md['bukthis'])
    diff = abs(md_days - b_days)
    ok = 'OK' if diff <= 2 else 'FAIL'
    if diff > 2:
        all_ok = False
    print(f'{ok} {md["planet"]}: MD={md_days}d Bhuktis={b_days}d Diff={diff}d')

print()
if all_ok:
    print('ALL CHECKS PASSED - Step 19 validated!')
else:
    print('SOME CHECKS FAILED')
