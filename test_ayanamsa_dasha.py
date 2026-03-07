from nadi_core import NadiEngine
import swisseph as swe
import datetime
import pytz
from dateutil.relativedelta import relativedelta
from dateutil.relativedelta import relativedelta

swe.set_ephe_path("ephe")

def get_moon_lon(year, month, day, hour, minute, second, lat, lon, ayanamsa_id):
    dt = datetime.datetime(year, month, day, hour, minute, second, tzinfo=pytz.UTC)
    jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute / 60.0 + dt.second / 3600.0)
    swe.set_sid_mode(ayanamsa_id, 0.0, 0.0)
    res, rc = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)
    return res[0]

def test_ayanamsa_shift():
    # User's chart: 8 Aug 1993, 10:37 AM Belgaum/India (+5:30)
    # UTC: 8 Aug 1993, 05:07:00
    dt_utc = datetime.datetime(1993, 8, 8, 5, 7, 0, tzinfo=pytz.UTC)
    moon_lahiri = get_moon_lon(1993, 8, 8, 5, 7, 0, 15.8497, 74.4977, swe.SIDM_LAHIRI)
    moon_kp = get_moon_lon(1993, 8, 8, 5, 7, 0, 15.8497, 74.4977, swe.SIDM_USER) # usually 39 is KP, let's just test 39
    moon_kp = get_moon_lon(1993, 8, 8, 5, 7, 0, 15.8497, 74.4977, 39)
    
    print(f"Lahiri Moon: {moon_lahiri}")
    print(f"KP Moon: {moon_kp}")
    print(f"Difference: {abs(moon_lahiri - moon_kp) * 60} minutes")
    
    # Calculate balance difference
    engine = NadiEngine()
    
    res_l = engine.calculate_dasha([{"planet": "Moon", "lon": moon_lahiri}], dt_utc)
    res_k = engine.calculate_dasha([{"planet": "Moon", "lon": moon_kp}], dt_utc)
    
    print(f"Lahiri First MD End: {res_l['mahadasha_sequence'][0]['end_date']}")
    print(f"KP First MD End: {res_k['mahadasha_sequence'][0]['end_date']}")

test_ayanamsa_shift()
