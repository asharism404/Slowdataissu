/* Smooth light/dark switch: circular reveal from the toggle button (View Transitions API).
   Falls back to an instant switch where unsupported or when reduced motion is requested. */
(() => {
  "use strict";
  const st = document.createElement("style");
  st.textContent = "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}::view-transition-old(root){z-index:1}::view-transition-new(root){z-index:2}";
  document.head.appendChild(st);
  let busy = false;
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("#themeToggle");
    if (!b || busy) return;
    if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.stopImmediatePropagation(); e.preventDefault();
    const r = b.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const t = document.startViewTransition(() => { busy = true; b.click(); busy = false; });
    t.ready.then(() => document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 600, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
    )).catch(() => {});
  }, true);
})();
