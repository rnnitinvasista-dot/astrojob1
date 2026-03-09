
# Gold Nadi Matrix & Constants
HIT_MATRIX = {
    1:  ["M", "M", "M", "M", "M", "M", "M", "L", "M", "H", "H", "B*"],
    2:  ["H", "H", "M", "H", "H", "E", "H", "M", "H", "H", "E", "M"],
    3:  ["L", "M", "M", "M", "M", "M", "M", "L", "M", "H", "H", "B*"],
    4:  ["M", "H", "M", "M", "M", "H", "H", "M", "M", "H", "H", "B*"],
    5:  ["M", "M", "M", "M", "M", "M", "M", "B*", "M", "M", "M", "VB*"],
    6:  ["H", "E", "H", "H", "H", "E", "E", "M", "H", "E", "E", "M"],
    7:  ["H", "H", "H", "H", "H", "E", "H", "M", "H", "H", "E", "M"],
    8:  ["L", "M", "L", "L", "B*", "M", "M", "B*", "L", "M", "M", "VB*"],
    9:  ["M", "H", "M", "M", "M", "H", "H", "L", "H", "H", "H", "B*"],
    10: ["H", "E", "H", "H", "H", "E", "H", "H", "E", "H", "E", "M"],
    11: ["H", "E", "H", "H", "H", "E", "E", "H", "E", "E", "E", "M"],
    12: ["VB*", "B*", "VB*", "VB*", "VB*", "B*", "B*", "VB*", "B*", "B*", "B*", "VB*"]
}

SUCCESS_LABELS = {
    "E": "Excellent", "H": "High", "M": "Medium", "L": "Low", "B*": "Bad", "VB*": "Very Bad"
}

HOUSE_JOB_AREAS = {
    1: "Self-employment, Design, Personal Branding, Leadership",
    2: "Finance, Banking, Asset Management, Family Business, Oratory",
    3: "Media, Communication, Sales, Marketing, Writing, Short Travels",
    4: "Real Estate, Vehicles, Agriculture, Education, Interior Design",
    5: "Entertainment, Arts, Sports, Cinema, Speculation",
    6: "Service Industry, Healthcare, Law, Competitive Roles, Auditing",
    7: "Business, Partnerships, Retail, Public Relations, Stock Market",
    8: "Research, Investigations, Legacy, Technical Work, Mystery, Deep Tech",
    9: "Professor, Preacher, NGO's, Trusts, Old age homes, All type of Consultants, Tourism, Publication, Judges, Foreign travels, Immigration, Travel Job, Philosopher, Navy, Hospital Management.",
    10: "Government job, Civil services, All type of Manager's, Any Authoritative role's, Private Sector, administrators, Politics, Corporate, CA's, MD, CEO's.",
    11: "Innovation, Social Impact, Gains, Large Groups, Success",
    12: "Foreign Ties, Investments, Social Service, Isolation Science"
}

import swisseph as swe
import datetime
import pytz
import math
from dateutil.relativedelta import relativedelta

class NadiEngine:
    def __init__(self, node_type="Mean", ayanamsa="KP", house_system="Placidus"):
        self.node_type = node_type
        self.ayanamsa = ayanamsa
        self.house_system = house_system
        
        # Constants
        self.PLANETS = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY,
            "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.MEAN_NODE if node_type == "Mean" else swe.TRUE_NODE,
            "Ketu": swe.MEAN_NODE if node_type == "Mean" else swe.TRUE_NODE
        }
        
        self.SIGN_RULERS = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        
        self.SIGNS = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        
        self.DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        self.DASHA_YEARS = {
            "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
            "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
        }
        
        self.HORARY_TABLE = self.generate_horary_table()
        
        self.NAKSHATRAS = [
            "Ashwini","Bharani","Krittika","Rohini","Mrigashira",
            "Ardra","Punarvasu","Pushya","Ashlesha","Magha",
            "Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati",
            "Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha",
            "Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada",
            "Uttara Bhadrapada","Revati"
        ]
        
        self.ASPECTS = {
            "Conjunction": 0, "Sextile": 60, "Square": 90, "Trine": 120, "Opposition": 180
        }
        
        self.SHORT_CODES = {
            "Sun": "Su", "Moon": "Mo", "Mars": "Ma", "Mercury": "Me",
            "Jupiter": "Ju", "Venus": "Ve", "Saturn": "Sa",
            "Rahu": "Ra", "Ketu": "Ke"
        }

    def decimal_to_dms(self, degree, is_absolute=False):
        """
        DMS conversion matching reference app (D°M'S" format).
        No leading zeros for degrees, no decimal seconds.
        """
        val = degree % 360.0
        d = int(val)
        m_f = (val - d) * 60.0
        m = int(m_f)
        s_f = (m_f - m) * 60.0
        sec = int(round(s_f))
        
        if sec >= 60:
            sec -= 60
            m += 1
        if m >= 60:
            m -= 60
            d = (d + 1) % 360
            
        return f"{d}°{m:02d}'{sec:02d}\""
    

    def get_varga_sign(self, lon, d_val):
        """
        Calculates the divisional sign using precise classical Parashari rules.
        """
        lon = float(lon % 360)
        sign_idx = int(lon / 30.0) % 12
        deg_in_sign = lon % 30.0
        
        if d_val == 1:
            return sign_idx
        elif d_val == 2: # Hora
            if sign_idx % 2 == 0: # Odd sign (Aries=0, Gemini=2, etc.)
                return 4 if deg_in_sign < 15 else 3 # Sun(Leo), Moon(Cancer)
            else: # Even sign
                return 3 if deg_in_sign < 15 else 4
        elif d_val == 3: # Drekkana
            part = int(deg_in_sign / 10.0)
            return (sign_idx + (part * 4)) % 12
        elif d_val == 4: # Chaturthamsha
            part = int(deg_in_sign / 7.5)
            return (sign_idx + (part * 3)) % 12
        elif d_val == 7: # Saptamsha
            part = int(deg_in_sign / (30.0 / 7.0))
            if sign_idx % 2 == 0: return (sign_idx + part) % 12 # Odd start from sign
            else: return (sign_idx + 6 + part) % 12 # Even start from 7th
        elif d_val == 9: # Navamsha
            part = int(deg_in_sign / (30.0 / 9.0))
            if sign_idx in [0, 4, 8]: start_idx = 0 # Fiery start Aries
            elif sign_idx in [1, 5, 9]: start_idx = 9 # Earthy start Capricorn
            elif sign_idx in [2, 6, 10]: start_idx = 6 # Airy start Libra
            else: start_idx = 3 # Watery start Cancer
            return (start_idx + part) % 12
        elif d_val == 10: # Dashamsha
            part = int(deg_in_sign / 3.0)
            if sign_idx % 2 == 0: return (sign_idx + part) % 12
            else: return (sign_idx + 8 + part) % 12
        elif d_val == 12: # Dwadashamsha
            part = int(deg_in_sign / 2.5)
            return (sign_idx + part) % 12
        elif d_val == 16: # Shodashamsha
            part = int(deg_in_sign / (30.0 / 16.0))
            start_table = [0, 4, 8] # Aries, Leo, Sag
            return (start_table[sign_idx % 3] + part) % 12
        elif d_val == 20: # Vimshamsha
            part = int(deg_in_sign / 1.5)
            start_table = [0, 8, 4] # Aries, Sag, Leo
            return (start_table[sign_idx % 3] + part) % 12
        elif d_val == 24: # Chaturvimshamsha
            part = int(deg_in_sign / 1.25)
            if sign_idx % 2 == 0: return (4 + part) % 12 # Odd start Leo
            else: return (3 + part) % 12 # Even start Cancer
        elif d_val == 27: # Saptavimshamsha / Bhamsha
            part = int(deg_in_sign / (30.0 / 27.0))
            start_table = [0, 3, 6, 9] # Aries, Cancer, Libra, Capricorn
            return (start_table[sign_idx % 4] + part) % 12
        elif d_val == 30: # Trimshamsha
            d = deg_in_sign
            if sign_idx % 2 == 0: # Odd
                if d < 5: return 0 # Mars
                elif d < 10: return 10 # Saturn
                elif d < 18: return 11 # Jupiter (Pisces used per logic)
                elif d < 25: return 2 # Mercury
                else: return 1 # Venus
            else: # Even
                if d < 5: return 1 # Venus
                elif d < 12: return 2 # Mercury
                elif d < 20: return 11 # Jupiter
                elif d < 25: return 10 # Saturn
                else: return 0 # Mars
        elif d_val == 40: # Khavedamsha
            part = int(deg_in_sign / 0.75)
            if sign_idx % 2 == 0: return (0 + part) % 12
            else: return (6 + part) % 12
        elif d_val == 45: # Akshavedamsha
            part = int(deg_in_sign / (30.0 / 45.0))
            start_table = [0, 4, 8]
            return (start_table[sign_idx % 3] + part) % 12
        elif d_val == 60: # Shashtiamsha
            part = int(deg_in_sign / 0.5)
            return (sign_idx + part) % 12
            
        return int((lon * d_val) / 30.0) % 12

    def decimal_to_sign_dms(self, degree):
        """
        Express planet degree within its sign (0-30°) with sign name.
        e.g., Sun at 323.46° → '03°27'38" Aquarius'
        Per spec Step 3: planet position = Sign Degree + Sign Name
        """
        degree = degree % 360.0
        sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                      "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        sign_idx = int(degree / 30.0) % 12
        deg_in_sign = degree - (sign_idx * 30.0)  # 0-30
        dms = self.decimal_to_dms(deg_in_sign, is_absolute=False)
        return f"{dms} {sign_names[sign_idx]}"

    def generate_horary_table(self):
        table = {}
        nak_size = 360.0 / 27.0
        num = 1
        sign_names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        calibration_offset = 27.0 / 3600.0 

        for n_idx in range(27):
            nak_start = n_idx * nak_size
            star_lord = self.DASHA_ORDER[n_idx % 9]
            start_lord_idx = self.DASHA_ORDER.index(star_lord)
            sub_seq = self.DASHA_ORDER[start_lord_idx:] + self.DASHA_ORDER[:start_lord_idx]
            
            curr_nak_lon = 0.0
            for lord in sub_seq:
                arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
                seg_start = nak_start + curr_nak_lon
                seg_end = seg_start + arc
                
                s_sign = int(seg_start / 30.0)
                e_sign = int((seg_end - 1e-8) / 30.0)
                
                if s_sign != e_sign:
                    table[num] = {
                        "lon": seg_start + calibration_offset, "sign": sign_names[s_sign],
                        "sl": self.SIGN_RULERS[sign_names[s_sign]],
                        "nl": star_lord, "sub": lord
                    }
                    num += 1
                    table[num] = {
                        "lon": (e_sign * 30.0) + calibration_offset, "sign": sign_names[e_sign],
                        "sl": self.SIGN_RULERS[sign_names[e_sign]],
                        "nl": star_lord, "sub": lord
                    }
                    num += 1
                else:
                    table[num] = {
                        "lon": seg_start + calibration_offset, "sign": sign_names[s_sign],
                        "sl": self.SIGN_RULERS[sign_names[s_sign]],
                        "nl": star_lord, "sub": lord
                    }
                    num += 1
                
                curr_nak_lon += arc
                if num > 249: break
            if num > 249: break
        return table

    def calculate_prashna_cusps(self, jd, lat, lon, horary_number, calibrated_ayan=None):
        table = self.generate_horary_table()
        if horary_number not in table:
            raise ValueError(f"Invalid Horary Number: {horary_number}")
            
        target_sid_asc = table[horary_number]['lon']
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        ayan = calibrated_ayan if calibrated_ayan is not None else swe.get_ayanamsa_ut(jd)
        target_trop_asc = (target_sid_asc + ayan) % 360
        
        res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
        eps = res[0]
        
        def get_asc_for_ramc(r):
            try:
                _, a = swe.houses_armc(r % 360, lat, eps, b'E')
                return a[0] 
            except: 
                return (r + 90) % 360

        best_r = 0.0
        min_diff = 400.0
        for test_r in range(0, 360, 2):
            curr = get_asc_for_ramc(float(test_r))
            diff = abs((curr - target_trop_asc + 180) % 360 - 180)
            if diff < min_diff:
                min_diff = diff
                best_r = float(test_r)

        low, high = best_r - 2.0, best_r + 2.0
        for _ in range(40):
            m1 = low + (high - low) * 0.4
            m2 = low + (high - low) * 0.6
            v1 = get_asc_for_ramc(m1)
            v2 = get_asc_for_ramc(m2)
            d1 = abs((v1 - target_trop_asc + 180) % 360 - 180)
            d2 = abs((v2 - target_trop_asc + 180) % 360 - 180)
            if d1 < d2: high = m2
            else: low = m1
        
        final_ramc = (low + high) / 2.0
        h_sys = b'P' if self.house_system == "Placidus" else b'E'
        cusps_trop, ascmc_trop = swe.houses_armc(final_ramc % 360, lat, eps, h_sys)
        cusps_sid = [(c - ayan) % 360 for c in cusps_trop]
        ascmc_sid = [(a - ayan) % 360 for a in ascmc_trop]
        return cusps_sid, ascmc_sid

    def get_kp_lords(self, degree: float):
        """
        Compute Sign Lord, Nakshatra Lord, Sub Lord, Sub-Sub Lord per spec Steps 3, 5, 18.
        Steps:
          Step 3: sign_idx = floor(degree / 30)
          Step 5: nak_idx = floor(degree / (360/27))
          Step 18: Sub segments proportional to Vimshottari years
        Full floating-point precision maintained throughout.
        """
        degree = float(degree % 360.0)

        # Step 3: Sign
        sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo",
                      "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        sign_idx = int(degree / 30.0) % 12
        sign_lord = self.SIGN_RULERS[sign_names[sign_idx]]
        
        # Step 5: Nakshatra
        nak_size = 360.0 / 27.0  # = 13.333333...°
        nak_idx = int(degree / nak_size) % 27
        star_lord = self.DASHA_ORDER[nak_idx % 9]
        
        # Elapsed and remaining in Nakshatra
        nak_start = nak_idx * nak_size
        elapsed_in_nak = degree - nak_start  # = Elapsed per spec Step 5
        
        # Step 18: Sub divisions - proportional to Vimshottari years
        # Each Nak has 9 subs, starting from the Nak's star lord
        sl_idx = self.DASHA_ORDER.index(star_lord)
        sub_seq = self.DASHA_ORDER[sl_idx:] + self.DASHA_ORDER[:sl_idx]
        
        sub_lord = star_lord
        sub_arc = (self.DASHA_YEARS[star_lord] / 120.0) * nak_size
        rem_in_sub = elapsed_in_nak
        sub_idx_in_nak = 1
        current_off = 0.0
        
        for i, lord in enumerate(sub_seq):
            arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
            if current_off <= elapsed_in_nak < (current_off + arc + 1e-10) or i == len(sub_seq) - 1:
                sub_lord = lord
                sub_arc = arc
                sub_idx_in_nak = i + 1
                rem_in_sub = elapsed_in_nak - current_off
                break
            current_off += arc
        
        # Sub-Sub Lord: proportional divisions within the Sub
        ssl_lord = sub_lord
        ssl_start_idx = self.DASHA_ORDER.index(sub_lord)
        ssl_seq = self.DASHA_ORDER[ssl_start_idx:] + self.DASHA_ORDER[:ssl_start_idx]
        off_ssl = 0.0
        for lord in ssl_seq:
            arc_ssl = (self.DASHA_YEARS[lord] / 120.0) * sub_arc
            if off_ssl <= rem_in_sub < (off_ssl + arc_ssl + 1e-10):
                ssl_lord = lord
                break
            off_ssl += arc_ssl
        
        nadi_type = "Unknown"
        if sub_idx_in_nak in [1, 4, 7]: nadi_type = "Vata"
        elif sub_idx_in_nak in [2, 5, 8]: nadi_type = "Pitta"
        elif sub_idx_in_nak in [3, 6, 9]: nadi_type = "Kapha"
            
        return sign_names[sign_idx], sign_lord, star_lord, sub_lord, ssl_lord, self.NAKSHATRAS[nak_idx], nadi_type, sub_idx_in_nak

    def get_nadi_triple_combination(self, degree: float):
        degree = degree % 360
        naksh_size = 360.0 / 27.0
        naksh_idx = int(degree / naksh_size) % 27
        star_lord = self.DASHA_ORDER[naksh_idx % 9]
        
        rem_in_nak = degree - (naksh_idx * naksh_size)
        sub_lord = star_lord
        sub_idx = 0
        current_off = 0.0
        seq_start = naksh_idx % 9
        sub_seq = self.DASHA_ORDER[seq_start:] + self.DASHA_ORDER[:seq_start]
        
        planet_lord = sub_lord
        pl_idx = 0
        
        found_sub = False
        for i, lord in enumerate(sub_seq):
            arc = (self.DASHA_YEARS[lord] / 120.0) * naksh_size
            if current_off <= rem_in_nak < (current_off + arc + 1e-10):
                sub_lord = lord
                sub_idx = i
                rem_in_sub = rem_in_nak - current_off
                
                pl_seq_start = self.DASHA_ORDER.index(lord)
                pl_seq = self.DASHA_ORDER[pl_seq_start:] + self.DASHA_ORDER[:pl_seq_start]
                pl_off = 0.0
                for j, pl_lord in enumerate(pl_seq):
                    pl_arc = (self.DASHA_YEARS[pl_lord] / 120.0) * arc
                    if pl_off <= rem_in_sub < (pl_off + pl_arc + 1e-10):
                        planet_lord = pl_lord
                        pl_idx = j
                        break
                    pl_off += pl_arc
                found_sub = True
                break
            current_off += arc
        
        if not found_sub:
            sub_lord = sub_seq[-1]
            planet_lord = sub_lord
            sub_idx = 8
            pl_idx = 8

        nadi_type = "Unknown"
        nadi_val = sub_idx + 1
        if nadi_val in [1, 4, 7]: nadi_type = "Vata"
        elif nadi_val in [2, 5, 8]: nadi_type = "Pitta"
        elif nadi_val in [3, 6, 9]: nadi_type = "Kapha"
        
        return self.NAKSHATRAS[naksh_idx], star_lord, sub_lord, planet_lord, nadi_type, nadi_val, pl_idx + 1

    def get_node_agents(self, node_name, node_data, all_planets):
        """
        Identify agents for Rahu/Ketu based on Standard KP/Nadi Rules:
        1. Sign Lord (Dispositor)
        2. All Conjunct Planets (In same sign)
        3. Aspecting Planets (Mars: 4,8; Jup: 5,9; Sat: 3,10; Opposition: 7)
        """
        agents = []
        node_sign = node_data['sign']
        node_lon = node_data['degree_decimal']
        
        # 1. Sign Lord
        sl_short = node_data.get('sign_lord')
        sl_full = next((k for k, v in self.SHORT_CODES.items() if v == sl_short), sl_short)
        agents.append({'type': 'Sign Lord', 'planet': sl_full})
        
        self.SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        
        for p in all_planets:
            p_name = p['planet']
            if p_name in [node_name, "Rahu", "Ketu"]: continue
            
            p_lon = p['degree_decimal']
            p_sign = p['sign']
            
            # Rule 1: Conjunction (Strictly SAME SIGN)
            if p_sign == node_sign:
                agents.append({'type': 'Conjunction', 'planet': p_name})
                    
            # Rule 2: Aspects (Planet aspecting the Node)
            # diff_deg = (Node_lon - Planet_lon + 360) % 360
            diff_deg = (node_lon - p_lon + 360.0) % 360.0

            is_aspecting = False
            # 7th Aspect (Opposition)
            if abs(diff_deg - 180) <= 12: is_aspecting = True
            # Mars: 4th (90), 8th (210)
            elif p_name == "Mars":
                if (abs(diff_deg - 90) <= 12) or (abs(diff_deg - 210) <= 12): is_aspecting = True
            # Jupiter: 5th (120), 9th (240)
            elif p_name == "Jupiter":
                if (abs(diff_deg - 120) <= 12) or (abs(diff_deg - 240) <= 12): is_aspecting = True
            # Saturn: 3rd (60), 10th (270)
            elif p_name == "Saturn":
                if (abs(diff_deg - 60) <= 12) or (abs(diff_deg - 270) <= 12): is_aspecting = True
            
            if is_aspecting:
                agents.append({'type': 'Aspect', 'planet': p_name})
                
        # Unique list of planets
        seen = set()
        final_agents = []
        for a in agents:
            if a['planet'] not in seen:
                final_agents.append(a)
                seen.add(a['planet'])
        return final_agents

    def calculate_kundli(self, dt_str, timezone, lat, lon, horary_number=None):
        tz = pytz.timezone(timezone)
        dt = None
        formats = ["%Y-%m-%d %H:%M:%S", "%d-%m-%Y %H:%M:%S", "%Y/%m/%d %H:%M:%S", "%d/%m/%Y %H:%M:%S", "%Y-%m-%d %H:%M", "%Y-%m-%dT%H:%M"]
        for fmt in formats:
            try:
                dt = datetime.datetime.strptime(dt_str, fmt)
                break
            except ValueError:
                continue
        if dt is None:
            try:
                dt = datetime.datetime.fromisoformat(dt_str)
            except:
                return {"status": "error", "message": f"Invalid Date Format: {dt_str}."}

        birth_dt_loc = tz.localize(dt)
        utc_dt = birth_dt_loc.astimezone(pytz.UTC)
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)
        
        h_sys = b'P' if self.house_system == "Placidus" else b'E'
        if horary_number:
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
            # Calibrated KP Ayanamsa to match reference app (-6.2s offset for Sun/Lag alignment)
            ayan_val = swe.get_ayanamsa_ut(jd) - (6.2 / 3600.0)
            cusps, ascmc = self.calculate_prashna_cusps(jd, lat, lon, horary_number, calibrated_ayan=ayan_val)
            ramc_offset = 0.0
        else:
            # Calibrated KP Ayanamsa to match reference app (-6.2s offset for Sun/Lag alignment)
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
            ayan_val = swe.get_ayanamsa_ut(jd) - (6.2 / 3600.0)
            
            ramc_offset = 0.0
            
            # Explicit Time Conversion for KP rules
            # GMST -> LST -> RAMC
            gmst_hrs = swe.sidtime(jd)
            lst_hrs = (gmst_hrs + lon / 15.0) % 24.0
            ramc_deg = (lst_hrs * 15.0) % 360.0
            
            res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
            eps = res_nut[0]
            
            cusps_trop, ascmc_trop = swe.houses_armc(ramc_deg + ramc_offset, lat, eps, h_sys)
            cusps = [(c - ayan_val) % 360 for c in cusps_trop]
            ascmc = [(a - ayan_val) % 360 for a in ascmc_trop]

        house_owners = {}
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        asc_sn, _, _, _, _, _, _, _ = self.get_kp_lords(cusps[0])
        asc_idx = signs.index(asc_sn)
        for i in range(12):
            curr_sign = signs[(asc_idx + i) % 12]
            house_owners[i+1] = self.SIGN_RULERS[curr_sign]
        
        # --- STEP 1 & 2: Tropical planetary longitudes, then subtract Ayanamsa ---
        # Sidereal Longitude = Tropical Longitude - KP Ayanamsa (normalized 0-360)
        planets_raw = []
        for name, code in self.PLANETS.items():
            res, _ = swe.calc_ut(jd, code, swe.FLG_SWIEPH | swe.FLG_SPEED)
            lon_tropical = res[0]  # Step 1: tropical from ephemeris
            # Step 2: sidereal = tropical - ayanamsa, normalized
            lon_sidereal = (lon_tropical - ayan_val) % 360.0
            speed_val = res[3]
            if name == "Ketu":
                lon_sidereal = (lon_sidereal + 180.0) % 360.0  # Ketu = Rahu + 180
            planets_raw.append({"planet": name, "lon": lon_sidereal, "speed": speed_val})
            
        houses_res = []
        for i in range(12):
            lon_val = cusps[i]
            if i == 0 and horary_number:
                entry = self.HORARY_TABLE[horary_number]
                sn, sl, nlk, sub = entry["sign"], entry["sl"], entry["nl"], entry["sub"]
                _, _, _, _, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            else:
                sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
                
            houses_res.append({
                "house_number": i+1, 
                "cusp_degree_dms": self.decimal_to_dms(lon_val, is_absolute=True),
                "sign": sn, 
                "sign_lord": self.SHORT_CODES.get(sl, sl), 
                "star_lord": self.SHORT_CODES.get(nlk, nlk), 
                "sub_lord": self.SHORT_CODES.get(sub, sub), 
                "sub_sub_lord": self.SHORT_CODES.get(ssl, ssl),
                "nakshatra": nak, "nadi": nadi, "nadi_index": sub_idx, "planet_lord": sl, "cusp_degree_decimal": lon_val
            })
            
        planets_res = []
        sun_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Sun")
        for p in planets_raw:
            lon_val = p["lon"]
            hp = 1
            for i in range(12):
                cusp_curr, cusp_next = cusps[i], cusps[(i+1)%12]
                if (cusp_next < cusp_curr and (lon_val >= cusp_curr or lon_val < cusp_next)) or (cusp_curr <= lon_val < cusp_next):
                    hp = i + 1; break
            
            sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            is_combust = False
            if p["planet"] != "Sun" and p["planet"] in ["Moon","Mars","Mercury","Jupiter","Venus","Saturn"]:
                orbs = {"Moon": 12, "Mars": 17, "Mercury": 13, "Jupiter": 11, "Venus": 9, "Saturn": 15}
                dist = abs(lon_val - sun_lon)
                if dist > 180: dist = 360 - dist
                if dist < orbs.get(p["planet"], 12): is_combust = True
                
            planets_res.append({
                "planet": p["planet"], 
                "degree_dms": self.decimal_to_dms(lon_val, is_absolute=True), # Absolute 0-360 to match user images
                "house_placed": int(hp),
                "sign": sn, 
                "sign_lord": self.SHORT_CODES.get(sl, sl), 
                "star_lord": self.SHORT_CODES.get(nlk, nlk), 
                "sub_lord": self.SHORT_CODES.get(sub, sub), 
                "sub_sub_lord": self.SHORT_CODES.get(ssl, ssl),
                "nakshatra": nak, "nadi": nadi, "nadi_index": sub_idx, 
                "is_retrograde": True if p["planet"] in ["Rahu", "Ketu"] else p["speed"] < 0, "is_combust": is_combust,
                "planet_lord": sl, "degree_decimal": lon_val
            })
            
        planet_res_map = {p["planet"]: p for p in planets_res}
        significations_res = []
        for p in planets_res:
            p_name = p["planet"]
            sigs_4 = self.get_node_significators(p_name, planet_res_map, house_owners) if p_name in ["Rahu", "Ketu"] else self.calculate_kp_significators_4level(p_name, planet_res_map, house_owners)
            total_houses = sorted(list(set(sigs_4["L1"] + sigs_4["L2"] + sigs_4["L3"] + sigs_4["L4"])))
            significations_res.append({"planet": p_name, "levels": sigs_4, "total": total_houses, "agent": sigs_4.get("agent", None)})
            
        nak_nadi_res = []
        for p in planets_res:
            p_name = p["planet"]
            p_lon = next(raw["lon"] for raw in planets_raw if raw["planet"] == p_name)
            nak, sl_name, sub_name, pl_name, nadi, sub_idx, pl_idx = self.get_nadi_triple_combination(p_lon)
            nak_nadi_res.append({
                "planet": p_name, "nakshatra_name": nak, "is_retrograde": p["is_retrograde"], "is_combust": p["is_combust"],
                "pl_signified": self.get_eff_sigs_detailed(p_name, planet_res_map, house_owners),
                "star_lord": sl_name, "nl_signified": self.get_eff_sigs_detailed(sl_name, planet_res_map, house_owners),
                "sub_lord": sub_name, "sl_signified": self.get_eff_sigs_detailed(sub_name, planet_res_map, house_owners),
                "planet_lord": pl_name, "pl_lord_signified": self.get_eff_sigs_detailed(pl_name, planet_res_map, house_owners)
            })
            
        dasha_data = self.calculate_dasha(planets_raw, birth_dt_loc)
        
        varga_configs = {
            "D1": 1, "D2": 2, "D3": 3, "D4": 4, "D7": 7, "D9": 9, 
            "D10": 10, "D12": 12, "D16": 16, "D20": 20, "D24": 24, 
            "D27": 27, "D30": 30, "D40": 40, "D45": 45, "D60": 60
        }
        varga_charts = {}
        
        for v_name, d_val in varga_configs.items():
            chart_planets = []
            for p_dict in planets_raw:
                p_name = p_dict["planet"]
                lon = p_dict["lon"]
                v_sign_idx = self.get_varga_sign(lon, d_val)
                chart_planets.append({
                    "planet": p_name,
                    "sign": self.SIGNS[v_sign_idx],
                    "is_retrograde": p_name in ["Rahu", "Ketu"] or p_dict["speed"] < 0
                })
            # Add Ascendant to Varga
            asc_v_sign = self.get_varga_sign(ascmc[0], d_val)
            varga_charts[v_name] = {
                "planets": chart_planets,
                "ascendant": {"sign": self.SIGNS[asc_v_sign]}
            }

        sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(ascmc[0])
        asc_res = {"degree_dms": f"{self.decimal_to_dms(ascmc[0])} {sn}", "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl, "nakshatra": nak, "nadi": nadi, "planet_lord": sl}
        moon_lon = dasha_data["moon_lon"]
        nak_size = 360/27
        return {
            "status": "success", "ascendant": asc_res, "houses": houses_res, "planets": planets_res,
            "significations": significations_res, "nakshatra_nadi": nak_nadi_res, "dasha": dasha_data,
            "varga_charts": varga_charts,
            "metadata": {"ayanamsa": self.ayanamsa, "ayanamsa_value": f"{ayan_val:.4f}°", "janma_nakshatra": self.NAKSHATRAS[int(moon_lon/nak_size)%27], "pada": int((moon_lon % nak_size) / (nak_size / 4)) + 1, "horary_number": horary_number},
            "aspects": self.calculate_aspects(planets_raw)
        }

    def calculate_aspects(self, planets_raw):
        res = []
        for i in range(len(planets_raw)):
            p1 = planets_raw[i]
            for j in range(len(planets_raw)):
                if i == j: continue
                p2 = planets_raw[j]
                diff = abs(p1["lon"] - p2["lon"])
                if diff > 180: diff = 360 - diff
                for name, deg in self.ASPECTS.items():
                    if abs(diff - deg) <= 6.0:
                        res.append({"planet": p1["planet"], "aspect": name, "target": p2["planet"], "degree_diff": round(diff, 2)})
        final_res = []
        for r in res:
            if r["planet"] in ["Rahu", "Ketu"] and r["aspect"] not in ["Trine", "Opposition", "Conjunction"]: continue
            final_res.append(r)
        return final_res

    def get_eff_sigs_detailed(self, p_name, planet_map, house_owners):
        if p_name not in planet_map: return []
        p_data = planet_map[p_name]
        sigs = [{"house": int(p_data["house_placed"]), "is_placed": True}]
        houses_seen = {int(p_data["house_placed"])}
        
        for h, owner in house_owners.items():
            if owner == p_name and h not in houses_seen:
                sigs.append({"house": h, "is_placed": False})
                houses_seen.add(h)
                
        if p_name in ["Rahu", "Ketu"]:
            # Identify all occupied houses (excluding Nodes themselves)
            occupied = set(int(p["house_placed"]) for p in planet_map.values() if p["planet"] not in ["Rahu", "Ketu"])
            
            for agent in self.get_node_agents(p_name, p_data, list(planet_map.values())):
                a_name = agent['planet']
                if a_name and a_name in planet_map:
                    a_data = planet_map[a_name]
                    a_occ = int(a_data["house_placed"])
                    # 1. Agent's Occupied House
                    if a_occ not in houses_seen:
                        sigs.append({"house": a_occ, "is_placed": False})
                        houses_seen.add(a_occ)
                        
                    # 2. Agent's Owned Houses (Fully included for Nodes)
                    for h, o in house_owners.items():
                        if o == a_name and h not in houses_seen:
                            sigs.append({"house": h, "is_placed": False})
                            houses_seen.add(h)
                            
        return sorted(sigs, key=lambda x: x["house"])

    def calculate_kp_significators_4level(self, p_name, planet_map, house_owners):
        if p_name not in planet_map: return {"L1":[], "L2":[], "L3":[], "L4":[], "is_self_strength": False}
        p_data = planet_map[p_name]
        sl_data = planet_map.get(p_data["star_lord"])
        l1 = [int(sl_data["house_placed"])] if sl_data else []
        l2 = [int(p_data["house_placed"])]
        l3 = sorted([int(h) for h, o in house_owners.items() if o == p_data["star_lord"]])
        l4 = sorted([int(h) for h, o in house_owners.items() if o == p_name])
        self_strength = not any(p["star_lord"] == p_name for p in planet_map.values())
        return {"L1": l2, "L2": l1, "L3": l4, "L4": l3, "is_self_strength": True} if self_strength else {"L1": l1, "L2": l2, "L3": l3, "L4": l4, "is_self_strength": False}

    def get_node_significators(self, node_name, planet_map, house_owners):
        # 1. Own significations
        base = self.calculate_kp_significators_4level(node_name, planet_map, house_owners)
        
        # 2. Add ALL significations of ALL agents (Sign Lord, Conjunct, Aspect)
        # User requested no restrictive logic, nodes act as their agents fully.
        p_data = planet_map[node_name]
        agents = self.get_node_agents(node_name, p_data, list(planet_map.values()))
        
        for agent in agents:
            a_name = agent['planet']
            if a_name and a_name in planet_map:
                a_sigs = self.calculate_kp_significators_4level(a_name, planet_map, house_owners)
                for lvl in ["L1", "L2", "L3", "L4"]:
                    base[lvl] = sorted(list(set(base[lvl] + a_sigs[lvl])))
        
        # Re-calc agents string
        agent_names = [a['planet'] for a in agents]
        base["agent"] = ", ".join(agent_names) if agent_names else None
        return base

    def calculate_dasha(self, planets_raw, birth_dt_loc):
        """
        Final High-Precision Vimshottari Dasha (v1.2.8)
        Sidereal Year = 365.25636 days.
        Nakshatra Length = 48000 arcseconds.
        Level Formula: (MD * AD * PD * ...) / 120^(level-1)
        """
        # Step 1-3: Moon Position & Balance
        moon_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Moon")
        abs_arcsec = moon_lon * 3600.0
        nak_len_arcsec = 48000.0 
        nak_idx = int(abs_arcsec // nak_len_arcsec) % 27
        elapsed_arcsec = abs_arcsec % nak_len_arcsec
        remaining_arcsec = nak_len_arcsec - elapsed_arcsec
        balance_fraction = remaining_arcsec / nak_len_arcsec
        
        lord_name = self.DASHA_ORDER[nak_idx % 9]
        bal_yrs_f = self.DASHA_YEARS[lord_name] * balance_fraction
        
        # sidereal year = 365.25636 days
        DAYS_PER_YEAR = 365.25636
        
        def add_precise(dt, float_yrs):
            return dt + datetime.timedelta(days=float_yrs * DAYS_PER_YEAR)

        fmt_dt = lambda dt: dt.strftime("%d/%m/%Y %H:%M:%S")
        today = datetime.datetime.now(pytz.UTC)
        
        # MD Sequence Start
        md_end_first = add_precise(birth_dt_loc, bal_yrs_f)
        md_curs = md_end_first - datetime.timedelta(days=self.DASHA_YEARS[lord_name] * DAYS_PER_YEAR)
        
        def get_seq(p):
            idx = self.DASHA_ORDER.index(p)
            return self.DASHA_ORDER[idx:] + self.DASHA_ORDER[:idx]

        tree, act_md, act_ad, act_pd = [], "None", "None", "None"
        
        # Level 1: Mahadasha (D)
        for md_p in get_seq(lord_name):
            md_start = md_curs
            md_yrs = self.DASHA_YEARS[md_p]
            md_end = md_start + datetime.timedelta(days=md_yrs * DAYS_PER_YEAR)
            md_item = {"planet": md_p, "label": "D", "start_date": fmt_dt(md_start), "end_date": fmt_dt(md_end), "bukthis": []}
            
            if md_start <= today <= md_end: act_md = md_p
            
            # Level 2: Antardasha (B)
            ad_curs = md_start
            for ad_p in get_seq(md_p):
                ad_yrs_f = (self.DASHA_YEARS[md_p] * self.DASHA_YEARS[ad_p]) / 120.0
                ad_end = add_precise(ad_curs, ad_yrs_f)
                ad_item = {"planet": ad_p, "label": "B", "start_date": fmt_dt(ad_curs), "end_date": fmt_dt(ad_end), "antaras": []}
                
                if act_md == md_p and ad_curs <= today <= ad_end: act_ad = ad_p
                
                # Level 3: Pratyantardasha (A)
                pd_curs = ad_curs
                for pd_p in get_seq(ad_p):
                    pd_yrs_f = (self.DASHA_YEARS[md_p] * self.DASHA_YEARS[ad_p] * self.DASHA_YEARS[pd_p]) / (120.0**2)
                    pd_end = add_precise(pd_curs, pd_yrs_f)
                    pd_item = {"planet": pd_p, "label": "A", "start_date": fmt_dt(pd_curs), "end_date": fmt_dt(pd_end)}
                    
                    if act_ad == ad_p and pd_curs <= today <= pd_end: act_pd = pd_p
                    
                    ad_item["antaras"].append(pd_item)
                    pd_curs = pd_end
                
                md_item["bukthis"].append(ad_item)
                ad_curs = ad_end
                
            tree.append(md_item)
            md_curs = md_end
            
        # Tree building logic
        return {
            "current_path": [act_md, act_ad, act_pd], 
            "tree": tree, 
            "moon_lon": moon_lon, 
            "balance": f"{bal_yrs_f:.4f} years",
            "nakshatra": self.NAKSHATRAS[nak_idx], 
            "pada": int((elapsed_arcsec % nak_len_arcsec) / (nak_len_arcsec / 4)) + 1
        }
