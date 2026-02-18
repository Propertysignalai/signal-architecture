'use client';

import Link from 'next/link';
import ParticleBackground from '@/components/ParticleBackground';
import ScrollReveal from '@/components/ScrollReveal';
import PipelineSection from '@/components/PipelineSection';
import AgentGrid from '@/components/AgentGrid';
import BiasChain from '@/components/BiasChain';
import StatusSection from '@/components/StatusSection';

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#0a0b0f', color: '#e9e9eb' }}>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="text-[13px] font-semibold tracking-wider uppercase text-[#3A76F0] mb-6">
            Real Estate Intelligence Architecture
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6">
            <span className="text-[#3A76F0]">All Signal.</span><br />
            <span className="text-[#62646e]/40">No Noise.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#8b8d97] max-w-xl mx-auto leading-relaxed mb-12">
            The system that thinks about real estate markets the way the best investor would — with unlimited research capacity and zero bias.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="#system" className="px-6 py-3 rounded-xl bg-[#3A76F0] text-white font-semibold text-sm hover:bg-[#3A76F0]/90 transition-colors">
              Explore the System
            </a>
            <Link href="/philosophy" className="px-6 py-3 rounded-xl border border-white/[0.1] text-[#8b8d97] font-semibold text-sm hover:border-white/[0.2] hover:text-white transition-colors">
              See the Evolution
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-[#62646e] tracking-wider">SCROLL</span>
          <span className="text-[#62646e]">↓</span>
        </div>
      </section>

      {/* ===== VISION ===== */}
      <section className="py-20 md:py-32 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-lg md:text-2xl text-[#8b8d97] leading-relaxed font-light italic">
              &ldquo;Every market has a story, and the story is always different. Jennings has a distress story hiding in $6K listings and landlord abandonment that never shows up in a foreclosure database. Signal finds the story that&apos;s actually there, not the story a template expects.&rdquo;
            </blockquote>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== EVOLUTION PREVIEW ===== */}
      <section className="py-16 md:py-24 px-6">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#62646e] text-center mb-10">
              The Evolution · July 2025 → Feb 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { v: 'Start', date: 'Jul 2025', stat: '1', unit: 'Agent', desc: 'One generalist scanning 50 ZIPs', color: '#6b7080' },
                { v: 'V1', date: 'Fall 2025', stat: '~8', unit: 'Agents', desc: 'Proximity groups, local context', color: '#3A76F0' },
                { v: 'V2', date: 'Feb 2026', stat: '500', unit: 'Agents', desc: '10 specialists × 50 ZIPs, convergence', color: '#6BA2FF' },
              ].map(item => (
                <div key={item.v} className="rounded-2xl border border-white/[0.06] bg-[#13141a] p-6 text-center">
                  <div className="text-[10px] font-bold tracking-wider mb-1" style={{ color: item.color }}>{item.v}</div>
                  <div className="text-xs text-[#62646e] mb-3">{item.date}</div>
                  <div className="text-4xl font-extrabold tracking-tight mb-1" style={{ color: item.color }}>{item.stat}</div>
                  <div className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: item.color }}>{item.unit}</div>
                  <p className="text-sm text-[#8b8d97]">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/philosophy" className="text-sm font-semibold text-[#3A76F0] hover:underline">
                Explore the full evolution →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== THE SYSTEM ===== */}
      <section id="system" className="py-16 md:py-24 px-6">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#3A76F0] text-center mb-3">
              The System
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
              How Signal Thinks
            </h3>
            <p className="text-center text-[#8b8d97] max-w-xl mx-auto mb-12">
              Click any node to see what it does, what data flows through it, and whether it&apos;s built yet.
            </p>
            <PipelineSection />
          </div>
        </ScrollReveal>
      </section>

      {/* ===== THE SWARM ===== */}
      <section className="py-16 md:py-24 px-6">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-purple-400 text-center mb-3">
              The Swarm
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
              10 Domain Specialists
            </h3>
            <p className="text-center text-[#8b8d97] max-w-xl mx-auto mb-12">
              Every ZIP gets 10 expert investigators. Each goes deep in their domain. Click to expand.
            </p>
            <AgentGrid />
          </div>
        </ScrollReveal>
      </section>

      {/* ===== THE CHAIN ===== */}
      <section className="py-16 md:py-24 px-6">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-emerald-400 text-center mb-3">
              The Chain
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-4">
              Bias Protection
            </h3>
            <p className="text-center text-[#8b8d97] max-w-xl mx-auto mb-12">
              Each layer only knows what it needs. Strategy never leaks into research. Research never leaks into synthesis.
            </p>
            <BiasChain />
          </div>
        </ScrollReveal>
      </section>

      {/* ===== BUILD STATUS ===== */}
      <section className="py-16 md:py-24 px-6">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-[#62646e] text-center mb-3">
              Build Status
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-12">
              Where We Are
            </h3>
            <StatusSection />
          </div>
        </ScrollReveal>
      </section>

      {/* ===== FOOTER ===== */}
      <section className="py-20 md:py-32 text-center px-6">
        <ScrollReveal>
          <div className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
            <span className="text-[#3A76F0]">All Signal.</span>{' '}
            <span className="text-[#62646e]/40">No Noise.</span>
          </div>
          <p className="text-[#62646e] text-sm mb-8">The filtering principle at every layer of the architecture.</p>
          <a
            href="https://github.com/Propertysignalai/signal-architecture"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#8b8d97] hover:text-white transition-colors"
          >
            View on GitHub →
          </a>
        </ScrollReveal>
      </section>
    </main>
  );
}
