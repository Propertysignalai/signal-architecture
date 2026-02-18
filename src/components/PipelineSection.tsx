'use client';

import { useState } from 'react';

const nodes = [
  {
    id: 'input', label: 'Input', icon: '📥', color: 'indigo',
    summary: 'The starting signal — a ZIP code and strategy.',
    dataIn: 'zip_code, exit_strategy, buy_box_criteria',
    dataOut: 'Structured input payload for the pipeline',
    status: 'built' as const,
    detail: 'Every analysis starts with a ZIP code and the investor\'s exit strategy. The system needs to know what you\'re looking for to educate agents about the mechanics — but never to bias their research.',
  },
  {
    id: 'l0', label: 'Layer 0: Strategy Orchestrator', icon: '🎓', color: 'green',
    summary: 'Educates agents about strategy mechanics. Never directs research.',
    dataIn: 'exit_strategy, buy_box_criteria',
    dataOut: 'education_context (strategy mechanics explanation)',
    status: 'built' as const,
    detail: 'Layer 0 understands the investor\'s strategy and translates it into domain education. If the strategy is Fix & Flip, agents learn what makes a good flip market — without being told what signals to find. Education, not direction.',
  },
  {
    id: 'agents', label: '10 Research Agents', icon: '🔬', color: 'purple',
    summary: '10 domain specialists run in parallel, each investigating their domain.',
    dataIn: 'zip_code, education_context from L0',
    dataOut: '10× { positive_signals, negative_signals, domain_findings, analytical_observations }',
    status: 'built' as const,
    detail: 'Each agent is a domain expert — property stock, financial equity, distress signals, ownership patterns, market dynamics, temporal trends, economic stress, investor competition, regulatory environment, and neighborhood microlocation. They reason freely within their domain, following leads wherever the data takes them.',
  },
  {
    id: 'merge', label: 'Merge', icon: '🔀', color: 'blue',
    summary: 'Combines all 10 agent outputs into a single intelligence package.',
    dataIn: '10 separate agent output objects',
    dataOut: 'Combined array of all findings',
    status: 'built' as const,
    detail: 'A simple but critical step — all 10 agent outputs are merged into one package. No filtering, no prioritization. Everything passes through. The intelligence must be complete before synthesis.',
  },
  {
    id: 'l2', label: 'Layer 2: Intelligence Analyst', icon: '🧠', color: 'green',
    summary: 'Strategy-blind synthesis. Dedup, conflict resolution, mosaic patterns.',
    dataIn: 'Combined agent findings (all 10 domains)',
    dataOut: 'Deduplicated intelligence, conflict analysis, mosaic patterns, propensity to sell',
    status: 'built' as const,
    detail: 'Layer 2 knows NOTHING about the investor\'s strategy. It only sees raw intelligence from 10 domains. It finds where signals converge across domains (mosaic patterns), resolves conflicts between agents, removes duplicates, and identifies the market\'s true story. Strategy-blind by design.',
  },
  {
    id: 'l3', label: 'Layer 3: Column Mapper', icon: '📋', color: 'red',
    summary: 'Maps intelligence to scoring columns. Not yet built.',
    dataIn: 'Synthesized intelligence from L2',
    dataOut: 'Scored columns for the Signal dashboard',
    status: 'planned' as const,
    detail: 'The final layer will map the synthesized intelligence into the scoring columns that power the Signal dashboard. This is where research becomes actionable scores. Currently in planning.',
  },
];

const colorStyles = {
  blue: { border: 'border-blue-500/30', bg: 'bg-blue-950/20', badge: 'bg-blue-500/10 text-blue-400' },
  green: { border: 'border-green-500/30', bg: 'bg-green-950/20', badge: 'bg-green-500/10 text-green-400' },
  purple: { border: 'border-purple-500/30', bg: 'bg-purple-950/20', badge: 'bg-purple-500/10 text-purple-400' },
  indigo: { border: 'border-indigo-500/30', bg: 'bg-indigo-950/20', badge: 'bg-indigo-500/10 text-indigo-400' },
  red: { border: 'border-red-500/30', bg: 'bg-red-950/20', badge: 'bg-red-500/10 text-red-400' },
};

const statusBadge = {
  built: { label: 'BUILT', cls: 'bg-green-500/10 text-green-400' },
  progress: { label: 'IN PROGRESS', cls: 'bg-yellow-500/10 text-yellow-400' },
  planned: { label: 'PLANNED', cls: 'bg-red-500/10 text-red-400' },
};

export default function PipelineSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/20 via-green-500/20 to-red-500/20" />

      <div className="space-y-4">
        {nodes.map((node, i) => {
          const isOpen = expanded === node.id;
          const colors = colorStyles[node.color as keyof typeof colorStyles];
          const status = statusBadge[node.status];

          return (
            <div key={node.id} className="relative">
              {/* Node dot */}
              <div className="absolute left-3.5 md:left-5.5 top-5 w-5 h-5 rounded-full bg-[#0a0b0f] flex items-center justify-center z-10">
                <div className={`w-3 h-3 rounded-full ${node.status === 'built' ? 'bg-green-500' : node.status === 'planned' ? 'bg-red-500' : 'bg-yellow-500'}`} />
              </div>

              <div
                onClick={() => setExpanded(isOpen ? null : node.id)}
                className={`ml-12 md:ml-16 cursor-pointer rounded-2xl border transition-all duration-300 ${
                  isOpen ? `${colors.border} ${colors.bg}` : 'border-white/[0.06] bg-[#13141a] hover:border-white/[0.12]'
                }`}
              >
                <div className="p-4 md:p-5">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xl">{node.icon}</span>
                    <h3 className="text-base font-semibold text-white flex-1">{node.label}</h3>
                    <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#8b8d97] mt-1">{node.summary}</p>

                  {isOpen && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-white/[0.06]">
                      <p className="text-sm text-[#8b8d97] leading-relaxed">{node.detail}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] font-semibold text-green-400 tracking-wider mb-1">DATA IN</div>
                          <p className="text-xs text-[#8b8d97] font-mono">{node.dataIn}</p>
                        </div>
                        <div className="rounded-xl bg-black/20 p-3">
                          <div className="text-[10px] font-semibold text-blue-400 tracking-wider mb-1">DATA OUT</div>
                          <p className="text-xs text-[#8b8d97] font-mono">{node.dataOut}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
