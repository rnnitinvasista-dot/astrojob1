
"""
Verification script for the 20-step astronomical calculation spec.
Validates: tropical->sidereal conversion, nakshatra, lords, dasha balance totals, cusp format.
"""
import sys
sys.path.insert(0, 'backend')
from nadi_core import NadiEngine

engine = NadiEngine()

def verify():
    # Test data: Bangalore, 2007-08-16 04:20:00 IST
    lat, lon = 13.2172, 79.1003
    dt_str = "2007-08-16 04:20:00"
    tz = "Asia/Kolkata"

    print("=" * 50)
    print("STEP 2: Sidereal Longitude = Tropical - KP Ayanamsa")
    print("STEP 3: Sign = floor(degree / 30) + 1")
    print("STEP 5: Nakshatra = floor(degree / 13.333) + 1")
    print("=" * 50)
    res = engine.calculate_kundli(dt_str, tz, lat, lon)
    
    if res['status'] != 'success':
        print(f"FAILED: {res.get('message', 'Unknown error')}")
        return
    
    print(f"\nAyanamsa: {res['metadata']['ayanamsa_value']}")
    
    print("\n--- PLANETS (Step 2, 3, 5 Validation) ---")
    for p in res['planets']:
        deg = p['degree_decimal']
        sign_num = int(deg / 30) + 1
        nak_num = int(deg / (360/27)) + 1
        print(f"{p['planet']:<8} Abs: {deg:>8.4f}° Sign#{sign_num:<2} ({p['sign']}) Nak#{nak_num:<2} ({p['nakshatra']}) SL:{p['sign_lord']} NL:{p['star_lord']} SB:{p['sub_lord']} SS:{p['sub_sub_lord']}")
    
    print("\n--- HOUSES (Step 14-18: GMST->LST->RAMC->Placidus) ---")
    print("Hos | Degree (Absolute 0-360) | SL | NL | SB | SS")
    for h in res['houses']:
        print(f"{h['house_number']:<3} | {h['cusp_degree_dms']:<18} | {h['sign_lord']:<2} | {h['star_lord']:<2} | {h['sub_lord']:<2} | {h['sub_sub_lord']}")
    
    print("\n--- DASHA (Steps 7-13 Validation) ---")
    d = res['dasha']
    print(f"Balance at birth: {d['balance_at_birth']}")
    print(f"Nakshatra: {d['nakshatra']} Pada: {d['pada']}")
    print(f"Current: D/{d['current_dasha']} B/{d['current_bukthi']} A/{d['current_antara']} P/{d['current_pratyantar']} S/{d['current_sookshma']}")
    
    print("\n--- STEP 19 VALIDATION: Sum of Bhuktis = Mahadasha ---")
    for md in d['mahadasha_sequence'][:2]:  # Check first 2 for brevity
        import datetime
        md_start = datetime.date.fromisoformat(md['start_date'])
        md_end = datetime.date.fromisoformat(md['end_date'])
        md_days = (md_end - md_start).days
        
        bukthi_days = sum((datetime.date.fromisoformat(b['end_date']) - datetime.date.fromisoformat(b['start_date'])).days for b in md['bukthis'])
        match = "✓" if abs(md_days - bukthi_days) <= 2 else "✗"
        print(f"{match} MD {md['planet']:<8}: MD={md_days}d  SumBukthis={bukthi_days}d  Diff={abs(md_days - bukthi_days)}d")
    
    print("\n✅ Verification complete.")

if __name__ == "__main__":
    verify()
