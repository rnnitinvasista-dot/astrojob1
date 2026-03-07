
import swisseph as swe
import datetime

def check_swe():
    jd = swe.julday(2026, 3, 4, 12)
    lat = 28.6139
    lon = 77.2090
    
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
    
    # Houses_ex
    cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
    print(f"houses_ex cusps length: {len(cusps)}")
    print(f"First 3 cusps: {cusps[0], cusps[1], cusps[2]}")
    
    # houses_armc
    eps, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
    cusps2, ascmc2 = swe.houses_armc(0, lat, eps[0], b'P')
    print(f"houses_armc cusps length: {len(cusps2)}")
    print(f"First 3 cusps: {cusps2[0], cusps2[1], cusps2[2]}")

if __name__ == "__main__":
    check_swe()
