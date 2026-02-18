const layers = [
  {
    id: 'L0',
    name: 'Strategy Orchestrator',
    color: 'from-blue-600 to-blue-500',
    borderColor: 'border-blue-600/50',
    knows: ['Full exit strategy', 'Buy box criteria', 'How each domain mechanically relates to the strategy'],
    doesntKnow: ['What agents will find', 'Final scoring or signals'],
    blocked: ['NEVER directs research conclusions', 'NEVER tells agents what to look for', 'NEVER passes scoring weights'],
  },
  {
    id: 'L1',
    name: '10 Research Agents',
    color: 'from-purple-600 to-indigo-500',
    borderColor: 'border-purple-600/50',
    knows: ['Domain expertise', 'Education context from L0 (mechanics only)', 'Zip code and market data'],
    doesntKnow: ['Exit strategy name', 'Scoring system or signal weights', 'What other agents found'],
    blocked: ['Strategy details', 'How findings will be scored', 'Other agents\' outputs'],
  },
  {
    id: 'L2',
    name: 'Intelligence Analyst',
    color: 'from-amber-600 to-orange-500',
    borderColor: 'border-amber-600/50',
    knows: ['All 10 agent outputs (raw)', 'Deduplication rules', 'Conflict resolution patterns', 'Proxy validation techniques'],
    doesntKnow: ['Exit strategy', 'Buy box criteria', 'Why this zip was chosen', 'Scoring weights'],
    blocked: ['ALL strategy context', 'Investor preferences', 'Target property types'],
  },
  {
    id: 'L3',
    name: 'Column Mapper',
    color: 'from-gray-600 to-gray-500',
    borderColor: 'border-gray-600/50',
    knows: ['Synthesized intelligence from L2', 'Column definitions and scoring rubrics'],
    doesntKnow: ['TBD — architecture in design'],
    blocked: ['TBD — PLANNED'],
    planned: true,
  },
];

export default function BiasProtectionPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-y-auto">
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-green-400 bg-clip-text text-transparent">
          Bias Protection Chain
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-2xl">
          Information barriers between layers ensure no single component can bias the intelligence pipeline.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-6xl mx-auto space-y-6">
        {layers.map((layer, i) => (
          <div key={layer.id}>
            <div className={`bg-gray-900 rounded-xl border ${layer.borderColor} p-6 ${layer.planned ? 'opacity-60' : ''}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`px-3 py-1 rounded-lg bg-gradient-to-r ${layer.color} text-sm font-bold`}>
                  {layer.id}
                </span>
                <h2 className="text-xl font-semibold">{layer.name}</h2>
                {layer.planned && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">PLANNED</span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-950/30 rounded-lg p-4 border border-green-800/30">
                  <h3 className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>✅</span> KNOWS
                  </h3>
                  <ul className="space-y-1">
                    {layer.knows.map((k) => (
                      <li key={k} className="text-sm text-gray-300">• {k}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  <h3 className="text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>❓</span> DOESN&apos;T KNOW
                  </h3>
                  <ul className="space-y-1">
                    {(Array.isArray(layer.doesntKnow) ? layer.doesntKnow : [layer.doesntKnow]).map((k) => (
                      <li key={k} className="text-sm text-gray-400">• {k}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-950/30 rounded-lg p-4 border border-red-800/30">
                  <h3 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span>🚫</span> BLOCKED
                  </h3>
                  <ul className="space-y-1">
                    {(Array.isArray(layer.blocked) ? layer.blocked : [layer.blocked]).map((k) => (
                      <li key={k} className="text-sm text-gray-300">• {k}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {i < layers.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="text-gray-600 text-2xl">↓</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
