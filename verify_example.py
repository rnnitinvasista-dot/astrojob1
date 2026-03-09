
from nadi_core import NadiEngine

engine = NadiEngine()
# 81 + 35/60 + 36/3600 = 81.59333333333333
test_lon = 81.59333333333333

sn, sl, nl, sub, ssl, nak, nadi, sub_idx = engine.get_kp_lords(test_lon)

print(f"Longitude: 81°35'36\" ({test_lon:.6f})")
print(f"Sign: {sn}")
print(f"NL: {nl}")
print(f"SL: {sub}")
print(f"SSL: {ssl}")
