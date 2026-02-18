'use client';

const layers = [
  {
    id: 'l0', label: 'Layer 0', name: 'Strategy Orchestrator', color: 'emerald',
    knows: ['Exit strategy (Fix & Flip, BRRRR, etc.)', 'Strategy mechanics and what makes them work', 'Buy box criteria'],
    doesntKnow: ['What agents will find', 'Market conditions', 'Scoring formulas'],
    blocked: ['Cannot direct research', 'Cannot suggest signals to find', 'Cannot bias agent output'],
  },
  {
    id: 'l1', label: 'Layer 1', name: '10 Research Agents', color: 'blue',
    knows: ['Their specific domain expertise', 'Strategy education from L0 (mechanics only)', 'ZIP code and location data'],
    doesntKnow: ['Scoring criteria or column weights', 'What other agents found', 'How findings will be classified'],
    blocked: ['No access to scoring logic', 'No signal classification', 'Cannot see exit strategy directly'],
  },
  {
    id: 'l2', label: 'Layer 2', name: 'Intelligence Analyst', color: 'purple',
    knows: ['All 10 agent outputs', 'Deduplication logic', 'Conflict resolution patterns'],
    doesntKnow: ['Investor\'s exit strategy', 'Why agents investigated what they did', 'How scores will be calculated'],
    blocked: ['No access to strategy', 'No column definitions', 'No scoring logic', 'Cannot classify signals as positive/negative for the strategy'],
  },
  {
    id: 'l3', label: 'Layer 3', name: 'Column Mapper', color: 'red',
    knows: ['Synthesized intelligence from L2', 'Scoring column definitions', 'Strategy-specific weights'],
    doesntKnow: ['Raw agent outputs', 'Research methodology'],
    blocked: ['Cannot modify upstream intelligence', 'Cannot re-run agents'],
    planned: true,
  },
];

export default function BiasChain() {
  return (
    <div className="relative space-y-4">
      {/* Connecting flow line */}
      <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/20 via-blue-500/20 via-purple-500/20 to-red-500/20 hidden md:block" />

      {layers.map((layer, i) => (
        <div key={layer.id} className="relative">
          {/* Arrow between layers */}
          {i > 0 && (
            <div className="flex justify-center mb-3">
              <div className="text-[#62646e] text-lg">↓</div>
            </div>
          )}

          <div className={`rounded-2xl border ${layer.planned ? 'border-red-500/20 border-dashed' : 'border-white/[0.06]'} bg-[#13141a] p-5 md:p-6 relative overflow-hidden`}>
            {layer.planned && (
              <div className="absolute top-3 right-3 text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-md bg-red-500/10 text-red-400">
                PLANNED
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-bold tracking-wider px-2.5 py-1 rounded-lg ${
                layer.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                layer.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                layer.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {layer.label}
              </span>
              <h3 className="text-lg font-semibold text-white">{layer.name}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* KNOWS */}
              <div className="rounded-xl bg-green-950/20 border border-green-500/10 p-4">
                <h4 className="text-[10px] font-bold tracking-wider text-green-400 mb-2">✅ KNOWS</h4>
                <ul className="space-y-1.5">
                  {layer.knows.map((item, j) => (
                    <li key={j} className="text-xs text-green-300/70 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5 shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* DOESN'T KNOW */}
              <div className="rounded-xl bg-gray-900/50 border border-white/[0.04] p-4">
                <h4 className="text-[10px] font-bold tracking-wider text-[#62646e] mb-2">❓ DOESN&apos;T KNOW</h4>
                <ul className="space-y-1.5">
                  {layer.doesntKnow.map((item, j) => (
                    <li key={j} className="text-xs text-[#62646e] flex items-start gap-1.5">
                      <span className="mt-0.5 shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* BLOCKED */}
              <div className="rounded-xl bg-red-950/20 border border-red-500/10 p-4">
                <h4 className="text-[10px] font-bold tracking-wider text-red-400 mb-2">🚫 BLOCKED</h4>
                <ul className="space-y-1.5">
                  {layer.blocked.map((item, j) => (
                    <li key={j} className="text-xs text-red-300/70 flex items-start gap-1.5">
                      <span className="text-red-500 mt-0.5 shrink-0">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
