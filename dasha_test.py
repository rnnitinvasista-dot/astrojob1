import datetime

DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

def calculate_dasha_test(birth_dt, moon_lon):
    nak_size = 360.0 / 27.0
    naksh_idx = int(moon_lon / nak_size) % 27
    deg_in_nak = moon_lon % nak_size
    pada = int(deg_in_nak / (nak_size / 4)) + 1
    
    traversed_fraction = deg_in_nak / nak_size
    remaining_fraction = 1.0 - traversed_fraction
    
    lord_name = DASHA_ORDER[naksh_idx % 9]
    bal_yrs_f = DASHA_YEARS[lord_name] * remaining_fraction
    
    start_idx = DASHA_ORDER.index(lord_name)
    
    YEAR_DAYS = 365.2421904
    
    # Cumulative years since birth
    cum_years = 0.0
    
    # First Mahadasha end in years from birth
    cum_years += bal_yrs_f
    
    print("Vimshottari Maha Dasha\n")
    
    curr_date = birth_dt + datetime.timedelta(days=bal_yrs_f * YEAR_DAYS)
    print(f"{lord_name[:2]}   {curr_date.strftime('%d/%m/%Y')}")
    
    md_start_year = cum_years
    for i in range(1, 9):
        p = DASHA_ORDER[(start_idx + i) % 9]
        md_yrs = DASHA_YEARS[p]
        cum_years += md_yrs
        end_date = birth_dt + datetime.timedelta(days=cum_years * YEAR_DAYS)
        print(f"{p[:2]}   {end_date.strftime('%d/%m/%Y')}")

# Suppose someone was born where Saturn balance was exactly till 08/01/2018
# And the next is Mercury 17 yrs, etc.
# Let's test by starting on 08/01/2000 (DD/MM/YYYY)
calc_start = datetime.datetime(2000, 1, 8)
# If moon_lon is such that exactly 18 years of Saturn is left...
# Wait, let's just reverse engineer moon_lon so bal_yrs is exactly 18.0
# Saturn total is 19. Remaining is 18/19 = 0.947368
# Traversed = 1 - 18/19 = 1/19
# Saturn nakshatras: Pushya (3), Anuradha (16), Uttara Bhadrapada (25)
moon_lon = 3 * (360/27) + (360/27)*(1/19.0)

calculate_dasha_test(calc_start, moon_lon)
