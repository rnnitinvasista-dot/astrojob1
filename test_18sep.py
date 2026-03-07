from nadi_core import NadiEngine
import datetime
import pytz

engine = NadiEngine()
# 18 Sep 2014 at 8:30 AM
# We need Moon in Gemini 23°56'
# Let's just run calculate_dasha by manually setting moon_lon to 2 Gemini 23 56
# Gemini is the 3rd sign (0=Aries, 1=Taurus, 2=Gemini)
# Longitude = 2 * 30 + 23 + (56/60) = 60 + 23.933333 = 83.9333333

birth_dt = datetime.datetime(2014, 9, 18, 8, 30, tzinfo=pytz.UTC)
planets_raw = [
    {"planet": "Moon", "lon": 83.93333333}
]

res = engine.calculate_dasha(planets_raw, birth_dt)
print(f"Balance string: {res['balance_at_birth']}")
print(f"Current Dasha: {res['current_dasha']}")
print("MD Sequence:")
for md in res["mahadasha_sequence"]:
    print(f"{md['planet']}: {md['start_date']} to {md['end_date']}")
    for ad in md["bukthis"]:
        print(f"  {ad['planet']}: {ad['start_date']} to {ad['end_date']}")

