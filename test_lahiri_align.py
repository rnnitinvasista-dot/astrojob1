from nadi_core import NadiEngine
import swisseph as swe
import datetime
import pytz

swe.set_ephe_path("ephe")

def test_lahiri_align():
    # User's chart: 4 May 2007, 10:30 AM Bengaluru (+5:30)
    dt_utc = datetime.datetime(2007, 5, 4, 5, 0, 0, tzinfo=pytz.UTC)
    
    # 1. Lahiri Moon
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    jd = swe.julday(2007, 5, 4, 5.0)
    moon_lahiri = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH | swe.FLG_SIDEREAL)[0][0]
    
    # 2. Engine with Lahiri
    engine = NadiEngine(ayanamsa="LAHIRI")
    res = engine.calculate_dasha([{"planet": "Moon", "lon": moon_lahiri}], dt_utc)
    
    print("Lahiri Dasha Sequence (Natal):")
    for md in res['mahadasha_sequence'][:4]:
        print(f"  {md['planet']}: {md['start_date']} to {md['end_date']}")

test_lahiri_align()
