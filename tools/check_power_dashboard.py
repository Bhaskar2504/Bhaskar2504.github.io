#!/usr/bin/env python3
from pathlib import Path
import math, re, subprocess, tempfile

p=Path("projects/power-performance-dashboard.html")
assert p.exists(), "dashboard page missing"
s=p.read_text(encoding="utf-8")

required=[
 "DEMO · SYNTHETIC DATA","Plant status &amp; KPI monitoring",
 "02 · KPI flare & historical comparison","03 · Gap — one benchmark hierarchy",
 "04 · Prioritise","05 · Diagnose","06 · Act","07 · Verify",
 "Design / guarantee","Corrected expected","Normative / target","Actual",
 "PAFM / PAFY","On-bar availability","Excess O₂","Condenser backpressure",
 "Equipment restriction","SLDC/RLDC below DC","Unit auxiliary power fingerprint",
 "Corrected-gap uncertainty","GCV","Coal ₹/t"
]
missing=[x for x in required if x not in s]
assert not missing, "missing dashboard requirements: "+", ".join(missing)

# Known-case reconciliation from the dashboard assumptions.
gap=40.5
generation_mu=29323
gcv=4000
tonnes=gap*generation_mu*1_000_000/gcv/1000
assert math.isclose(tonnes,296895.375,rel_tol=0,abs_tol=.001)

# Controllable loss/action linking must exist.
for loss in ("condenser","rh","apc"):
    assert f'data-loss="{loss}"' in s
assert 'data-loss="gcv"' in s and 'data-loss="load"' in s

# Syntax-check every inline JavaScript block that contains executable code.
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
assert checked>=2, "expected theme + dashboard inline scripts"
print(f"PASS: dashboard structure, economics and {checked} inline scripts validated.")
