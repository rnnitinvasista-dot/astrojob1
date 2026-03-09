
import swisseph as swe
import datetime
import pytz

jd = swe.julday(2007, 5, 4, 5.0)
birth = datetime.datetime(2007, 5, 4, 10, 30, tzinfo=pytz.timezone('Asia/Kolkata'))

def get_moon_sid(mode):
    swe.set_sid_mode(mode, 0, 0)
    ayan = swe.get_ayanamsa_ut(jd)
    res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SWIEPH)
    return (res[0] - ayan) % 360.0

# Lahiri Moon
moon_lahiri = get_moon_sid(swe.SIDM_LAHIRI)
nak_size = 360.0 / 27.0
nak_idx = int(moon_lahiri / nak_size) % 27
nak_start = nak_idx * nak_size
elapsed = moon_lahiri - nak_start
fraction = (nak_size - elapsed) / nak_size

# Saturn MD is 19 years
bal = 19.0 * fraction
print(f"Lahiri Moon: {moon_lahiri}")
print(f"Balance (Saturn): {bal} years")

# Mercury MD end
mercury_end_yrs = bal + 17.0
final_dt = birth + datetime.timedelta(days=mercury_end_yrs * 365.2425)
print(f"Mercury MD End (Lahiri + 365.2425): {final_dt.strftime('%Y-%m-%d')}")
