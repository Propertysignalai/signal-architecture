const stages = [
  {
    label: 'INPUT',
    color: 'from-cyan-600 to-cyan-500',
    title: 'Trigger Data',
    input: 'Webhook / Manual',
    output: 'zip_code + exit_strategy + buy_box_criteria',
    detail: 'Raw investor request with target zip and strategy parameters',
  },
  {
    label: 'L0',
    color: 'from-blue-600 to-blue-500',
    title: 'Strategy Orchestrator',
    input: 'exit_strategy + buy_box_criteria',
    output: 'education_context (text)',
    detail: 'Translates strategy into domain-specific education — mechanics only, no directives',
  },
  {
    label: 'L1',
    color: 'from-purple-600 to-indigo-500',
    title: '10 Parallel Research Agents',
    input: 'zip_code + education_context + domain_prompt',
    output: '{ positive_signals, negative_signals, domain_findings, analytical_observations } × 10',
    detail: 'Each agent independently researches its domain and reasons freely about findings',
  },
  {
    label: 'MERGE',
    color: 'from-gray-600 to-gray-500',
    title: 'Output Aggregation',
    input: '10 agent JSON outputs',
    output: 'combined_intelligence[ ]',
    detail: 'Simple concatenation of all 10 agent outputs into a single array',
  },
  {
    label: 'L2',
    color: 'from-amber-600 to-orange-500',
    title: 'Strategy-Blind Analyst',
    input: 'combined_intelligence[ ]',
    output: 'deduplicated_intelligence + conflict_resolution + mosaic_patterns + propensity_to_sell',
    detail: 'Knows NOTHING about strategy. Deduplicates, resolves conflicts, finds cross-domain patterns, validates via proxy signals',
  },
];

export default function DataFlowPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-y-auto">
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text text-transparent">
          Data Flow Transformations
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-2xl">
          How raw input transforms through each pipeline layer into actionable intelligence.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-6xl mx-auto space-y-4">
        {stages.map((s, i) => (
          <div key={s.label}>
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <div className="flex items-start gap-4">
                <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${s.color} text-sm font-bold shrink-0 mt-0.5`}>
                  {s.label}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.detail}</p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Input</span>
                      <p className="text-sm text-gray-300 font-mono mt-1">{s.input}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Output</span>
                      <p className="text-sm text-gray-300 font-mono mt-1">{s.output}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {i < stages.length - 1 && (
              <div className="flex justify-center py-1">
                <div className="text-gray-600 text-xl">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
