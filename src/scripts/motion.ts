import frames from '../data/hero-frames.json';

export function initializeHeroMotion() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const canvas = hero?.querySelector<HTMLCanvasElement>('.ascii-canvas');
  const button = hero?.querySelector<HTMLButtonElement>('.motion-toggle');
  const next = hero?.querySelector<HTMLButtonElement>('.next-photo');
  const controls = hero?.querySelector<HTMLElement>('.ascii-controls');
  const fallback = hero?.querySelector<SVGElement>('.ascii-static');
  const position = hero?.querySelector<HTMLElement>('.photo-position');
  const ctx = canvas?.getContext('2d');
  if(!hero || !canvas || !button || !next || !controls || !fallback || !position || !ctx) return;
  const root=hero, art=canvas, context=ctx, toggle=button;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  let reduced=preference.matches, paused=false, visible=false;
  let current=0, previous=0, elapsed=1800, last=0, painted=0, request=0;
  const duration=1800, hold=3600, columns=144, rows=108;
  const glyphs='@%#*+=-:. ';
  const step=840/columns, cellH=630/rows;
  const grids=frames.map(frame=>Uint8Array.from(frame.tones, t=>Number(t)));
  const cells=Array.from({length:columns*rows},(_,i)=>{
    const x=i%columns,y=Math.floor(i/columns);
    return {x:x*step+step/2,y:y*cellH+cellH/2,delay:.38*(x/columns*.55+y/rows*.45),dx:Math.sin(x*12.989+y*7.23)*20,dy:Math.cos(x*4.17+y*16.71)*20};
  });
  function draw() {
    context.clearRect(0,0,840,630);
    context.fillStyle='#342c48';context.font=`bold ${step*1.18}px monospace`;
    context.textBaseline='middle';context.textAlign='center';
    const progress=Math.min(1,elapsed/duration);
    for(let i=0;i<cells.length;i++) {
      const cell=cells[i];
      const local=Math.max(0,Math.min(1,(progress-cell.delay)/.62));
      const mix=1-(1-local)**3;
      const tone=Math.round(grids[previous][i]+(grids[current][i]-grids[previous][i])*mix);
      if(tone===9) continue;
      const scatter=Math.sin(local*Math.PI);
      context.fillText(glyphs[tone],cell.x+cell.dx*scatter,cell.y+cell.dy*scatter);
    }
  }
  function advance() {
    previous=current;current=(current+1)%frames.length;
    elapsed=paused||reduced?duration:0;
    art.setAttribute('aria-label',`ASCII photograph: ${frames[current].label}`);
    position!.textContent=`${current+1} / ${frames.length}`;
    draw();
  }
  function running() {return !paused&&!reduced&&visible&&!document.hidden;}
  function tick(now:number) {
    request=0;if(!running())return;
    elapsed+=last?Math.min(now-last,100):0;last=now;
    if(elapsed>=duration+hold) advance();
    if(now-painted>=1000/30&&elapsed<=duration+100){draw();painted=now;}
    request=requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(request);request=0;last=0;
    root.dataset.motion=running()?'running':'paused';
    const label=reduced?'Animation paused':paused?'Play animation':'Pause animation';
    toggle.textContent=label;toggle.setAttribute('aria-label',label);
    toggle.setAttribute('aria-pressed',String(!paused&&!reduced));toggle.disabled=reduced;
    toggle.title=reduced?'Paused by your reduced motion preference':'';
    if(running())request=requestAnimationFrame(tick);
  }
  draw();canvas.hidden=false;fallback.style.display='none';controls.hidden=false;
  button.addEventListener('click',()=>{paused=!paused;sync();});
  next.addEventListener('click',advance);
  preference.addEventListener('change',event=>{reduced=event.matches;if(reduced){elapsed=duration;draw();}sync();});
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();}).observe(canvas);
  sync();
}
