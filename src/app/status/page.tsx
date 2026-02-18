const sections = [
  {
    status: 'built' as const,
    label: 'Built',
    color: 'bg-green-500',
    items: [
      'V2 architecture design',
      '10 agent prompts',
      'Layer 0 prompt (Strategy Orchestrator)',
      'Layer 2 strategy-blind prompt (Intelligence Analyst)',
      'n8n workflow JSON (18 nodes)',
      'Architecture dashboard',
    ],
  },
  {
    status: 'progress' as const,
    label: 'In Progress',
    color: 'bg-yellow-500',
    items: [
      'V2 workflow deploy & test',
      'Vercel deployment',
    ],
  },
  {
    status: 'planned' as const,
    label: 'Planned',
    color: 'bg-red-500',
    items: [
      'Layer 3 column mapping',
      'Base44 entity creation',
      'Production webhook fix',
    ],
  },
];

export default function StatusPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-950 text-white overflow-y-auto">
      <section className="px-8 pt-12 pb-8 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">
          Build Status
        </h1>
        <p className="mt-3 text-gray-400 text-lg max-w-2xl">
          Current state of the Signal V2 architecture implementation.
        </p>
      </section>

      <div className="px-8 pb-16 max-w-6xl mx-auto space-y-6">
        {sections.map((section) => (
          <div key={section.label} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-3">
              <span className={`w-3 h-3 rounded-full ${section.color}`} />
              {section.label}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item} className="flex items-center gap-3 text-gray-300">
                  <span className={`w-2 h-2 rounded-full ${section.color} shrink-0`} />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
