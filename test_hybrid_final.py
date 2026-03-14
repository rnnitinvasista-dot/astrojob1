
from nadi_core import NadiEngine
import json

def test_hybrid():
    engine = NadiEngine()
    # 4 May 2007, 10:30 AM, Bangalore (12.97, 77.59)
    # Lahiri Sun should be around ~19° Aries
    # KP Sun should be around ~20° Aries (due to calibration)
    res = engine.calculate_kundli("04-05-2007 10:30:00", "Asia/Kolkata", 12.97, 77.59)
    
    if res["status"] == "error":
        print("Error:", res["message"])
        return

    print("--- Hybrid Calculation Verification ---")
    print(f"Metadata Ayanamsa: {res['metadata']['ayanamsa']}")
    print(f"Metadata Values: {res['metadata']['ayanamsa_value']}")
    
    # Check Sun
    sun = next(p for p in res["planets"] if p["planet"] == "Sun")
    print(f"\nSun (Lahiri Display): {sun['degree_dms']} {sun['sign']}")
    print(f"Sun KP Lon (Debug): {sun['kp_lon_debug']:.4f}")
    
    # Check Moon and Dasha
    moon = next(p for p in res["planets"] if p["planet"] == "Moon")
    print(f"\nMoon (Lahiri Display): {moon['degree_dms']} {moon['sign']}")
    print(f"Dasha Balance: {res['dasha']['balance_at_birth']}")
    
    # Check House 1 (KP)
    h1 = res["houses"][0]
    print(f"\nHouse 1 (KP Display): {h1['cusp_degree_dms']} {h1['sign']}")
    
    # Check Significators (Should be KP based)
    sun_sigs = next(s for s in res["significations"] if s["planet"] == "Sun")
    print(f"\nSun Significators (KP): {sun_sigs['levels']}")

if __name__ == "__main__":
    test_hybrid()
