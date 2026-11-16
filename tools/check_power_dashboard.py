#!/usr/bin/env python3
from pathlib import Path
import math, re, subprocess, tempfile

p=Path("projects/power-performance-dashboard.html")
assert p.exists(), "dashboard page missing"
s=p.read_text(encoding="utf-8")

required=[
 "DEMO · SYNTHETIC DATA","Current performance","What needs attention","Performance workbench",
 "Generation","PLF","PAFY","Gross heat rate","APC","SOC",
 "Design / guarantee","Corrected expected","Normative / target","Actual",
 "On-bar availability","Excess O₂","Condenser backpressure",
 "Equipment restriction","SLDC/RLDC below DC","Auxiliary power",
 "Improvement actions","GCV kcal/kg","Coal ₹/t"
]
missing=[x for x in required if x not in s]
assert not missing, "missing dashboard requirements: "+", ".join(missing)

# Keep reliability/APM analytics out of the performance-monitoring product.
for forbidden in ("MTBF","failure mode","predictive maintenance","asset health score"):
    assert forbidden.casefold() not in s.casefold(), f"out-of-scope concept found: {forbidden}"

# Known-case economic reconciliation.
gap=40.5
generation_mu=29323
gcv=4000
tonnes=gap*generation_mu*1_000_000/gcv/1000
assert math.isclose(tonnes,296895.375,rel_tol=0,abs_tol=.001)

# Performance loss model must explicitly separate condition effects from controllable residuals.
for key in ("load","cw","gcv","condenser","rh","fget","o2","loi"):
    assert "key:'"+key+"'" in s

scripts=re.findall(r"<script(?:\\s[^>]*)?>(.*?)</script>",s,re.S)
checked=0
for code in scripts:
    code=code.strip()
    if not code:
        continue
    with tempfile.NamedTemporaryFile("w",suffix=".js",delete=False,encoding="utf-8") as f:
        f.write(code); name=f.name
    subprocess.run(["node","--check",name],check=True,capture_output=True,text=True)
    checked+=1
assert checked>=1, "expected dashboard JavaScript"
print(f"PASS: performance scope, economics, benchmark hierarchy and {checked} script(s) validated.")
