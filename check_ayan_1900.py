import swisseph as swe
jd_1900 = swe.julday(1900, 1, 1, 0)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
print(f"Index 5 (1900): {swe.get_ayanamsa_ut(jd_1900)}")
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
print(f"Lahiri (1900):  {swe.get_ayanamsa_ut(jd_1900)}")
