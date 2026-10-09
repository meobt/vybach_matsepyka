(() => {
  'use strict';

  // Куди приходять відповіді (див. README):
  const TOPIC = 'matsepyka-jtso8oqgm4trc0';                       // пуш через застосунок ntfy
  const MAIL = 'https://formsubmit.co/ajax/me.o.b.t2@gmail.com';  // лист через FormSubmit (після одноразової активації)

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = {
    ink: '#2A2420', cream: '#F8EFDC', tomato: '#D8432E', corn: '#F2B335', lilac: '#8A5BB5',
    leaf: '#5E9441', pink: '#F08DA6', paper: '#F5EAD2', white: '#FFFDF6', brown: '#C08A52', moon: '#F6D77A',
  };
  const PX = '<svg viewBox="0 0 7 6" shape-rendering="crispEdges" aria-hidden="true"><path fill="#E8263A" d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z"/><path fill="#A5121F" d="M6 1h1v2H6zM5 3h1v1H5zM4 4h1v1H4zM3 5h1v1H3z"/><path fill="#FFB3BC" d="M1 1h1v1H1z"/></svg>';

  const mk = (tag, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };

  /* ---------- малювання олівцем ---------- */

  let rc = null;

  // Три варіанти з різним seed по черзі = лінії «кипять», як у мальованому мультику.
  function sketch(svg, draw, { boil = true, ink = C.ink } = {}) {
    const n = boil && !RM ? 3 : 1;
    const seed = 1 + Math.floor(Math.random() * 9000);
    for (let i = 0; i < n; i++) {
      const g = mk('g');
      [].concat(draw({ seed: seed + i * 31, stroke: ink, strokeWidth: 2.4, roughness: 1.5, bowing: 1.2 }))
        .forEach(node => g.appendChild(node));
      svg.appendChild(g);
    }
    if (n > 1) svg.classList.add('boil');
    $$('path', svg).forEach(p => p.classList.add(p.getAttribute('stroke') === 'none' ? 'rf' : 'rs'));
  }

  const flower = (o, x, y, h, color, s = 1) => [
    rc.line(x, y, x + 3, y - h, { ...o, stroke: C.leaf, strokeWidth: 2.6 }),
    rc.ellipse(x + 10 * s, y - h * .45, 20 * s, 9 * s, { ...o, stroke: C.leaf, fill: C.leaf, fillStyle: 'solid', strokeWidth: 1.4 }),
    ...[0, 1, 2, 3, 4].map(k => rc.circle(x + 3 + Math.cos(k * 1.2566) * 9 * s, y - h + Math.sin(k * 1.2566) * 9 * s, 13 * s,
      { ...o, fill: color, fillStyle: 'solid', strokeWidth: 1.5 })),
    rc.circle(x + 3, y - h, 9 * s, { ...o, fill: C.corn, fillStyle: 'solid', strokeWidth: 1.4 }),
  ];

  const FLOWERS = [[60, 70, 'tomato'], [150, 48, 'pink'], [262, 82, 'corn'], [392, 56, 'lilac'], [520, 74, 'tomato'], [640, 50, 'white'],
    [762, 86, 'pink'], [882, 58, 'lilac'], [992, 76, 'corn'], [1110, 60, 'tomato'], [1172, 44, 'pink']];

  const D = {
    heart: (o, el) => rc.path('M50 84 C18 62 4 44 10 27 C16 10 38 6 50 26 C62 6 84 10 90 27 C96 44 82 62 50 84 Z',
      { ...o, fill: C[el.dataset.c || 'tomato'], fillStyle: 'hachure', hachureGap: 5, fillWeight: 2.6 }),

    sun: o => {
      const out = [];
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6, r = i % 2 ? 82 : 95;
        out.push(rc.line(100 + Math.cos(a) * 60, 100 + Math.sin(a) * 60, 100 + Math.cos(a) * r, 100 + Math.sin(a) * r,
          { ...o, stroke: '#E8912A', strokeWidth: 4 }));
      }
      const cheek = { ...o, stroke: 'none', fill: C.pink, fillStyle: 'solid' };
      out.push(
        rc.circle(100, 100, 100, { ...o, fill: C.corn, fillStyle: 'zigzag', hachureGap: 5, fillWeight: 2.2 }),
        rc.arc(82, 96, 16, 14, Math.PI, Math.PI * 2, false, o),
        rc.arc(118, 96, 16, 14, Math.PI, Math.PI * 2, false, o),
        rc.arc(100, 110, 36, 26, Math.PI * .15, Math.PI * .85, false, { ...o, strokeWidth: 3 }),
        rc.circle(74, 112, 13, cheek), rc.circle(126, 112, 13, cheek),
      );
      return out;
    },

    cloud: o => rc.path('M38 92 C8 92 6 62 32 58 C26 30 62 20 80 36 C88 10 136 8 146 38 C170 26 206 44 196 70 C214 80 204 98 184 96 Z',
      { ...o, fill: C.white, fillStyle: 'solid', roughness: 1.3, strokeWidth: 2.2 }),

    scribble: o => rc.curve([[8, 26], [90, 14], [170, 28], [250, 14], [330, 27], [410, 15], [490, 26], [592, 14]],
      { ...o, stroke: C.pink, strokeWidth: 7, roughness: 1.1 }),

    arrow: o => [
      rc.curve([[44, 6], [30, 36], [52, 66], [40, 104]], { ...o, strokeWidth: 3 }),
      rc.line(40, 106, 22, 86, { ...o, strokeWidth: 3 }),
      rc.line(40, 106, 58, 88, { ...o, strokeWidth: 3 }),
    ],

    star: o => {
      const p = [];
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 11 : 26;
        p.push([30 + Math.cos(a) * r, 31 + Math.sin(a) * r]);
      }
      return rc.polygon(p, { ...o, stroke: C.corn, fill: C.corn, fillStyle: 'solid', strokeWidth: 2, roughness: 1.2 });
    },

    moon: o => [
      rc.path('M98 18 C48 24 28 80 54 116 C80 150 134 146 150 114 C108 126 72 96 78 58 C80 40 88 27 98 18 Z',
        { ...o, stroke: C.moon, fill: C.moon, fillStyle: 'hachure', hachureGap: 4, fillWeight: 2.4 }),
      rc.arc(56, 80, 14, 10, 0, Math.PI, false, { ...o, stroke: '#4a3a1c', strokeWidth: 2.4 }),
      rc.linearPath([[112, 22], [128, 22], [112, 38], [128, 38]], { ...o, strokeWidth: 2.4 }),
      rc.linearPath([[136, 2], [146, 2], [136, 12], [146, 12]], { ...o, strokeWidth: 2 }),
    ],

    box: o => [
      rc.polygon([[22, 56], [8, 28], [84, 28], [90, 56]], { ...o, fill: '#D7A56B', fillStyle: 'solid' }),
      rc.polygon([[90, 56], [96, 28], [174, 28], [158, 56]], { ...o, fill: '#D7A56B', fillStyle: 'solid' }),
      rc.rectangle(22, 56, 136, 86, { ...o, fill: C.brown, fillStyle: 'hachure', hachureGap: 5, fillWeight: 2 }),
      rc.rectangle(82, 56, 16, 86, { ...o, fill: '#EFD9A6', fillStyle: 'solid', strokeWidth: 1.4 }),
      rc.linearPath([[40, 100], [48, 88], [56, 100]], { ...o, strokeWidth: 2 }),
      rc.line(48, 88, 48, 118, { ...o, strokeWidth: 2 }),
      rc.linearPath([[124, 100], [132, 88], [140, 100]], { ...o, strokeWidth: 2 }),
      rc.line(132, 88, 132, 118, { ...o, strokeWidth: 2 }),
    ],

    battery: o => {
      const level = rc.rectangle(20, 24, 14, 42, { ...o, stroke: 'none', fill: C.tomato, fillStyle: 'solid' });
      level.classList.add('blink');
      return [
        rc.rectangle(10, 14, 146, 62, { ...o, strokeWidth: 3 }),
        rc.rectangle(158, 32, 14, 26, { ...o, fill: o.stroke, fillStyle: 'solid' }),
        level,
      ];
    },

    kneel: o => {
      const line = { ...o, strokeWidth: 3 };
      const cheek = { ...o, stroke: 'none', fill: C.pink, fillStyle: 'solid' };
      return [
        rc.line(168, 118, 176, 70, { ...o, stroke: C.leaf }),
        rc.line(168, 118, 196, 80, { ...o, stroke: C.leaf }),
        rc.line(168, 118, 206, 104, { ...o, stroke: C.leaf }),
        rc.polygon([[154, 128], [178, 92], [202, 112]], { ...o, fill: C.lilac, fillStyle: 'hachure', hachureGap: 4 }),
        rc.circle(176, 66, 22, { ...o, fill: C.tomato, fillStyle: 'solid' }),
        rc.circle(198, 78, 20, { ...o, fill: C.pink, fillStyle: 'solid' }),
        rc.circle(208, 102, 18, { ...o, fill: C.corn, fillStyle: 'solid' }),
        rc.circle(92, 66, 62, { ...o, fill: '#F6D2B0', fillStyle: 'solid' }),
        rc.linearPath([[62, 54], [72, 36], [84, 46], [94, 32], [106, 46], [118, 38], [122, 52]], line),
        rc.circle(82, 66, 5, { ...o, fill: o.stroke, fillStyle: 'solid', strokeWidth: 1 }),
        rc.circle(104, 66, 5, { ...o, fill: o.stroke, fillStyle: 'solid', strokeWidth: 1 }),
        rc.path('M80 73 C77 80 76 84 80 86 C84 84 83 80 80 73 Z', { ...o, stroke: '#5E9CC8', fill: '#8CC3E3', fillStyle: 'solid', strokeWidth: 1.2 }),
        rc.arc(93, 88, 16, 10, Math.PI, Math.PI * 2, false, { ...o, strokeWidth: 2.2 }),
        rc.circle(70, 78, 9, cheek), rc.circle(115, 78, 9, cheek),
        rc.line(94, 97, 102, 172, line),
        rc.linearPath([[97, 118], [132, 130], [160, 122]], line),
        rc.linearPath([[97, 120], [128, 146], [162, 128]], line),
        rc.linearPath([[102, 172], [142, 184], [146, 236], [162, 238]], line),
        rc.linearPath([[102, 172], [96, 236], [54, 238]], line),
        rc.line(16, 244, 224, 244, { ...o, stroke: C.leaf }),
      ];
    },

    garden: (o, el) => {
      const out = [rc.path('M0 150 C200 95 380 112 560 140 C760 170 900 102 1200 118 L1200 240 L0 240 Z',
        { ...o, stroke: '#6E9A45', fill: '#9CC66A', fillStyle: 'hachure', hachureGap: 9, fillWeight: 2 })];
      if (el.dataset.v !== 'nofence') {
        const white = { ...o, fill: C.white, fillStyle: 'solid', strokeWidth: 1.8, roughness: 1.2 };
        out.push(rc.rectangle(10, 140, 1180, 11, white), rc.rectangle(10, 178, 1180, 11, white));
        for (let x = 24; x < 1180; x += 48) out.push(rc.polygon([[x, 214], [x, 122], [x + 13, 104], [x + 26, 122], [x + 26, 214]], white));
      }
      out.push(rc.path('M0 206 C150 190 300 210 450 200 C600 190 800 214 1000 200 C1100 194 1150 204 1200 200 L1200 240 L0 240 Z',
        { ...o, stroke: '#3F6E2B', fill: C.leaf, fillStyle: 'hachure', hachureGap: 6, fillWeight: 2.4 }));
      FLOWERS.forEach(([x, h, c]) => out.push(...flower(o, x, 224, h, C[c])));
      for (let x = 30; x < 1200; x += 62) {
        const g = { ...o, stroke: '#3F6E2B', strokeWidth: 2.2 };
        out.push(rc.line(x, 238, x - 7, 216, g), rc.line(x, 238, x + 1, 210, g), rc.line(x, 238, x + 8, 218, g));
      }
      return out;
    },
  };

  function drawDoodles() {
    $$('svg[data-d]').forEach(svg => {
      const ink = svg.closest('.tired') ? C.cream : C.ink;
      sketch(svg, o => D[svg.dataset.d](o, svg), { ink });
    });
  }

  // Кольорова рамка олівцем навколо кожного фото; перемальовується, коли фото змінює розмір.
  function frame(fig) {
    const w = fig.offsetWidth + 24, h = fig.offsetHeight + 24;
    let svg = $(':scope > .frame', fig);
    if (svg && svg.dataset.size === `${w}x${h}`) return;
    if (!svg) svg = fig.appendChild(mk('svg', { class: 'frame', preserveAspectRatio: 'none', 'aria-hidden': 'true' }));
    svg.innerHTML = '';
    svg.classList.remove('boil');
    svg.dataset.size = `${w}x${h}`;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (w < 80 || h < 80) return;
    sketch(svg, o => rc.rectangle(4, 4, w - 8, h - 8, { ...o, stroke: C[fig.dataset.c] || C.ink, strokeWidth: 3, roughness: 1.2, bowing: 2 }));
  }

  // Мальований фон кнопки/чипа: data-rb = колір заливки, data-boil = «кипить».
  function rbox(el) {
    if (!rc || el.querySelector(':scope > .rb')) return;
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w) return; // ще схований — намалюємо, коли з’явиться
    const svg = mk('svg', { class: 'rb', viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    sketch(svg, o => rc.rectangle(3, 3, w - 6, h - 6,
      { ...o, fill: C[el.dataset.rb], fillStyle: 'solid', strokeWidth: 2.6, roughness: 1.4, bowing: 2 }), { boil: el.hasAttribute('data-boil') });
    el.prepend(svg);
  }

  function ring(label) {
    $$('.game .ring').forEach(s => { s.innerHTML = ''; s.classList.remove('boil'); });
    if (!rc || !label) return;
    const svg = $('.ring', label), w = label.offsetWidth + 44, h = label.offsetHeight + 44;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    sketch(svg, o => rc.ellipse(w / 2, h / 2, w * 1.06, h * 1.1, { ...o, stroke: C.tomato, strokeWidth: 4.5, roughness: 2.2 }), { boil: false });
    $$('path', svg).forEach(p => p.setAttribute('pathLength', '1'));
  }

  /* ---------- папір, літери, сердечка ---------- */

  $$('.tear').forEach(svg => {
    svg.setAttribute('viewBox', '0 0 1200 40');
    svg.setAttribute('preserveAspectRatio', 'none');
    let d = 'M0 40 L0 24', x = 0;
    while (x < 1200) {
      x = Math.min(1200, x + 12 + Math.random() * 30);
      d += ` L${x.toFixed(0)} ${(6 + Math.random() * 26).toFixed(0)}`;
    }
    svg.innerHTML = `<path d="${d} L1200 40 Z" fill="currentColor"/>`;
  });

  $$('.rainbow').forEach(h => {
    const text = h.textContent.trim(), cols = [C.tomato, '#E07B1F', '#4E8A34', '#3F7FB5', C.lilac, '#E0567F'];
    h.setAttribute('aria-label', text);
    h.textContent = '';
    let i = 0;
    text.split(' ').forEach(word => {
      const w = document.createElement('span');
      w.className = 'w';
      w.setAttribute('aria-hidden', 'true');
      for (const ch of word) {
        const l = document.createElement('span');
        l.className = 'l';
        l.textContent = ch;
        l.style.cssText = `--c:${cols[i % cols.length]};--rot:${(Math.random() * 12 - 6).toFixed(1)}deg;--dy:${(Math.random() * .12 - .06).toFixed(3)}em;--i:${i}`;
        w.appendChild(l);
        i++;
      }
      h.append(w, ' ');
    });
  });

  if (!RM) $$('.px-float').forEach(box => {
    for (let i = 0; i < 7; i++) {
      const s = document.createElement('span');
      s.className = 'px';
      s.innerHTML = PX;
      s.style.cssText = `left:${5 + Math.random() * 90}%;--s:${14 + Math.random() * 16}px;--t:${7 + Math.random() * 6}s;--d:${-Math.random() * 12}s`;
      box.appendChild(s);
    }
  });

  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal, .watch').forEach(el => io.observe(el));

  /* ---------- нескінченний список справ ---------- */

  const todo = $('#todo'), todoN = $('#todo-n');
  let tasks = 47, todoTimer = 0;

  function task(done) {
    const li = document.createElement('li');
    const svg = mk('svg', { viewBox: '0 0 190 24', preserveAspectRatio: 'none' });
    const end = 70 + Math.random() * 110, pts = [];
    for (let x = 30; x < end; x += 9) pts.push([x, 12 + Math.random() * 8 - 4]);
    if (rc) sketch(svg, o => {
      const out = [
        rc.rectangle(4, 5, 14, 14, { ...o, strokeWidth: 1.6, roughness: 1 }),
        rc.curve(pts, { ...o, stroke: '#3B4F78', strokeWidth: 1.8, roughness: .8 }),
      ];
      if (done) out.push(
        rc.line(26, 12, end + 4, 13, { ...o, stroke: C.tomato, strokeWidth: 2.2 }),
        rc.linearPath([[6, 11], [10, 17], [20, 2]], { ...o, stroke: C.tomato, strokeWidth: 2.2 }),
      );
      return out;
    }, { boil: false });
    li.appendChild(svg);
    return li;
  }

  /* ---------- вибір гри ---------- */

  let game = '';
  function setGame(value) {
    game = value;
    $$('input[name=game], input[name=game2]').forEach(i => { i.checked = i.value === value; });
    const main = $$('input[name=game]').find(i => i.checked);
    ring(main && main.closest('.game'));
    summary();
    dirty();
  }
  $$('input[name=game]').forEach(i => i.addEventListener('change', () => setGame(i.value)));

  /* ---------- «так» тягнеться, «ні» тікає ---------- */

  const arena = $('#arena'), yes = $('#yes'), no = $('#no'), yesWrap = $('.yes-wrap');
  const PAD = 12;
  let escapes = 0, lastJump = 0, said = false, px = -1e4, py = -1e4, raf = 0;

  function flee(fromX, fromY) {
    const now = performance.now();
    if (said || now - lastJump < 140) return;
    lastJump = now;
    const a = arena.getBoundingClientRect(), b = no.getBoundingClientRect(), y = yes.getBoundingClientRect();
    // стрибаємо лише у видиму частину арени; якщо її замало — у всю арену
    let x0 = Math.max(a.left, 0) + PAD, y0 = Math.max(a.top, 0) + PAD;
    let x1 = Math.min(a.right, innerWidth) - PAD - b.width, y1 = Math.min(a.bottom, innerHeight) - PAD - b.height;
    if (x1 - x0 < b.width || y1 - y0 < b.height) {
      x0 = a.left + PAD; y0 = a.top + PAD; x1 = a.right - PAD - b.width; y1 = a.bottom - PAD - b.height;
    }
    let best = [x0, y0], bestScore = -Infinity;
    for (let i = 0; i < 48; i++) {
      const x = x0 + Math.random() * (x1 - x0), yy = y0 + Math.random() * (y1 - y0);
      const onYes = x < y.right + 16 && x + b.width > y.left - 16 && yy < y.bottom + 16 && yy + b.height > y.top - 16;
      const score = Math.min(Math.hypot(x + b.width / 2 - fromX, yy + b.height / 2 - fromY), 420)
        + Math.min(Math.hypot(x - b.left, yy - b.top), 220) * .3 - (onYes ? 1000 : 0);
      if (score > bestScore) { bestScore = score; best = [x, yy]; }
    }
    if (!no.classList.contains('free')) {
      no.style.left = b.left - a.left + 'px';
      no.style.top = b.top - a.top + 'px';
      no.classList.add('free');
      void no.offsetWidth; // стартова точка для transition
    }
    no.style.left = best[0] - a.left + 'px';
    no.style.top = best[1] - a.top + 'px';
    no.style.rotate = (Math.random() * 24 - 12).toFixed(0) + 'deg';
    escapes++;
    stretch();
  }

  function stretch() {
    if (said) return;
    const r = yesWrap.getBoundingClientRect();
    const dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), d = Math.hypot(dx, dy);
    const pull = Math.max(0, 1 - d / 460);
    const k = pull * Math.min(1, d / 70); // над самою кнопкою не перекошуємо
    const ang = Math.atan2(dy, dx);
    const base = Math.min(1 + escapes * .07, 1.85);
    yes.style.transform = `translate(${(dx * .22 * pull).toFixed(1)}px,${(dy * .22 * pull).toFixed(1)}px) `
      + `rotate(${ang.toFixed(3)}rad) scaleX(${(1 + .32 * k).toFixed(3)}) rotate(${(-ang).toFixed(3)}rad) `
      + `scale(${(base * (1 + .22 * pull)).toFixed(3)})`;
  }

  function nearNo(x, y, margin) {
    const b = no.getBoundingClientRect();
    return Math.hypot(Math.max(b.left - x, 0, x - b.right), Math.max(b.top - y, 0, y - b.bottom)) < margin;
  }

  addEventListener('pointermove', e => {
    px = e.clientX; py = e.clientY;
    if (!said && nearNo(px, py, e.pointerType === 'touch' ? 40 : 56)) flee(px, py);
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; stretch(); });
  }, { passive: true });

  const fleeSelf = () => { const b = no.getBoundingClientRect(); flee(b.left + b.width / 2, b.top + b.height / 2); };
  no.addEventListener('pointerdown', e => { e.preventDefault(); flee(e.clientX, e.clientY); });
  no.addEventListener('touchstart', e => { e.preventDefault(); flee(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
  no.addEventListener('click', e => { e.preventDefault(); fleeSelf(); });
  no.addEventListener('focus', fleeSelf);

  addEventListener('resize', () => {
    if (!no.classList.contains('free')) return;
    const w = arena.clientWidth, h = arena.clientHeight;
    no.style.left = Math.max(PAD, Math.min(parseFloat(no.style.left), w - no.offsetWidth - PAD)) + 'px';
    no.style.top = Math.max(PAD, Math.min(parseFloat(no.style.top), h - no.offsetHeight - PAD)) + 'px';
  });

  const times = n => {
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? 'раз' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'рази' : 'разів';
  };

  yes.addEventListener('click', () => {
    if (said) return;
    said = true;
    burst(yes);
    push('Вона натиснула «так»! 💛', `Анюточка дала цепі шанс 🥹\n«Ні» втекла ${escapes} ${times(escapes)}.`, ['heart', 'tada']).catch(() => {});
    arena.hidden = true;
    show($('#plan'));
    $('#plan').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- день, година, надсилання ---------- */

  const DAYS = [[5, 'п’ятниця'], [6, 'субота'], [0, 'неділя']];
  const pad2 = n => String(n).padStart(2, '0');
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const send = $('#send'), sendT = $('#send-t'), status = $('#status'), tg = $('#tg');
  let day = null, hour = null, sent = false;

  function chip(name, value, label, sub) {
    const l = document.createElement('label');
    l.className = 'chip';
    l.innerHTML = `<input type="radio" name="${name}" value="${value}"><span data-rb="paper">${label}${sub ? `<small>${sub}</small>` : ''}</span>`;
    return l;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  DAYS.forEach(([wd, name]) => {
    const off = (wd - today.getDay() + 7) % 7;
    const d = new Date(today);
    d.setDate(d.getDate() + off);
    const date = `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}`;
    const c = chip('day', name, name, off === 0 ? 'сьогодні' : off === 1 ? 'завтра' : date);
    c.dataset.date = date;
    $('#days').appendChild(c);
  });
  for (let h = 10; h <= 23; h++) $('#hours').appendChild(chip('hour', h, `${h}:00`));
  [['Цепсько-мацепське виживання', 'виживання'], ['Dungeon Heroes', 'Dungeon Heroes']]
    .forEach(([v, t]) => $('#sum-games').appendChild(chip('game2', v, t)));

  function show(el) {
    const first = el.hidden;
    el.hidden = false;
    $$('[data-rb]', el).forEach(rbox);
    if (first && el.id !== 'plan') el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' });
  }

  function summary() {
    if (!day || hour === null) return;
    $('#sum').textContent = `📅 ${cap(day.name)}, ${day.date}, о ${hour}:00\n🎮 ${game || 'гру ще не обрано'}`;
  }

  function dirty() {
    if (!sent) return;
    sent = false;
    send.disabled = false;
    sendT.textContent = 'Надіслати зміни 💌';
    status.textContent = '';
  }

  $('#plan').addEventListener('change', e => {
    const t = e.target;
    if (t.name === 'day') { day = { name: t.value, date: t.closest('.chip').dataset.date }; show($('#step-hour')); }
    if (t.name === 'hour') { hour = +t.value; show($('#step-send')); }
    if (t.name === 'game2') { setGame(t.value); return; }
    summary();
    dirty();
  });

  const push = (title, message, tags) => fetch('https://ntfy.sh/', {
    method: 'POST',
    body: JSON.stringify({ topic: TOPIC, title, message, tags, priority: 5 }),
  }).then(r => { if (!r.ok) throw new Error('ntfy ' + r.status); });

  const mail = (subject, fields) => fetch(MAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ _subject: subject, _template: 'box', _captcha: 'false', ...fields }),
  }).then(r => r.json()).then(j => { if (String(j.success) !== 'true') throw new Error(j.message || 'formsubmit'); });

  // Успіх, якщо дійшов хоча б один канал.
  async function notify(title, message, fields) {
    const res = await Promise.allSettled([push(title, message, ['video_game', 'calendar']), mail(`💌 ${title}`, fields)]);
    if (res.every(r => r.status === 'rejected')) throw res[0].reason;
  }

  send.addEventListener('click', async () => {
    if (!game) {
      status.textContent = 'Спершу оберіть гру 👆';
      return;
    }
    send.disabled = true;
    status.textContent = 'Надсилаю…';
    const when = `${day.name}, ${day.date}, о ${hour}:00`;
    tg.href = 'https://t.me/share/url?url=' + encodeURIComponent(location.href)
      + '&text=' + encodeURIComponent(`Цепо, я обрала: ${when}, граємо в «${game}» 💛`);
    try {
      await notify('Анюточка обрала час 🎮',
        `📅 ${cap(when)}\n🎮 ${game}\n🏃 «Ні» втекла ${escapes} ${times(escapes)}`,
        { 'День': `${day.name}, ${day.date}`, 'Час': `${hour}:00`, 'Гра': game, '«Ні» втекла': `${escapes} ${times(escapes)}` });
      sent = true;
      sendT.textContent = 'Надіслано ✓';
      status.textContent = 'Надіслано! Цепа вже знає 💛';
      tg.hidden = true;
      burst(send);
    } catch {
      send.disabled = false;
      status.textContent = 'Не вийшло надіслати. Перевірте інтернет і натисніть ще раз.';
      tg.hidden = false;
    }
  });

  /* ---------- конфеті з сердечок ---------- */

  function burst(el) {
    if (RM) return;
    const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const cols = [C.tomato, C.corn, C.pink, C.lilac, C.leaf, '#4F8FC0'];
    for (let i = 0; i < 42; i++) {
      const b = document.createElement('span');
      b.className = 'bit' + (i % 3 ? ' dot' : '');
      if (i % 3) b.style.background = cols[i % cols.length];
      else b.innerHTML = PX;
      b.style.left = cx - 9 + 'px';
      b.style.top = cy - 9 + 'px';
      document.body.appendChild(b);
      const ang = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260;
      const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v - 140;
      b.animate([
        { transform: 'translate(0,0) scale(.4)', opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${dx * 1.2}px,${dy + 260}px) scale(.8) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1400 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => b.remove();
    }
  }

  /* ---------- старт ---------- */

  if (window.rough) {
    rc = rough.svg(mk('svg'));
    drawDoodles();
    const ro = new ResizeObserver(entries => entries.forEach(e => frame(e.target)));
    $$('.photo').forEach(f => ro.observe(f));
  }
  for (let i = 0; i < 8; i++) todo.appendChild(task(i === 1 || i === 4));
  if (!RM) new IntersectionObserver(([e]) => {
    clearInterval(todoTimer);
    if (e.isIntersecting) todoTimer = setInterval(() => {
      const li = task(Math.random() < .15);
      li.className = 'new';
      todo.appendChild(li);
      if (todo.children.length > 12) todo.firstElementChild.remove();
      todoN.textContent = ++tasks;
    }, 1500);
  }).observe($('.todo'));

  // Кнопки міряємо після шрифтів, інакше рамка буде не того розміру.
  Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 2500))])
    .then(() => $$('[data-rb]').forEach(rbox));
})();
