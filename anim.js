(() => {
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 }) : null;
  const sel = ".subject-card,.notes-card,.playlist-card,.topic-card,.stat-card,.feature-card,.section-heading,.qb-card";
  const scan = () => document.querySelectorAll(sel).forEach((el, n) => { if (el.dataset.rv) return; el.dataset.rv = 1; el.style.setProperty("--i", n % 10); el.classList.add("reveal"); io ? io.observe(el) : el.classList.add("in"); });
  const go = () => { scan(); new MutationObserver(scan).observe(document.body, { childList: true, subtree: true }); };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", go) : go();
})();
