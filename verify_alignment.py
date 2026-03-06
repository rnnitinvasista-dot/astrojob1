import swisseph as swe
from nadi_core import NadiEngine

def verify():
    engine = NadiEngine()
    
    # Sample date: March 3, 2026, 12:00 PM IST
    # UTC = 6.5 hours
    jd = swe.julday(2026, 3, 3, 6.5)
    lat = 12.9716
    lon = 77.5946
    
    # Set Ayanamsa to KP
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
    ayan = swe.get_ayanamsa_ut(jd)
    print(f"KP Ayanamsa: {ayan:.6f}")
    
    print("-" * 80)
    print(f"{'No.':<4} {'Target':<12} {'Calculat.':<12} {'Diff (sec)':<12} {'SL'}")
    print("-" * 80)
    
    for num in [1, 24, 125, 249]:
        # Target from 249 table
        target_lon = engine.HORARY_TABLE[num]["lon"]
        
        # Calculation
        cusps, ascmc = engine.calculate_prashna_cusps(jd, lat, lon, num)
        calculated_lon = ascmc[0]
        
        # Calculate SL for the degree
        sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = engine.get_kp_lords(calculated_lon)
        
        diff = (calculated_lon - target_lon + 180) % 360 - 180
        diff_arc_sec = diff * 3600
        
        # Format target DMS for comparison if needed
        print(f"{num:<4} {target_lon:<12.4f} {calculated_lon:<12.4f} {diff_arc_sec:<12.6f} {sl}")

if __name__ == "__main__":
    verify()
