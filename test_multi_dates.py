from nadi_core import NadiEngine
import json

test_cases = [
    ("04/05/2007 10:30:00", "Asia/Kolkata", 12.9716, 77.5946, "Bengaluru 04-May-2007"),
    ("1990-12-15 17:30:00", "Asia/Kolkata", 28.6, 77.2, "Delhi 15-Dec-1990"),
    ("1990-01-01 12:00:00", "Asia/Kolkata", 12.9716, 77.5946, "Bengaluru 01-Jan-1990"),
    ("1985-06-15 08:00:00", "Asia/Kolkata", 19.076, 72.877, "Mumbai 15-Jun-1985"),
]

e = NadiEngine()

for dt, tz, lat, lon, label in test_cases:
    res = e.calculate_kundli(dt, tz, lat, lon)
    nadi = {n['planet']: n for n in res['nakshatra_nadi'] if n['planet'] in ['Rahu', 'Ketu']}
    
    rahu_pl = [h['house'] for h in nadi.get('Rahu', {}).get('pl_signified', [])]
    ketu_pl  = [h['house'] for h in nadi.get('Ketu', {}).get('pl_signified', [])]
    
    r = next((p for p in res['planets'] if p['planet'] == 'Rahu'), {})
    k = next((p for p in res['planets'] if p['planet'] == 'Ketu'), {})
    
    print(f"\n=== {label} ===")
    print(f"Rahu in house {r.get('house_placed')} (Sign: {r.get('sign')}, SignLord: {r.get('sign_lord')})")
    print(f"Ketu in house {k.get('house_placed')} (Sign: {k.get('sign')}, SignLord: {k.get('sign_lord')})")
    
    agents_ra = e.get_node_agents("Rahu", r, res['planets'])
    agents_ke = e.get_node_agents("Ketu", k, res['planets'])
    
    print(f"Rahu Agents: {[a['planet'] for a in agents_ra]}")
    print(f"Ketu  Agents: {[a['planet'] for a in agents_ke]}")
    print(f"Rahu PL Houses: {rahu_pl}")
    print(f"Ketu  PL Houses: {ketu_pl}")
