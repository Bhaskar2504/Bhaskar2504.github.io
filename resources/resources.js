const RESOURCE_LIBRARY = {
  "failure-mode-mapping": {
    title: "Failure Mode Mapping Checklist",
    deck: "A practical review tool for converting equipment failure knowledge into clear, testable and non-duplicative failure-mode mappings.",
    principle: "A failure mode is not a tag condition. It should describe a credible loss of function or degradation mechanism, while tags provide evidence for or against it.",
    fields: ["Asset / system", "Failure-mode owner", "Reviewer", "Reference / revision"],
    sections: [
      {title:"Define the engineering scope", intro:"Start with the equipment boundary and function before looking at tags.", items:[
        ["Asset boundary is explicit","The mapped equipment, upstream/downstream systems and shared auxiliaries are clearly separated."],
        ["Primary function is stated","Define what the equipment is expected to deliver: flow, pressure, torque, heat transfer, electrical output, containment, control, etc."],
        ["Operating states are identified","State whether the failure mode is relevant during running, standby, startup, shutdown, changeover or specific load ranges."],
        ["Failure mode is written as an engineering condition","Use a physical or functional degradation description, not a symptom such as ‘pressure low’ or ‘current high’."],
        ["Cause, failure mode and effect are not mixed","Keep initiating causes, the actual failure condition and resulting consequences conceptually separate."]]},
      {title:"Check physical plausibility", intro:"Every mapped failure mode should have a credible engineering mechanism.", items:[
        ["Mechanism is physically plausible","Mechanical, hydraulic, thermal, electrical, chemical, control or instrumentation behaviour can explain the failure mode."],
        ["Expected direction of change is understood","For each important variable, define whether it should increase, decrease, become unstable, lag or decouple."],
        ["Operating-condition dependence is considered","Load, speed, ambient condition, valve position, control mode and equipment configuration may change the expected signature."],
        ["Competing explanations are listed","Identify other mechanisms that could produce a similar signal pattern."],
        ["Contradicting evidence is defined","Specify which stable or opposing measurements would weaken the hypothesis."]]},
      {title:"Map evidence, not just tags", intro:"Use groups of evidence so diagnosis does not depend on one signal.", items:[
        ["Primary response signals are mapped","Measurements that directly reflect the affected function are included."],
        ["Cause-indicating signals are mapped where available","Include variables that support the suspected mechanism, not only the final effect."],
        ["Operating-context tags are included","Load, run status, speed, valve state, parallel-equipment state and control mode are available where relevant."],
        ["Exclusion / contradiction tags are included","Map signals that help rule out alternative explanations or instrumentation issues."],
        ["Calculated engineering features are considered","Use ΔP, temperature rise, pressure ratio, efficiency, specific current or other relationships when they are more diagnostic than raw values."]]},
      {title:"Define temporal behaviour", intro:"A credible signature usually includes persistence, sequence and rate—not only direction.", items:[
        ["Expected persistence is defined","Separate transient changes from sustained degradation."],
        ["Sequence of symptoms is considered","Where engineering knowledge supports it, identify which variables are expected to move first and which follow."],
        ["Rate of change is considered","Rapid step changes, gradual drift and cyclic instability can imply different mechanisms."],
        ["Startup / shutdown filtering is defined","Normal transients are excluded or evaluated separately when necessary."],
        ["Changeover and parallel-operation effects are considered","The signature remains valid when equipment configuration changes."]]},
      {title:"Review overlap and actionability", intro:"The final mapping should help an engineer decide what to investigate next.", items:[
        ["Duplicate failure modes have been removed","Two labels are not describing the same engineering condition with slightly different wording."],
        ["Failure modes are distinguishable where possible","The evidence set can help separate similar mechanisms, or the limitation is documented."],
        ["Recommended checks are defined","The mapping points to practical inspections, trend reviews, instrument checks or maintenance verification."],
        ["Confidence limitations are documented","State when available instrumentation cannot uniquely diagnose the mechanism."],
        ["Peer review is completed","A second engineer has challenged the mechanism, tag set and alternative explanations."]]},
      {title:"Freeze and govern the mapping", intro:"Treat the failure-mode library as controlled engineering knowledge.", items:[
        ["Source references are recorded","Public/OEM/manual/internal references are traceable where permitted."],
        ["Version and approval are recorded","The mapping can be tied to a revision and review decision."],
        ["Changes trigger revalidation","New tags, process modifications, logic changes or equipment redesign prompt review."],
        ["Feedback from real alerts is captured","Validated and false alerts are used to improve future mapping."],
        ["Confidential information is handled appropriately","Public-facing versions exclude proprietary customer, employer and site-specific knowledge."]]}
    ],
    outcome:["Approved — mechanism and evidence are sufficiently defined.","Conditional — usable only in defined operating states or with stated limitations.","Needs revision — mapping is symptom-based, ambiguous or poorly supported."]
  },
  "tag-validation": {
    title: "Industrial Tag Validation Checklist",
    deck: "A field-ready checklist for validating historian or DCS tags before they are used in calculations, analytics, models or diagnostics.",
    principle: "A tag is usable only when its identity, unit, time behaviour, operating response and engineering meaning are all credible.",
    fields:["Tag name / ID","Asset / system","Reviewer","Validation period"],
    sections:[
      {title:"Identity and metadata",intro:"Confirm what the tag actually represents before analysing values.",items:[
        ["Tag description matches the physical measurement","The name and description correspond to the intended equipment and measurement point."],
        ["Asset / system mapping is correct","The tag is assigned to the right train, unit, equipment and subsystem."],
        ["Tag type is known","Analog, digital, status, calculated, totalizer, command or derived tag is correctly identified."],
        ["Engineering unit is confirmed","Unit, scaling and conversion are correct and consistent with downstream calculations."],
        ["Expected engineering range is known","Normal, minimum, maximum and instrument-range context are available where possible."]]},
      {title:"Time and availability",intro:"Check whether the time series can support the intended analysis.",items:[
        ["Timestamp is credible","Timezone, clock source and timestamp meaning are understood."],
        ["Sampling interval is understood","Native resolution, historian compression and resampling behaviour are known."],
        ["Data coverage is sufficient","The required operating periods are present with no unexplained long gaps."],
        ["Duplicate timestamps are handled","Repeated records do not distort averaging or model training."],
        ["Cross-tag alignment is checked","Related measurements refer to comparable time windows before multivariable use."]]},
      {title:"Data-quality behaviour",intro:"Look for patterns that indicate instrument, historian or preprocessing problems.",items:[
        ["Missing values are quantified","Nulls, blanks, bad-quality codes and gaps are measured rather than silently ignored."],
        ["Flat-line behaviour is reviewed","Constant values are checked against process state to distinguish genuine steady operation from a stuck signal."],
        ["Spikes and impossible jumps are reviewed","Abrupt excursions are checked for instrument, communication or parsing issues."],
        ["Clipping / saturation is checked","Values are not repeatedly pinned to instrument or configured limits."],
        ["Noise and quantization are understood","Resolution, jitter and least-count effects are acceptable for the intended calculation or model."]]},
      {title:"Engineering plausibility",intro:"A clean-looking signal can still be mapped or scaled incorrectly.",items:[
        ["Direction of response is plausible","The tag reacts in the expected direction when load, valve position, speed or process demand changes."],
        ["Magnitude is plausible","Typical values are consistent with equipment design and system behaviour."],
        ["Peer tags agree where they should","Redundant sensors, phase values, parallel equipment or upstream/downstream tags are compared."],
        ["Sign convention is verified","Positive/negative direction for power, flow, valve action, differential pressure or other variables is understood."],
        ["Known operational events are visible","Start, stop, trip, load change or equipment changeover appears correctly in the signal."]]},
      {title:"Use-case suitability",intro:"A tag may be valid for display but unsuitable for a specific calculation or model.",items:[
        ["Required accuracy is adequate","Measurement quality is suitable for the KPI, diagnostic rule or model sensitivity."],
        ["Preprocessing is documented","Averaging, filtering, interpolation, imputation and unit conversion are explicit."],
        ["Shutdown / invalid states are excluded","Zeros or standby values are not treated as normal operating data unless intended."],
        ["Calculated tags are independently checked","Formula, source tags and units are validated before reuse."],
        ["Final usability classification is assigned","Mark usable, conditional, replace/re-map, or reject with the reason recorded."]]}
    ],outcome:["Usable — identity, quality and engineering response are credible.","Conditional — usable only with filtering, operating-state rules or documented caveats.","Reject / re-map — evidence indicates wrong mapping, poor quality or unsuitable measurement behaviour."]
  },
  "alert-validation": {
    title:"Predictive Alert Validation Checklist",
    deck:"A structured way to decide whether a predictive alert is technically credible, actionable and worth keeping.",
    principle:"An alert is valuable only when the deviation is real, context-aware, evidence-supported and connected to a practical engineering response.",
    fields:["Alert / case ID","Asset","Reviewer","Review window"],
    sections:[
      {title:"Confirm the alert context",intro:"Establish what the asset was doing when the alert began.",items:[
        ["Asset was in a valid operating state","Running/standby/startup/shutdown status is confirmed."],
        ["Load and operating regime are identified","The alert is compared with behaviour appropriate for the same regime."],
        ["Equipment configuration is known","Parallel equipment, changeover, bypasses and control mode are considered."],
        ["Alert start time is verified","The first meaningful deviation is distinguished from later severity growth."],
        ["Persistence is meaningful","The alert is not only a short transient unless the transient itself is important."]]},
      {title:"Validate the underlying data",intro:"Do not diagnose an alert until the contributing evidence is trusted.",items:[
        ["Contributing tags passed data-quality checks","No obvious missing, stuck, spiking or timestamp problems explain the alert."],
        ["Expected vs measured values are credible","Model residuals or deviations are not caused by bad baselines or invalid context."],
        ["Related signals are time-aligned","Apparent relationships are not produced by different sampling or lag."],
        ["Recent maintenance / calibration is considered","Instrument or equipment changes that alter the baseline are known."],
        ["Model or rule configuration is current","Thresholds, persistence and operating filters match the latest intended setup."]]},
      {title:"Assess engineering evidence",intro:"Build a diagnosis from relationships rather than individual abnormal tags.",items:[
        ["Observed pattern is clearly stated","Describe what changed and what stayed stable."],
        ["A plausible mechanism explains the pattern","Failure-mode reasoning is physically credible."],
        ["Multiple signals support the hypothesis where possible","The case is not dependent on one uncertain measurement."],
        ["Contradicting evidence is reviewed","Stable or opposing tags are actively used to challenge the diagnosis."],
        ["Alternative explanations are considered","Process change, instrumentation, control action and normal transitions are evaluated."]]},
      {title:"Judge alert quality",intro:"A technically interesting deviation is not automatically a good operational alert.",items:[
        ["Lead time is useful","The alert occurs early enough to support investigation or planning."],
        ["Severity reflects engineering significance","Severity is not driven only by model score without consequence/context."],
        ["False-positive risk is acceptable","Similar historical conditions are reviewed where possible."],
        ["Alert wording is understandable","An engineer can understand the problem without decoding model internals."],
        ["Recommended checks are practical","The alert points to realistic validation, inspection or monitoring actions."]]},
      {title:"Close the learning loop",intro:"Every reviewed alert should improve the system.",items:[
        ["Outcome is classified","Confirmed issue, credible early warning, process/context event, instrumentation issue, false alert or unresolved."],
        ["Root cause is not overstated","If evidence is insufficient, the case remains a hypothesis rather than a confirmed diagnosis."],
        ["Tuning action is recorded","Persistence, context filters, tag selection or model settings are changed only when justified."],
        ["Failure-mode mapping is updated if needed","New evidence is fed back into the engineering knowledge layer."],
        ["Review decision and owner are recorded","Keep, tune, suppress, merge or retire is explicit."]]}
    ],outcome:["Keep — technically credible and operationally useful.","Tune — useful concept but configuration/context needs improvement.","Investigate — evidence incomplete or contradictory.","Retire / suppress — repetitive, non-actionable or technically invalid."]
  },
  "sensor-data-quality": {
    title:"Sensor Data Quality Checklist",
    deck:"A systematic review of raw measurement quality before uncertainty, calculations, models or diagnostics are built on top of the signal.",
    principle:"Data quality is not only missing values. A sensor can be complete yet biased, drifting, saturated, noisy, mis-scaled or physically inconsistent.",
    fields:["Sensor / tag","Measurement type","Reviewer","Assessment period"],
    sections:[
      {title:"Measurement definition",intro:"Understand the measurement system before judging the time series.",items:[
        ["Measurand is clearly defined","Know exactly what physical quantity and location the sensor represents."],
        ["Range and unit are known","Configured span, engineering unit and scaling are verified."],
        ["Resolution / least count is known where relevant","Small apparent changes are not interpreted below the measurement resolution."],
        ["Accuracy / calibration information is available where relevant","Published or calibration uncertainty is distinguished from observed process variability."],
        ["Installation context is understood","Impulse lines, thermowells, flow profile, mounting, cable routing or environmental effects are considered where relevant."]]},
      {title:"Completeness and continuity",intro:"Quantify whether data loss or historian behaviour affects analysis.",items:[
        ["Missing-data percentage is measured","Report missing records over the assessment period."],
        ["Gap duration is reviewed","A few long gaps and many short gaps can have different impacts."],
        ["Bad-quality flags are retained where available","Historian quality information is not discarded before validation."],
        ["Duplicate / out-of-order timestamps are checked","Sequence problems are removed before time-dependent analysis."],
        ["Sampling irregularity is understood","Variable sampling or compression does not silently distort averages or derivatives."]]},
      {title:"Signal integrity",intro:"Look for sensor and acquisition failure signatures.",items:[
        ["Flat-line / stuck behaviour is checked","Constant output is compared with process activity and peer tags."],
        ["Spikes and dropouts are checked","Single-point excursions are separated from genuine process transients."],
        ["Clipping / saturation is checked","The signal is not repeatedly limited by span or software boundaries."],
        ["Noise level is characterized","Short-term variation is compared with process dynamics and sensor resolution."],
        ["Step changes are investigated","Abrupt baseline shifts are checked against calibration, maintenance, scaling or process changes."]]},
      {title:"Bias, drift and plausibility",intro:"Long-term quality problems may look smooth and therefore escape simple checks.",items:[
        ["Drift is reviewed against references or peers","Slow change is compared with redundant measurements, mass/energy balance or known stable conditions."],
        ["Bias is considered","A consistent offset may matter even when trend shape is correct."],
        ["Cross-sensor relationships remain physical","Pressure, temperature, flow, power and equipment-state relationships are plausible."],
        ["Response time is plausible","Sensor lag is consistent with the measurement technology and process dynamics."],
        ["Environmental sensitivity is considered","Ambient temperature, vibration, EMI or other external factors are reviewed where relevant."]]},
      {title:"Treatment and uncertainty",intro:"Document what will happen to questionable data before downstream use.",items:[
        ["Noise floor / practical deadband is defined where needed","Small deviations below trustworthy resolution are not treated as genuine process change."],
        ["Imputation rule is explicit","Missing data is not filled without a defined method and suitability check."],
        ["Filtering does not hide real dynamics","Smoothing lag and transient suppression are understood."],
        ["Uncertainty is propagated for calculated results where material","Important input measurement uncertainties are carried into derived KPIs rather than ignored."],
        ["Exclusion / replacement criteria are defined","The point at which the tag becomes unsuitable is documented."]]}
    ],outcome:["Good — suitable for intended use.","Usable with controls — filtering, deadband, context or uncertainty treatment required.","Poor — repair, recalibration, remapping or alternative measurement required."]
  },
  "kpi-validation": {
    title:"Calculated KPI Validation Sheet",
    deck:"A structured engineering review for any KPI derived from multiple plant measurements, equations or preprocessing steps.",
    principle:"A calculated KPI is only as trustworthy as its definition, source tags, units, boundary conditions, time alignment and uncertainty treatment.",
    fields:["KPI name","Purpose / decision supported","Formula / revision","Reviewer"],
    sections:[
      {title:"Define the KPI",intro:"Make the calculation unambiguous before implementation.",items:[
        ["Engineering purpose is stated","Explain what decision, performance question or diagnostic need the KPI supports."],
        ["System boundary is explicit","Define exactly which equipment or process boundary the calculation represents."],
        ["Formula is documented","Every variable, constant, sign convention and unit conversion is defined."],
        ["Output unit is confirmed","Dimensional consistency is checked from inputs through result."],
        ["Reference basis is defined","HHV/LHV, absolute/gauge pressure, wet/dry basis, gross/net, standard/actual conditions or other bases are explicit where relevant."]]},
      {title:"Validate source measurements",intro:"Review every input tag, not just the final calculated trend.",items:[
        ["Source tags are correctly mapped","Each variable comes from the intended measurement point and equipment."],
        ["Units and scaling are correct","Raw historian units match the formula or are converted explicitly."],
        ["Measurement quality is adequate","Accuracy, range, resolution and known data-quality issues are acceptable for the KPI."],
        ["Redundant or substitute tags are governed","Fallback logic is defined rather than silently switching sources."],
        ["Calculated inputs are traceable","If one KPI uses another derived value, the dependency chain is documented."]]},
      {title:"Align time and preprocessing",intro:"Many wrong KPIs are mathematically correct but temporally inconsistent.",items:[
        ["Input timestamps are aligned","Values represent the same or intentionally lagged physical period."],
        ["Aggregation method is appropriate","Mean, total, median, min/max or integration matches the engineering meaning."],
        ["Averaging windows are consistent","Different source resolutions are resampled deliberately."],
        ["Missing-data handling is defined","The KPI does not silently calculate from incomplete input sets."],
        ["Filtering / imputation effects are understood","Preprocessing does not introduce unrealistic phase lag or hide excursions."]]},
      {title:"Check boundary and edge cases",intro:"Define when the KPI is valid and when it must not be shown as normal data.",items:[
        ["Operating-state validity is defined","Startup, shutdown, low load, standby or trip periods are treated appropriately."],
        ["Divide-by-small-number risk is handled","Ratios and efficiencies have guards against unstable denominators."],
        ["Physical limits are defined","Impossible negative values, >100% efficiencies or other nonphysical states are trapped where appropriate."],
        ["Sensor failure behaviour is defined","Bad or unavailable inputs produce a quality flag rather than a misleading number."],
        ["Equipment configuration changes are considered","Parallel trains, bypasses and operating-mode changes are reflected in the formula or validity logic."]]},
      {title:"Validate against independent evidence",intro:"A KPI should be challenged with a second calculation or trusted reference.",items:[
        ["Manual spot calculation matches","Representative periods are independently calculated outside the application."],
        ["Reference or expected range is available","Design data, accepted engineering references or historical known-good operation provide context."],
        ["Trend response is physically sensible","The KPI moves as expected during known load or operating changes."],
        ["Acceptance tolerance is defined","State how close independent calculations must agree and why."],
        ["Discrepancies are explained","Do not accept a convenient match without understanding residual differences."]]},
      {title:"Uncertainty and governance",intro:"Make the result maintainable after go-live.",items:[
        ["Material input uncertainties are identified","Sensors with the largest effect on the KPI are known."],
        ["Combined uncertainty is estimated where decision-critical","A calculated deviation is not over-interpreted when it is comparable to measurement uncertainty."],
        ["Formula version is controlled","Changes to constants, tags or preprocessing are traceable."],
        ["Owner and approval are assigned","Responsibility for maintaining the KPI is clear."],
        ["Revalidation triggers are defined","Sensor replacement, plant modification, historian changes or formula edits require review."]]}
    ],outcome:["Validated — calculation is traceable, reproducible and physically credible.","Conditional — valid only in defined operating conditions or with stated uncertainty.","Not validated — source, formula, timing or boundary issue remains unresolved."]
  },
  "industrial-ai-implementation": {
    title:"Industrial AI Implementation Checklist",
    deck:"An end-to-end stage-gate checklist for moving an industrial AI use case from discovery through data readiness, validation, UAT, go-live and sustained adoption.",
    principle:"Industrial AI implementation is not finished when a model runs. The system must be technically valid, integrated, governed, usable and owned by the people who act on its outputs.",
    fields:["Program / use case","Asset scope","Implementation owner","Current phase"],
    sections:[
      {title:"Problem and scope",intro:"Define the engineering problem before choosing analytics.",items:[
        ["Business / engineering problem is explicit","State the operational pain, reliability risk or performance decision being improved."],
        ["Asset and system boundaries are agreed","Hierarchy, equipment scope and exclusions are documented."],
        ["Intended users are identified","Operators, reliability, maintenance, performance or management users have clear roles."],
        ["Expected action is defined","Know what a user should do differently when the system produces an insight."],
        ["Success criteria are measurable","Technical, workflow and adoption acceptance criteria are agreed before build."]]},
      {title:"Data and integration readiness",intro:"Confirm that required signals can be trusted and delivered consistently.",items:[
        ["Historian / data-source connectivity is available","Access, permissions and update frequency support the use case."],
        ["Asset hierarchy is aligned","System, equipment and tag relationships are consistent across data and application layers."],
        ["Required tags are mapped and validated","Identity, units, type, quality and operating response are checked."],
        ["Historical data is sufficient","Relevant operating regimes and enough usable history are available."],
        ["Data-quality rules are defined","Missing, flat-line, shutdown, duplicates, spikes and invalid periods have explicit handling."]]},
      {title:"Engineering knowledge design",intro:"Translate domain expertise into structures the AI system can use and engineers can review.",items:[
        ["Failure modes / performance questions are defined","The system knows which engineering problems it is intended to support."],
        ["Diagnostic evidence is mapped","Cause, response, context and contradicting signals are identified."],
        ["Calculated KPIs are independently validated","Derived features and formulas are trustworthy before model use."],
        ["Operating-context logic is defined","Startup, shutdown, load, control mode and equipment configuration are handled."],
        ["Limitations are documented","Known blind spots and unavailable measurements are visible to reviewers."]]},
      {title:"Analytics / model build",intro:"Build only after scope, data and engineering definitions are stable enough.",items:[
        ["Training / baseline periods are representative","Normal and relevant operating regimes are adequately represented."],
        ["Model outputs are interpretable enough for the workflow","Users can understand deviation, evidence and confidence at the required level."],
        ["Persistence / threshold logic is tuned","Short noise-driven events are separated from meaningful deviations."],
        ["Model version and configuration are traceable","Changes can be reproduced and compared."],
        ["Offline evaluation includes failures and limitations","Do not publish only successful cases."]]},
      {title:"Engineering validation",intro:"Validate the system against plant physics and historical behaviour, not metrics alone.",items:[
        ["Known events / operating changes are replayed","The system behaves sensibly on representative historical cases."],
        ["False-alert scenarios are challenged","Startup, changeover, sensor faults and process transitions are tested."],
        ["Failure-mode relevance is reviewed","Model deviations actually support the intended engineering questions."],
        ["Lead time and actionability are assessed","Insights arrive early enough and point to practical next checks."],
        ["Engineering sign-off criteria are met","Unresolved technical issues are recorded rather than hidden."]]},
      {title:"UAT and workflow",intro:"Test how real users understand and act on the system.",items:[
        ["UAT scenarios reflect actual user workflows","Tests include alert review, evidence inspection, acknowledgement and follow-up."],
        ["Severity and prioritization are understandable","Users know what requires attention first and why."],
        ["Feedback / disposition workflow exists","Users can record valid, false, unresolved and contextual cases."],
        ["Escalation path is clear","Safety-critical or uncertain situations route to qualified engineering review."],
        ["User documentation and training are complete","Users understand both capability and limitations."]]},
      {title:"Go-live, adoption and governance",intro:"The production phase requires ownership and continuous review.",items:[
        ["Production data flow is monitored","Connectivity, latency and data-quality failures are visible."],
        ["Model / alert health is reviewed","Volume, false positives, stale models and changing operating regimes are tracked."],
        ["Roles and response cadence are defined","Someone owns alert review, tuning, escalation and closure."],
        ["Change control is active","Tag changes, model updates, software releases and plant modifications trigger controlled review."],
        ["Security and confidentiality controls are maintained","Credentials, proprietary data and customer/employer information remain protected."],
        ["Value and adoption are reviewed after go-live","Usage, actionability and technical outcomes are reassessed rather than assuming deployment equals success."]]}
    ],outcome:["Ready for next stage — current gate criteria are satisfied.","Conditional progress — known gaps have owners and explicit mitigation.","Hold — critical data, engineering, validation, workflow or governance gap remains."]
  }
};

function resourceKey(){return document.body.dataset.resourceKey || "";}
function storageKey(){return `engineering-resource:${resourceKey()}`;}
function loadState(){try{return JSON.parse(localStorage.getItem(storageKey()))||{checks:{},fields:{},notes:{}}}catch{return {checks:{},fields:{},notes:{}}}}
function saveState(state){localStorage.setItem(storageKey(),JSON.stringify(state));}
function esc(s){return String(s).replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}

function renderResource(){
  const key=resourceKey(); const data=RESOURCE_LIBRARY[key]; if(!data)return;
  const state=loadState();
  document.querySelector("[data-resource-title]").textContent=data.title;
  document.querySelector("[data-resource-deck]").textContent=data.deck;
  document.querySelector("[data-resource-principle]").textContent=data.principle;
  const fields=document.querySelector("[data-resource-fields]");
  fields.innerHTML=data.fields.map((f,i)=>`<div class="resource-field"><label for="field-${i}">${esc(f)}</label><input id="field-${i}" data-field="${i}" value="${esc(state.fields?.[i]||"")}" /></div>`).join("");
  const holder=document.querySelector("[data-checklist-sections]");
  holder.innerHTML=data.sections.map((sec,si)=>`<section class="checklist-section"><div class="checklist-section-head"><span class="checklist-section-no">${String(si+1).padStart(2,"0")}</span><div><h2>${esc(sec.title)}</h2><p class="checklist-section-intro">${esc(sec.intro)}</p></div></div><div class="checklist-items">${sec.items.map((it,ii)=>{const id=`${si}-${ii}`;return `<label class="check-item"><input type="checkbox" data-check="${id}" ${state.checks?.[id]?"checked":""}><span><strong>${esc(it[0])}</strong><small>${esc(it[1])}</small></span></label>`}).join("")}</div><div class="section-notes"><label for="note-${si}">Section notes</label><textarea id="note-${si}" data-note="${si}" placeholder="Record findings, exceptions, evidence or actions...">${esc(state.notes?.[si]||"")}</textarea></div></section>`).join("");
  const outcome=document.querySelector("[data-resource-outcome]"); outcome.innerHTML=`<h2>Suggested review outcome</h2><ul>${data.outcome.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;
  bindResource(); updateProgress();
}

function bindResource(){
  document.querySelectorAll("[data-check]").forEach(el=>el.addEventListener("change",()=>{const s=loadState();s.checks[el.dataset.check]=el.checked;saveState(s);updateProgress();}));
  document.querySelectorAll("[data-field]").forEach(el=>el.addEventListener("input",()=>{const s=loadState();s.fields[el.dataset.field]=el.value;saveState(s);}));
  document.querySelectorAll("[data-note]").forEach(el=>el.addEventListener("input",()=>{const s=loadState();s.notes[el.dataset.note]=el.value;saveState(s);}));
  document.querySelector("[data-print]")?.addEventListener("click",()=>window.print());
  document.querySelector("[data-reset]")?.addEventListener("click",()=>{if(confirm("Clear all checks and notes for this resource?")){localStorage.removeItem(storageKey());location.reload();}});
}
function updateProgress(){const all=[...document.querySelectorAll("[data-check]")];const done=all.filter(x=>x.checked).length;const pct=all.length?Math.round(done/all.length*100):0;document.querySelector("[data-progress-bar]").style.width=`${pct}%`;document.querySelector("[data-progress-text]").textContent=`${done}/${all.length} · ${pct}%`;}

document.addEventListener("DOMContentLoaded",renderResource);
