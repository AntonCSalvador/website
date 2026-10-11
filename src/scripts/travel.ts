export function initializeTravel(): void {
  const root = document.querySelector<HTMLElement>('[data-travel-map]');
  if (!root || root.dataset.enhanced) return;
  const controls = [...root.querySelectorAll<HTMLAnchorElement>('[data-trip-select]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-trip-panel]')];
  const overview = root.querySelector<HTMLButtonElement>('.map-overview');
  const land = root.querySelector<SVGGElement>('.map-land');
  const labels = root.querySelector<SVGGElement>('.map-place-labels');
  const status = root.querySelector<HTMLElement>('.trip-selection-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animations: Animation[] = [];

  function mapView(pin?: HTMLAnchorElement): void {
    // Restrained 15% zoom retains context; translation is bounded by the atlas edges.
    const scale = pin ? 1.15 : 1;
    const x = pin ? Math.max(1000 * (1 - scale), Math.min(0, 500 - Number(pin.dataset.x) * scale)) : 0;
    const y = pin ? Math.max(760 * (1 - scale), Math.min(0, 380 - Number(pin.dataset.y) * scale)) : 0;
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    if (land) land.style.transform = transform;
    if (labels) labels.style.transform = transform;
    for (const control of controls.filter((control) => control.classList.contains('map-pin'))) {
      control.style.setProperty('--pin-x', `${(Number(control.dataset.x) * scale + x) / 10}%`);
      control.style.setProperty('--pin-y', `${(Number(control.dataset.y) * scale + y) / 7.6}%`);
    }
    root!.dataset.mapView = pin ? 'destination' : 'overview';
  }

  function selectTrip(id: string): void {
    const panel = panels.find((panel) => panel.dataset.tripPanel === id);
    const pin = controls.find((control) => control.classList.contains('map-pin') && control.dataset.tripSelect === id);
    if (!panel || !pin) return;
    animations.forEach((animation) => animation.cancel());
    animations = [];
    root!.dataset.selectedTrip = id;
    panels.forEach((item) => { item.hidden = item !== panel; });
    controls.forEach((control) => control.setAttribute('aria-pressed', String(control.dataset.tripSelect === id)));
    mapView(pin);
    if (status) status.textContent = `${panel.querySelector('h3')?.textContent}, 2026. Photos coming soon.`;
    const hiker = panel.querySelector<HTMLElement>('.hiker');
    if (hiker && !reducedMotion.matches) {
      animations = [hiker.animate([
        { transform: 'translate(0, 0)' }, { transform: 'translate(34px, -4px)', offset: .3 },
        { transform: 'translate(69px, 0)', offset: .6 }, { transform: 'translate(116px, -3px)' },
      ], { duration: 500, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'forwards' })];
    }
  }

  for (const control of controls) {
    control.setAttribute('role', 'button');
    control.setAttribute('aria-controls', `trip-${control.dataset.tripSelect}`);
    control.addEventListener('click', (event) => {
      event.preventDefault();
      selectTrip(control.dataset.tripSelect!);
    });
    control.addEventListener('keydown', (event) => {
      if (event.key === ' ') { event.preventDefault(); control.click(); }
    });
  }
  overview?.addEventListener('click', () => mapView());
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { animations.forEach((animation) => animation.cancel()); animations = []; }
  });
  root.dataset.enhanced = 'true';
  if (overview) overview.hidden = false;
  const initial = location.hash.startsWith('#trip-') ? location.hash.slice(6) : 'boston';
  selectTrip(panels.some((panel) => panel.dataset.tripPanel === initial) ? initial : 'boston');
  // The initial map shows all places; Boston stays selected until the visitor chooses another.
  animations.forEach((animation) => animation.cancel());
  animations = [];
  mapView();
}
