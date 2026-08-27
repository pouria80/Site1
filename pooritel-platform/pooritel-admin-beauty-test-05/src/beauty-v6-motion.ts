const root = document.querySelector('.app');

if (root && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const tick = () => {
    currentX += (targetX - currentX) * 0.075;
    currentY += (targetY - currentY) * 0.075;
    root.style.setProperty('--core-x', `${currentX.toFixed(2)}px`);
    root.style.setProperty('--core-y', `${currentY.toFixed(2)}px`);
    raf = requestAnimationFrame(tick);
  };

  const onMove = (event: MouseEvent) => {
    const nx = event.clientX / window.innerWidth - 0.5;
    const ny = event.clientY / window.innerHeight - 0.5;
    targetX = nx * 34;
    targetY = ny * 24;
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const reset = () => {
    targetX = 0;
    targetY = 0;
  };

  window.addEventListener('mousemove', onMove, {passive: true});
  window.addEventListener('mouseleave', reset, {passive: true});
}
