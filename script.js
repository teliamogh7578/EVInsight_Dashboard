let charts = {};
let tripMode = "eco";
let darkMode = false;

function navigate(page, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  if (el) el.classList.add("active");
  if (page === "analytics") setTimeout(() => buildCharts(), 50);
  if (page === "battery") setTimeout(() => buildVoltChart(), 50);
  if (page === "alerts") buildAlerts();
}

function toggleProto() {
  const body = document.getElementById("proto-body");
  const chev = document.getElementById("proto-chevron");
  body.classList.toggle("open");
  chev.style.transform = body.classList.contains("open")
    ? "rotate(180deg)"
    : "";
}

function getVals() {
  return {
    batt: +document.getElementById("sl-batt").value,
    volt: +document.getElementById("sl-volt").value,
    dest: +document.getElementById("sl-dest").value,
    thr: +document.getElementById("sl-thr").value,
    curr: +document.getElementById("sl-curr").value,
    temp: +document.getElementById("sl-temp").value,
  };
}

const MAX_RANGE = 150;

function update() {
  const v = getVals();
  document.getElementById("lbl-batt").textContent = v.batt + "%";
  document.getElementById("lbl-volt").textContent = v.volt.toFixed(1) + " V";
  document.getElementById("lbl-dest").textContent = v.dest + " km";
  document.getElementById("lbl-thr").textContent = v.thr + "%";
  document.getElementById("lbl-curr").textContent = v.curr + " A";
  document.getElementById("lbl-temp").textContent = v.temp + "°C";

  const range = Math.round((v.batt / 100) * MAX_RANGE * (1 - v.thr * 0.003));
  const power = (v.volt * v.curr) / 1000;
  const runtime = v.curr > 0 ? ((v.batt / 100) * 50) / v.curr : 0;
  const canReach = range >= v.dest;
  const afterRange = range - v.dest;
  const eff = Math.max(
    10,
    Math.min(100, 100 - v.thr * 0.4 - v.curr * 0.5 + v.batt * 0.1),
  );

  document.getElementById("d-batt").innerHTML =
    v.batt + '<span class="stat-unit">%</span>';
  document.getElementById("d-volt").textContent = v.volt.toFixed(1) + " V";
  document.getElementById("d-runtime").textContent = runtime.toFixed(1) + " h";
  document.getElementById("d-range").textContent = range + " km";
  document.getElementById("d-curr").textContent = v.curr + " A";
  document.getElementById("d-power").textContent = power.toFixed(2) + " kW";
  document.getElementById("d-dest-km").textContent = v.dest + " km";
  document.getElementById("thr-label").textContent = v.thr + "%";

  const bar = document.getElementById("batt-bar");
  bar.style.width = v.batt + "%";
  bar.style.background =
    v.batt > 40 ? "var(--green)" : v.batt > 20 ? "var(--amber)" : "var(--red)";

  const chargePill =
    v.batt >= 100
      ? '<span class="status-pill pill-green"><span class="pill-dot"></span>Full</span>'
      : v.batt < 20
        ? '<span class="status-pill pill-red"><span class="pill-dot"></span>Critical</span>'
        : v.batt < 40
          ? '<span class="status-pill pill-amber"><span class="pill-dot"></span>Low</span>'
          : '<span class="status-pill pill-green"><span class="pill-dot"></span>Discharging</span>';
  document.getElementById("d-charge-pill").innerHTML = chargePill;

  const effBar = document.getElementById("eff-bar");
  effBar.style.width = Math.round(eff) + "%";
  effBar.style.background =
    eff > 60 ? "var(--green)" : eff > 30 ? "var(--amber)" : "var(--red)";
  document.getElementById("eff-label").textContent =
    eff > 60 ? "Good" : eff > 30 ? "Fair" : "Poor";

  const thrBar = document.getElementById("thr-bar");
  thrBar.style.width = v.thr + "%";
  thrBar.style.background =
    v.thr > 75 ? "var(--red)" : v.thr > 50 ? "var(--amber)" : "var(--blue)";

  const reachDiv = document.getElementById("d-reach-result");
  if (canReach) {
    reachDiv.innerHTML = `<div class="reach-result reach-yes"><div class="reach-icon">✅</div><div class="reach-label" style="color:var(--green)">Destination Reachable</div><div class="reach-sub">Range: ${range} km &nbsp;|&nbsp; Destination: ${v.dest} km</div></div>`;
  } else {
    reachDiv.innerHTML = `<div class="reach-result reach-no"><div class="reach-icon">❌</div><div class="reach-label" style="color:var(--red)">Destination Not Reachable</div><div class="reach-sub">Short by ${v.dest - range} km — charge before departing</div></div>`;
  }

  document.getElementById("d-after-range").textContent = canReach
    ? afterRange + " km remaining"
    : "—";
  document.getElementById("d-charge-stop").textContent =
    canReach && afterRange < 30
      ? "Recommended at ~" + Math.round(v.dest * 0.7) + " km"
      : canReach
        ? "Not required"
        : "Before departure";
  document.getElementById("d-rec-thr").textContent = canReach
    ? Math.min(v.thr, 70) + "% max"
    : "Charge first";

  // Status
  let statusKey = "safe",
    statusLabel = "Safe",
    statusSub = "All systems normal",
    statusColor = "var(--green)",
    statusBg = "var(--green-mid)",
    icon = "✓";
  const tags = [];
  if (v.batt < 10) {
    statusKey = "critical";
    statusLabel = "Critical";
    statusSub = "Battery critically low";
    statusColor = "var(--red)";
    statusBg = "var(--red-mid)";
    icon = "!";
  } else if (v.batt < 20) {
    statusKey = "low";
    statusLabel = "Low Battery";
    statusSub = "Charge soon";
    statusColor = "var(--amber)";
    statusBg = "var(--amber-mid)";
    icon = "↓";
  }
  if (v.curr > 40) {
    statusKey = "highusage";
    statusLabel = "High Usage";
    statusSub = "Reduce throttle";
    statusColor = "var(--amber)";
    statusBg = "var(--amber-mid)";
    icon = "↑";
  }
  if (v.temp > 45) {
    statusKey = "hot";
    statusLabel = "Temperature High";
    statusSub = "Battery overheating";
    statusColor = "var(--red)";
    statusBg = "var(--red-mid)";
    icon = "🌡";
  }

  if (v.batt > 60)
    tags.push(
      '<span class="status-pill pill-green" style="font-size:11px"><span class="pill-dot"></span>Battery OK</span>',
    );
  else if (v.batt > 20)
    tags.push(
      '<span class="status-pill pill-amber" style="font-size:11px"><span class="pill-dot"></span>Low Battery</span>',
    );
  else
    tags.push(
      '<span class="status-pill pill-red" style="font-size:11px"><span class="pill-dot"></span>Critical</span>',
    );
  if (canReach)
    tags.push(
      '<span class="status-pill pill-green" style="font-size:11px"><span class="pill-dot"></span>Trip OK</span>',
    );
  else
    tags.push(
      '<span class="status-pill pill-red" style="font-size:11px"><span class="pill-dot"></span>Trip Blocked</span>',
    );
  if (v.curr > 40)
    tags.push(
      '<span class="status-pill pill-amber" style="font-size:11px"><span class="pill-dot"></span>High Draw</span>',
    );
  if (v.temp > 40)
    tags.push(
      '<span class="status-pill pill-amber" style="font-size:11px"><span class="pill-dot"></span>Warm</span>',
    );

  const si = document.getElementById("status-icon");
  si.style.background = statusBg;
  si.textContent = icon;
  document.getElementById("status-label").style.color = statusColor;
  document.getElementById("status-label").textContent = statusLabel;
  document.getElementById("status-sub").textContent = statusSub;
  document.getElementById("status-tags").innerHTML = tags.join("");

  // Recommendations
  const recs = [];
  if (v.thr > 70)
    recs.push({
      ico: "🐢",
      type: "Efficiency",
      text: "Reduce throttle below 70% to extend range by up to 20%",
    });
  if (v.batt < 20 && !canReach)
    recs.push({
      ico: "⚡",
      type: "Urgent",
      text: "Charge immediately — battery critically low and destination unreachable",
    });
  else if (v.batt < 30)
    recs.push({
      ico: "🔋",
      type: "Charging",
      text: "Charge within the next 10 km to avoid being stranded",
    });
  if (canReach && afterRange < 20)
    recs.push({
      ico: "📍",
      type: "Planning",
      text: "Plan a charging stop near your destination — low buffer range",
    });
  if (v.temp > 45)
    recs.push({
      ico: "❄",
      type: "Temperature",
      text: "Battery temperature high — reduce load and allow cooling",
    });
  if (v.curr < 15 && v.batt > 60)
    recs.push({
      ico: "✅",
      type: "Status",
      text: "Battery performing normally — efficient driving mode active",
    });
  if (canReach && afterRange > 50)
    recs.push({
      ico: "🎯",
      type: "Status",
      text: "Destination comfortably reachable with good range buffer",
    });
  if (recs.length === 0)
    recs.push({
      ico: "✅",
      type: "Status",
      text: "All systems operating normally",
    });

  const recsEl = document.getElementById("recs-list");
  recsEl.innerHTML = recs
    .slice(0, 4)
    .map(
      (r) =>
        `<div class="rec-item"><div class="rec-ico" style="background:var(--surface2)">${r.ico}</div><div><div class="rec-text">${r.text}</div><div class="rec-type">${r.type}</div></div></div>`,
    )
    .join("");

  // Update battery health page
  updateBatteryHealth(v);
  // Update alert count
  let ac = 0;
  if (v.batt < 20) ac++;
  if (!canReach) ac++;
  if (v.curr > 40) ac++;
  if (v.temp > 45) ac++;
  document.getElementById("alert-count").textContent = ac || "";
  document.getElementById("alert-count").style.display = ac ? "" : "none";

  document.getElementById("last-updated").textContent = "Updated just now";
}

function updateBatteryHealth(v) {
  const health = Math.max(
    20,
    Math.min(
      100,
      Math.round(
        70 +
          ((v.volt - 36) / 18) * 20 -
          (v.temp > 45 ? 15 : 0) -
          (v.curr > 40 ? 5 : 0),
      ),
    ),
  );
  document.getElementById("health-score-val").textContent = health;
  const ring = document.getElementById("health-ring");
  const offset = 314 * (1 - health / 100);
  ring.setAttribute("stroke-dashoffset", offset.toFixed(1));
  ring.setAttribute(
    "stroke",
    health > 60 ? "#16a34a" : health > 30 ? "#d97706" : "#dc2626",
  );

  const voltStab = Math.round(Math.min(100, 85 + (v.volt - 36) * 0.5));
  document.getElementById("volt-stab").textContent = voltStab + "%";
  document.getElementById("volt-stab-bar").style.width = voltStab + "%";
  document.getElementById("volt-stab-bar").style.background =
    voltStab > 70 ? "var(--green)" : "var(--amber)";

  const capRet = Math.round(Math.min(100, 88 - v.curr * 0.1));
  document.getElementById("cap-ret").textContent = capRet + "%";
  document.getElementById("cap-ret-bar").style.width = capRet + "%";
  document.getElementById("cap-ret-bar").style.background =
    capRet > 70 ? "var(--green)" : "var(--amber)";

  const thermal = v.temp < 35 ? 100 : v.temp < 45 ? 80 : 50;
  const thermalLabel = v.temp < 35 ? "Optimal" : v.temp < 45 ? "Warm" : "High";
  document.getElementById("therm-cond").textContent = thermalLabel;
  document.getElementById("therm-bar").style.width = thermal + "%";
  document.getElementById("therm-bar").style.background =
    thermal > 70
      ? "var(--green)"
      : thermal > 40
        ? "var(--amber)"
        : "var(--red)";

  document.getElementById("batt-temp-disp").textContent =
    v.temp + "°C — " + thermalLabel;
  document.getElementById("degradation").textContent =
    "~" + ((100 - health) * 0.05).toFixed(1) + "%";

  const repStatus =
    health > 70
      ? '<span class="status-pill pill-green" style="font-size:11px"><span class="pill-dot"></span>Good</span>'
      : health > 40
        ? '<span class="status-pill pill-amber" style="font-size:11px"><span class="pill-dot"></span>Watch</span>'
        : '<span class="status-pill pill-red" style="font-size:11px"><span class="pill-dot"></span>Poor</span>';
  document.getElementById("replace-status").innerHTML = repStatus;

  const hpill = document.getElementById("health-pill");
  hpill.className =
    "status-pill " +
    (health > 70 ? "pill-green" : health > 40 ? "pill-amber" : "pill-red");
  hpill.innerHTML =
    '<span class="pill-dot"></span>' +
    (health > 70 ? "Good" : health > 40 ? "Watch" : "Poor");
}

function buildAlerts() {
  const v = getVals();
  const range = Math.round((v.batt / 100) * MAX_RANGE * (1 - v.thr * 0.003));
  const canReach = range >= v.dest;
  const alerts = [];
  if (v.batt < 20)
    alerts.push({
      sev: "red",
      icon: "🔋",
      title: "Battery below safe threshold",
      sub: "Current level: " + v.batt + "% — charge immediately",
      time: "Just now",
    });
  if (!canReach)
    alerts.push({
      sev: "red",
      icon: "📍",
      title: "Destination may not be reachable",
      sub: "Range: " + range + " km / Destination: " + v.dest + " km",
      time: "Just now",
    });
  if (v.curr > 40)
    alerts.push({
      sev: "amber",
      icon: "⚡",
      title: "High power draw detected",
      sub: "Current draw: " + v.curr + "A — consider reducing throttle",
      time: "Just now",
    });
  if (v.temp > 45)
    alerts.push({
      sev: "red",
      icon: "🌡",
      title: "Battery temperature elevated",
      sub: "Temperature: " + v.temp + "°C — allow cooling before heavy use",
      time: "Just now",
    });
  if (v.batt < 30 && v.batt >= 20)
    alerts.push({
      sev: "amber",
      icon: "🔌",
      title: "Charging recommended soon",
      sub: "Battery at " + v.batt + "% — find a charging point",
      time: "Just now",
    });
  if (alerts.length === 0)
    alerts.push({
      sev: "green",
      icon: "✅",
      title: "No active alerts",
      sub: "All systems operating normally",
      time: "Just now",
    });

  const colorMap = {
    red: ["var(--red-mid)", "var(--red)"],
    amber: ["var(--amber-mid)", "var(--amber)"],
    green: ["var(--green-mid)", "var(--green)"],
  };
  document.getElementById("alerts-list").innerHTML = alerts
    .map(
      (a) => `
    <div class="alert-card">
      <div class="alert-icon" style="background:${colorMap[a.sev][0]}">${a.icon}</div>
      <div style="flex:1">
        <div class="alert-title">${a.title}</div>
        <div class="alert-sub">${a.sub}</div>
        <div class="alert-time">${a.time}</div>
      </div>
      <span class="status-pill ${a.sev === "red" ? "pill-red" : a.sev === "amber" ? "pill-amber" : "pill-green"}" style="font-size:11px"><span class="pill-dot"></span>${a.sev === "red" ? "Critical" : a.sev === "amber" ? "Warning" : "OK"}</span>
    </div>`,
    )
    .join("");
}

function selectMode(m) {
  tripMode = m;
  ["eco", "normal", "sport"].forEach((x) =>
    document.getElementById("mode-" + x).classList.remove("selected"),
  );
  document.getElementById("mode-" + m).classList.add("selected");
}

function calcTrip() {
  const v = getVals();
  const dist = +document.getElementById("trip-dist").value;
  const modeMulti = { eco: 1.15, normal: 1.0, sport: 0.82 }[tripMode];
  const range = Math.round((v.batt / 100) * MAX_RANGE * modeMulti);
  const canReach = range >= dist;
  const battUsed = Math.round(((dist / MAX_RANGE) * 100) / modeMulti);
  const recThr = { eco: 40, normal: 60, sport: 80 }[tripMode];
  const out = document.getElementById("trip-output");
  out.innerHTML = `
    ${
      canReach
        ? `<div class="reach-result reach-yes"><div class="reach-icon">✅</div><div class="reach-label" style="color:var(--green)">Trip Feasible</div><div class="reach-sub">${dist} km journey within your ${range} km range</div></div>`
        : `<div class="reach-result reach-no"><div class="reach-icon">❌</div><div class="reach-label" style="color:var(--red)">Trip Not Feasible</div><div class="reach-sub">Need ${dist - range} km more range — charge to ${Math.min(100, Math.round(v.batt + ((dist - range) / MAX_RANGE) * 100))}% first</div></div>`
    }
    <div style="margin-top:12px">
      <div class="info-row"><span class="info-key">Expected battery usage</span><span class="info-val">${Math.min(100, battUsed)}%</span></div>
      <div class="info-row"><span class="info-key">Available range</span><span class="info-val">${range} km</span></div>
      <div class="info-row"><span class="info-key">Range after trip</span><span class="info-val">${Math.max(0, range - dist)} km</span></div>
      <div class="info-row"><span class="info-key">Charging stop</span><span class="info-val">${canReach && range - dist < 30 ? "Recommended at ~" + Math.round(dist * 0.6) + " km" : canReach ? "Not required" : "Before departure"}</span></div>
      <div class="info-row"><span class="info-key">Suggested throttle</span><span class="info-val">${recThr}% max</span></div>
      <div class="info-row"><span class="info-key">Driving mode</span><span class="info-val" style="text-transform:capitalize">${tripMode}</span></div>
    </div>`;
}

function buildVoltChart() {
  if (charts.volt) charts.volt.destroy();
  const v = getVals();
  const base = v.volt;
  const labels = [
    "T-9",
    "T-8",
    "T-7",
    "T-6",
    "T-5",
    "T-4",
    "T-3",
    "T-2",
    "T-1",
    "Now",
  ];
  const data = labels.map(
    (_, i) => +(base - 0.8 + Math.random() * 1.6).toFixed(2),
  );
  data[9] = base;
  const ctx = document.getElementById("voltChart");
  charts.volt = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Voltage (V)",
          data,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,.06)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#2563eb",
          pointRadius: 4,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          grid: { color: "rgba(0,0,0,.05)" },
          ticks: { font: { size: 11 } },
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

function buildCharts() {
  const makeData = (base, range, n = 10) =>
    Array.from({ length: n }, () =>
      Math.round(base - range / 2 + Math.random() * range),
    );
  const v = getVals();
  if (charts.batt) charts.batt.destroy();
  if (charts.eff) charts.eff.destroy();
  if (charts.runtime) charts.runtime.destroy();
  if (charts.thr) charts.thr.destroy();
  const labels = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];
  charts.batt = new Chart(document.getElementById("battChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Battery %",
          data: [...makeData(65, 30, 9), v.batt],
          borderColor: "#16a34a",
          backgroundColor: "rgba(22,163,74,.07)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(0,0,0,.05)" },
          ticks: { font: { size: 11 } },
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
  charts.eff = new Chart(document.getElementById("effChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Efficiency",
          data: makeData(70, 30),
          backgroundColor: "rgba(37,99,235,.7)",
          borderRadius: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          grid: { color: "rgba(0,0,0,.05)" },
          ticks: { font: { size: 11 } },
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
  charts.runtime = new Chart(document.getElementById("runtimeChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Runtime (h)",
          data: makeData(3.5, 2),
          borderColor: "#9333ea",
          backgroundColor: "rgba(147,51,234,.07)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          grid: { color: "rgba(0,0,0,.05)" },
          ticks: { font: { size: 11 } },
        },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
  charts.thr = new Chart(document.getElementById("thrChart"), {
    type: "doughnut",
    data: {
      labels: ["Eco (<40%)", "Normal (40-70%)", "Sport (>70%)"],
      datasets: [
        {
          data: [30, 45, 25],
          backgroundColor: ["#16a34a", "#2563eb", "#d97706"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: "65%",
    },
  });
}

function toggleDark(el) {
  el.classList.toggle("on");
  darkMode = el.classList.contains("on");
  document.body.style.background = darkMode ? "#0f111a" : "";
  document
    .querySelectorAll(".card,.sidebar,.topbar,.proto-panel")
    .forEach((c) => (c.style.background = darkMode ? "#1a1d2e" : ""));
  document
    .querySelectorAll(".card")
    .forEach((c) => (c.style.border = darkMode ? "1px solid #2a2d3e" : ""));
}

toggleProto();
update();
