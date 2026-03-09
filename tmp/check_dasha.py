
import sys
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine

engine = NadiEngine()
# 2007-05-04 10:30 Bengaluru
res = engine.calculate_kundli('2007-05-04 10:30:00', 'Asia/Kolkata', 12.9666, 77.5833)

print(f"Balance: {res['dasha']['balance_at_birth']}")
for md in res['dasha']['mahadasha_sequence']:
    if md['planet'] == "Mercury":
        print(f"Mercury MD: {md['start_date']} to {md['end_date']}")
