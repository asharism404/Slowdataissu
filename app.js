(() => {
  "use strict";
  const SUBJECTS = (window.ASH_SUBJECTS || []).map(s => ({ ...s }));
  SUBJECTS.forEach(s=>{const v=(window.ASHARCHIVES_VIDEOS||{})[s.id];s.count=Object.keys(v||{}).length;});
  const $ = id => document.getElementById(id);
  const safeParse = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem("asharrow-theme", theme); }
  const savedTheme = localStorage.getItem("asharrow-theme");
  setTheme(savedTheme || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("themeToggle")?.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  const completed = safeParse("asharrow-completed", []);
  const saved = safeParse("asharrow-saved", []);
  const progress = id => {
    const topics = completed.filter(x => x.startsWith(id + "::"));
    const subject = SUBJECTS.find(s => s.id === id);
    return subject ? Math.min(100, Math.round(topics.length / subject.count * 100)) : 0;
  };
  function renderSubjects() {
    const grid = $("subjectGrid"); if (!grid) return;
    const query = ($("subjectSearch")?.value || "").trim().toLowerCase();
    const year = $("yearFilter")?.value || "all";
    const matches = SUBJECTS.filter(s => (s.name + " " + s.desc).toLowerCase().includes(query) && (year === "all" || String(s.year) === year));
    const ord = y => y === 4 ? "Final year" : `${y}${["st","nd","rd"][y-1] || "th"} year`;
    const rowHtml = s => {
      const pct = progress(s.id);
      return `<a class="subject-row" data-tone="${s.color}" href="lecture.html?subject=${encodeURIComponent(s.id)}" aria-label="Open ${s.name}">
        <span class="subject-icon">${s.icon}</span>
        <div><h3>${s.name}</h3><p>${s.desc}</p><div class="subject-meta"><span class="year-pill">${s.count} lecture topics</span></div></div>
        <div class="subject-side"><span class="subject-pct">${pct}%</span><span class="progress-track"><span style="width:${pct}%"></span></span></div>
      </a>`;
    };
    grid.innerHTML = [1, 2, 3, 4].map(y => {
      const list = matches.filter(s => s.year === y);
      return list.length ? `<section class="subject-group"><div class="subject-group-head"><h3>${ord(y)}</h3><span>${y === 4 ? "Others" : list.length + " subjects"}</span></div><div class="subject-list">${list.map(rowHtml).join("")}</div></section>` : "";
    }).join("");
    $("emptyState").hidden = matches.length !== 0;
  }
  $("subjectGrid")?.addEventListener("pointerdown", e => {
    const row = e.target.closest(".subject-row"); if (!row) return;
    const r = row.getBoundingClientRect(), d = Math.max(r.width, r.height) * 1.6, rp = document.createElement("i");
    rp.className = "row-ripple"; rp.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    row.append(rp); setTimeout(() => rp.remove(), 700);
  });
  $("subjectSearch")?.addEventListener("input", renderSubjects);
  $("yearFilter")?.addEventListener("change", renderSubjects);
  document.addEventListener("keydown", e => {
    if (e.key === "/" && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) { e.preventDefault(); $("subjectSearch")?.focus(); }
  });
  function renderActivity() {
    const dates = [...new Set(completed.map(item => item.split("::")[2]).filter(Boolean))].sort();
    const today = new Date(); today.setHours(0,0,0,0);
    const todayKey = dateKey(today);
    const active = new Set(dates);
    let streak = 0;
    const cursor = new Date(today);
    if (!active.has(todayKey)) cursor.setDate(cursor.getDate()-1);
    while (active.has(dateKey(cursor))) { streak++; cursor.setDate(cursor.getDate()-1); }
    $("streakCount").textContent = streak;
    $("completedCount").textContent = completed.length;
    $("savedCount").textContent = saved.length;
    $("streakMessage").textContent = streak ? "Nice work — keep your learning rhythm going." : "Your streak starts when you complete a lecture.";
    const labels = ["S","M","T","W","T","F","S"];
    const days = [];
    for (let i=6;i>=0;i--) { const d=new Date(today); d.setDate(today.getDate()-i); const key=dateKey(d); days.push(`<div class="week-day"><span class="week-dot ${active.has(key)?"active":""}">${active.has(key)?"✓":""}</span><span>${labels[d.getDay()]}</span></div>`); }
    $("weekRow").innerHTML = days.join("");
  }
  function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
  renderSubjects(); renderActivity();
})();
