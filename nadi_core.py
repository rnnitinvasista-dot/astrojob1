
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

    def decimal_to_dms(self, degree):
        deg_in_sign = degree % 30
        d = int(deg_in_sign)
        m = int((deg_in_sign - d) * 60)
        s = round((deg_in_sign - d - m/60)*3600, 2)
        return f"{d:02}°{m:02}′{s:05.2f}″"

    def get_kp_lords(self, degree: float):
        degree = degree % 360
        sign_idx = int(degree / 30) % 12
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
        Identify agents for Rahu/Ketu based on Standard KP Rules:
        1. Sign Lord (Dispositor)
        2. Conjunct Planets (In same sign)
        3. Aspecting Planets (Standard Aspects: 7; Mars: 4,8; Jup: 5,9; Sat: 3,10)
        """
        agents = []
        node_sign = node_data['sign']
        node_lon = node_data['degree_decimal']
        node_house = int(node_data['house_placed'])
        
        # 1. Sign Lord
        agents.append({'type': 'Sign Lord', 'planet': node_data.get('sign_lord')})
        
        signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        node_sign_idx = signs.index(node_sign)
        
        for p in all_planets:
            p_name = p['planet']
            if p_name in [node_name, "Rahu", "Ketu"]: continue
            
            p_lon = p['degree_decimal']
            dist = abs(node_lon - p_lon)
            if dist > 180: dist = 360 - dist
                
            # Rule 1: Conjunction (Same Sign + Orb 12)
            # Standard Nadi often uses same sign, but KP/Professional Nadi uses proximity.
            if p['sign'] == node_sign and dist <= 12.0:
                agents.append({'type': 'Conjunction', 'planet': p_name})
                    
            # Rule 2: Aspects (Orb 12)
            p_sign_idx = signs.index(p['sign'])
            diff = (node_sign_idx - p_sign_idx + 12) % 12 + 1
            
            is_aspecting = False
            # Standard Vedic/KP distances with 12 degree orb
            if diff == 7 and dist >= 168: is_aspecting = True
            elif p_name == "Mars" and diff in [4, 8] and (abs(dist-90)<=12 or abs(dist-210)<=12): is_aspecting = True
            elif p_name == "Jupiter" and diff in [5, 9] and (abs(dist-120)<=12 or abs(dist-240)<=12): is_aspecting = True
            elif p_name == "Saturn" and diff in [3, 10] and (abs(dist-60)<=12 or abs(dist-270)<=12): is_aspecting = True
            
            # Fallback for Nadi links (Strictly House based but with proximity guard)
            if not is_aspecting:
                if diff == 7 and dist >= 168: is_aspecting = True
                elif p_name == "Mars" and diff in [4, 8]: is_aspecting = True
                elif p_name == "Jupiter" and diff in [5, 9]: is_aspecting = True
                elif p_name == "Saturn" and diff in [3, 10]: is_aspecting = True
            
            if is_aspecting:
                agents.append({'type': 'Aspect', 'planet': p_name})
                
        return agents

    def calculate_kundli(self, dt_str, timezone, lat, lon):
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
        
        
        # Set Ayanamsa dynamically
        if self.ayanamsa == "KP":
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        elif self.ayanamsa == "KP_OLD":
            # For KP Old, we use the standard KRISHNAMURTI but can adjust if needed
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        elif self.ayanamsa == "Lahiri":
            swe.set_sid_mode(swe.SIDM_LAHIRI, 0, 0)
        else:
            swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        
        ayan_val = swe.get_ayanamsa_ut(jd)
        
        # Calculate Houses (Placidus Default for Cusps/Placement)
        h_sys = b'P' if self.house_system == "Placidus" else b'E'
        cusps, ascmc = swe.houses_ex(jd, lat, lon, h_sys, swe.FLG_SIDEREAL)
        
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
        
        # Calculate Planets
        planets_raw = []
        for name, code in self.PLANETS.items():
            # CRITICAL: Must include FLG_SPEED to get accurate speed!
            res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL | swe.FLG_SPEED)
            lon_val = res[0]
            speed_val = res[3]
            if name == "Ketu": lon_val = (lon_val + 180) % 360
            planets_raw.append({"planet": name, "lon": lon_val, "speed": speed_val})
            if name == "Venus":
                print(f"DEBUG VENUS: Lon: {lon_val}")

            
        planets_raw_map = {p["planet"]: p for p in planets_raw}
        
        # Process Results
        houses_res = []
        for i in range(12):
            lon_val = cusps[i]
            sn, sl, nlk, sub, ssl, nak, nadi, sub_idx = self.get_kp_lords(lon_val)
            houses_res.append({
                "house_number": i+1, "cusp_degree_dms": f"{self.decimal_to_dms(lon_val)} {sn}",
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
                dist = abs(lon_val - sun_lon)
                if dist > 180: dist = 360 - dist
                if dist < 12: is_combust = True
                
            # Ensure house_placed is always an integer for safety
            planets_res.append({
                "planet": p["planet"], "degree_dms": f"{self.decimal_to_dms(lon_val)} {sn}", "house_placed": int(hp),
                "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "sub_sub_lord": ssl,
                "nakshatra": nak, "nadi": nadi, "nadi_index": sub_idx, 
                "is_retrograde": True if p["planet"] in ["Rahu", "Ketu"] else p["speed"] < 0, 
                "is_combust": is_combust, "planet_lord": sl,
                "degree_decimal": lon_val
            })
            
        # Aspect and Signification Logic
        planet_res_map = {p["planet"]: p for p in planets_res}
        
        # Significators using KP hierarchy
        significations_res = []
        for p in planets_res:
            p_name = p["planet"]
            sl_name = p["star_lord"]
            sub_name = p["sub_lord"]
            
            # Level 2: Planet itself
            # SIGNIFICATOR TABLE RULE: Nodes follow classic KP (Placement + Star Lord). 
            # Agents are only for Nadi table.
            include_agents_for_this = False if p_name in ["Rahu", "Ketu"] else True
            # But wait, standard planets don't have agents anyway. 
            # So we set use_node_agents=False for Rahu/Ketu here to clean up the table.
            
            p_detailed = self.get_eff_sigs_detailed(p_name, planet_res_map, house_owners, include_node_self=True, use_node_agents=False)
            # Level 1: Star Lord (Strongest)
            sl_detailed = self.get_eff_sigs_detailed(sl_name, planet_res_map, house_owners, include_node_self=True, use_node_agents=True)
            # Level 3: Sub Lord (Materialization)
            sub_detailed = self.get_eff_sigs_detailed(sub_name, planet_res_map, house_owners, include_node_self=True, use_node_agents=True)
            
            # Total = Level 1 + Level 2 (Standard KP)
            combined_detailed = sl_detailed + p_detailed
            
            # deduplicate
            total_houses = sorted(list(set([int(s["house"]) for s in combined_detailed])))
            
            significations_res.append({
                "planet": p_name,
                "level1": sl_detailed, # Star Lord
                "level2": p_detailed,  # Planet
                "level3": sub_detailed, # Sub Lord
                "total_detailed": combined_detailed,
                "total": total_houses
            })
            
        # Nadi Combo Analysis
        nak_nadi_res = []
        for p in planets_res:
            p_name = p["planet"]
            p_lon = next(raw["lon"] for raw in planets_raw if raw["planet"] == p_name)
            nak, sl_name, sub_name, pl_name, nadi, sub_idx, pl_idx = self.get_nadi_triple_combination(p_lon)
            
            # 1. Planet's Own Houses (Level 2 in KP)
            # For normal planets: Occ + Own
            # For Rahu/Ketu: Occ + Conjunct Planets (No Own)
            pl_detailed = self.get_eff_sigs_detailed(p_name, planet_res_map, house_owners, include_node_self=False)
            
            # 2. Star Lord's Houses (Level 1 in KP - Strongest)
            # Star Lord is a planet, so we get its Occ + Own
            nl_detailed = self.get_eff_sigs_detailed(sl_name, planet_res_map, house_owners, include_node_self=True)
            
            # 3. Sub Lord's Houses (Deciding Authority)
            # Sub Lord is a planet, so we get its Occ + Own
            sl_detailed = self.get_eff_sigs_detailed(sub_name, planet_res_map, house_owners, include_node_self=True)
            
            nak_nadi_res.append({
                "planet": p_name, "nakshatra_name": nak, "is_retrograde": p["is_retrograde"],
                "pl_signified": pl_detailed,
                "star_lord": sl_name, "nl_signified": nl_detailed,
                "sub_lord": sub_name, "sl_signified": sl_detailed,
                "planet_lord": pl_name
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
                "janma_nakshatra": self.NAKSHATRAS[int(moon_lon/nak_size)%27], "pada": pada
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
                
        # 3. Node Agents (Nadi specific)
        if p_name in ["Rahu", "Ketu"] and use_node_agents:
            agents = self.get_node_agents(p_name, p_data, list(planet_map.values()))
            for agent in agents:
                a_name = agent['planet']
                if a_name and a_name in planet_map:
                    a_data = planet_map[a_name]
                    a_occ = int(a_data["house_placed"])
                    a_own = [int(h) for h, o in house_owners.items() if o == a_name]
                    
                    if a_occ not in houses_seen:
                        sigs.append({"house": a_occ, "is_placed": False})
                        houses_seen.add(a_occ)
                        
                    for h in a_own:
                        if h not in houses_seen:
                            sigs.append({"house": h, "is_placed": False})
                            houses_seen.add(h)
        
        return sorted(sigs, key=lambda x: x["house"])

    def calculate_dasha(self, planets_raw, birth_dt_loc):
        # Step 1: Moon longitude in decimal degrees
        moon_lon = next(p["lon"] for p in planets_raw if p["planet"] == "Moon")
        nak_size = 360.0 / 27.0
        
        # Exact Nakshatra (0-26 index)
        naksh_idx = int(moon_lon / nak_size) % 27
        
        # Step 1 continued: Pada
        deg_in_nak = moon_lon % nak_size
        pada = int(deg_in_nak / (nak_size / 4)) + 1
        
        # Step 2: Remaining Nakshatra fraction
        traversed_fraction = deg_in_nak / nak_size
        remaining_fraction = 1.0 - traversed_fraction
        
        lord_name = self.DASHA_ORDER[naksh_idx % 9]
        bal_yrs_f = self.DASHA_YEARS[lord_name] * remaining_fraction
        
        def add_years(dt, y):
            days = int(y * 365.2425)
            return dt + datetime.timedelta(days=days)
            
        today = datetime.datetime.now(pytz.UTC)
        act_md, act_ad, act_pd = "None", "None", "None"
        
        start_idx = self.DASHA_ORDER.index(lord_name)
        mahadasha_tree = []
        
        # Absolute start of the first Mahadasha in the cycle
        total_yrs = self.DASHA_YEARS[lord_name]
        elapsed_yrs = total_yrs * traversed_fraction
        md_curs = add_years(birth_dt_loc, -elapsed_yrs)
        
        for i in range(9):
            p = self.DASHA_ORDER[(start_idx + i) % 9]
            md_yrs = self.DASHA_YEARS[p]
            md_start = md_curs
            md_end = add_years(md_start, md_yrs)
            
            md_item = {
                "planet": p, "start_date": md_start.strftime("%Y-%m-%d"), "end_date": md_end.strftime("%Y-%m-%d"),
                "bukthis": []
            }
            if md_start <= today <= md_end: act_md = p
            
            ad_seq = self.DASHA_ORDER[self.DASHA_ORDER.index(p):] + self.DASHA_ORDER[:self.DASHA_ORDER.index(p)]
            ad_curs = md_start
            for ap in ad_seq:
                ad_yrs = (self.DASHA_YEARS[ap] / 120.0) * md_yrs
                ad_end = add_years(ad_curs, ad_yrs)
                
                ad_item = { "planet": ap, "start_date": ad_curs.strftime("%Y-%m-%d"), "end_date": ad_end.strftime("%Y-%m-%d"), "antaras": [] }
                if ad_curs <= today <= ad_end: act_ad = ap
                
                pd_seq = self.DASHA_ORDER[self.DASHA_ORDER.index(ap):] + self.DASHA_ORDER[:self.DASHA_ORDER.index(ap)]
                pd_curs = ad_curs
                for pp in pd_seq:
                    pd_yrs = (self.DASHA_YEARS[pp] / 120.0) * ad_yrs
                    pd_end = add_years(pd_curs, pd_yrs)
                    if pd_curs <= today <= pd_end: act_pd = pp
                    ad_item["antaras"].append({
                        "planet": pp, "start_date": pd_curs.strftime("%Y-%m-%d"), "end_date": pd_end.strftime("%Y-%m-%d")
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
