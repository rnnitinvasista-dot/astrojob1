
import swisseph as swe
import datetime

# 2007-05-04 10:30:00 IST -> 05:00:00 UT
# Bengaluru: 12.9716, 77.5946
jd = swe.julday(2007, 5, 4, 5.0) # 10:30 IST is 05:00 UT

def check_mode(mode_id, name):
    swe.set_sid_mode(mode_id, 0, 0)
    ayan = swe.get_ayanamsa_ex(jd, swe.FLG_SIDEREAL)[0]
    # Calculate houses
    houses, ascmc = swe.houses_ex(jd, 12.9716, 77.5946, b'P', swe.FLG_SIDEREAL)
    asc = ascmc[0]
    
    # Calculate Sun
    res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)
    sun = res[0]
    
    print(f"\nMode: {name} ({mode_id})")
    print(f"Ayanamsa: {ayan:.6f}")
    print(f"Asc: {asc:.6f}")
    print(f"Sun: {sun:.6f}")

check_mode(swe.SIDM_KRISHNAMURTI_VP291, "KP NEW (VP291)")
check_mode(swe.SIDM_KRISHNAMURTI, "KP OLD")
check_mode(39, "KP New (Mode 39)") # Manual mode 39 if defined as int
