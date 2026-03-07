import swisseph as swe
jd_1900 = swe.julday(1900, 1, 1, 0)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
aya = swe.get_ayanamsa_ut(jd_1900)
d = int(aya)
m = int((aya-d)*60)
s = (aya-d-m/60)*3600
print(f"SIDM 5 at 1900: {d:02} {m:02} {s:02.2f}")
