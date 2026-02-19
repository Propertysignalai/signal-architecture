'use client';

import { useMemo, memo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const agents = [
  { id: 1, emoji: '🏠', name: 'Physical Environment\n& Housing Stock', hex: '#3b82f6',
    desc: 'Investigates property age distributions, renovation patterns, housing density shifts, new construction permits, and physical deterioration indicators across the ZIP.',
    output: 'Housing condition signals, rehab opportunity density' },
  { id: 2, emoji: '💰', name: 'Financial Positions\n& Transactions', hex: '#22c55e',
    desc: 'Analyzes recent sale prices vs assessments, equity positions, mortgage origination patterns, cash vs financed ratios, and price trajectory by property type.',
    output: 'Equity distress indicators, transaction velocity' },
  { id: 3, emoji: '⚖️', name: 'Distress &\nLegal Activity', hex: '#ef4444',
    desc: 'Tracks foreclosure filings, lis pendens, tax lien volumes, code violations, probate filings, and bankruptcy rates. Leading indicators of forced disposition.',
    output: 'Distress density score, legal trigger events' },
  { id: 4, emoji: '👥', name: 'Ownership Structure\n& Occupancy', hex: '#f97316',
    desc: 'Maps owner-occupied vs absentee ratios, LLC ownership concentration, inherited property patterns, vacancy rates, and long-hold owner demographics.',
    output: 'Absentee owner density, inheritance flags' },
  { id: 5, emoji: '📊', name: 'Market Dynamics &\nDemographic Forces', hex: '#8b5cf6',
    desc: 'Studies population migration trends, median income shifts, employment sector dependencies, age demographics, and rent-vs-own equilibrium changes.',
    output: 'Demographic momentum, market phase classification' },
  { id: 6, emoji: '📅', name: 'Temporal &\nSeasonal Patterns', hex: '#ec4899',
    desc: 'Identifies listing seasonality, days-on-market trends, seasonal price fluctuations, and cyclical patterns in transaction volume and distress filings.',
    output: 'Optimal timing windows, seasonal urgency flags' },
  { id: 7, emoji: '💼', name: 'Economic Stress &\nLeading Indicators', hex: '#eab308',
    desc: 'Monitors local unemployment trends, business closure rates, permit decline patterns, utility shutoffs, and economic leading indicators for the area.',
    output: 'Economic stress index, leading decline signals' },
  { id: 8, emoji: '🏢', name: 'Investor &\nCompetitive Landscape', hex: '#06b6d4',
    desc: 'Assesses institutional buyer activity, fix-and-flip volume, wholesale transaction frequency, investor saturation, and competitive acquisition patterns.',
    output: 'Competition density, investor saturation score' },
  { id: 9, emoji: '📜', name: 'Regulatory &\nPolitical Environment', hex: '#10b981',
    desc: 'Reviews zoning changes, rent control proposals, tax policy shifts, building code updates, and political initiatives affecting property investment viability.',
    output: 'Regulatory risk score, opportunity zone flags' },
  { id: 10, emoji: '📍', name: 'Neighborhood &\nMicro-Location Intel', hex: '#a855f7',
    desc: 'Evaluates school ratings, crime trends, infrastructure projects, amenity proximity, walkability scores, and hyperlocal reputation signals.',
    output: 'Micro-location quality score, trajectory signals' },
];

const AgentNode = memo(function AgentNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${hex}88`, borderStyle: 'dashed', backgroundColor: `${hex}12`, boxShadow: `0 4px 25px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{data.emoji as string}</span>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: `${hex}20`, color: hex }}>
            AGENT {data.num as number}
          </span>
        </div>
      </div>
      <div className="text-sm font-bold text-white whitespace-pre-line leading-tight mb-1">{data.name as string}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">DOMAIN SPECIALIST</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">{data.desc as string}</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUTPUT: </span>
        <span className="text-[10px] text-gray-400 font-mono">{data.output as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const CenterNode = memo(function CenterNode() {
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[260px] max-w-[300px] text-center transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: '#a855f788', borderStyle: 'dashed', backgroundColor: '#a855f712', boxShadow: '0 4px 25px #a855f720' }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-3xl mb-2">🔬</div>
      <div className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-2" style={{ backgroundColor: '#a855f720', color: '#a855f7' }}>
        LAYER 1 — RESEARCH
      </div>
      <div className="text-lg font-bold text-white mb-1">10 Domain Specialists</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">Each ZIP gets 10 expert investigators. Each agent receives strategy education and determines independently what matters. No prescribed fields — the agent decides what to research and how deep to go.</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUTPUT: </span>
        <span className="text-[10px] text-gray-400 font-mono">10 independent intelligence reports</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const SchemaNode = memo(function SchemaNode() {
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: '#6366f188', borderStyle: 'dashed', backgroundColor: '#6366f112', boxShadow: '0 4px 25px #6366f120' }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📋</span>
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: '#6366f120', color: '#6366f1' }}>
          SHARED SCHEMA
        </span>
      </div>
      <div className="text-sm font-bold text-white mb-1">Output Format</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">All 10 agents output to the same structured format, enabling merge and cross-domain analysis.</div>
      {['positive_signals[]', 'negative_signals[]', 'domain_findings[]', 'analytical_observations[]'].map(f => (
        <div key={f} className="text-[10px] text-gray-400 leading-tight flex items-start gap-1 py-0.5">
          <span className="text-indigo-500 mt-0.5">›</span>
          <span className="font-mono">{f}</span>
        </div>
      ))}
      <div className="pt-2 mt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUTPUT: </span>
        <span className="text-[10px] text-gray-400 font-mono">Merged intelligence package → L2</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { agent: AgentNode, center: CenterNode, schema: SchemaNode };

export default function AgentsPage() {
  const cx = 600, cy = 400, radius = 420;

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      { id: 'center', type: 'center', position: { x: cx - 130, y: cy - 60 }, data: {} },
      { id: 'schema', type: 'schema', position: { x: cx - 120, y: cy + 380 }, data: {} },
    ];
    agents.forEach((a, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        id: `agent-${a.id}`, type: 'agent',
        position: { x: cx + Math.cos(angle) * radius - 110, y: cy + Math.sin(angle) * radius - 60 },
        data: { emoji: a.emoji, num: a.id, name: a.name, hex: a.hex, desc: a.desc, output: a.output },
      });
    });
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = agents.map(a => ({
      id: `center-agent-${a.id}`, source: 'center', target: `agent-${a.id}`,
      style: { stroke: a.hex, strokeWidth: 2 },
      animated: true, type: 'smoothstep',
    }));
    edges.push({
      id: 'center-schema', source: 'center', target: 'schema',
      style: { stroke: '#6366f1', strokeWidth: 2 },
      animated: true, type: 'smoothstep',
      label: 'shared format',
      labelStyle: { fill: '#6366f1', fontSize: 10 },
      labelBgStyle: { fill: '#0a0a0f', fillOpacity: 0.8 },
    });
    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <main className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] w-full bg-gray-950">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.15} maxZoom={2} className="bg-gray-950"
        defaultEdgeOptions={{ type: 'smoothstep' }}>
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'agent') return (node.data?.hex as string) || '#a855f7';
            if (node.type === 'schema') return '#6366f1';
            return '#a855f7';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
