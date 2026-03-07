
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
        val = degree if is_absolute else (degree % 30)
        d = int(val)
        m = int((val - d) * 60)
        s = round((val - d - m/60)*3600)
        if s >= 60:
            s -= 60
            m += 1
        if m >= 60:
            m -= 60
            d += 1
        return f"{d:02}°{m:02}'{int(s):02}\""

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
        degree = float(degree % 360.0)
        if degree < 1e-10 or degree > 359.999999999: degree = 0.0
        
        sign_idx = int(degree / 30.0) % 12
        sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        sign_lord = self.SIGN_RULERS[sign_names[sign_idx]]
        
        nak_size = 360.0 / 27.0
        nak_idx = int(degree / nak_size) % 27
        star_lord = self.DASHA_ORDER[nak_idx % 9]
        
        rem_in_nak = degree - (nak_idx * nak_size)
        sub_lord = star_lord
        sub_idx_in_nak = 1
        current_off = 0.0
        sub_seq = self.DASHA_ORDER[nak_idx % 9:] + self.DASHA_ORDER[:nak_idx % 9]
        
        ssl_lord = sub_lord 
        rem_in_sub = 0.0
        sub_arc = 0.0
        
        for i, lord in enumerate(sub_seq):
            arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
            if current_off <= rem_in_nak < (current_off + arc + 1e-10):
                sub_lord = lord
                sub_arc = arc
                sub_idx_in_nak = i + 1
                rem_in_sub = rem_in_nak - current_off
                break
            current_off += arc
            
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
        agents = []
        node_sign = node_data['sign']
        node_lon = node_data['degree_decimal']
        
        agents.append({'type': 'Sign Lord', 'planet': node_data.get('sign_lord')})
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        node_sign_idx = signs.index(node_sign)
        
        for p in all_planets:
            p_name = p['planet']
            if p_name in [node_name, "Rahu", "Ketu"]: continue
            
            p_lon = p['degree_decimal']
            dist = abs(node_lon - p_lon)
            if dist > 180: dist = 360 - dist
                
            if p['sign'] == node_sign and dist <= 12.0:
                agents.append({'type': 'Conjunction', 'planet': p_name})
                    
            p_sign_idx = signs.index(p['sign'])
            diff = (node_sign_idx - p_sign_idx + 12) % 12 + 1
            
            is_aspecting = False
            if diff == 7 and dist >= 168: is_aspecting = True
            elif p_name == "Mars" and diff in [4, 8] and (abs(dist-90)<=12 or abs(dist-210)<=12): is_aspecting = True
            elif p_name == "Jupiter" and diff in [5, 9] and (abs(dist-120)<=12 or abs(dist-240)<=12): is_aspecting = True
            elif p_name == "Saturn" and diff in [3, 10] and (abs(dist-60)<=12 or abs(dist-270)<=12): is_aspecting = True
            
            if is_aspecting:
                agents.append({'type': 'Aspect', 'planet': p_name})
                
        return agents

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
            ayan_val = swe.get_ayanamsa_ut(jd) + (1600.0 / 3600.0)
            cusps, ascmc = self.calculate_prashna_cusps(jd, lat, lon, horary_number, calibrated_ayan=ayan_val)
        else:
            if self.ayanamsa == "Lahiri":
                swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
            else:
                swe.set_sid_mode(swe.SIDM_KRISHNAMURTI_VP291, 0, 0)
            ayan_val = swe.get_ayanamsa_ut(jd)
            # Re-implement tropical-to-sidereal manual subtraction to avoid SwissEph sidereal flag issues
            cusps_trop, ascmc_trop = swe.houses_ex(jd, lat, lon, h_sys, 0) # Tropical
            cusps = [(c - ayan_val) % 360 for c in cusps_trop]
            ascmc = [(a - ayan_val) % 360 for a in ascmc_trop]

        house_owners = {}
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        asc_sn, _, _, _, _, _, _, _ = self.get_kp_lords(cusps[0])
        asc_idx = signs.index(asc_sn)
        for i in range(12):
            curr_sign = signs[(asc_idx + i) % 12]
            house_owners[i+1] = self.SIGN_RULERS[curr_sign]
        
        planets_raw = []
        for name, code in self.PLANETS.items():
            # Use Tropical then subtract ayanamsa for consistency
            res, _ = swe.calc_ut(jd, code, swe.FLG_SWIEPH | swe.FLG_SPEED)
            lon_tropical = res[0]
            lon_val = (lon_tropical - ayan_val) % 360
            speed_val = res[3]
            if name == "Ketu": lon_val = (lon_val + 180) % 360
            planets_raw.append({"planet": name, "lon": lon_val, "speed": speed_val})
            
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
                "house_number": i+1, "cusp_degree_dms": self.decimal_to_dms(lon_val, is_absolute=horary_number is not None),
                "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl,
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
                "planet": p["planet"], "degree_dms": f"{self.decimal_to_dms(lon_val)} {sn}", "house_placed": int(hp),
                "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl,
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
                "planet_lord": pl_name
            })
            
        dasha_data = self.calculate_dasha(planets_raw, birth_dt_loc)
        sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(ascmc[0])
        asc_res = {"degree_dms": f"{self.decimal_to_dms(ascmc[0])} {sn}", "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl, "nakshatra": nak, "nadi": nadi, "planet_lord": sl}
        moon_lon = dasha_data["moon_lon"]
        nak_size = 360/27
        return {
            "status": "success", "ascendant": asc_res, "houses": houses_res, "planets": planets_res,
            "significations": significations_res, "nakshatra_nadi": nak_nadi_res, "dasha": dasha_data,
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
                sigs.append({"house": h, "is_placed": False}); houses_seen.add(h)
        if p_name in ["Rahu", "Ketu"]:
            for agent in self.get_node_agents(p_name, p_data, list(planet_map.values())):
                a_name = agent['planet']
                if a_name and a_name in planet_map:
                    a_data = planet_map[a_name]
                    if int(a_data["house_placed"]) not in houses_seen:
                        sigs.append({"house": int(a_data["house_placed"]), "is_placed": False}); houses_seen.add(int(a_data["house_placed"]))
                    for h, o in house_owners.items():
                        if o == a_name and h not in houses_seen: sigs.append({"house": h, "is_placed": False}); houses_seen.add(h)
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
        base = self.calculate_kp_significators_4level(node_name, planet_map, house_owners)
        for agent in self.get_node_agents(node_name, planet_map[node_name], list(planet_map.values())):
            a_name = agent['planet']
            if a_name and a_name in planet_map:
                a_sigs = self.calculate_kp_significators_4level(a_name, planet_map, house_owners)
                for level in ["L1", "L2", "L3", "L4"]: base[level] = sorted(list(set(base[level] + a_sigs[level])))
        return base

    def calculate_dasha(self, planets_raw, birth_dt_loc):
        moon_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Moon")
        nak_size = 360.0 / 27.0
        naksh_idx = int(moon_lon / nak_size) % 27
        deg_in_nak = moon_lon % nak_size
        remaining_fraction = 1.0 - (deg_in_nak / nak_size)
        lord_name = self.DASHA_ORDER[naksh_idx % 9]
        bal_yrs_f = self.DASHA_YEARS[lord_name] * remaining_fraction
        
        def add_period(dt, float_yrs):
            """Add a fractional year period using y/m/d decomposition."""
            y = int(float_yrs)
            m_f = (float_yrs - y) * 12
            m = int(m_f)
            d = int((m_f - m) * 30.436875)
            return dt + relativedelta(years=y, months=m, days=d)

        fmt_date = lambda dt: dt.isoformat()[:10]
        today = datetime.datetime.now(pytz.UTC)
        # Balance: exact days from birth to end of first dasha
        md_end_first = add_period(birth_dt_loc, bal_yrs_f)
        # Start of the current nakshatra lord's dasha period (before birth)
        md_curs = add_period(birth_dt_loc, bal_yrs_f - self.DASHA_YEARS[lord_name])
        
        # Helper to get sequence from a start planet
        def get_seq(p):
            idx = self.DASHA_ORDER.index(p)
            return self.DASHA_ORDER[idx:] + self.DASHA_ORDER[:idx]

        tree, act_md, act_ad, act_pd, act_sd, act_pr = [], "None", "None", "None", "None", "None"
        
        # Dasha (D) - compute bukthis for ALL mahadasha periods
        for d_p in get_seq(lord_name):
            md_start = md_curs
            md_end = md_start + relativedelta(years=self.DASHA_YEARS[d_p])
            md_item = {"planet": d_p, "label": "D", "start_date": fmt_date(md_start), "end_date": fmt_date(md_end), "bukthis": []}
            
            is_current_md = md_start <= today <= md_end
            if is_current_md:
                act_md = d_p
            
            # Bukthi (B) - compute for ALL mahadasha rows
            ad_curs = md_start
            for b_p in get_seq(d_p):
                ad_yrs_f = (self.DASHA_YEARS[b_p] / 120.0) * self.DASHA_YEARS[d_p]
                ad_end = add_period(ad_curs, ad_yrs_f)
                ad_item = {"planet": b_p, "label": "B", "start_date": fmt_date(ad_curs), "end_date": fmt_date(ad_end), "antaras": []}
                
                is_current_ad = is_current_md and (ad_curs <= today <= ad_end)
                if is_current_ad:
                    act_ad = b_p
                
                # Antara (A) - compute for ALL bukthi rows
                pd_curs = ad_curs
                for a_p in get_seq(b_p):
                    pd_yrs_f = (self.DASHA_YEARS[a_p] / 120.0) * ad_yrs_f
                    pd_end = add_period(pd_curs, pd_yrs_f)
                    pd_item = {"planet": a_p, "label": "A", "start_date": fmt_date(pd_curs), "end_date": fmt_date(pd_end), "pratyantars": []}
                    
                    is_current_pd = is_current_ad and (pd_curs <= today <= pd_end)
                    if is_current_pd:
                        act_pd = a_p
                    
                    # Pratyantar (P) - compute for ALL antara rows
                    sd_curs = pd_curs
                    for p_p in get_seq(a_p):
                        sd_yrs_f = (self.DASHA_YEARS[p_p] / 120.0) * pd_yrs_f
                        sd_end = add_period(sd_curs, sd_yrs_f)
                        sd_item = {"planet": p_p, "label": "P", "start_date": fmt_date(sd_curs), "end_date": fmt_date(sd_end), "sookshmas": []}
                        
                        is_current_sd = is_current_pd and (sd_curs <= today <= sd_end)
                        if is_current_sd:
                            act_sd = p_p
                            # Sookshma (S) - Prana - only compute for current pratyantar
                            pr_curs = sd_curs
                            for s_p in get_seq(p_p):
                                pr_yrs_f = (self.DASHA_YEARS[s_p] / 120.0) * sd_yrs_f
                                pr_end = add_period(pr_curs, pr_yrs_f)
                                if pr_curs <= today <= pr_end: act_pr = s_p
                                sd_item["sookshmas"].append({"planet": s_p, "label": "S", "start_date": fmt_date(pr_curs), "end_date": fmt_date(pr_end)})
                                pr_curs = pr_end
                        
                        pd_item["pratyantars"].append(sd_item)
                        sd_curs = sd_end
                    
                    ad_item["antaras"].append(pd_item)
                    pd_curs = pd_end
                
                md_item["bukthis"].append(ad_item)
                ad_curs = ad_end
            
            tree.append(md_item)
            md_curs = md_end
            
        y_bal = int(bal_yrs_f)
        rem_y = bal_yrs_f - y_bal
        m_bal = int(rem_y * 12)
        d_bal = int(((rem_y * 12) - m_bal) * 30)
        
        return {
            "balance_at_birth": f"{y_bal}y {m_bal}m {d_bal}d", 
            "current_dasha": act_md, "current_bukthi": act_ad, "current_antara": act_pd,
            "current_pratyantar": act_sd, "current_sookshma": act_pr,
            "mahadasha_sequence": tree, "moon_lon": moon_lon, "nakshatra": self.NAKSHATRAS[naksh_idx], "pada": int((deg_in_nak / (nak_size / 4)) + 1)
        }
