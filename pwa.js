(() => {
  "use strict";
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1"))
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (standalone) return;
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let deferred = null, btn = null;
  const toast = (m, o) => window.AshUI && AshUI.toast(m, o);
  const addButton = () => {
    const foot = document.querySelector(".drawer-foot");
    if (btn || !foot) return;
    btn = document.createElement("button");
    btn.className = "drawer-theme"; btn.type = "button";
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg><span>Install app</span>';
    btn.addEventListener("click", async () => {
      if (deferred) { deferred.prompt(); await deferred.userChoice.catch(() => {}); deferred = null; btn.remove(); btn = null; }
      else toast("Tap Share, then “Add to Home Screen”.", { ms: 6000 });
    });
    foot.querySelector(".drawer-theme").after(btn);
  };
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; addButton(); });
  addEventListener("appinstalled", () => { deferred = null; btn && btn.remove(); btn = null; toast("Asharchives installed."); });
  if (ios) addEventListener("load", addButton);
})();
