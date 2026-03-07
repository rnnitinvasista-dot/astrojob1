import swisseph as swe
from nadi_core import NadiEngine
engine = NadiEngine()

jd = swe.julday(2026, 3, 4, 22.59666)

print(f"{'ID':3} | {'Name':20} | {'Ayanamsa'}")
print("-" * 40)
for i in range(45):
    try:
        swe.set_sid_mode(i, 0, 0)
        aya = swe.get_ayanamsa_ut(jd)
        print(f"{i:3} | Mode {i:15} | {engine.decimal_to_dms(aya, True)}")
    except:
        pass
