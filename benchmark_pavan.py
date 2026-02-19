
import swisseph as swe
import datetime
import pytz

def get_dms(deg):
    d = int(deg)
    m = int((deg - d) * 60)
    s = int((deg - d - m/60) * 3600)
    return f"{d:02d}°{m:02d}'{s:02d}\""

def check_benchmark():
    # Pavan: 16/08/2007 04:20 Chittoor, AP, India
    # 13.2172 N, 79.1003 E
    lat, lon = 13.2172, 79.1003
    dt = datetime.datetime(2007, 8, 16, 4, 20, 0)
    tz = pytz.timezone('Asia/Kolkata')
    dt_loc = tz.localize(dt)
    utc_dt = dt_loc.astimezone(pytz.UTC)
    jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)

    dasha_order = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
    dasha_years = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}
    
    modes = {
        'KP_OLD': swe.SIDM_KRISHNAMURTI,
        'KP_NEW': swe.SIDM_KRISHNAMURTI_VP291,
        'LAHIRI': swe.SIDM_LAHIRI
    }

    target_sun = 133 + 28/60 + 45.9/3600 # 133 is start of Leo
    # Wait, screenshot says SU 28°45'55". Leo is the 5th sign.
    # Aries: 0, Taurus: 30, Gemini: 60, Cancer: 90, Leo: 120.
    # So Sun should be 120 + 28°45'55" = 148.765...
    # Let me check the screenshot image media__1771409618597.jpg carefully.
    # The screenshot shows SU at grid 9? No, it's grid 1 (Aries), 2, 3, 4 (Cancer)...
    # In South Indian Chart: Grid 1 (Top Left 2nd) is Aries. 
    # Top Row: Pisces, Aries, Taurus, Gemini
    # Right Col: Cancer, Leo, Virgo, Libra
    # Bottom Row: Scorpio, Sag, Cap, Aqua
    # Wait, screenshot signs:
    # Top Row (Left to Right): Pisces (9), Aries (10), Taurus (11), Gemini (12)? 
    # No, usually:
    # 12 1  2  3
    # 11       4
    # 10       5
    # 9  8  7  6
    # Lagna is in box 1? No, box 1 is Aries. LA is in box 1 (Aries).
    # Sun is in box 1 (Aries)? Screenshot: LA SU ME in Box 1. 
    # Box 1 = Aries. 
    # If Sun is 28°45'55" in Aries, that's 28.765...
    # MO is in box 3 (Gemini)? 03°22'57". Gem starts at 60. So MO is 60 + 3.38... = 63.38...
    
    print(f"Target Birth Balance: 18Y 6M 1D")
    
    for name, mode in modes.items():
        swe.set_sid_mode(mode, 0, 0)
        
        # Sun
        res_s, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)
        s_lon = res_s[0]
        
        # Moon
        res_m, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
        m_lon = res_m[0]
        
        print(f"\n--- {name} ---")
        print(f"Sun:  {get_dms(s_lon % 30)} in Sign {int(s_lon/30)+1}")
        print(f"Moon: {get_dms(m_lon % 30)} in Sign {int(m_lon/30)+1}")
        
        # Dasha math
        nak_size = 360/27
        m_lon_total = m_lon
        nak_idx = int(m_lon_total / nak_size)
        frac_rem = 1.0 - ( (m_lon_total % nak_size) / nak_size )
        lord = dasha_order[nak_idx % 9]
        bal_yrs = dasha_years[lord] * frac_rem
        
        y_b = int(bal_yrs)
        m_b = int((bal_yrs - y_b) * 12)
        d_b = int(((bal_yrs - y_b) * 12 - m_b) * 30)
        
        print(f"Dasha Lord: {lord}")
        print(f"Balance: {y_b}Y {m_b}M {d_b}D")

if __name__ == "__main__":
    check_benchmark()
