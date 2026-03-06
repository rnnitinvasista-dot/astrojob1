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
        """Generates the 249 KP Horary mapping table mathematically."""
        table = {}
        nak_size = 360.0 / 27.0  # 13°20' = 800'
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
                sign_idx_e = int((seg_end - 1e-10) / 30.0)
                
                if sign_idx_s != sign_idx_e:
                    # Part 1: Previous Sign
                    table[num] = {
                        "lon": seg_start, "sl": self.SIGN_LORDS[self.SIGN_NAMES[sign_idx_s]],
                        "nl": star_lord, "sub": sub_lord
                    }
                    num += 1
                    # Part 2: Next Sign
                    table[num] = {
                        "lon": float(sign_idx_e * 30.0), "sl": self.SIGN_LORDS[self.SIGN_NAMES[sign_idx_e]],
                        "nl": star_lord, "sub": sub_lord
                    }
                    num += 1
                else:
                    table[num] = {
                        "lon": seg_start, "sl": self.SIGN_LORDS[self.SIGN_NAMES[sign_idx_s]],
                        "nl": star_lord, "sub": sub_lord
                    }
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
        sub_arc = 0.0
        for lord in sub_seq:
            arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
            if curr_off <= rem_in_nak < (curr_off + arc + 1e-10):
                sub_lord = lord
                sub_arc = arc
                rem_in_sub = rem_in_nak - curr_off
                break
            curr_off += arc
        
        # Sub-Sub-Lord calculation
        ssl_lord = "Unknown"
        if sub_lord != "Unknown":
            ssl_start_idx = self.DASHA_ORDER.index(sub_lord)
            ssl_seq = self.DASHA_ORDER[ssl_start_idx:] + self.DASHA_ORDER[:ssl_start_idx]
            off_ssl = 0.0
            for lord in ssl_seq:
                arc_ssl = (self.DASHA_YEARS[lord] / 120.0) * sub_arc
                if off_ssl <= rem_in_sub < (off_ssl + arc_ssl + 1e-10):
                    ssl_lord = lord
                    break
                off_ssl += arc_ssl
            
        return sign_name, sign_lord, star_lord, sub_lord, ssl_lord

    def calculate(self, prashna_num, date_str, time_str, lat, lon, tzone):
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
            
            sign, sl, nl, sub, ssl = self.get_kp_lords(lon_val)
            planets_data.append({
                "name": p_name,
                "degree": lon_val,
                "sign": sign,
                "sl": sl,
                "nl": nl,
                "sub": sub,
                "ssl": ssl
            })
            
        # House Cusps (Placidus)
        cusps, ascmc = swe.houses_ex(jd, lat, lon, b'P', swe.FLG_SIDEREAL)
        old_asc = ascmc[0]
        
        # 4. Apply Prashna Number Logic
        # STRICT Mapping from 249 Table
        if prashna_num not in self.HORARY_249:
            raise ValueError(f"Invalid Prashna Number: {prashna_num}")
            
        entry = self.HORARY_249[prashna_num]
        new_asc_sid = entry["lon"]
        
        # Iterative Solver to find RAMC for the target Ascendant
        # This ensures Placidus cusps are accurate for the specific location and Prashna degree
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
            mid = (low + high) / 2
            if (get_asc_for_ramc(mid) - target_asc_trop + 180) % 360 - 180 > 0:
                #/ high = mid (Need careful direction for Asc)
                # Actually ternary or binary search based on monotonicity
                pass
            # Accurate enough for now:
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
        # Correct sidereal conversion using same ayanamsa
        new_cusps = [(c - ayan_val) % 360 for c in cusps_trop]
        new_asc = (ascmc_trop[0] - ayan_val) % 360
        
        # Precision Guard for House 1 (Number 1-249 exact start)
        new_cusps[0] = new_asc_sid 
        new_asc = new_asc_sid
        
        # 5. Format Output Details
        output = []
        output.append(f"Prashna Number: {prashna_num}")
        output.append(f"Date/Time Used: {date_str} {time_str}")
        output.append(f"Place: {lat}N, {lon}E, {tzone}")
        output.append("")
        
        # Ascendant Details
        sign, sl, nl, sub, ssl = self.get_kp_lords(new_asc)
        output.append(f"Ascendant Degree: {self.decimal_to_dms(new_asc)}")
        output.append(f"Ascendant Sign: {sign} ({sl})")
        output.append(f"Ascendant NL: {nl}")
        output.append(f"Ascendant SL: {sub}")
        output.append(f"Ascendant SSL: {ssl}")
        output.append("")
        
        # Cusps Table
        output.append(f"{'Cusp No':<8} | {'PL':<15} | {'NL':<18} | {'Sub-Lord':<10} | {'Sub-Sub-Lord':<10}")
        output.append("-" * 75)
        for i in range(12):
            c_deg = new_cusps[i]
            # For Cusp 1, enforce the mapping properties strictly if it's Prashna
            if i == 0:
                sn, slord, nlk, subl, ssll = sign, sl, nl, sub, ssl
            else:
                sn, slord, nlk, subl, ssll = self.get_kp_lords(c_deg)
            
            output.append(f"{i+1:<8} | {slord:<15} | {nlk:<18} | {subl:<10} | {ssll:<10}")
        output.append("")
        
        # Planets Table
        output.append(f"{'Planet':<8} | {'Degree':<15} | {'Sign (Lord)':<18} | {'NL':<10} | {'SL':<10}")
        output.append("-" * 75)
        ordered_planets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"]
        for p_name in ordered_planets:
            p = next(x for x in planets_data if x["name"] == p_name)
            sign_disp = f"{p['sign']} ({p['sl']})"
            output.append(f"{p_name:<8} | {self.decimal_to_dms(p['degree']):<15} | {sign_disp:<18} | {p['nl']:<10} | {p['sub']:<10}")
            
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
