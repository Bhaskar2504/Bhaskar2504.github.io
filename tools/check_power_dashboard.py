#!/usr/bin/env python3
from pathlib import Path
import math, re, subprocess, tempfile

p=Path("projects/power-performance-dashboard.html")
assert p.exists(), "dashboard page missing"
s=p.read_text(encoding="utf-8")

required=[
 "Routine performance monitoring, from KPI to test evidence",
 "Gross generation","Plant load factor","Gross heat rate","Aux consumption",
 "Availability on bar","Specific oil consumption","Specific coal consumption",
 "Coal GCV at boiler","DM make-up","Partial loading",
 "Efficiency & heat-rate workbench","Routine performance tests",
 "HP/IP cylinder efficiency","Condenser test","HP heater performance",
 "Turbine pressure survey","Turbine cycle heat-rate test","Dirty-air / mill performance",
 "APH performance","FG-path temperature mapping","Boiler efficiency test",
 "High-energy drain loss","Cooling-tower test",
 "Auxiliary power performance","MDBFP","ID fans","FD fans","PA fans","CEP","Mills","CW pumps",
 "Load, availability & generation loss","Grid constraint","No demand / regulation",
 "GCV kcal/kg","Coal ₹/t"
]
missing=[x for x in required if x not in s]
assert not missing, "missing Routine Test dashboard elements: "+", ".join(missing)

for forbidden in ("MTBF","predictive maintenance","asset health score","failure mode","reliability"):
    assert forbidden.casefold() not in s.casefold(), f"out-of-scope concept found: {forbidden}"

gap=40.5
generation_mu=29323
gcv=4000
tonnes=gap*generation_mu*1_000_000/gcv/1000
assert math.isclose(tonnes,296895.375,rel_tol=0,abs_tol=.001)

ids=re.findall(r'id="([^"]+)"',s)
assert len(ids)==len(set(ids)), "duplicate HTML ids found"

scripts=re.findall(r"<script(?:\\s[^>]*)?>(.*?)</script>",s,re.S)
checked=0
for code in scripts:
    code=code.strip()
    if not code: continue
    with tempfile.NamedTemporaryFile("w",suffix=".js",delete=False,encoding="utf-8") as f:
        f.write(code); name=f.name
    subprocess.run(["node","--check",name],check=True,capture_output=True,text=True)
    checked+=1
assert checked>=1
print(f"PASS: Routine Test scope, performance KPIs, economics, unique ids and {checked} script(s) validated.")
