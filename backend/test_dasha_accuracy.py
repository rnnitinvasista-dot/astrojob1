
import swisseph as swe
from nadi_core import NadiEngine
import datetime
import pytz

def verify_dasha():
    engine = NadiEngine()
    
    # Test Birth: 27/06/1974 21:20 Shivamogga, India
    # 13.9299 N, 75.5681 E
    result = engine.calculate_kundli(
        "1974-06-27 21:20:00", 
        "Asia/Kolkata", 
        13.9299, 
        75.5681
    )
    
    print(f"Status: {result['status']}")
    print(f"Ayanamsa used: {result['metadata']['ayanamsa_value']}")
    print(f"Nakshatra: {result['metadata']['janma_nakshatra']}")
    print(f"Dasha Balance: {result['dasha']['balance_at_birth']}")
    
    # Check Current Mahadasha (Dasha on 2026-03-07)
    print(f"Current Dasha: {result['dasha']['current_dasha']} / {result['dasha']['current_bukthi']} / {result['dasha']['current_antara']} / {result['dasha']['current_sukshma']}")
    
    # Print MD sequence for verification
    for md in result['dasha']['mahadasha_sequence']:
        if "2026" in md['end_date'] or "2025" in md['end_date'] or "2027" in md['end_date']:
            print(f"MD: {md['planet']} from {md['start_date']} to {md['end_date']}")
            for ad in md['bukthis']:
                if "2026" in ad['end_date'] or "2025" in ad['end_date']:
                    print(f"  AD: {ad['planet']} from {ad['start_date']} to {ad['end_date']}")
                    for pd in ad['antaras']:
                         if "2026" in pd['end_date']:
                             print(f"    PD: {pd['planet']} from {pd['start_date']} to {pd['end_date']}")
                             # Check if PD starts with parent AD
                             # Note: ad['planet'] is parent
                             first_sd = pd['sukshmas'][0]['planet']
                             print(f"      First SD: {first_sd} (Parent PD: {pd['planet']})")

if __name__ == "__main__":
    verify_dasha()
