const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();

const cursor = document.querySelector('.cursor');
window.addEventListener('pointermove', (event) => {
  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

document.querySelectorAll('.ripple').forEach((button) => {
  button.addEventListener('click', (event) => {
    const dot = document.createElement('span');
    const rect = button.getBoundingClientRect();
    dot.style.cssText = `position:absolute;left:${event.clientX - rect.left}px;top:${event.clientY - rect.top}px;width:12px;height:12px;border-radius:50%;background:rgba(255,255,255,.65);transform:translate(-50%,-50%) scale(0);pointer-events:none;`;
    button.appendChild(dot);
    dot.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: 1 }, { transform: 'translate(-50%,-50%) scale(18)', opacity: 0 }], { duration: 650, easing: 'cubic-bezier(.2,1,.2,1)' }).onfinish = () => dot.remove();
  });
});

if (!prefersReduced) {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.split-text').forEach((node) => {
    node.innerHTML = node.textContent.split('').map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
  });
  gsap.from('.char', { yPercent: 110, opacity: 0, rotate: 8, stagger: 0.018, duration: 0.9, ease: 'power4.out' });
  gsap.to('.asset', { y: -90, rotate: 0, scale: 0.92, opacity: 0.25, stagger: 0.04, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.hero-tags span, .hero-actions .btn', { y: 28, opacity: 0, stagger: 0.08, delay: 0.6, ease: 'back.out(1.8)' });
  gsap.utils.toArray('.cap-card').forEach((card, index) => gsap.from(card, { y: 80, opacity: 0, rotate: index % 2 ? 2 : -2, scrollTrigger: { trigger: card, start: 'top 84%' } }));
  gsap.utils.toArray('.case-card').forEach((card, index) => gsap.to(card, { scale: 1 - index * 0.025, scrollTrigger: { trigger: card, start: 'top 120px', end: 'bottom 120px', scrub: true } }));
  gsap.from('.portrait-tile', { clipPath: 'inset(50% 50% 50% 50% round 34px)', y: 80, stagger: 0.12, duration: 1.1, ease: 'power4.out', scrollTrigger: { trigger: '.portrait-system', start: 'top 75%' } });
  gsap.to('.portrait-tile', { y: (i) => [-28, 34, -18, 24][i], scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.utils.toArray('.kpi-grid strong').forEach((item) => {
    const target = Number(item.dataset.count);
    const suffix = item.textContent.includes('Cr') ? 'Cr+' : item.textContent.includes('%') ? '%' : '+';
    const prefix = item.textContent.includes('₹') ? '₹' : '';
    gsap.fromTo(item, { innerText: 0 }, { innerText: target, snap: { innerText: 1 }, duration: 1.5, scrollTrigger: { trigger: item, start: 'top 82%' }, onUpdate() { item.textContent = `${prefix}${Math.round(item.innerText)}${suffix}`; } });
  });
  gsap.from('.process-rail span', { x: 90, opacity: 0, stagger: 0.08, scrollTrigger: { trigger: '.process-rail', start: 'top 80%' } });
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, { x: (event.clientX - rect.left - rect.width / 2) * 0.18, y: (event.clientY - rect.top - rect.height / 2) * 0.18, duration: 0.35 });
    });
    el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,.35)' }));
  });
}
