import swisseph as swe
import datetime
import pytz

def find_ramc_for_asc(target_asc_sid, lat):
    # Standard Obliquity for now
    jd = swe.julday(2026, 3, 4, 1.9811) # approx for the user's time
    res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
    eps = res[0]
    ayan_val = swe.get_ayanamsa_ut(jd)
    target_asc_trop = (target_asc_sid + ayan_val) % 360
    
    def get_asc_for_ramc(r):
        _, ascmc = swe.houses_armc(r, lat, eps, b'P')
        return ascmc[0]

    # Search RAMC
    best_ramc = 0.0
    min_diff = 400.0
    for r in range(0, 360):
        curr = get_asc_for_ramc(float(r))
        diff = abs((curr - target_asc_trop + 180) % 360 - 180)
        if diff < min_diff:
            min_diff = diff
            best_ramc = float(r)
            
    # Refine
    low, high = best_ramc - 1.0, best_ramc + 1.0
    for _ in range(30):
        mid = (low + high) / 2
        if abs((get_asc_for_ramc(mid) - target_asc_trop + 180) % 360 - 180) < \
           abs((get_asc_for_ramc(best_ramc) - target_asc_trop + 180) % 360 - 180):
            best_ramc = mid
        # Simple binary search proxy
        if (get_asc_for_ramc(mid) - target_asc_trop + 180) % 360 - 180 > 0:
            high = mid
        else:
            low = mid
            
    return best_ramc, eps, ayan_val

def test():
    lat = 12.9716
    # Target: Aries 0 (Number 1)
    target_asc = 0.0 
    
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    ramc, eps, ayan = find_ramc_for_asc(target_asc, lat)
    
    cusps_trop, ascmc_trop = swe.houses_armc(ramc, lat, eps, b'P')
    cusps_sid = [(c - ayan) % 360 for c in cusps_trop]
    
    print(f"Target Asc: {target_asc:.4f}")
    print(f"Result RAMC: {ramc:.4f}")
    print(f"Result H1: {cusps_sid[0]:.4f}")
    print(f"Result H10: {cusps_sid[9]:.4f}")
    print(f"Result H4: {(cusps_sid[9] + 180) % 360:.4f}")

if __name__ == "__main__":
    test()
