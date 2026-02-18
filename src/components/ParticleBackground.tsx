'use client';

import { useRef, useEffect } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf: number;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; phase: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw(t: number) {
      const w = window.innerWidth, h = window.innerHeight;
      ctx!.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

        const px = p.x * w, py = p.y * h;
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.001 + p.phase);
        ctx!.beginPath();
        ctx!.arc(px, py, p.r * (0.8 + pulse * 0.4), 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(58, 118, 240, ${0.15 + pulse * 0.2})`;
        ctx!.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = (particles[j].x - particles[i].x) * w;
          const dy = (particles[j].y - particles[i].y) * h;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x * w, particles[i].y * h);
            ctx!.lineTo(particles[j].x * w, particles[j].y * h);
            ctx!.strokeStyle = `rgba(58, 118, 240, ${0.04 * (1 - dist / 120)})`;
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
