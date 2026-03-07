from datetime import datetime
from dateutil.relativedelta import relativedelta
import math

DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_YEARS = {
    "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
    "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
}

def float_years_to_ymd(years_f):
    y = int(years_f)
    rem_y = years_f - y
    m = int(rem_y * 12)
    rem_m = (rem_y * 12) - m
    d = round(rem_m * 30) # round to nearest day
    
    # Handle overflow
    if d >= 30:
        d -= 30
        m += 1
    if m >= 12:
        m -= 12
        y += 1
        
    return y, m, d

def test_astrosage_logic(birth_dt, bal_years_f, first_lord):
    print(f"Birth: {birth_dt}, Balance: {bal_years_f:.4f} years of {first_lord}")
    
    y, m, d = float_years_to_ymd(bal_years_f)
    print(f"Balance YMD: {y}y {m}m {d}d")
    
    curr_date = birth_dt + relativedelta(years=y, months=m, days=d)
    print(f"\n{first_lord[:2]}   {curr_date.strftime('%d/%m/%Y')}")
    
    start_idx = DASHA_ORDER.index(first_lord)
    for i in range(1, 9):
        p = DASHA_ORDER[(start_idx + i) % 9]
        md_yrs = DASHA_YEARS[p]
        curr_date = curr_date + relativedelta(years=md_yrs)
        print(f"{p[:2]}   {curr_date.strftime('%d/%m/%Y')}")

# Suppose someone was born where Saturn balance ended on 08/01/2018
calc_start = datetime(1999, 1, 8)
bal = 19.0 # Full 19 years of Saturn
test_astrosage_logic(calc_start, bal, "Saturn")
