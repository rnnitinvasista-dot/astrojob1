from nadi_core import NadiEngine
import swisseph as swe
import datetime
import pytz
from dateutil.relativedelta import relativedelta

swe.set_ephe_path("ephe")

def get_moon_lon(year, month, day, hour, minute, second, lat, lon, ayanamsa_id):
    dt = datetime.datetime(year, month, day, hour, minute, second, tzinfo=pytz.UTC)
    jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute / 60.0 + dt.second / 3600.0)
    swe.set_sid_mode(ayanamsa_id, 0.0, 0.0)
    res, rc = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    return res[0]

def test_ayanamsa_shift():
    # User's chart: 4 May 2007, 10:30 AM Bengaluru (+5:30)
    # UTC: 4 May 2007, 05:00:00
    dt_utc = datetime.datetime(2007, 5, 4, 5, 0, 0, tzinfo=pytz.UTC)
    moon_lahiri = get_moon_lon(2007, 5, 4, 5, 0, 0, 12.9716, 77.5946, swe.SIDM_LAHIRI)
    moon_kp = get_moon_lon(2007, 5, 4, 5, 0, 0, 12.9716, 77.5946, 39)
    
    print(f"Lahiri Moon: {moon_lahiri}")
    print(f"KP Moon: {moon_kp}")
    print(f"Difference: {abs(moon_lahiri - moon_kp) * 60} minutes")
    
    # Calculate balance difference
    engine = NadiEngine()
    
    res_l = engine.calculate_dasha([{"planet": "Moon", "lon": moon_lahiri}], dt_utc)
    res_k = engine.calculate_dasha([{"planet": "Moon", "lon": moon_kp}], dt_utc)
    
    print("Lahiri Sequence:")
    for md in res_l['mahadasha_sequence'][:4]:
        print(f"  {md['planet']}: {md['start_date']} to {md['end_date']}")
        
    print("KP Sequence:")
    for md in res_k['mahadasha_sequence'][:4]:
        print(f"  {md['planet']}: {md['start_date']} to {md['end_date']}")

test_ayanamsa_shift()
