from nadi_core import NadiEngine
import swisseph as swe

engine = NadiEngine()
# Test Horary 45
table = engine.generate_horary_table()
h45 = table[45]
print(f"Horary 45 Start: {engine.decimal_to_dms(h45['lon'], True)} | Lords: {h45['sl']}-{h45['nl']}-{h45['sub']}")

# Check KP New Ayanamsa for the date
jd = swe.julday(2026, 3, 4, 22.59666) # Approx for 22:35
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
aya_kp = swe.get_ayanamsa_ut(jd)
print(f"Standard KP Ayanamsa: {engine.decimal_to_dms(aya_kp, True)}")

swe.set_sid_mode(swe.SIDM_KP_NEW, 0, 0)
aya_new = swe.get_ayanamsa_ut(jd)
print(f"KP New Ayanamsa: {engine.decimal_to_dms(aya_new, True)}")

# Find target degree for Horary 45
# Gemini 4 53 47 = 64.8963888
target = 64.8963888
# My engine (with 25" offset) should be Gemini 4 53 45?
# Let's see.
