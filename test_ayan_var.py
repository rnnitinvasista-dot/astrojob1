import swisseph as swe
import datetime
import pytz

def test_ayanamsa_variation():
    # 4 May 2007, 10:30 AM Bengaluru (+5:30)
    jd = swe.julday(2007, 5, 4, 5.0) # UTC 5:00
    
    # 1. Standard KP (No shift)
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
    moon_kp_std = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    
    # 2. KP with +1600" shift (Our current code)
    shift = 1600.0 / 3600.0
    moon_kp_shifted = (moon_kp_std - shift) % 360 # Wait, is it subtracted? 
    # In nadi_core: lon_sid = (c - ayan_val) % 360. If ayan_val = ayan_std + shift, then lon_sid = lon_trop - ayan_std - shift
    # So yes, it decreases.
    
    # 3. Lahiri
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    moon_lahiri = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    
    print(f"Lahiri Moon: {moon_lahiri}")
    print(f"KP Standard: {moon_kp_std}")
    print(f"KP Shifted: {moon_kp_shifted}")

test_ayanamsa_variation()
