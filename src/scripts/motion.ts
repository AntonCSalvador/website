export function initializeHeroMotion() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const button = hero?.querySelector<HTMLButtonElement>('.motion-toggle');
  if (!hero || !button) return;

  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = false;
  let onScreen = false;

  function update() {
    const playing = !userPaused && !preference.matches;
    hero!.dataset.motion = playing && onScreen && !document.hidden ? 'running' : 'paused';
    const label = preference.matches ? 'Animation paused' : playing ? 'Pause animation' : 'Play animation';
    button!.disabled = preference.matches;
    button!.title = preference.matches ? 'Paused by your reduced motion preference' : '';
    button!.setAttribute('aria-label', label);
    button!.setAttribute('aria-pressed', String(playing));
    button!.querySelector('span')!.textContent = label;
  }

  button.hidden = false;
  button.addEventListener('click', () => {
    // A reduced-motion preference always wins, including after clicking Play.
    userPaused = !userPaused;
    update();
  });
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(hero);
  update();
}
