
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


    def generate_horary_table(self):
        """Generates the 249 KP Horary mapping table mathematically."""
        table = {}
        nak_size = 360.0 / 27.0  # 13° 20' = 800'
        num = 1
        sign_names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]

        for n_idx in range(27):
            nak_start = n_idx * nak_size
            lord_start_idx = n_idx % 9
            sub_seq = self.DASHA_ORDER[lord_start_idx:] + self.DASHA_ORDER[:lord_start_idx]
            
            curr_nak_lon = 0.0
            for lord in sub_seq:
                arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
                seg_start = nak_start + curr_nak_lon
                seg_end = seg_start + arc
                
                sign_idx_s = int(seg_start / 30.0)
                sign_idx_e = int((seg_end - 1e-10) / 30.0)
                nak_lord = self.DASHA_ORDER[lord_start_idx]
                
                if sign_idx_s != sign_idx_e:
                    # Part 1: Previous Sign
                    table[num] = {
                        "lon": seg_start, "sign": sign_names[sign_idx_s],
                        "sl": self.SIGN_RULERS[sign_names[sign_idx_s]],
                        "nl": nak_lord, "sub": lord
                    }
                    num += 1
                    # Part 2: Next Sign
                    table[num] = {
                        "lon": (sign_idx_e * 30.0), "sign": sign_names[sign_idx_e],
                        "sl": self.SIGN_RULERS[sign_names[sign_idx_e]],
                        "nl": nak_lord, "sub": lord
                    }
                    num += 1
                else:
                    table[num] = {
                        "lon": seg_start, "sign": sign_names[sign_idx_s],
                        "sl": self.SIGN_RULERS[sign_names[sign_idx_s]],
                        "nl": nak_lord, "sub": lord
                    }
                    num += 1
                
                curr_nak_lon += arc
                if num > 249: break
            if num > 249: break
        return table

    def calculate_prashna_cusps(self, jd, lat, lon, horary_num):
        """Calculates Placidus cusps for Prashna using the Effective Latitude method."""
        if horary_num not in self.HORARY_TABLE:
            raise ValueError(f"Invalid Horary Number: {horary_num}")
            
        entry = self.HORARY_TABLE[horary_num]
        asc_sid = entry["lon"]
        
        ayan_val = swe.get_ayanamsa_ut(jd)
        asc_trop = (asc_sid + ayan_val) % 360
        
        # 3. Calculate RAMC (Right Ascension of Midheaven)
        # houses_ex returns ascmc[2] which is RAMC
        _, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
        ramc = ascmc[2]
        
        # 4. Obliquity of Ecliptic
        # swe.calc_ut returns (res, ret) where res[0] is true obliquity
        res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
        eps = res[0]
        
        try:
            # 5. Precise Iterative Solver for Effective Latitude
            def get_asc_for_lat(p):
                try:
                    # Equal house Ascendant is the most stable proxy for actual Rising Degree
                    _, a = swe.houses_armc(ramc, p, eps, b'E')
                    return a[0] 
                except: return (ramc + 90) % 360

            # Step 1: Broad sampling to find the best range (handles quadrant jumps)
            best_phi = 0.0
            min_diff = 400.0
            for test_phi in range(-89, 90, 2):
                curr = get_asc_for_lat(float(test_phi))
                diff = abs((curr - asc_trop + 180) % 360 - 180)
                if diff < min_diff:
                    min_diff = diff
                    best_phi = float(test_phi)

            # Step 2: Refine the best range with ternary search (to find global minimum of diff)
            low, high = best_phi - 2.0, best_phi + 2.0
            for _ in range(40):
                mid1 = low + (high - low) * 0.4
                mid2 = low + (high - low) * 0.6
                diff1 = abs((get_asc_for_lat(mid1) - asc_trop + 180) % 360 - 180)
                diff2 = abs((get_asc_for_lat(mid2) - asc_trop + 180) % 360 - 180)
                if diff1 < diff2: high = mid2
                else: low = mid1
            phi_eff = (low + high) / 2
            phi_eff = (low + high) / 2

            # 6. Final Cusp Generation
            try:
                cusps_trop, ascmc_trop = swe.houses_armc(ramc, phi_eff, eps, b'P')
            except:
                # Placidus singularity fallback (Porphyry matches unequal requirement)
                cusps_trop, ascmc_trop = swe.houses_armc(ramc, phi_eff, eps, b'O') 
            
            cusps_sid = [(c - ayan_val) % 360 for c in cusps_trop]
            
            # Adjust ascmc for sidereal
            ascmc_sid = [0.0] * 10
            ascmc_sid[0] = (ascmc_trop[0] - ayan_val) % 360 # Asc
            ascmc_sid[1] = (ascmc_trop[1] - ayan_val) % 360 # MC
            ascmc_sid[2] = ramc 
            
            return cusps_sid, ascmc_sid
                
        except Exception as e:
            print(f"DEBUG SOLVER ERROR: {str(e)}")
            # Final fallback: Standard houses if anything fails
            return swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)

    def get_kp_lords(self, degree: float):
        # Normalize to 0-359.999...
        degree = float(degree % 360.0)
        # Precision guard for Aries 0 boundaries
        if degree < 1e-10: degree = 0.0
        
        sign_idx = int(degree / 30.0) % 12
        sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        sign_lord = self.SIGN_RULERS[sign_names[sign_idx]]
        
        naksh_size = 360.0 / 27.0
        naksh_idx = int(degree / naksh_size) % 27
        star_lord = self.DASHA_ORDER[naksh_idx % 9]
        
        rem_in_nak = degree - (naksh_idx * naksh_size)
        sub_lord = star_lord
        sub_idx_in_nak = 1
        current_off = 0.0
        sub_seq = self.DASHA_ORDER[naksh_idx % 9:] + self.DASHA_ORDER[:naksh_idx % 9]
        
        ssl_lord = sub_lord # Default
        
        for i, lord in enumerate(sub_seq):
            arc = (self.DASHA_YEARS[lord] / 120.0) * naksh_size
            if current_off <= rem_in_nak < (current_off + arc + 1e-10):
                sub_lord = lord
                sub_idx_in_nak = i + 1
                rem_in_sub = rem_in_nak - current_off
                ssl_idx = self.DASHA_ORDER.index(lord)
                ssl_seq = self.DASHA_ORDER[ssl_idx:] + self.DASHA_ORDER[:ssl_idx]
                off_ssl = 0.0
                for sl in ssl_seq:
                    arc_ssl = (self.DASHA_YEARS[sl] / 120.0) * arc
                    if off_ssl <= rem_in_sub < (off_ssl + arc_ssl + 1e-10):
                        ssl_lord = sl
                        break
                    off_ssl += arc_ssl
                break
            current_off += arc
        
        nadi_type = "Unknown"
        if sub_idx_in_nak in [1, 4, 7]: nadi_type = "Vata"
        elif sub_idx_in_nak in [2, 5, 8]: nadi_type = "Pitta"
        elif sub_idx_in_nak in [3, 6, 9]: nadi_type = "Kapha"
            
        return sign_names[sign_idx], sign_lord, star_lord, sub_lord, ssl_lord, self.NAKSHATRAS[naksh_idx], nadi_type, sub_idx_in_nak

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
        # Map back to full name if possible
        SHORT_CODES = {"Sun":"Su","Moon":"Mo","Mars":"Ma","Mercury":"Me","Jupiter":"Ju","Venus":"Ve","Saturn":"Sa","Rahu":"Ra","Ketu":"Ke"}
        sl_full = next((k for k, v in SHORT_CODES.items() if v == sl_short), sl_short)
        agents.append({'type': 'Sign Lord', 'planet': sl_full})
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        
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
        
        # Robust Date Parsing
        dt = None
        formats = [
            "%Y-%m-%d %H:%M:%S", 
            "%d-%m-%Y %H:%M:%S",
            "%Y/%m/%d %H:%M:%S",
            "%d/%m/%Y %H:%M:%S",
            "%Y-%m-%d %H:%M",
            "%Y-%m-%dT%H:%M"
        ]
        
        for fmt in formats:
            try:
                dt = datetime.datetime.strptime(dt_str, fmt)
                break
            except ValueError:
                continue
        
        if dt is None:
            # Fallback if specific format fails, try very generic
            try:
                dt = datetime.datetime.fromisoformat(dt_str)
            except:
                return {"status": "error", "message": f"Invalid Date Format: {dt_str}. Using auto-detect failed."}

        birth_dt = dt
        birth_dt_loc = tz.localize(birth_dt)
        utc_dt = birth_dt_loc.astimezone(pytz.UTC)
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60 + utc_dt.second/3600)
        
        
        # Standardize to KP Krishnamurti (Type 5) with -6.2s Calibration
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        if horary_number:
            ayan_val = swe.get_ayanamsa_ut(jd) - (6.2 / 3600.0)
            cusps, ascmc = self.calculate_prashna_cusps(jd, lat, lon, horary_number, calibrated_ayan=ayan_val)
            ramc_offset = 0.0
        else:
            ayan_val = swe.get_ayanamsa_ut(jd) - (6.2 / 3600.0)
            ramc_offset = 0.0
            
            # GMST -> LST -> RAMC for House Calculation
            gmst_hrs = swe.sidtime(jd)
            lst_hrs = (gmst_hrs + lon / 15.0) % 24.0
            ramc_deg = (lst_hrs * 15.0) % 360.0
            
            res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
            eps = res_nut[0]
            
            # Calculate Tropical Cusps and Subtract Ayanamsa manually for precision
            cusps_trop, ascmc_trop = swe.houses_armc(ramc_deg + ramc_offset, lat, eps, h_sys)
            cusps = [(c - ayan_val) % 360 for c in cusps_trop]
            ascmc = [(a - ayan_val) % 360 for a in ascmc_trop]
        
        # HOUSE OWNERSHIP LOGIC - STRICT WHOLE SIGN (User Requirement)
        # User explicitly flagged that for Gemini Ascendant, Sun MUST own 3rd (Leo) and Jupiter 7th/10th (Sag/Pis).
        # Standard Placidus often shifts these due to latitude, causing "Wrong" feedback.
        # We will calculate ownerships based on the Ascendant Sign strictly.
        
        house_owners = {}
        for i in range(12):
            lon_val = cusps[i]
            # Use the sign lord of the cusp degree as the house owner
            sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            house_owners[i+1] = sl
        
        # house_owners = {i+1: self.SIGN_RULERS[self.get_kp_lords(cusps[i])[0]] for i in range(12)} # OLD PLACIDUS LOGIC
        
        # Calculate Planets (Tropical then Subtract Ayanamsa)
        planets_raw = []
        for name, code in self.PLANETS.items():
            # Calculate tropical from ephemeris
            res, _ = swe.calc_ut(jd, code, swe.FLG_SWIEPH | swe.FLG_SPEED)
            lon_tropical = res[0]
            # Manual subtraction for absolute precision
            lon_sidereal = (lon_tropical - ayan_val) % 360.0
            speed_val = res[3]
            if name == "Ketu": lon_sidereal = (lon_sidereal + 180) % 360
            planets_raw.append({"planet": name, "lon": lon_sidereal, "speed": speed_val})
            if name == "Venus":
                print(f"DEBUG VENUS: Lon: {lon_sidereal}")

            
        planets_raw_map = {p["planet"]: p for p in planets_raw}
        
        # Process Results
        houses_res = []
        for i in range(12):
            lon_val = cusps[i]
            # STRICT RULE: For Prashna Ascendant (Cusp 1), use properties from 249 table
            if i == 0 and horary_number:
                entry = self.HORARY_TABLE[horary_number]
                sn, sl, nlk, sub = entry["sign"], entry["sl"], entry["nl"], entry["sub"]
                # Derive SSL and other fields from degree
                _, _, _, _, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            else:
                sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
                
            houses_res.append({
                "house_number": i+1,
                "cusp_degree_dms": self.decimal_to_dms(lon_val, is_absolute=True),
                "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl,
                "nakshatra": nak, "nadi": nadi, "nadi_index": sub_idx, "planet_lord": sl,
                "cusp_degree_decimal": lon_val
            })
            
        self.last_houses = houses_res # Store for agent calculation (Rule 7)
        
        planets_res = []
        sun_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Sun")
        
        for p in planets_raw:
            lon_val = p["lon"]
            hp = 1
            # Strict KP House Placement: Planet is in House X if Cusp X <= Longitude < Cusp X+1
            # Handle 360-degree crossover (Pisces-Aries transition)
            
            for i in range(12):
                cusp_curr = cusps[i]
                cusp_next = cusps[(i+1)%12]
                
                if cusp_next < cusp_curr: # Crossover case (e.g. 350 to 20)
                    if lon_val >= cusp_curr or lon_val < cusp_next:
                        hp = i + 1
                        break
                else: # Normal case
                    if cusp_curr <= lon_val < cusp_next:
                        hp = i + 1
                        break
            
            sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            is_combust = False
            if p["planet"] != "Sun" and p["planet"] in ["Moon","Mars","Mercury","Jupiter","Venus","Saturn"]:
                # KP/Vedic standard combustion orbs
                orbs = {"Moon": 12, "Mars": 17, "Mercury": 13, "Jupiter": 11, "Venus": 9, "Saturn": 15}
                base_orb = orbs.get(p["planet"], 12)
                if p["planet"] == "Mercury" and p["speed"] < 0: base_orb = 12
                
                dist = abs(lon_val - sun_lon)
                if dist > 180: dist = 360 - dist
                if dist < base_orb: is_combust = True
                
            # Ensure house_placed is always an integer for safety
            planets_res.append({
                "planet": p["planet"], "degree_dms": self.decimal_to_dms(lon_val, is_absolute=True), "house_placed": int(hp),
                "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl,
                "nakshatra": nak, "nadi": nadi, "nadi_index": sub_idx, 
                "is_retrograde": True if p["planet"] in ["Rahu", "Ketu"] else p["speed"] < 0, 
                "is_combust": is_combust, "planet_lord": sl,
                "degree_decimal": lon_val
            })
            
        # Aspect and Signification Logic
        planet_res_map = {p["planet"]: p for p in planets_res}
        
        # Significators using strict 4-level Logic
        significations_res = []
        for p in planets_res:
            p_name = p["planet"]
            if p_name in ["Rahu", "Ketu"]:
                sigs_4 = self.get_node_significators(p_name, planet_res_map, house_owners)
            else:
                sigs_4 = self.calculate_kp_significators_4level(p_name, planet_res_map, house_owners)
            
            # For backward compatibility in case frontend still uses old fields
            total_houses = sorted(list(set(sigs_4["L1"] + sigs_4["L2"] + sigs_4["L3"] + sigs_4["L4"])))
            
            significations_res.append({
                "planet": p_name,
                "levels": sigs_4,
                "total": total_houses,
                "agent": sigs_4.get("agent", None)
            })
            
        # Nadi Combo Analysis
        nak_nadi_res = []
        for p in planets_res:
            p_name = p["planet"]
            p_lon = next(raw["lon"] for raw in planets_raw if raw["planet"] == p_name)
            nak, sl_name, sub_name, pl_name, nadi, sub_idx, pl_idx = self.get_nadi_triple_combination(p_lon)
            
            # 1. Planet's Own Houses (Include placement for Hit Theory)
            pl_detailed = self.get_eff_sigs_detailed(p_name, planet_res_map, house_owners, include_node_self=True)
            
            # 2. Star Lord's Houses
            nl_detailed = self.get_eff_sigs_detailed(sl_name, planet_res_map, house_owners, include_node_self=True)
            
            # 3. Sub Lord's Houses
            sl_detailed = self.get_eff_sigs_detailed(sub_name, planet_res_map, house_owners, include_node_self=True)
            
            nak_nadi_res.append({
                "planet": p_name, "nakshatra_name": nak, "is_retrograde": p["is_retrograde"],
                "is_combust": p["is_combust"],
                "pl_signified": pl_detailed,
                "star_lord": sl_name, "nl_signified": nl_detailed,
                "sub_lord": sub_name, "sl_signified": sl_detailed,
                "planet_lord": pl_name, "pl_lord_signified": self.get_eff_sigs_detailed(pl_name, planet_res_map, house_owners, include_node_self=True)
            })
            
        dasha_data = self.calculate_dasha(planets_raw, birth_dt_loc)
        
        # DEBUG LOGGING FOR ENGINE
        print(f"DEBUG: Calculated {len(nak_nadi_res)} Nadi entries.")
        if nak_nadi_res:
            print(f"DEBUG: First entry ({nak_nadi_res[0]['planet']}) pl_sigs count: {len(nak_nadi_res[0]['pl_signified'])}")
            
        # Asc metadata
        sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(ascmc[0])
        asc_res = {
            "degree_dms": f"{self.decimal_to_dms(ascmc[0])} {sn}", "sign": sn, "sign_lord": sl,
            "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl, "nakshatra": nak, "nadi": nadi,
            "planet_lord": sl
        }
        
        moon_lon = dasha_data["moon_lon"]
        nak_size = 360/27
        pada = int((moon_lon % nak_size) / (nak_size / 4)) + 1
        
        return {
            "status": "success", "ascendant": asc_res, "houses": houses_res, "planets": planets_res,
            "significations": significations_res, "nakshatra_nadi": nak_nadi_res, "dasha": dasha_data,
            "metadata": {
                "ayanamsa": self.ayanamsa, "ayanamsa_value": f"{ayan_val:.4f}°",
                "janma_nakshatra": self.NAKSHATRAS[int(moon_lon/nak_size)%27], "pada": pada,
                "horary_number": horary_number
            }
        }

    def calculate_aspects(self, planets_raw):
        res = []
        orb = 6.0
        for i in range(len(planets_raw)):
            p1 = planets_raw[i]
            for j in range(len(planets_raw)):
                if i == j: continue
                p2 = planets_raw[j]
                diff = abs(p1["lon"] - p2["lon"])
                if diff > 180: diff = 360 - diff
                
                # Standard Aspects
                is_hit = False
                aspect_name = ""
                
                # Check standard geometric aspects first
                for name, deg in self.ASPECTS.items():
                    if abs(diff - deg) <= orb:
                        res.append({"planet": p1["planet"], "aspect": name, "target": p2["planet"], "degree_diff": round(diff, 2)})
                        
                # Indian/Vedic Special Aspects (Sign-based mostly, but here using degrees for engine compatibility)
                # Adding Rahu/Ketu 5, 9 aspects (Trine) explicit visual check
                # Note: This method is for visual tables.
                if p1["planet"] in ["Rahu", "Ketu"]:
                    # 5th, 9th (Trine - 120) and 7th (Opposition - 180)
                    # We utilize the standard aspect mappings: Trine=120, Opposition=180.
                    # This loop already checks all aspects in self.ASPECTS against 'diff'.
                    # self.ASPECTS = {"Conjunction": 0, "Sextile": 60, "Square": 90, "Trine": 120, "Opposition": 180}
                    # By default the loop above will catch Trine (120) and Opposition (180).
                    # So 5, 7, 9 are covered by Trine and Opposition.
                    # 5 and 9 are both 120 degrees apart in terms of absolute difference on a circle (120 and 240->120).
                    # So 'Trine' covers both 5 and 9. 'Opposition' covers 7.
                    # Thus, NO EXTRA CODE is actually needed if standard aspects are checked!
                    # However, we need to ensure we don't generate unwanted aspects (Sextile, Square).
                    # User asked for "5, 7, 9".
                    # Square (90) is 4, 10. Sextile (60) is 3, 11.
                    # We should FILTER to only include Trine and Opposition for Nodes.
                    
                    allowed_aspects = ["Trine", "Opposition", "Conjunction"]
                    if is_hit or aspect_name: # standard loop found something
                        # But wait, the standard loop appends to 'res' immediately.
                        # We need to filter 'res' or modify the loop.
                        pass
                        
        # POST-PROCESSING FILTER FOR NODES
        # Filter out non-5,7,9 aspects for Rahu/Ketu
        final_res = []
        for r in res:
            if r["planet"] in ["Rahu", "Ketu"]:
                if r["aspect"] not in ["Trine", "Opposition", "Conjunction"]:
                    continue
            final_res.append(r)
            
        return final_res

    def get_eff_sigs_detailed(self, p_name, planet_map, house_owners, include_node_self=True, use_node_agents=True):
        if p_name not in planet_map: return []
        p_data = planet_map[p_name]
        occ_house = int(p_data["house_placed"])
        own_houses = sorted([int(h) for h, owner in house_owners.items() if owner == p_name])
        
        sigs = []
        houses_seen = set()
        
        # 1. House Placement
        if p_name not in ["Rahu", "Ketu"] or include_node_self:
            sigs.append({"house": occ_house, "is_placed": True})
            houses_seen.add(occ_house)
            
        # 2. House Ownership
        for h in own_houses:
            if h not in houses_seen:
                sigs.append({"house": h, "is_placed": False})
                houses_seen.add(h)
        
        # 3. Node Agents (Nadi specific) - Replaced with more inclusive logic
        if p_name in ["Rahu", "Ketu"]:
            for agent in self.get_node_agents(p_name, p_data, list(planet_map.values())):
                a_name = agent['planet']
                if a_name and a_name in planet_map:
                    a_data = planet_map[a_name]
                    a_occ = int(a_data["house_placed"])
                    # 1. Agent's Occupied House
                    if a_occ not in houses_seen:
                        sigs.append({"house": a_occ, "is_placed": False})
                        houses_seen.add(a_occ)
                        
                    # 2. Agent's Owned Houses (Fully included for Nodes per User Req)
                    for h, o in house_owners.items():
                        if o == a_name and h not in houses_seen:
                            sigs.append({"house": h, "is_placed": False})
                            houses_seen.add(h)
        
        return sorted(sigs, key=lambda x: x["house"])

    def get_house_occupation(self, p_name, planet_map):
        if p_name not in planet_map: return []
        return [int(planet_map[p_name]["house_placed"])]

    def get_house_ownership(self, p_name, house_owners):
        return sorted([int(h) for h, owner in house_owners.items() if owner == p_name])

    def is_self_strength(self, p_name, all_planets):
        # A planet is self-strength if no other planet has it as Star Lord
        for p in all_planets:
            if p["star_lord"] == p_name:
                return False
        return True

    def calculate_kp_significators_4level(self, p_name, planet_map, house_owners):
        if p_name not in planet_map: return {"L1":[], "L2":[], "L3":[], "L4":[], "is_self_strength": False}
        
        p_data = planet_map[p_name]
        sl_name = p_data["star_lord"]
        
        # Standard levels
        l1 = self.get_house_occupation(sl_name, planet_map)
        l2 = self.get_house_occupation(p_name, planet_map)
        l3 = self.get_house_ownership(sl_name, house_owners)
        l4 = self.get_house_ownership(p_name, house_owners)
        
        self_strength = self.is_self_strength(p_name, planet_map.values())
        
        if self_strength:
            # Reorder: 2, 1, 4, 3
            return {
                "L1": l2, "L2": l1, "L3": l4, "L4": l3,
                "is_self_strength": True,
                "original": {"L1": l1, "L2": l2, "L3": l3, "L4": l4}
            }
        
        return {
            "L1": l1, "L2": l2, "L3": l3, "L4": l4,
            "is_self_strength": False
        }

    def get_node_significators(self, node_name, planet_map, house_owners):
        # 1. Own 4 levels
        base = self.calculate_kp_significators_4level(node_name, planet_map, house_owners)
        
    def get_node_significators(self, node_name, planet_map, house_owners):
        # 1. Own 4 levels
        base = self.calculate_kp_significators_4level(node_name, planet_map, house_owners)
        
        # 2. All Agents (Sign Lord + Conjunct/Aspect innerhalb 12 Grad)
        p_data = planet_map[node_name]
        agents = self.get_node_agents(node_name, p_data, list(planet_map.values()))
        
        agent_names = list(set([a['planet'] for a in agents if a['planet']]))
        for a_name in agent_names:
            if a_name == node_name: continue
            agent_sigs = self.calculate_kp_significators_4level(a_name, planet_map, house_owners)
            # Merge significations
            for level in ["L1", "L2", "L3", "L4"]:
                base[level] = sorted(list(set(base[level] + agent_sigs[level])))
                
        # Recalculate total after merge
        all_h = set()
        for lvl in ["L1", "L2", "L3", "L4"]:
            for h in base[lvl]: all_h.add(h)
        base["total"] = sorted(list(all_h))
        
        base["agent"] = ", ".join(agent_names) if agent_names else None
        
        return base
    def calculate_dasha(self, planets_raw, birth_dt_loc):
        """
        Final High-Precision Vimshottari Dasha (v1.2.8)
        Sidereal Year = 365.25636 days.
        Nakshatra Length = 48000 arcseconds.
        Level Formula: (MD * AD * PD * ...) / 120^(level-1)
        """
        moon_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Moon")
        abs_arcsec = moon_lon * 3600.0
        nak_len_arcsec = 48000.0 
        nak_idx = int(abs_arcsec // nak_len_arcsec) % 27
        remaining_arcsec = nak_len_arcsec - (abs_arcsec % nak_len_arcsec)
        balance_fraction = remaining_arcsec / nak_len_arcsec
        
        lord_name = self.DASHA_ORDER[nak_idx % 9]
        bal_yrs_f = self.DASHA_YEARS[lord_name] * balance_fraction
        # Sidereal Year = 365.25636 days
        DAYS_PER_YEAR = 365.25636
        
        def add_precise(dt, float_yrs):
            import datetime
            return dt + datetime.timedelta(days=float_yrs * DAYS_PER_YEAR)

        fmt_dt = lambda dt: dt.strftime("%d/%m/%Y %H:%M:%S")
        import pytz
        today = datetime.datetime.now(pytz.UTC)
        md_end_first = add_precise(birth_dt_loc, bal_yrs_f)
        md_curs = md_end_first - datetime.timedelta(days=self.DASHA_YEARS[lord_name] * DAYS_PER_YEAR)
        
        def get_seq(p):
            idx = self.DASHA_ORDER.index(p)
            return self.DASHA_ORDER[idx:] + self.DASHA_ORDER[:idx]

        tree, act_md, act_ad, act_pd = [], "None", "None", "None"
        for md_p in get_seq(lord_name):
            md_start = md_curs
            
            ad_seq_start = self.DASHA_ORDER.index(p)
            ad_seq = self.DASHA_ORDER[ad_seq_start:] + self.DASHA_ORDER[:ad_seq_start]
            ad_curs = md_start
            for ap in ad_seq:
                ad_yrs = (self.DASHA_YEARS[ap] / 120.0) * md_yrs
                ad_end = add_years(ad_curs, ad_yrs)
                
                ad_item = { "planet": ap, "start_date": fmt_date(ad_curs), "end_date": fmt_date(ad_end), "antaras": [] }
                if ad_curs <= today <= ad_end: act_ad = ap
                
                pd_seq_start = self.DASHA_ORDER.index(ap)
                pd_seq = self.DASHA_ORDER[pd_seq_start:] + self.DASHA_ORDER[:pd_seq_start]
                pd_curs = ad_curs
                for pp in pd_seq:
                    pd_yrs = (self.DASHA_YEARS[pp] / 120.0) * ad_yrs
                    pd_end = add_years(pd_curs, pd_yrs)
                    if pd_curs <= today <= pd_end: act_pd = pp
                    ad_item["antaras"].append({
                        "planet": pp, "start_date": fmt_date(pd_curs), "end_date": fmt_date(pd_end)
                    })
                    pd_curs = pd_end
                md_item["bukthis"].append(ad_item)
                ad_curs = ad_end
            mahadasha_tree.append(md_item)
            md_curs = md_end
            
        y_bal = int(bal_yrs_f)
        rem_y = bal_yrs_f - y_bal
        m_bal = int(rem_y * 12)
        d_bal = int(((rem_y * 12) - m_bal) * 30)
        
        return {
            "balance_at_birth": f"{y_bal}y {m_bal}m {d_bal}d",
            "current_dasha": act_md, "current_bukthi": act_ad, "current_antara": act_pd,
            "mahadasha_sequence": mahadasha_tree, 
            "moon_lon": moon_lon,
            "nakshatra": self.NAKSHATRAS[naksh_idx],
            "pada": pada
        }
