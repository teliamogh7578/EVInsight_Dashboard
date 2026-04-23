let charts = {};
let tripMode = "eco";
let darkMode = false;
let currentUser = { name: "You", initials: "YO" };

/* ─── AUTH ─── */
function showAuthScreen(s) {
  document
    .querySelectorAll(".auth-card")
    .forEach((c) => (c.style.display = "none"));
  document.getElementById("screen-" + s).style.display = "block";
}

function togglePw(id, btn) {
  const el = document.getElementById(id);
  const show = el.type === "password";
  el.type = show ? "text" : "password";
  btn.innerHTML = show
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
}

function checkStr(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const fills = [
    ["0%", "var(--border)", ""],
    ["25%", "var(--red)", "Weak"],
    ["50%", "var(--amber)", "Fair"],
    ["75%", "var(--amber)", "Good"],
    ["100%", "var(--green)", "Strong"],
  ];
  const [w, c, t] = fills[s];
  const f = document.getElementById("str-fill");
  f.style.width = w;
  f.style.background = c;
  const l = document.getElementById("str-lbl");
  l.textContent = t || "Enter a password";
  l.style.color = c || "var(--text3)";
}

function showFieldErr(id, show) {
  const e = document.getElementById(id);
  if (e) e.style.display = show ? "block" : "none";
}
function setErr(id, err) {
  const e = document.getElementById(id);
  if (e) e.classList.toggle("err", err);
}

function doLogin() {
  const email = document.getElementById("login-email").value.trim();
  const pw = document.getElementById("login-pw").value;
  let ok = true;
  if (!email || !email.includes("@")) {
    showFieldErr("err-le", true);
    setErr("login-email", true);
    ok = false;
  } else {
    showFieldErr("err-le", false);
    setErr("login-email", false);
  }
  if (!pw) {
    showFieldErr("err-lp", true);
    setErr("login-pw", true);
    ok = false;
  } else {
    showFieldErr("err-lp", false);
    setErr("login-pw", false);
  }
  if (!ok) return;
  const name = email
    .split("@")[0]
    .replace(/[._]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  currentUser = {
    name,
    initials:
      name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || email.slice(0, 2).toUpperCase(),
  };
  launchApp();
}

function doRegister() {
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pw = document.getElementById("reg-pw").value;
  let ok = true;
  if (!name) {
    showFieldErr("err-rn", true);
    setErr("reg-name", true);
    ok = false;
  } else {
    showFieldErr("err-rn", false);
    setErr("reg-name", false);
  }
  if (!email || !email.includes("@")) {
    showFieldErr("err-re", true);
    setErr("reg-email", true);
    ok = false;
  } else {
    showFieldErr("err-re", false);
    setErr("reg-email", false);
  }
  if (pw.length < 8) {
    showFieldErr("err-rp", true);
    setErr("reg-pw", true);
    ok = false;
  } else {
    showFieldErr("err-rp", false);
    setErr("reg-pw", false);
  }
  if (!ok) return;
  const veh = document.getElementById("reg-veh").value.trim();
  if (veh) document.getElementById("topbar-name").textContent = veh;
  currentUser = {
    name,
    initials: name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };
  showAuthScreen("login");
  const b = document.getElementById("reg-success-msg");
  b.style.display = "flex";
}

function doGoogleLogin() {
  currentUser = { name: "Alex Johnson", initials: "AJ" };
  launchApp();
}

function doForgot() {
  const email = document.getElementById("forgot-email").value.trim();
  if (!email || !email.includes("@")) {
    showFieldErr("err-fe", true);
    return;
  }
  showFieldErr("err-fe", false);
  document.getElementById("forgot-form-inner").style.display = "none";
  document.getElementById("forgot-sent").style.display = "block";
}

function launchApp() {
  document.getElementById("auth-screen").style.display = "none";
  const app = document.getElementById("app-shell");
  app.style.display = "flex";
  document.getElementById("user-avatar").textContent = currentUser.initials;
  document.getElementById("mob-user-avatar").textContent = currentUser.initials;
  document.getElementById("mob-user-name").textContent = currentUser.name;
  update();
}

function doSignOut() {
  document.getElementById("app-shell").style.display = "none";
  document.getElementById("auth-screen").style.display = "flex";
  showAuthScreen("login");
  closeDrawer();
}

/* ─── MOBILE DRAWER ─── */
function openDrawer() {
  document.getElementById("mob-overlay").classList.add("open");
  document.getElementById("mob-drawer").classList.add("open");
}
function closeDrawer() {
  document.getElementById("mob-overlay").classList.remove("open");
  document.getElementById("mob-drawer").classList.remove("open");
}

/* ─── NAVIGATION ─── */
function navigate(page, el) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  if (el) el.classList.add("active");
  const mobId = "mob-item-" + page;
  const mobEl = document.getElementById(mobId);
  if (mobEl) mobEl.classList.add("active");
  if (page === "analytics") setTimeout(() => buildCharts(), 50);
  if (page === "battery") setTimeout(() => buildVoltChart(), 50);
  if (page === "alerts") buildAlerts();
}

/* ─── PROTO PANEL ─── */
function toggleProto() {
  const body = document.getElementById("proto-body");
  const chev = document.getElementById("proto-chevron");
  body.classList.toggle("open");
  chev.style.transform = body.classList.contains("open")
    ? "rotate(180deg)"
    : "";
}

/* ─── SENSOR VALUES ─── */
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

let MAX_RANGE = 150;

/* ─── MAIN UPDATE ─── */
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

  let statusLabel = "Safe",
    statusSub = "All systems normal",
    statusColor = "var(--green)",
    statusBg = "var(--green-mid)",
    icon = "✓";
  if (v.batt < 10) {
    statusLabel = "Critical";
    statusSub = "Battery critically low";
    statusColor = "var(--red)";
    statusBg = "var(--red-mid)";
    icon = "!";
  } else if (v.batt < 20) {
    statusLabel = "Low Battery";
    statusSub = "Charge soon";
    statusColor = "var(--amber)";
    statusBg = "var(--amber-mid)";
    icon = "↓";
  }
  if (v.curr > 40) {
    statusLabel = "High Usage";
    statusSub = "Reduce throttle";
    statusColor = "var(--amber)";
    statusBg = "var(--amber-mid)";
    icon = "↑";
  }
  if (v.temp > 45) {
    statusLabel = "Temperature High";
    statusSub = "Battery overheating";
    statusColor = "var(--red)";
    statusBg = "var(--red-mid)";
    icon = "🌡";
  }

  const tags = [];
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

  document.getElementById("recs-list").innerHTML = recs
    .slice(0, 4)
    .map(
      (r) =>
        `<div class="rec-item"><div class="rec-ico" style="background:var(--surface2)">${r.ico}</div><div><div class="rec-text">${r.text}</div><div class="rec-type">${r.type}</div></div></div>`,
    )
    .join("");

  updateBatteryHealth(v);

  let ac = 0;
  if (v.batt < 20) ac++;
  if (!canReach) ac++;
  if (v.curr > 40) ac++;
  if (v.temp > 45) ac++;
  const acEl = document.getElementById("alert-count");
  acEl.textContent = ac || "";
  acEl.style.display = ac ? "" : "none";
  const mobAc = document.getElementById("mob-alert-count");
  mobAc.textContent = ac || "";
  mobAc.style.display = ac ? "" : "none";
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
  ring.setAttribute("stroke-dashoffset", (314 * (1 - health / 100)).toFixed(1));
  ring.setAttribute(
    "stroke",
    health > 60 ? "#16a34a" : health > 30 ? "#d97706" : "#dc2626",
  );
  const hpill = document.getElementById("health-pill");
  hpill.className =
    "status-pill " +
    (health > 60 ? "pill-green" : health > 40 ? "pill-amber" : "pill-red");
  hpill.innerHTML =
    '<span class="pill-dot"></span>' +
    (health > 60 ? "Good" : health > 40 ? "Watch" : "Poor");
  const vs = Math.round(Math.min(100, 85 + (v.volt - 36) * 0.5));
  document.getElementById("volt-stab").textContent = vs + "%";
  document.getElementById("volt-stab-bar").style.width = vs + "%";
  document.getElementById("volt-stab-bar").style.background =
    vs > 70 ? "var(--green)" : "var(--amber)";
  const cr = Math.round(Math.min(100, 88 - v.curr * 0.1));
  document.getElementById("cap-ret").textContent = cr + "%";
  document.getElementById("cap-ret-bar").style.width = cr + "%";
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
      sub: "Battery at " + v.batt + "%",
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
    red: "var(--red-mid)",
    amber: "var(--amber-mid)",
    green: "var(--green-mid)",
  };
  document.getElementById("alerts-list").innerHTML = alerts
    .map(
      (a) =>
        `<div class="alert-card"><div class="alert-icon" style="background:${colorMap[a.sev]}">${a.icon}</div><div style="flex:1"><div class="alert-title">${a.title}</div><div class="alert-sub">${a.sub}</div><div class="alert-time">${a.time}</div></div><span class="status-pill ${a.sev === "red" ? "pill-red" : a.sev === "amber" ? "pill-amber" : "pill-green"}" style="font-size:11px"><span class="pill-dot"></span>${a.sev === "red" ? "Critical" : a.sev === "amber" ? "Warning" : "OK"}</span></div>`,
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
  const battUsed = Math.min(
    100,
    Math.round(((dist / MAX_RANGE) * 100) / modeMulti),
  );
  const recThr = { eco: 40, normal: 60, sport: 80 }[tripMode];
  document.getElementById("trip-output").innerHTML =
    `${canReach ? `<div class="reach-result reach-yes"><div class="reach-icon">✅</div><div class="reach-label" style="color:var(--green)">Trip Feasible</div><div class="reach-sub">${dist} km journey within your ${range} km range</div></div>` : `<div class="reach-result reach-no"><div class="reach-icon">❌</div><div class="reach-label" style="color:var(--red)">Trip Not Feasible</div><div class="reach-sub">Need ${dist - range} km more range — charge to ${Math.min(100, Math.round(v.batt + ((dist - range) / MAX_RANGE) * 100))}% first</div></div>`}<div style="margin-top:12px"><div class="info-row"><span class="info-key">Expected battery usage</span><span class="info-val">${battUsed}%</span></div><div class="info-row"><span class="info-key">Available range</span><span class="info-val">${range} km</span></div><div class="info-row"><span class="info-key">Range after trip</span><span class="info-val">${Math.max(0, range - dist)} km</span></div><div class="info-row"><span class="info-key">Charging stop</span><span class="info-val">${canReach && range - dist < 30 ? "Recommended at ~" + Math.round(dist * 0.6) + " km" : canReach ? "Not required" : "Before departure"}</span></div><div class="info-row"><span class="info-key">Suggested throttle</span><span class="info-val">${recThr}% max</span></div><div class="info-row"><span class="info-key">Driving mode</span><span class="info-val" style="text-transform:capitalize">${tripMode}</span></div></div>`;
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
  charts.volt = new Chart(document.getElementById("voltChart"), {
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
  const root = document.documentElement;
  if (darkMode) {
    root.style.setProperty("--bg", "#0f111a");
    root.style.setProperty("--surface", "#1a1d2e");
    root.style.setProperty("--surface2", "#22263a");
    root.style.setProperty("--border", "#2a2d3e");
    root.style.setProperty("--text", "#e8eaf0");
    root.style.setProperty("--text2", "#9ca3c4");
    root.style.setProperty("--text3", "#6b7280");
    root.style.setProperty("--blue-light", "#1e2a4a");
    root.style.setProperty("--blue-mid", "#1e3a6e");
    root.style.setProperty("--green-light", "#0d2318");
    root.style.setProperty("--green-mid", "#14532d55");
    root.style.setProperty("--amber-light", "#1c1506");
    root.style.setProperty("--amber-mid", "#78350f44");
    root.style.setProperty("--red-light", "#1c0606");
    root.style.setProperty("--red-mid", "#7f1d1d44");
  } else {
    root.style.setProperty("--bg", "#f7f8fa");
    root.style.setProperty("--surface", "#ffffff");
    root.style.setProperty("--surface2", "#f0f2f5");
    root.style.setProperty("--border", "#e4e7ec");
    root.style.setProperty("--text", "#111827");
    root.style.setProperty("--text2", "#6b7280");
    root.style.setProperty("--text3", "#9ca3af");
    root.style.setProperty("--blue-light", "#eff6ff");
    root.style.setProperty("--blue-mid", "#dbeafe");
    root.style.setProperty("--green-light", "#f0fdf4");
    root.style.setProperty("--green-mid", "#dcfce7");
    root.style.setProperty("--amber-light", "#fffbeb");
    root.style.setProperty("--amber-mid", "#fef3c7");
    root.style.setProperty("--red-light", "#fef2f2");
    root.style.setProperty("--red-mid", "#fee2e2");
  }
}

toggleProto();
