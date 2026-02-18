'use client';

import { useRef, useEffect } from 'react';

const C0 = { r: 107, g: 112, b: 128 };
const C1 = { r: 58, g: 118, b: 240 };
const C2 = { r: 107, g: 162, b: 255 };

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

function CanvasViz({ draw }: { draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = rect.width + 'px';
      canvas!.style.height = rect.height + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function loop(t: number) {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;
      ctx!.clearRect(0, 0, w, h);
      draw(ctx!, w, h, t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [draw]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

// Stable data refs (generated once)
const startZips = Array.from({ length: 50 }, () => ({
  x: Math.random(), y: Math.random(), phase: Math.random() * Math.PI * 2,
}));

const v1Groups = [
  { rx: 0.13, ry: 0.3, count: 7 }, { rx: 0.32, ry: 0.18, count: 5 },
  { rx: 0.52, ry: 0.62, count: 8 }, { rx: 0.32, ry: 0.78, count: 6 },
  { rx: 0.68, ry: 0.22, count: 6 }, { rx: 0.85, ry: 0.5, count: 7 },
  { rx: 0.13, ry: 0.72, count: 4 }, { rx: 0.87, ry: 0.82, count: 7 },
].map(g => ({
  ...g,
  zips: Array.from({ length: g.count }, (_, i) => ({
    angle: (i / g.count) * Math.PI * 2,
    r: 20 + Math.random() * 25,
    phase: Math.random() * Math.PI * 2,
  })),
}));

const v2Zips = (() => {
  const arr: { rx: number; ry: number; jx: number; jy: number; phase: number; specs: { ba: number; rad: number; spd: number; ph: number }[] }[] = [];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 10; c++)
      arr.push({
        rx: (c + 0.5) / 10, ry: (r + 0.5) / 5,
        jx: (Math.random() - 0.5) * 0.03, jy: (Math.random() - 0.5) * 0.03,
        phase: Math.random() * Math.PI * 2,
        specs: Array.from({ length: 10 }, (_, s) => ({
          ba: (s / 10) * Math.PI * 2, rad: 6 + Math.random() * 5,
          spd: 0.0008 + Math.random() * 0.0012, ph: Math.random() * Math.PI * 2,
        })),
      });
  return arr;
})();

const v2Packets = Array.from({ length: 30 }, () => {
  const a = Math.floor(Math.random() * 50);
  let b = Math.floor(Math.random() * 50);
  while (b === a) b = Math.floor(Math.random() * 50);
  return { from: a, to: b, prog: Math.random(), spd: 0.002 + Math.random() * 0.004 };
});

function drawStart(ctx: CanvasRenderingContext2D, cw: number, ch: number, t: number) {
  const cx = cw / 2, cy = ch / 2;
  startZips.forEach(z => {
    const zx = 50 + z.x * (cw - 100), zy = 25 + z.y * (ch - 50);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(zx, zy);
    ctx.strokeStyle = rgba(C0, 0.05 + 0.03 * Math.sin(t * 0.001 + z.phase));
    ctx.lineWidth = 0.5; ctx.stroke();
    const p = 0.5 + 0.5 * Math.sin(t * 0.002 + z.phase);
    ctx.beginPath(); ctx.arc(zx, zy, 2 + p, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C0, 0.25 + p * 0.3); ctx.fill();
  });
  const ap = 8 + 3 * Math.sin(t * 0.003);
  ctx.beginPath(); ctx.arc(cx, cy, ap + 14, 0, Math.PI * 2);
  ctx.fillStyle = rgba(C0, 0.04); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, ap, 0, Math.PI * 2);
  ctx.fillStyle = rgba(C0, 0.1); ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = rgba(C0, 0.8); ctx.fill();
  ctx.font = '600 10px Inter, -apple-system, sans-serif';
  ctx.fillStyle = rgba(C0, 0.45); ctx.textAlign = 'center';
  ctx.fillText('1 AGENT → 50 ZIPS', cx, cy + 28);
}

function drawV1(ctx: CanvasRenderingContext2D, cw: number, ch: number, t: number) {
  const groups = v1Groups.map(g => ({ ...g, x: g.rx * cw, y: g.ry * ch }));
  for (let i = 0; i < groups.length; i++)
    for (let j = i + 1; j < groups.length; j++) {
      const dx = groups[j].x - groups[i].x, dy = groups[j].y - groups[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < cw * 0.35) {
        ctx.beginPath(); ctx.moveTo(groups[i].x, groups[i].y); ctx.lineTo(groups[j].x, groups[j].y);
        ctx.strokeStyle = rgba(C1, 0.04); ctx.lineWidth = 0.5;
        ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
      }
    }
  groups.forEach((g, gi) => {
    v1Groups[gi].zips.forEach(z => {
      const zx = g.x + Math.cos(z.angle) * z.r, zy = g.y + Math.sin(z.angle) * z.r;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(zx, zy);
      ctx.strokeStyle = rgba(C1, 0.15); ctx.lineWidth = 0.8; ctx.stroke();
      const p = 0.5 + 0.5 * Math.sin(t * 0.002 + z.phase);
      ctx.beginPath(); ctx.arc(zx, zy, 2.5 + p, 0, Math.PI * 2);
      ctx.fillStyle = rgba(C1, 0.25 + p * 0.3); ctx.fill();
    });
    const hp = 5 + 2 * Math.sin(t * 0.003 + gi);
    ctx.beginPath(); ctx.arc(g.x, g.y, hp + 6, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C1, 0.06); ctx.fill();
    ctx.beginPath(); ctx.arc(g.x, g.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C1, 1); ctx.fill();
  });
  ctx.font = '600 10px Inter, -apple-system, sans-serif';
  ctx.fillStyle = rgba(C1, 0.4); ctx.textAlign = 'center';
  ctx.fillText('~8 AGENTS → PROXIMITY GROUPS → 50 ZIPS', cw / 2, ch - 10);
}

function drawV2(ctx: CanvasRenderingContext2D, cw: number, ch: number, t: number) {
  const px = 35, py = 22;
  const nodes = v2Zips.map(z => ({
    ...z, x: px + (z.rx + z.jx) * (cw - px * 2), y: py + (z.ry + z.jy) * (ch - py * 2),
  }));
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < cw * 0.16) {
        ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = rgba(C2, 0.03 + 0.02 * Math.sin(t * 0.001 + i));
        ctx.lineWidth = 0.3; ctx.stroke();
      }
    }
  v2Packets.forEach(p => {
    p.prog += p.spd;
    if (p.prog > 1) { p.prog = 0; p.from = p.to; p.to = Math.floor(Math.random() * 50); }
    const f = nodes[p.from], tn = nodes[p.to];
    ctx.beginPath(); ctx.arc(f.x + (tn.x - f.x) * p.prog, f.y + (tn.y - f.y) * p.prog, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C1, 0.6 * (1 - Math.abs(p.prog - 0.5) * 2)); ctx.fill();
  });
  nodes.forEach(n => {
    n.specs.forEach(s => {
      const sx = n.x + Math.cos(s.ba + t * s.spd) * s.rad;
      const sy = n.y + Math.sin(s.ba + t * s.spd) * s.rad;
      ctx.beginPath(); ctx.arc(sx, sy, 1, 0, Math.PI * 2);
      ctx.fillStyle = rgba(C1, 0.3 * (0.4 + 0.6 * Math.sin(t * 0.003 + s.ph))); ctx.fill();
    });
    const p = 0.5 + 0.5 * Math.sin(t * 0.002 + n.phase);
    ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = rgba(C2, 0.5 + p * 0.3); ctx.fill();
    ctx.beginPath(); ctx.arc(n.x, n.y, 7 + p * 3, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(C2, 0.04 + p * 0.03); ctx.lineWidth = 0.5; ctx.stroke();
  });
  ctx.font = '600 10px Inter, -apple-system, sans-serif';
  ctx.fillStyle = rgba(C2, 0.4); ctx.textAlign = 'center';
  ctx.fillText('500 SPECIALIST AGENTS → 10 DOMAINS × 50 ZIPS', cw / 2, ch - 8);
}

const phases = [
  {
    version: 'Start', date: 'July 2025', title: 'The Generalist',
    model: 'Claude Opus 2.x', colorVar: 'phase0',
    stats: [
      { value: '1', label: 'Agent' }, { value: '50', label: 'ZIP Codes' },
      { value: '1', label: 'Research Pass' }, { value: '~2pg', label: 'Per ZIP' },
    ],
    desc: 'One agent. One pass. Fifty ZIPs. The generalist scanned everything through a single lens — broad but shallow. It could spot surface patterns but couldn\'t hold the context depth to find the stories hiding underneath. Like sending one investigator to cover an entire metro.',
    draw: drawStart,
  },
  {
    version: 'V1', date: 'Fall 2025', title: 'The Proximity Network',
    model: 'Claude Opus 3.0', colorVar: 'phase1',
    stats: [
      { value: '~8', label: 'Agents' }, { value: '50', label: 'ZIP Codes' },
      { value: '3–10', label: 'ZIPs / Group' }, { value: '~6pg', label: 'Per ZIP' },
    ],
    desc: 'Markets grouped by geographic proximity — each agent owns a cluster and understands how neighboring ZIPs bleed into each other. Spillover effects, shared infrastructure, corridor dynamics. Context becomes local.',
    draw: drawV1,
  },
  {
    version: 'V2', date: 'Feb 2026', title: 'The Specialist Swarm',
    model: 'Claude Opus 4.6', colorVar: 'phase2',
    stats: [
      { value: '500', label: 'Agents' }, { value: '50', label: 'ZIP Codes' },
      { value: '10', label: 'Domains / ZIP' }, { value: '~30pg', label: 'Per ZIP' },
    ],
    desc: 'Every ZIP gets 10 domain specialists — demographics, ownership patterns, distress signals, economic drivers, housing stock, institutional activity, regulatory environment, infrastructure, market velocity, and narrative synthesis. Each goes deep. Then convergence finds where independent signals align.',
    draw: drawV2,
  },
];

const colorMap = {
  phase0: { dot: 'bg-[#6b7080]/10', inner: 'bg-[#6b7080]', badge: 'text-[#6b7080] bg-[#6b7080]/10', model: 'text-[#6b7080]', label: 'text-[#6b7080]', topLine: 'from-[#6b7080]/25' },
  phase1: { dot: 'bg-[#3A76F0]/10', inner: 'bg-[#3A76F0]', badge: 'text-[#3A76F0] bg-[#3A76F0]/10', model: 'text-[#3A76F0]', label: 'text-[#3A76F0]', topLine: 'from-[#3A76F0]/35' },
  phase2: { dot: 'bg-[#6BA2FF]/10', inner: 'bg-[#6BA2FF]', badge: 'text-[#6BA2FF] bg-[#6BA2FF]/10', model: 'text-[#6BA2FF]', label: 'text-[#6BA2FF]', topLine: 'from-[#6BA2FF]/35' },
};

const compRows = [
  { label: 'Agents', widths: [2, 16, 100], value: '500×' },
  { label: 'Depth', widths: [7, 20, 100], value: '15×' },
  { label: 'Convergence', widths: [0, 0, 100], value: '∞' },
  { label: 'Accuracy', widths: [25, 55, 95], value: '~4×' },
];

export default function EvolutionPage() {
  const compRef = useRef<HTMLDivElement>(null);
  const barsAnimated = useRef(false);

  useEffect(() => {
    if (!compRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !barsAnimated.current) {
          barsAnimated.current = true;
          compRef.current?.querySelectorAll<HTMLElement>('[data-target-width]').forEach(bar => {
            const delay = parseInt(bar.dataset.delay || '0');
            setTimeout(() => {
              bar.style.width = bar.dataset.targetWidth!;
            }, delay);
          });
        }
      });
    }, { threshold: 0.3 });
    obs.observe(compRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] overflow-y-auto" style={{ background: '#121216', color: '#e9e9eb' }}>
      {/* Ambient glow */}
      <div className="fixed top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(58,118,240,0.06) 0%, rgba(58,118,240,0.02) 50%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[960px] mx-auto px-10 py-20">
        {/* Header */}
        <div className="text-center mb-24 animate-fade-up">
          <div className="text-[13px] font-semibold tracking-wider uppercase text-[#3A76F0] mb-4">
            System Architecture · 2025 – 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-5">
            The Evolution of <span className="text-[#3A76F0]">Signal</span>
          </h1>
          <p className="text-lg text-[#8b8d97] max-w-[520px] mx-auto leading-relaxed">
            From one mind scanning the horizon to five hundred specialists dissecting every block. Each version fundamentally changed how intelligence is gathered.
          </p>
        </div>

        {/* Vision Quote */}
        <div className="mb-20 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-white/5 p-8" style={{ background: '#1b1c20' }}>
            <p className="text-[15px] leading-relaxed text-[#8b8d97] italic">
              &ldquo;Signal is a system that thinks about real estate markets the way the best human investor would if they had unlimited research capacity and zero bias. It starts from nothing. No assumptions about what matters, no predetermined scoring columns, no templates inherited from how the last market worked. It reads a market fresh — the way an investigator walks into a new city and starts asking questions, following leads, connecting dots that nobody told them to connect.&rdquo;
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative flex flex-col">
          {/* Timeline line */}
          <div className="absolute left-[24px] top-0 bottom-0 w-[2px] rounded-full opacity-25"
            style={{ background: 'linear-gradient(to bottom, #6b7080, #3A76F0, #6BA2FF)' }} />

          {phases.map((phase, i) => {
            const colors = colorMap[phase.colorVar as keyof typeof colorMap];
            return (
              <div key={phase.version} className="relative pl-[72px] pb-[68px]">
                {/* Dot */}
                <div className={`absolute left-[14px] top-[6px] w-[22px] h-[22px] rounded-full flex items-center justify-center ${colors.dot}`}>
                  <div className={`w-[10px] h-[10px] rounded-full ${colors.inner}`} />
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-xs font-semibold tracking-wider px-2.5 py-0.5 rounded-md ${colors.badge}`}>
                    {phase.version}
                  </span>
                  <span className="text-[13px] text-[#62646e]">{phase.date}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-1">{phase.title}</h2>
                <p className="text-[13px] text-[#62646e] mb-6">
                  Powered by <span className={`font-semibold ${colors.model}`}>{phase.model}</span>
                </p>

                {/* Card */}
                <div className="relative rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: '#1b1c20' }}>
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${colors.topLine} to-transparent`} />

                  {/* Canvas */}
                  <div className="h-[200px] mx-6 mt-6 rounded-xl overflow-hidden border border-white/[0.03]" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <CanvasViz draw={phase.draw} />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2.5 px-6 pt-6 pb-2">
                    {phase.stats.map(s => (
                      <div key={s.label} className="rounded-xl border border-white/[0.03] p-3.5 text-center" style={{ background: '#232428' }}>
                        <div className="text-[28px] font-bold leading-none mb-1.5 tracking-tight">{s.value}</div>
                        <div className={`text-[10px] font-semibold uppercase tracking-wider ${colors.label}`}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-[14.5px] leading-relaxed text-[#8b8d97] px-6 pb-6 pt-4">
                    {phase.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison */}
        <div ref={compRef} className="mt-24">
          <div className="text-xs font-semibold tracking-wider uppercase text-[#62646e] text-center mb-8">
            Intelligence Multiplier · Start → V2
          </div>
          <div className="flex flex-col gap-3.5 max-w-[680px] mx-auto">
            {compRows.map(row => (
              <div key={row.label} className="grid grid-cols-[100px_1fr_56px] items-center gap-4">
                <div className="text-[13px] font-medium text-[#8b8d97] text-right">{row.label}</div>
                <div className="h-[34px] rounded-lg relative overflow-hidden border border-white/[0.03]" style={{ background: '#232428' }}>
                  {row.widths.map((w, j) => (
                    <div
                      key={j}
                      className="absolute left-0 top-0 bottom-0 rounded-lg transition-all duration-[1800ms]"
                      style={{
                        width: '0%',
                        background: j === 0 ? '#6b7080' : j === 1 ? '#3A76F0' : '#6BA2FF',
                        opacity: j === 0 ? 1 : j === 1 ? 0.85 : 0.8,
                        zIndex: 3 - j,
                      }}
                      data-target-width={`${w}%`}
                      data-delay={j * 200}
                    />
                  ))}
                </div>
                <div className="text-[15px] font-bold text-[#3A76F0] text-right">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-28 text-center">
          <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
            <span className="text-[#3A76F0]">All Signal.</span>{' '}
            <span className="text-[#62646e] opacity-40">No Noise.</span>
          </div>
          <p className="text-[13px] text-[#62646e] mt-2">The filtering principle at every layer of the architecture.</p>
        </div>
      </div>
    </main>
  );
}
