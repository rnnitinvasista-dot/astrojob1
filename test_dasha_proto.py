from datetime import datetime, timedelta
import pytz

DASHA_YEARS = {
    'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7, 
    'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17
}
DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']

def add_years(dt, years):
    # Gregorian approximate (365.2425 days per year)
    days = int(years * 365.2425) 
    return dt + timedelta(days=days)

def calc_dasha(birth_dt_loc, moon_lon):
    nak_size = 360.0/27.0
    star_idx = int(moon_lon / nak_size) % 27
    lord_name = DASHA_ORDER[star_idx % 9]
    
    # Calculate Balance
    traversed = (moon_lon % nak_size) / nak_size
    remaining_fraction = 1.0 - traversed
    
    balance_years = DASHA_YEARS[lord_name] * remaining_fraction
    
    # Start Dates
    print(f"Birth Star Lord: {lord_name}")
    print(f"Balance Years: {balance_years:.4f}")
    
    current_time = datetime.now(pytz.UTC)
    
    # Mahadasha Loop
    md_start = birth_dt_loc
    # End of first dasha
    md_end = add_years(md_start, balance_years)
    
    start_idx = DASHA_ORDER.index(lord_name)
    
    for i in range(9):
        md_planet = DASHA_ORDER[(start_idx + i) % 9]
        duration = DASHA_YEARS[md_planet]
        
        # Adjust first dasha duration
        if i == 0:
            actual_end = md_end
            actual_start = birth_dt_loc
        else:
            actual_start = md_end
            actual_end = add_years(actual_start, duration)
            md_end = actual_end
            
        print(f"MD: {md_planet} | {actual_start.date()} to {actual_end.date()}")
        
        # Check if current
        if actual_start <= current_time <= actual_end:
            print(f"  >>> CURRENT MD: {md_planet}")
            
            # Bukthi Loop
            ad_seq = DASHA_ORDER[DASHA_ORDER.index(md_planet):] + DASHA_ORDER[:DASHA_ORDER.index(md_planet)]
            ad_start = actual_start
            
            for ad_planet in ad_seq:
                # Bukthi Fraction = (Bukthi Years / 120) * MD Years
                ad_years = (DASHA_YEARS[ad_planet] / 120.0) * DASHA_YEARS[md_planet]
                ad_end = add_years(ad_start, ad_years)
                
                print(f"    AD: {ad_planet} | {ad_start.date()} to {ad_end.date()}")
                
                if ad_start <= current_time <= ad_end:
                    print(f"    >>> CURRENT AD: {ad_planet}")
                    
                    # Antara (Pratyantardasha) Loop
                    pd_seq = DASHA_ORDER[DASHA_ORDER.index(ad_planet):] + DASHA_ORDER[:DASHA_ORDER.index(ad_planet)]
                    pd_start = ad_start
                    
                    for pd_planet in pd_seq:
                         # Antara Fraction = (Antara Years / 120) * Bukthi Years
                         pd_years = (DASHA_YEARS[pd_planet] / 120.0) * ad_years
                         pd_end = add_years(pd_start, pd_years)
                         
                         print(f"      PD: {pd_planet} | {pd_start.date()} to {pd_end.date()}")
                         if pd_start <= current_time <= pd_end:
                             print(f"      >>> CURRENT PD: {pd_planet}")
                             
                         pd_start = pd_end

                ad_start = ad_end

check_dt = datetime(1990, 1, 1, 12, 0, tzinfo=pytz.UTC)
moon_lon = 306.56 # From previous logs
calc_dasha(check_dt, moon_lon)
