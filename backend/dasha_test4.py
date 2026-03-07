import datetime
from dateutil.relativedelta import relativedelta

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
    d = round(rem_m * 30)
    if d >= 30:
        d -= 30
        m += 1
    if m >= 12:
        m -= 12
        y += 1
    return y, m, d

def test_astrosage_logic(birth_dt, bal_years_f, first_lord):
    print(f"Birth: {birth_dt.strftime('%d/%m/%Y')}, Balance: {bal_years_f:.4f} years of {first_lord}")
    
    y, m, d = float_years_to_ymd(bal_years_f)
    print(f"Balance YMD: {y}y {m}m {d}d")
    
    start_idx = DASHA_ORDER.index(first_lord)
    
    # EXACT AstroSage method:
    # 1. Total yrs of first lord = 20 (for Ven)
    total_yrs = DASHA_YEARS[first_lord]
    
    # 2. Add full balance to birth date to get end of first MD
    md_curs = birth_dt + relativedelta(years=y, months=m, days=d)
    print(f"{first_lord[:2]}   {md_curs.strftime('%d/%m/%Y')}")
    
    for i in range(1, 9):
        p = DASHA_ORDER[(start_idx + i) % 9]
        md_yrs = DASHA_YEARS[p]
        md_curs = md_curs + relativedelta(years=md_yrs)
        print(f"{p[:2]}   {md_curs.strftime('%d/%m/%Y')}")

calc_start = datetime.datetime(2000, 1, 8)
bal = 19.0
test_astrosage_logic(calc_start, bal, "Saturn")
