
import swisseph as swe
import datetime
import pytz

def check_all():
    # 27/06/1974 21:20 Shivamogga, India
    # 13.9299 N, 75.5681 E
    lat, lon = 13.9299, 75.5681
    dt = datetime.datetime(1974, 6, 27, 21, 20, 0)
    tz = pytz.timezone('Asia/Kolkata')
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

    dasha_order = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    dasha_years = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}
    nak_size = 360/27

    modes = {
        'KP_OLD': swe.SIDM_KRISHNAMURTI, 
        'KP_NEW': swe.SIDM_KRISHNAMURTI_VP291, 
        'LAHIRI': swe.SIDM_LAHIRI
    }

    target_date = datetime.datetime(2026, 2, 18, tzinfo=pytz.UTC)

    for name, mode in modes.items():
        swe.set_sid_mode(mode, 0, 0)
        res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
        m_lon = res[0]
        nak_idx = int(m_lon / nak_size)
        frac_passed = (m_lon % nak_size) / nak_size
        frac_rem = 1.0 - frac_passed
        lord = dasha_order[nak_idx % 9]
        
        # Check MD
        bal_yrs = dasha_years[lord] * frac_rem
        cursor = dt_loc + datetime.timedelta(days=bal_yrs * 365.25)
        
        print(f"--- {name} ---")
        print(f"Moon Lon: {m_lon:.4f} ({lord})")
        
        current_md = lord
        if cursor < target_date:
            idx = (dasha_order.index(lord) + 1) % 9
            while cursor < target_date:
                md_p = dasha_order[idx]
                cursor += datetime.timedelta(days=dasha_years[md_p] * 365.25)
                current_md = md_p
                idx = (idx + 1) % 9
        
        print(f"Current MD as of Feb 2026: {current_md}")

if __name__ == "__main__":
    check_all()
