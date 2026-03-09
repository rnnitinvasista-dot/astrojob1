
import swisseph as swe
jd = swe.julday(2007, 5, 4, 5.0)
swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
ayan = swe.get_ayanamsa_ut(jd)
res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
sid_lon = (res[0] - ayan) % 360.0
deg_in_sign = sid_lon % 30.0
d = int(deg_in_sign); m = int((deg_in_sign - d)*60); s = int((((deg_in_sign - d)*60)-m)*60)
print(f"Lahiri -> {d:02d}°{m:02d}'{s:02d}\"")
