
import swisseph as swe
from nadi_core import NadiEngine

engine = NadiEngine()

test_cases = [
    (0.0, "Mars", "Ketu", "Ketu"),      # Entry 1: 0°
    (1.0, "Mars", "Ketu", "Venus"),     # Entry 2: 0°46'40" - 3°0'0"
    (3.5, "Mars", "Ketu", "Sun"),       # Entry 3: 3°0'0" - 3°40'0"
    (13.4, "Mars", "Venus", "Venus"),   # Entry 10: 13°20'0"
    (210.0, "Mars", "Jupiter", "Moon")  # Entry 146: Scorpio 0°
]

print("Degrees | Sign Lord  | Star Lord  | Sub Lord   | SSL Lord   | Expected (SL-NL-Sub)")
print("-" * 85)
for deg, exp_sl, exp_nl, exp_sub in test_cases:
    res = engine.get_kp_lords(deg)
    # res index: 1:SignL, 2:StarL, 3:SubL, 4:SSL
    print(f"{deg:5.1f} | {res[1]:10} | {res[2]:10} | {res[3]:10} | {res[4]:10} | {exp_sl}-{exp_nl}-{exp_sub}")
