from datetime import datetime
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

def test_cumulative_bhukti():
    md_start = datetime(2018, 1, 8)
    md_yrs = 17 # Mercury
    md_end = md_start + relativedelta(years=md_yrs)
    print(f"Me MD: {md_start.strftime('%d/%m/%Y')} to {md_end.strftime('%d/%m/%Y')}")
    
    ad_seq = DASHA_ORDER[8:] + DASHA_ORDER[:8]
    
    ad_cum_f = 0.0
    ad_curs = md_start
    for ap in ad_seq:
        ad_yrs_f = (DASHA_YEARS[ap] / 120.0) * md_yrs
        
        # Absolute from md_start
        ad_cum_f += ad_yrs_f
        y_ad, m_ad, d_ad = float_years_to_ymd(ad_cum_f)
        ad_end = md_start + relativedelta(years=y_ad, months=m_ad, days=d_ad)
        
        print(f"  {ap[:2]} AD: {ad_curs.strftime('%d/%m/%Y')} to {ad_end.strftime('%d/%m/%Y')} | length={ad_end-ad_curs}")
        ad_curs = ad_end

test_cumulative_bhukti()
