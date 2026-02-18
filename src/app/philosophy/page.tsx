export default function PhilosophyPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-y-auto">
      {/* Hero */}
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Design Philosophy
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-2xl">
          How Signal V4 evolved from rigid templates to free-reasoning agents — and why that matters for intelligence quality.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-6xl mx-auto space-y-10">
        {/* Evolution Timeline */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">Evolution Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { v: 'V1', desc: '5 prescribed agents with rigid output templates', color: 'from-gray-700 to-gray-600', icon: '📋' },
              { v: 'V2', desc: '5 agents with improved prompts and better context', color: 'from-gray-600 to-gray-500', icon: '📝' },
              { v: 'V3', desc: '10 specialized agents with structured JSON output', color: 'from-indigo-800 to-indigo-600', icon: '🔧' },
              { v: 'V4', desc: '10 free-reasoning agents, Layer 0 education, strategy-blind L2 synthesis', color: 'from-purple-700 to-indigo-500', icon: '🧠' },
            ].map((item) => (
              <div
                key={item.v}
                className={`rounded-xl bg-gradient-to-br ${item.color} p-5 border border-gray-700/50`}
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="text-xl font-bold text-white">{item.v}</h3>
                <p className="text-sm text-gray-200 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Insight */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="text-3xl">💡</span> Why Free Reasoning Beats Templates
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            Structured output schemas told agents <em>what</em> to find — biasing their research toward expected answers.
            V4 flips this: agents receive <strong>domain education</strong> (mechanics of how their domain works),
            then reason freely about what they observe. The structured output schema captures their findings without
            constraining their thinking. This produces richer, more surprising intelligence.
          </p>
        </section>

        {/* Key Principles */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">Key Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '🔒',
                title: 'Bias Protection',
                desc: 'Each layer only knows what it needs. Strategy never leaks into research. Research never leaks into synthesis.',
              },
              {
                icon: '🎯',
                title: 'Strategy-Blind Synthesis',
                desc: 'Layer 2 knows NOTHING about the investor\'s strategy. It only sees raw intelligence — deduplicating, resolving conflicts, and finding mosaic patterns.',
              },
              {
                icon: '✅',
                title: '"If It Works, Keep It"',
                desc: 'Architecture decisions are empirical. When agents produce better signals with free reasoning, we keep free reasoning. No dogma.',
              },
            ].map((p) => (
              <div
                key={p.title}
                className="bg-gray-900 rounded-xl border border-gray-800 p-6 hover:border-indigo-600/50 transition-colors"
              >
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
