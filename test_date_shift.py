import swisseph as swe

def check(date_str, y, m, d):
    jd = swe.julday(y, m, d, 12.0)
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
    res, _ = swe.calc_ut(jd, swe.MARS, swe.FLG_SIDEREAL | swe.FLG_SPEED)
    print(f"Date: {date_str}, JD: {jd}, Mars: {res[0]}")

check("2000-01-01", 2000, 1, 1)
check("1990-01-01", 1990, 1, 1)
check("1990-02-10", 1990, 2, 10) # 40 days later
