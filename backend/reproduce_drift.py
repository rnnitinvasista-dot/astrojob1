from nadi_core import NadiEngine
import datetime
import pytz

def reproduce_drift():
    engine = NadiEngine()
    # Mocking birth details for 2007-05-04 10:30 Bengaluru
    # This birth results in Saturn MD balance.
    # We want to see if Ketu end date shifts.
    
    # 2007-05-04 05:00 UTC
    dt_utc = datetime.datetime(2007, 5, 4, 5, 0, 0, tzinfo=pytz.UTC)
    
    # Let's use the longitude from the live API test: Moon Lon: 217.804
    planets = [{"planet": "Moon", "lon": 217.804}]
    
    res = engine.calculate_dasha(planets, dt_utc)
    
    print("Dasha Sequence Reproduction:")
    for md in res['mahadasha_sequence'][:4]:
        print(f"  {md['planet']}: {md['start_date']} to {md['end_date']}")

reproduce_drift()
