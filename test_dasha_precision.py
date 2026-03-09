import swisseph as swe
import datetime
import pytz
from nadi_core import NadiEngine

def test_dasha():
    engine = NadiEngine()
    
    # 04/05/2007 10:30 AM Bengaluru
    dob = "2007-05-04"
    tob = "10:30:00"
    tz = "Asia/Kolkata"
    lat = 12.9716
    lon = 77.5946
    
    dt_str = f"{dob} {tob}"
    local_tz = pytz.timezone(tz)
    dt_obj = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
    dt_loc = local_tz.localize(dt_obj)
    dt_utc = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute/60.0 + dt_utc.second/3600.0)
    
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    ayan_lahiri = swe.get_ayanamsa_ut(jd)
    res_trop, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH)
    moon_lon = (res_trop[0] - ayan_lahiri) % 360.0
    
    nak_size = 360.0 / 27.0
    naksh_idx = int(moon_lon / nak_size) % 27
    nak_start = naksh_idx * nak_size
    elapsed = moon_lon - nak_start
    remaining = nak_size - elapsed
    frac = remaining / nak_size
    
    lord_name = engine.DASHA_ORDER[naksh_idx % 9]
    lord_yrs = engine.DASHA_YEARS[lord_name]
    bal_yrs = lord_yrs * frac
    
    DAYS_PER_YEAR = 365.2425
    def add_period_exact(dt, float_yrs):
        total_days = float_yrs * DAYS_PER_YEAR
        total_seconds = total_days * 86400.0
        return dt + datetime.timedelta(seconds=total_seconds)

    md_end_first = add_period_exact(dt_loc, bal_yrs)
    md_start_first = md_end_first - datetime.timedelta(days=lord_yrs * DAYS_PER_YEAR)
    
    print(f"Birth: {dt_loc}")
    print(f"Moon Lon: {moon_lon}")
    print(f"Nakshatra: {engine.NAKSHATRAS[naksh_idx]} (Lord: {lord_name})")
    print(f"Remaining Fraction: {frac}")
    print(f"Balance Years: {bal_yrs}")
    print(f"MD First End: {md_end_first}")
    print(f"MD First Start: {md_start_first}")

if __name__ == "__main__":
    test_dasha()
