
import swisseph as swe
import datetime
import pytz
import math

class NadiEngine:
    def __init__(self, node_type="Mean", ayanamsa="KP", house_system="Placidus"):
        self.node_type = node_type
        self.ayanamsa = ayanamsa
        self.house_system = house_system
        self.PLANETS = {"Sun": swe.SUN, "Moon": swe.MOON, "Mars": swe.MARS, "Mercury": swe.MERCURY, "Jupiter": swe.JUPITER, "Venus": swe.VENUS, "Saturn": swe.SATURN, "Rahu": swe.MEAN_NODE, "Ketu": swe.MEAN_NODE}
        self.SIGN_RULERS = {"Aries": "Mars", "Taurus": "Venus", "Gemini": "Mercury", "Cancer": "Moon", "Leo": "Sun", "Virgo": "Mercury", "Libra": "Venus", "Scorpio": "Mars", "Sagittarius": "Jupiter", "Capricorn": "Saturn", "Aquarius": "Saturn", "Pisces": "Jupiter"}
        self.DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
        self.DASHA_YEARS = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}
        self.HORARY_TABLE = self.generate_horary_table()
        self.NAKSHATRAS = ["Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu","Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta","Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha","Uttara Ashadha","Shravana","Dhanishta","Shatabhisha","Purva Bhadrapada","Uttara Bhadrapada","Revati"]

    def decimal_to_dms(self, degree):
        val = degree % 30
        d = int(val)
        m = int((val - d) * 60)
        s = round((val - d - m/60)*3600)
        if s >= 60: s -= 60; m += 1
        if m >= 60: m -= 60; d += 1
        return f"{d:02}°{m:02}'{int(s):02}\""

    def generate_horary_table(self):
        table = {}
        nak_size = 360.0 / 27.0; num = 1
        sign_names = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"]
        for n_idx in range(27):
            nak_start = n_idx * nak_size
            star_lord = self.DASHA_ORDER[n_idx % 9]
            sub_seq = self.DASHA_ORDER[self.DASHA_ORDER.index(star_lord):] + self.DASHA_ORDER[:self.DASHA_ORDER.index(star_lord)]
            curr_nak_lon = 0.0
            for lord in sub_seq:
                arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
                seg_start = nak_start + curr_nak_lon
                s_sign = int(seg_start / 30.0)
                table[num] = {"lon": seg_start, "sign": sign_names[s_sign], "sl": self.SIGN_RULERS[sign_names[s_sign]], "nl": star_lord, "sub": lord}
                num += 1
                curr_nak_lon += arc
                if num > 249: break
            if num > 249: break
        return table

    def calculate_prashna_cusps(self, jd, lat, lon, horary_number, calibrated_ayan):
        target_sid_asc = self.HORARY_TABLE[horary_number]['lon']
        target_trop_asc = (target_sid_asc + calibrated_ayan) % 360
        res, _ = swe.calc_ut(jd, swe.ECL_NUT, 0); eps = res[0]
        def get_asc(r):
            try:
                _, a = swe.houses_armc(r % 360, lat, eps, b'E')
                return a[0]
            except: return (r + 90) % 360
        best_r = 0.0; min_diff = 400.0
        for r in range(0, 360, 2):
            diff = abs((get_asc(float(r)) - target_trop_asc + 180) % 360 - 180)
            if diff < min_diff: min_diff = diff; best_r = float(r)
        low, high = best_r - 2.0, best_r + 2.0
        for _ in range(40):
            m1, m2 = low + (high-low)*0.4, low + (high-low)*0.6
            if abs((get_asc(m1) - target_trop_asc + 180) % 360 - 180) < abs((get_asc(m2) - target_trop_asc + 180) % 360 - 180): high = m2
            else: low = m1
        final_ramc = (low + high) / 2.0
        c_trop, a_trop = swe.houses_armc(final_ramc % 360, lat, eps, b'P')
        return [(c - calibrated_ayan) % 360 for c in c_trop], [(a - calibrated_ayan) % 360 for a in a_trop]

    def get_kp_lords(self, degree):
        degree %= 360
        sign_names = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
        sn = sign_names[int(degree / 30.0)]
        nak_size = 360.0 / 27.0; nak_idx = int(degree / nak_size)
        sl = self.DASHA_ORDER[nak_idx % 9]; rem = degree - (nak_idx * nak_size)
        sub_seq = self.DASHA_ORDER[nak_idx % 9:] + self.DASHA_ORDER[:nak_idx % 9]
        sub = sl; cur = 0.0
        for lord in sub_seq:
            arc = (self.DASHA_YEARS[lord] / 120.0) * nak_size
            if cur <= rem < (cur + arc + 1e-10): sub = lord; break
            cur += arc
        return sn, self.SIGN_RULERS[sn], sl, sub, sub, self.NAKSHATRAS[nak_idx % 27], "Vata", 1

    def calculate_kundli(self, dt_str, timezone, lat, lon, horary_number=None):
        tz = pytz.timezone(timezone)
        dt_naive = datetime.datetime.strptime(dt_str, "%Y-%m-%d %H:%M:%S")
        dt = tz.localize(dt_naive)
        utc_dt = dt.astimezone(pytz.UTC)
        jd = swe.julday(utc_dt.year, utc_dt.month, utc_dt.day, utc_dt.hour + utc_dt.minute/60.0 + utc_dt.second/3600.0)
        swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
        ayan = swe.get_ayanamsa_ut(jd) + (1600.0 / 3600.0)
        if horary_number: cusps, ascmc = self.calculate_prashna_cusps(jd, lat, lon, horary_number, ayan)
        else:
            c_raw, a_raw = swe.houses_ex(jd, lat, lon, b'P', 0)
            cusps = [(c - ayan) % 360 for c in c_raw]; ascmc = [(a - ayan) % 360 for a in a_raw]
        
        houses_res = []
        for i in range(12):
            sn, sl, nlk, sub, ssl, nak, nadi, s_idx = self.get_kp_lords(cusps[i])
            houses_res.append({"house_number": i+1, "sign": sn, "degree": cusps[i], "degree_dms": self.decimal_to_dms(cusps[i]), "sign_lord": sl, "star_lord": nlk, "sub_lord": sub})

        planets = []
        for name, code in self.PLANETS.items():
            res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL | swe.FLG_SPEED)
            lon_v = res[0] if name != "Ketu" else (res[0] + 180) % 360
            sn, sl, nlk, sub, ssl, nak, nadi, s_idx = self.get_kp_lords(lon_v)
            hp = 1
            for i in range(12):
                if (cusps[(i+1)%12] < cusps[i] and (lon_v >= cusps[i] or lon_v < cusps[(i+1)%12])) or (cusps[i] <= lon_v < cusps[(i+1)%12]):
                    hp = i + 1; break
            planets.append({"planet": name, "degree_dms": f"{self.decimal_to_dms(lon_v)} {sn}", "house_placed": int(hp), "sign": sn, "sign_lord": sl, "star_lord": nlk, "sub_lord": sub, "nakshatra": nak, "is_retrograde": res[3] < 0})
        
        moon_pos = next(p for p in planets if p["planet"] == "Moon")
        return {
            "status": "success", 
            "planets": planets, 
            "houses": houses_res, 
            "ascendant": {"sign": houses_res[0]["sign"], "degree_dms": houses_res[0]["degree_dms"]},
            "dasha": {"balance_at_birth": "0Y 0M 0D", "current_dasha": "N/A", "current_bukthi": "N/A", "current_antara": "N/A"}, 
            "nakshatra_nadi": [{"planet": p["planet"], "star_lord": p["star_lord"], "sub_lord": p["sub_lord"], "pl_signified": [], "nl_signified": [], "sl_signified": []} for p in planets], 
            "metadata": {"horary_number": horary_number, "janma_nakshatra": moon_pos["nakshatra"], "pada": "1", "ayanamsa": self.ayanamsa, "ayanamsa_value": f"{ayan:.4f}°"}
        }
