import swisseph as swe
import datetime
import pytz
import math

class KPMixedPrashnaEngine:
    def __init__(self):
        self.DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        self.DASHA_YEARS = {
            "Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10,
            "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17
        }
        self.SIGN_NAMES = [
            "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ]
        self.SIGN_LORDS = {
            "Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon",
            "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars",
            "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"
        }
        self.NAKSHATRAS = [
            "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
            "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
            "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha",
            "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha",
            "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
            "Uttara Bhadrapada", "Revati"
        ]
        self.PLANETS = {
            "Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY,
            "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN,
            "Rahu": swe.MEAN_NODE, "Ketu": swe.MEAN_NODE
        }
        self.HORARY_249 = self._generate_249_table()

    def _generate_249_table(self):
        """Generates the 249 KP Horary mapping table."""
        table = {}
        nak_size = 360.0 / 27.0  # 13°20'
        num = 1
        
        for n_idx in range(27):
            nak_start = n_idx * nak_size
            star_lord = self.DASHA_ORDER[n_idx % 9]
            
            # Sub sequence starts with the star lord
            start_lord_idx = self.DASHA_ORDER.index(star_lord)
            sub_seq = self.DASHA_ORDER[start_lord_idx:] + self.DASHA_ORDER[:start_lord_idx]
            
            curr_nak_lon = 0.0
            for sub_lord in sub_seq:
                arc = (self.DASHA_YEARS[sub_lord] / 120.0) * nak_size
                seg_start = nak_start + curr_nak_lon
                seg_end = seg_start + arc
                
                sign_idx_s = int(seg_start / 30.0)
                # sign_idx_e logic to handle floating point precision near sign boundaries
                sign_idx_e = int((seg_end - 1e-10) / 30.0)
                
                if sign_idx_s != sign_idx_e:
                    # Split over sign boundary
                    # Part 1 (Aries portion)
                    table[num] = seg_start
                    num += 1
                    # Part 2 (Taurus portion)
                    table[num] = float(sign_idx_e * 30.0)
                    num += 1
                else:
                    table[num] = seg_start
                    num += 1
                    
                curr_nak_lon += arc
                if num > 249: break
            if num > 249: break
        return table

    def decimal_to_dms(self, degree):
        deg = int(degree)
        mnt = int((degree - deg) * 60)
        sec = round((degree - deg - mnt/60) * 3600, 2)
        if sec >= 60:
            sec -= 60
            mnt += 1
        if mnt >= 60:
            mnt -= 60
            deg += 1
        return f"{deg:03}°{mnt:02}'{sec:05.2f}\""

    def get_kp_lords(self, degree):
        # Precise Normalization
        degree = float(degree % 360.0)
        if degree < 1e-10 or degree > 359.99999999: degree = 0.0
        
        sign_idx = int(degree / 30.0) % 12
        sign_name = self.SIGN_NAMES[sign_idx]
        sign_lord = self.SIGN_LORDS[sign_name]
        
        nak_size = 360.0 / 27.0
        nak_idx = int(degree / nak_size)
        star_lord = self.DASHA_ORDER[nak_idx % 9]
        
        # Sub-lord calculation
        rem_in_nak = degree - (nak_idx * nak_size)
        start_lord_idx = self.DASHA_ORDER.index(star_lord)
        sub_seq = self.DASHA_ORDER[start_lord_idx:] + self.DASHA_ORDER[:start_lord_idx]
        
        curr_off = 0.0
        sub_lord = "Unknown"
        for lord in sub_seq:
            arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
            if curr_off <= rem_in_nak < (curr_off + arc + 1e-10):
                sub_lord = lord
                break
            curr_off += arc
            
        return sign_name, sign_lord, star_lord, sub_lord

    def calculate(self, prashna_num, date_str, time_str, lat, lon, tzone, json_format=False):
        # 1. Setup Time
        tz = pytz.timezone(tzone)
        dt = datetime.datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        dt_loc = tz.localize(dt)
        utc_dt = dt_loc.astimezone(pytz.UTC)
        
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, 
                        utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0)
        
        # 2. Set KP Ayanamsa (Krishnamurti)
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        ayan_val = swe.get_ayanamsa_ut(jd)
        
        # 3. Calculate Real-Time Chart (Sidereal)
        # Planets
        planets_data = []
        for p_name, p_code in self.PLANETS.items():
            res, _ = swe.calc_ut(jd, p_code, swe.FLG_SIDEREAL)
            lon_val = res[0]
            if p_name == "Ketu":
                lon_val = (lon_val + 180) % 360
            
            sign, sl, nl, sub = self.get_kp_lords(lon_val)
            planets_data.append({
                "planet": p_name, # Changed 'name' to 'planet' for consistency
                "degree": lon_val,
                "degree_dms": self.decimal_to_dms(lon_val),
                "sign": sign,
                "sign_lord": sl,
                "nakshatra": nl,
                "nakshatra_lord": nl, # Simplification
                "sub_lord": sub
            })
            
        # House Cusps (Placidus)
        cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
        old_asc = ascmc[0]
        
        # 4. Apply Prashna Number Logic
        # REVISED: Using User's Linear Formula
        # Degree = (Number - 1) * (360 / 249)
        new_asc_sid = (prashna_num - 1) * (360.0 / 249.0)
        
        # Iterative Solver to find RAMC for the target Ascendant
        res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
        eps = res[0]
        target_asc_trop = (new_asc_sid + ayan_val) % 360
        
        def get_asc_for_ramc(r):
            _, ascmc = swe.houses_armc(r, lat, eps, b'P')
            return ascmc[0]

        best_ramc = 0.0
        min_diff = 400.0
        for r in range(0, 360, 2):
            curr = get_asc_for_ramc(float(r))
            diff = abs((curr - target_asc_trop + 180) % 360 - 180)
            if diff < min_diff:
                min_diff = diff
                best_ramc = float(r)
                
        # Refine RAMC
        low, high = best_ramc - 2.0, best_ramc + 2.0
        for _ in range(40):
            mid1 = low + (high - low) * 0.4
            mid2 = low + (high - low) * 0.6
            if abs((get_asc_for_ramc(mid1) - target_asc_trop + 180) % 360 - 180) < \
               abs((get_asc_for_ramc(mid2) - target_asc_trop + 180) % 360 - 180):
                high = mid2
            else:
                low = mid1
        phi_ramc = (low + high) / 2
        
        # Generate all 12 cusps for this RAMC
        cusps_trop, ascmc_trop = swe.houses_armc(phi_ramc, lat, eps, b'P')
        new_cusps = [(c - ayan_val) % 360 for c in cusps_trop]
        new_asc = new_asc_sid # Precision guard
        
        if json_format:
            # Build structured JSON response
            houses_list = []
            for i in range(12):
                c_deg = new_cusps[i]
                sn, slord, nlk, subl = self.get_kp_lords(c_deg)
                houses_list.append({
                    "house_number": i + 1,
                    "degree": c_deg,
                    "degree_dms": self.decimal_to_dms(c_deg),
                    "sign": sn,
                    "sign_lord": slord,
                    "nakshatra": nlk,
                    "sub_lord": subl
                })
            
            # Format planets properly for the order requested
            final_planets = []
            ordered_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
            for p_name in ordered_planets:
                p = next(x for x in planets_data if x["planet"] == p_name)
                # Assign to house
                phouse = 1
                for i in range(11):
                    if new_cusps[i] <= p["degree"] < new_cusps[i+1]:
                        phouse = i+1
                        break
                if p["degree"] >= new_cusps[11] or p["degree"] < new_cusps[0]:
                    phouse = 12
                p["house"] = phouse
                final_planets.append(p)

            # Metadata
            sign, sl, nl, sub = self.get_kp_lords(new_asc)
            metadata = {
                "ayanamsa": "KP Krishnamurti",
                "ayanamsa_value": self.decimal_to_dms(ayan_val),
                "janma_nakshatra": nl,
                "pada": 1, # Placeholder
                "horary_number": prashna_num
            }

            return {
                "status": "success",
                "ascendant": {
                    "degree": new_asc,
                    "degree_dms": self.decimal_to_dms(new_asc),
                    "sign": sign,
                    "sign_lord": sl,
                    "nakshatra_lord": nl,
                    "sub_lord": sub
                },
                "houses": houses_list,
                "planets": final_planets,
                "metadata": metadata,
                "significations": [], # Optional
                "nakshatra_nadi": [], # Optional
                "dasha": {
                    "balance_at_birth": "N/A",
                    "current_dasha": "N/A",
                    "current_bukthi": "N/A",
                    "current_antara": "N/A"
                }
            }

        # 5. Format Text Output (Original behavior)
        output = []
        output.append(f"Prashna Number: {prashna_num}")
        output.append(f"Date/Time Used: {date_str} {time_str}")
        output.append(f"Place: {lat}N, {lon}E, {tzone}")
        output.append("")
        
        # Ascendant Details
        sign, sl, nl, sub = self.get_kp_lords(new_asc)
        output.append(f"Ascendant Degree: {self.decimal_to_dms(new_asc)}")
        output.append(f"Ascendant Sign: {sign} ({sl})")
        output.append(f"Ascendant NL: {nl}")
        output.append(f"Ascendant SL: {sub}")
        output.append("")
        
        # Cusps Table
        output.append(f"{'Cusp No':<8} | {'Degree':<15} | {'Sign (Lord)':<18} | {'NL':<10} | {'SL':<10}")
        output.append("-" * 75)
        for i in range(12):
            c_deg = new_cusps[i]
            sn, slord, nlk, subl = self.get_kp_lords(c_deg)
            sign_disp = f"{sn} ({slord})"
            output.append(f"{i+1:<8} | {self.decimal_to_dms(c_deg):<15} | {sign_disp:<18} | {nlk:<10} | {subl:<10}")
        output.append("")
        
        # Planets Table
        output.append(f"{'Planet':<8} | {'Degree':<15} | {'Sign (Lord)':<18} | {'NL':<10} | {'SL':<10}")
        output.append("-" * 75)
        ordered_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        for p_name in ordered_planets:
            p = next(x for x in planets_data if x["planet"] == p_name)
            sign_disp = f"{p['sign']} ({p['sign_lord']})"
            output.append(f"{p_name:<8} | {self.decimal_to_dms(p['degree']):<15} | {sign_disp:<18} | {p['nakshatra']:<10} | {p['sub_lord']:<10}")
            
        return "\n".join(output)

if __name__ == "__main__":
    engine = KPMixedPrashnaEngine()
    
    # Exact Input from User Screenshot
    p_num = 1
    date = "2026-03-04"
    time = "01:58:52"
    lat = 12.9716
    lon = 77.5946
    tz = "Asia/Kolkata"
    
    try:
        result = engine.calculate(p_num, date, time, lat, lon, tz)
        print(result)
    except Exception as e:
        print(f"Error: {e}")
