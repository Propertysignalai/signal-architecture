'use client';

import { useState } from 'react';

const agents = [
  { id: 1, emoji: '🏠', name: 'Property & Housing Stock', desc: 'Investigates the physical real estate landscape — what exists, what condition it\'s in, and what the housing mix tells you about a market.', questions: ['What\'s the age and condition distribution?', 'Where are vacancy clusters forming?', 'What housing types dominate and why?', 'Are there renovation or demolition patterns?'] },
  { id: 2, emoji: '💰', name: 'Financial & Equity', desc: 'Follows the money — mortgage stress, equity positions, assessment gaps, and financial patterns that reveal market health.', questions: ['What are the dominant equity positions?', 'Where is mortgage stress concentrating?', 'How do assessments compare to market values?', 'What\'s the refinance vs purchase ratio?'] },
  { id: 3, emoji: '⚖️', name: 'Distress & Legal', desc: 'Tracks the signals that most databases miss — tax liens, code violations, legal filings, and the early warnings of forced sellers.', questions: ['What are the foreclosure and pre-foreclosure trends?', 'Where are tax delinquencies clustering?', 'What legal filings indicate owner distress?', 'Are code violations escalating?'] },
  { id: 4, emoji: '👥', name: 'Ownership & Occupancy', desc: 'Maps who owns what and how they use it — tenure patterns, investor concentration, entity ownership, and occupancy dynamics.', questions: ['What\'s the owner-occupied vs investor ratio?', 'How long have current owners held?', 'Are there entity ownership patterns?', 'What\'s the vacancy trend?'] },
  { id: 5, emoji: '📊', name: 'Market Dynamics', desc: 'Reads the market pulse — price movements, absorption rates, listing patterns, and the velocity of transactions.', questions: ['What direction are prices moving?', 'How fast is inventory absorbing?', 'What\'s the days-on-market trend?', 'Are there price tier divergences?'] },
  { id: 6, emoji: '📅', name: 'Temporal & Seasonal', desc: 'Finds the patterns in time — cyclical trends, seasonal variations, and timing indicators that most analysis ignores.', questions: ['Are there seasonal transaction patterns?', 'How do current trends compare to historical cycles?', 'What timing indicators are emerging?', 'Is this market early, mid, or late cycle?'] },
  { id: 7, emoji: '💼', name: 'Economic Stress', desc: 'Monitors the economic foundation — employment shifts, income trends, business activity, and the macro forces that move local markets.', questions: ['What are the employment trends?', 'How are income levels shifting?', 'Are businesses opening or closing?', 'What economic indicators suggest stress?'] },
  { id: 8, emoji: '🏢', name: 'Investor & Competitive', desc: 'Watches the competition — institutional activity, flip volume, rental market dynamics, and who else is hunting in this ZIP.', questions: ['What\'s the institutional buyer presence?', 'How active is the flip market?', 'What\'s the rental competition level?', 'Are investors entering or exiting?'] },
  { id: 9, emoji: '📜', name: 'Regulatory & Political', desc: 'Tracks the rules of the game — zoning changes, tax policy shifts, code enforcement intensity, and political decisions that reshape markets.', questions: ['Are there zoning changes in progress?', 'How aggressive is code enforcement?', 'What tax policy changes are coming?', 'Are there development incentives?'] },
  { id: 10, emoji: '📍', name: 'Neighborhood & Microlocation', desc: 'Zooms into block-level intelligence — school quality, crime patterns, infrastructure changes, and the micro-factors that drive value.', questions: ['What are the school quality trends?', 'How are crime patterns shifting?', 'What infrastructure projects are planned?', 'Is walkability/transit improving?'] },
];

export default function AgentGrid() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {agents.map(a => {
        const isOpen = expanded === a.id;
        return (
          <div
            key={a.id}
            onClick={() => setExpanded(isOpen ? null : a.id)}
            className={`cursor-pointer rounded-2xl border transition-all duration-300 ${
              isOpen
                ? 'col-span-2 md:col-span-5 border-purple-500/30 bg-purple-950/20'
                : 'border-white/[0.06] bg-[#13141a] hover:border-purple-500/20 hover:bg-purple-950/10'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <span className="text-[10px] font-semibold text-purple-400 tracking-wider">AGENT {a.id}</span>
                  <h3 className="text-sm font-semibold text-white leading-tight">{a.name}</h3>
                </div>
              </div>

              {isOpen && (
                <div className="mt-4 space-y-4 animate-in fade-in duration-300">
                  <p className="text-sm text-[#8b8d97] leading-relaxed">{a.desc}</p>
                  <div>
                    <h4 className="text-xs font-semibold text-purple-400 tracking-wider mb-2">KEY INVESTIGATIONS</h4>
                    <ul className="space-y-1.5">
                      {a.questions.map((q, i) => (
                        <li key={i} className="text-sm text-[#8b8d97] flex items-start gap-2">
                          <span className="text-purple-500 mt-1 shrink-0">→</span> {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06]">
                    <h4 className="text-xs font-semibold text-purple-400 tracking-wider mb-1">OUTPUT SCHEMA</h4>
                    <div className="flex flex-wrap gap-2">
                      {['positive_signals', 'negative_signals', 'domain_findings', 'analytical_observations'].map(f => (
                        <span key={f} className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
