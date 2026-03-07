
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
    
    # Check if first MD starts at birth
    first_md = result['dasha']['mahadasha_sequence'][0]
    print(f"Birth Time: 1974-06-27 21:20:00")
    print(f"First MD ({first_md['planet']}) starts: {first_md['start_date']}")
    
    # Check Current Mahadasha (Dasha on 2026-03-07)
    print(f"Current Dasha: {result['dasha']['current_dasha']} / {result['dasha']['current_bukthi']} / {result['dasha']['current_antara']} / {result['dasha']['current_sukshma']} / {result['dasha']['current_prana']}")
    
    # Print MD sequence for verification
    for md in result['dasha']['mahadasha_sequence']:
        if "2026" in md['end_date'] or "1974" in md['start_date'] or "2027" in md['end_date']:
            print(f"MD: {md['planet']} from {md['start_date']} to {md['end_date']}")
            for ad in md['bukthis']:
                if "2026" in ad['end_date'] or "1974" in ad['start_date']:
                    print(f"  AD: {ad['planet']} from {ad['start_date']} to {ad['end_date']}")
                    for pd in ad['antaras']:
                         if "2026" in pd['end_date'] or "1974" in pd['start_date']:
                             print(f"    PD: {pd['planet']} from {pd['start_date']} to {pd['end_date']}")
                             for sd in pd['sukshmas']:
                                 if "2026" in sd['end_date']:
                                     print(f"      SD: {sd['planet']} from {sd['start_date']} to {sd['end_date']}")
                                     first_pr = sd['pranas'][0]['planet']
                                     print(f"        First PR: {first_pr} (Parent SD: {sd['planet']})")

if __name__ == "__main__":
    verify_dasha()
