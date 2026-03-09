from nadi_core import NadiEngine

e = NadiEngine()
res = e.calculate_kundli('04-05-2007 10:20:00', 'Asia/Kolkata', 12.9716, 77.5946)
p_map = {p['planet']: p for p in res['planets']}

# Replicate the INTERNAL house_owners from SIGN_RULERS (full names)
import swisseph as swe
import pytz, datetime

# get house_owners same way calculate_kundli does
tz = pytz.timezone("Asia/Kolkata")
dt = datetime.datetime(2007, 5, 4, 10, 20, 0)
dt_loc = tz.localize(dt)
dt_utc = dt_loc.astimezone(pytz.UTC)
jd = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, dt_utc.hour + dt_utc.minute/60.0)

swe.set_sid_mode(swe.SIDM_KRISHNAMURTI, 0, 0)
ayan_offset = -11.18/3600.0
ramc_offset = 13.5/3600.0
ayan_val = swe.get_ayanamsa_ut(jd) + ayan_offset

lat, lon = 12.9716, 77.5946
h_sys = b'P'
gmst_hrs = swe.sidtime(jd)
lst_hrs = (gmst_hrs + lon / 15.0) % 24.0
ramc_deg = (lst_hrs * 15.0) % 360.0
res_nut, _ = swe.calc_ut(jd, swe.ECL_NUT, 0)
eps = res_nut[0]
cusps_trop, _ = swe.houses_armc(ramc_deg + ramc_offset, lat, eps, h_sys)
cusps = [(c - ayan_val) % 360 for c in cusps_trop]

signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"]
asc_sn, *_ = e.get_kp_lords(cusps[0])
asc_idx = signs.index(asc_sn)

house_owners_internal = {}
for i in range(12):
    curr_sign = signs[(asc_idx + i) % 12]
    house_owners_internal[i+1] = e.SIGN_RULERS[curr_sign]

print("Internal house_owners:", house_owners_internal)

# Now debug get_eff_sigs_detailed manually for Rahu
def debug_eff_sigs(node_name, planet_map, house_owners):
    p_data = planet_map[node_name]
    sigs = [{"house": int(p_data["house_placed"]), "is_placed": True}]
    houses_seen = {int(p_data["house_placed"])}
    
    # Regular owned houses
    for h, owner in house_owners.items():
        if owner == node_name and h not in houses_seen:
            sigs.append({"house": h, "is_placed": False})
            houses_seen.add(h)

    occupied = set(int(p["house_placed"]) for p in planet_map.values() if p["planet"] not in ["Rahu","Ketu"])
    
    agents = e.get_node_agents(node_name, p_data, list(planet_map.values()))
    print(f"\n{node_name} agents: {[a['planet'] for a in agents]}")
    
    for agent in agents:
        a_name = agent['planet']
        if a_name not in planet_map:
            print(f"  Agent {a_name}: MISSING FROM MAP!")
            continue
        a_data = planet_map[a_name]
        a_occ = int(a_data["house_placed"])
        
        # Find owned houses
        owned_matching = [(h, o) for h, o in house_owners.items() if o == a_name]
        print(f"  Agent {a_name}: house={a_occ}, house_owners matches: {owned_matching}")
        
        if a_occ not in houses_seen:
            sigs.append({"house": a_occ, "is_placed": False})
            houses_seen.add(a_occ)
        
        for h, o in house_owners.items():
            if o == a_name and h not in houses_seen and h not in occupied:
                sigs.append({"house": h, "is_placed": False})
                houses_seen.add(h)
    
    return sorted(sigs, key=lambda x: x["house"])

print("\n=== Rahu debug ===")
r = debug_eff_sigs("Rahu", p_map, house_owners_internal)
print("Rahu result:", [x['house'] for x in r])

print("\n=== Ketu debug ===")
k = debug_eff_sigs("Ketu", p_map, house_owners_internal)
print("Ketu result:", [x['house'] for x in k])
