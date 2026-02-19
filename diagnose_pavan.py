
import swisseph as swe
import datetime
import pytz

def decimal_to_dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = (deg - d - m/60) * 3600
    return f"{d}°{m}'{s:.2f}\""

def check_pavan_diagnostics():
    # Pavan: 16/08/2007 04:20 Chittoor, AP, India
    # 13.2172 N, 79.1003 E
    lat, lon = 13.2172, 79.1003
    dt = datetime.datetime(2007, 8, 16, 4, 20, 0)
    tz = pytz.timezone('Asia/Kolkata')
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

    # Set Lahiri
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    
    print(f"Diagnostics for Pavan (16/08/2007 04:20 IST)")
    print(f"JD: {jd}")
    print(f"Ayanamsa: {decimal_to_dms(swe.get_ayanamsa_ut(jd))}")

    # Check Moon and Pada
    res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
    moon_lon = res[0]
    nak_size = 360/27
    nak_idx = int(moon_lon / nak_size)
    nak_rem = moon_lon - (nak_idx * nak_size)
    pada = int(nak_rem / (nak_size / 4)) + 1
    
    print(f"Moon Lon: {decimal_to_dms(moon_lon)}")
    print(f"Nakshatra Index: {nak_idx} ({['Ashwini', 'Bharani', '...'][0] if nak_idx==0 else '...'})")
    print(f"Degrees into Nakshatra: {decimal_to_dms(nak_rem)}")
    print(f"Pada Calculation: {nak_rem} / 3.333... = {nak_rem / (nak_size/4)}")
    print(f"Calculated Pada: {pada}")

    # Check Jupiter Retrograde
    res_jup, _ = swe.calc_ut(jd, swe.JUPITER, swe.FLG_SIDEREAL)
    print(f"Jupiter Lon: {decimal_to_dms(res_jup[0])}")
    print(f"Jupiter Speed: {res_jup[3]}")
    print(f"Is Jupiter Retrograde? {res_jup[3] < 0}")

    # Check other planets for R
    for p_id, p_name in [(swe.MERCURY, "Mercury"), (swe.VENUS, "Venus"), (swe.SATURN, "Saturn")]:
        res, _ = swe.calc_ut(jd, p_id, swe.FLG_SIDEREAL)
        print(f"{p_name} Speed: {res[3]} (Retro? {res[3] < 0})")

if __name__ == "__main__":
    check_pavan_diagnostics()
