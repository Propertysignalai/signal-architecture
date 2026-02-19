'use client';

const sections = [
  {
    label: 'Built', color: 'green', dot: 'bg-green-500',
    items: [
      'V2 architecture design',
      '10 agent prompts (domain specialists)',
      'Layer 0 Strategy Orchestrator prompt',
      'Layer 2 strategy-blind enrichment prompt',
      'n8n workflow (18 nodes, 10 parallel agents)',
      'Architecture dashboard + evolution page',
    ],
  },
  {
    label: 'In Progress', color: 'yellow', dot: 'bg-yellow-500',
    items: [
      'V2 workflow deploy & test',
      'Full pipeline testing (ZIP 63136 + Fix & Flip)',
    ],
  },
  {
    label: 'Planned', color: 'red', dot: 'bg-red-500',
    items: [
      'Layer 3 column mapping',
      'Base44 entity creation',
      'Production webhook fix',
      '50-ZIP batch processing',
    ],
  },
];

export default function StatusSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map(s => (
        <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-[#13141a] p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
            <h3 className="text-sm font-semibold text-white tracking-wide">{s.label}</h3>
          </div>
          <ul className="space-y-2.5">
            {s.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mt-1.5 shrink-0 opacity-60`} />
                <span className="text-sm text-[#8b8d97]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
