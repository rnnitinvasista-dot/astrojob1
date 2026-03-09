
import swisseph as swe
# Test 2007-05-04 10:30 AM (10.5h IST -> 5.0h UT)
jd = swe.julday(2007, 5, 4, 5.0)

def check(mode, lat, lon):
    swe.set_sid_mode(mode, 0, 0)
    ayan = swe.get_ayanamsa_ut(jd)
    # Sun
    res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SWIEPH)
    sid_lon = (res[0] - ayan) % 360.0
    
    # Format to sign+dms
    sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
    sign_idx = int(sid_lon / 30.0) % 12
    deg_in_sign = sid_lon % 30.0
    d = int(deg_in_sign)
    m = int((deg_in_sign - d) * 60)
    s = int((((deg_in_sign - d) * 60) - m) * 60)
    
    print(f"Mode {mode} | Lat {lat} | Lon {lon} -> {d:02d}°{m:02d}'{s:02d}\" {sign_names[sign_idx]}")

# Check Mode 45 (VP291) with Urban coords
check(swe.SIDM_KRISHNAMURTI_VP291, 12.9716, 77.5946)
# Check Mode 5 (KP OLD) with Urban coords
check(swe.SIDM_KRISHNAMURTI, 12.9716, 77.5946)
