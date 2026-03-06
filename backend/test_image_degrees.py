from nadi_core import NadiEngine

def test_specific_degrees():
    engine = NadiEngine()
    degrees = [
        18.118611,  # 18°07'07"
        47.145555,  # 47°08'44"
        73.251111,  # 73°15'04"
        99.703333,  # 99°42'12"
        129.305555, # 129°18'20"
        163.043611, # 163°02'37"
        198.118611  # 198°07'07"
    ]
    
    print(f"{'Deg':<10} | {'Sign':<8} | {'SL':<5} | {'NL':<5} | {'Sub':<5}")
    print("-" * 40)
    for deg in degrees:
        sn, sl, nl, sub, ssl, nak, nadi, sub_idx = engine.get_kp_lords(deg)
        print(f"{deg:<10.6f} | {sn:<8} | {sl[:2].upper():<5} | {nl[:2].upper():<5} | {sub[:2].upper():<5}")

if __name__ == "__main__":
    test_specific_degrees()
