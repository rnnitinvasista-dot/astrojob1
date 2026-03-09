
import swisseph as swe

def check_ayan(mode, year):
    jd = swe.julday(year, 1, 1)
    swe.set_sid_mode(mode, 0, 0)
    ayan = swe.get_ayanamsa_ut(jd)
    d = int(ayan)
    m = int((ayan-d)*60)
    s = (ayan-d-m/60)*3600
    return f"{d:02d}°{m:02d}'{s:05.2f}\""

print(f"Epoch 1900-01-01")
print(f"SIDM_KRISHNAMURTI (5): {check_ayan(5, 1900)}")
print(f"SIDM_VP291 (39):       {check_ayan(39, 1900)}")
print(f"SIDM_LAHIRI (0):       {check_ayan(0, 1900)}")

print(f"\nYear 2026-01-01")
print(f"SIDM_KRISHNAMURTI (5): {check_ayan(5, 2026)}")
print(f"SIDM_VP291 (39):       {check_ayan(39, 2026)}")
