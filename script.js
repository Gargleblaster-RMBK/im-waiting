const DATA_URL = "data.json";
const REFRESH_DATA_MS = 5 * 60 * 1000;

let latest = null;

function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function renderStatic(data) {
  document.getElementById("lastUpdated").textContent = formatDateTime(data.updated);
  document.getElementById("version").textContent = data.version || "n/a";
  document.getElementById("editedAt").textContent = formatDateTime(data.editedAt);
  getLastMajorUpdateNumber(data);
}

function getLastMajorUpdateNumber(data) {
  document.getElementById("versionDisplay").textContent = data.MajVersion || "n/a";
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function daysInMonth(year, month0) {
  // month0 is 0-11; day 0 of the next month == last day of this month
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}

// Add `n` calendar months to `date`, clamping the day-of-month so e.g.
// Jan 31 + 1 month lands on Feb 28/29 instead of overflowing into March.
function addMonthsClamped(date, n) {
  const totalMonth = date.getUTCFullYear() * 12 + date.getUTCMonth() + n;
  const targetYear = Math.floor(totalMonth / 12);
  const targetMonth0 = ((totalMonth % 12) + 12) % 12;
  const clampedDay = Math.min(date.getUTCDate(), daysInMonth(targetYear, targetMonth0));
  return new Date(Date.UTC(
    targetYear, targetMonth0, clampedDay,
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds()
  ));
}

// Calendar-aware breakdown: walk `start` forward whole months until one more
// month would pass `now`, then take the leftover as an exact duration. This
// avoids the negative-day bug a naive field-by-field subtraction hits when
// `now`'s hour is earlier than `start`'s hour right after a short month.
function breakdown(start, now) {
  let monthsTotal = (now.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (now.getUTCMonth() - start.getUTCMonth());

  let anchor = addMonthsClamped(start, monthsTotal);
  if (anchor.getTime() > now.getTime()) {
    monthsTotal -= 1;
    anchor = addMonthsClamped(start, monthsTotal);
  }

  const years = Math.floor(monthsTotal / 12);
  const months = monthsTotal - years * 12;

  const remainderMs = now.getTime() - anchor.getTime();
  const days = Math.floor(remainderMs / 86400000);
  const hours = Math.floor((remainderMs % 86400000) / 3600000);
  const minutes = Math.floor((remainderMs % 3600000) / 60000);
  const seconds = Math.floor((remainderMs / 1000) % 60);

  return { years, months, days, hours, minutes, seconds };
}

function setFlip(id, value) {
  const el = document.getElementById(id);
  if (el) el.dataset.value = pad2(value);
}

function tick() {
  if (!latest) return;

  const start = new Date(latest.updated);
  const now = new Date(Math.max(start.getTime(), Date.now()));
  const b = breakdown(start, now);

  const yearsGroup = document.getElementById("yearsGroup");
  if (yearsGroup) yearsGroup.hidden = b.years === 0;

  setFlip("tickYears", b.years);
  setFlip("tickMonths", b.months);
  setFlip("tickDays", b.days);
  setFlip("tickHours", b.hours);
  setFlip("tickMinutes", b.minutes);
  setFlip("tickSeconds", b.seconds);

  const daysEl = document.getElementById("days");
  if (daysEl) {
    daysEl.textContent =
      `${b.years} years, ${b.months} months, ${b.days} days, ` +
      `${b.hours} hours, ${b.minutes} minutes, ${b.seconds} seconds since last update`;
  }
}

async function loadData() {
  try {
    const res = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    latest = data;
    renderStatic(data);
    tick();

    const status = document.getElementById("status");
    if (status) status.hidden = true;
  } catch (err) {
    const status = document.getElementById("status");
    if (status) status.hidden = false;
    console.error("Failed to load data.json", err);
  }
}

loadData();
setInterval(tick, 1000);
setInterval(loadData, REFRESH_DATA_MS);
