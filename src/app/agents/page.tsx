const agents = [
  { num: 1, name: 'Property Stock', domain: 'Housing inventory & supply dynamics', questions: ['What is available inventory?', 'Days on market trends?', 'New listings vs absorption rate?'] },
  { num: 2, name: 'Financial Equity', domain: 'Equity positions & financial pressure', questions: ['Average equity in the zip?', 'Negative equity concentrations?', 'Cash-out refi activity?'] },
  { num: 3, name: 'Distress & Legal', domain: 'Foreclosure, liens, legal distress', questions: ['Foreclosure pipeline volume?', 'Tax lien activity?', 'Code violation patterns?'] },
  { num: 4, name: 'Ownership & Occupancy', domain: 'Owner types, vacancy, tenure', questions: ['Owner-occupied vs rental ratio?', 'Vacancy rate trends?', 'Average tenure length?'] },
  { num: 5, name: 'Market Dynamics', domain: 'Pricing, velocity, competition', questions: ['Price trend direction?', 'Sale-to-list ratios?', 'Investor purchase share?'] },
  { num: 6, name: 'Temporal & Seasonal', domain: 'Timing patterns and cycles', questions: ['Seasonal listing patterns?', 'Best months for acquisition?', 'Market cycle position?'] },
  { num: 7, name: 'Economic Stress', domain: 'Employment, income, affordability', questions: ['Unemployment trends?', 'Income-to-housing ratio?', 'Job market diversification?'] },
  { num: 8, name: 'Investor & Competitive', domain: 'Investor activity & competition', questions: ['Institutional buyer presence?', 'Flip activity volume?', 'Wholesale deal flow?'] },
  { num: 9, name: 'Regulatory & Political', domain: 'Zoning, policy, regulation', questions: ['Zoning changes pending?', 'Rent control proposals?', 'Tax assessment changes?'] },
  { num: 10, name: 'Neighborhood & Microlocation', domain: 'Hyperlocal factors & amenities', questions: ['School rating trends?', 'Crime trajectory?', 'Development pipeline nearby?'] },
];

export default function AgentsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-y-auto">
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Agent Identity System
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-2xl">
          10 specialized research agents, each with deep domain expertise and free reasoning capability.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-6xl mx-auto space-y-10">
        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((a) => (
            <div
              key={a.num}
              className="bg-gray-900 rounded-xl border border-gray-800 p-5 hover:border-purple-600/50 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-sm font-bold shrink-0">
                  {a.num}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{a.name}</h3>
                  <p className="text-xs text-gray-500">{a.domain}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {a.questions.map((q) => (
                  <li key={q} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5">•</span>{q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Shared Output Schema */}
        <section className="bg-gray-900 rounded-xl border border-gray-800 p-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <span className="text-3xl">📦</span> Shared Output Schema
          </h2>
          <p className="text-gray-400 mb-4 text-sm">Every agent produces the same four output fields, regardless of domain:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { field: 'positive_signals', desc: 'Favorable indicators for the target market', color: 'text-green-400' },
              { field: 'negative_signals', desc: 'Risk factors and warning signs', color: 'text-red-400' },
              { field: 'domain_findings', desc: 'Raw research findings from the domain', color: 'text-blue-400' },
              { field: 'analytical_observations', desc: 'Agent\'s own reasoning and inferences', color: 'text-yellow-400' },
            ].map((f) => (
              <div key={f.field} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                <code className={`text-sm font-mono ${f.color}`}>{f.field}</code>
                <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
