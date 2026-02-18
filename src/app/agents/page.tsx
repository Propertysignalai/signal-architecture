'use client';

import { useCallback, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Position, MarkerType, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const agents = [
  { id: 1, emoji: '🏠', name: 'Property &\nHousing Stock', q: 'Age, condition, vacancy,\nhousing type distribution' },
  { id: 2, emoji: '💰', name: 'Financial &\nEquity', q: 'Mortgage stress, equity\npositions, assessment ratios' },
  { id: 3, emoji: '⚖️', name: 'Distress &\nLegal', q: 'Foreclosures, tax liens,\ncode violations, legal filings' },
  { id: 4, emoji: '👥', name: 'Ownership &\nOccupancy', q: 'Tenure, investor ratio,\nturnover, entity ownership' },
  { id: 5, emoji: '📊', name: 'Market\nDynamics', q: 'Price trends, DOM,\nabsorption rate, listings' },
  { id: 6, emoji: '📅', name: 'Temporal &\nSeasonal', q: 'Cyclical patterns,\nseasonal trends, timing' },
  { id: 7, emoji: '💼', name: 'Economic\nStress', q: 'Employment, income,\nbusiness closures' },
  { id: 8, emoji: '🏢', name: 'Investor &\nCompetitive', q: 'Institutional activity,\nflip volume, rental comp' },
  { id: 9, emoji: '📜', name: 'Regulatory &\nPolitical', q: 'Zoning, tax policy,\ncode enforcement' },
  { id: 10, emoji: '📍', name: 'Neighborhood &\nMicrolocation', q: 'Schools, crime, transit,\nwalkability, infrastructure' },
];

function AgentNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-xl border-2 border-purple-500/40 bg-purple-950/60 px-4 py-3 min-w-[180px] shadow-lg shadow-purple-500/10">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xl">{data.emoji as string}</span>
        <span className="text-[10px] font-bold text-purple-400 tracking-wider">AGENT {data.num as number}</span>
      </div>
      <div className="text-sm font-bold text-white whitespace-pre-line leading-tight mb-1.5">{data.name as string}</div>
      <div className="text-[11px] text-purple-300/60 whitespace-pre-line leading-tight">{data.questions as string}</div>
    </div>
  );
}

function CenterNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-2xl border-2 border-purple-400/50 bg-purple-900/40 px-6 py-4 text-center shadow-xl shadow-purple-500/20">
      <div className="text-3xl mb-2">🔬</div>
      <div className="text-lg font-extrabold text-white mb-1">10 Domain Specialists</div>
      <div className="text-xs text-purple-300/60">Each ZIP gets 10 expert investigators</div>
    </div>
  );
}

function SchemaNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 px-4 py-3 min-w-[220px]">
      <div className="text-[10px] font-bold text-indigo-400 tracking-wider mb-2">SHARED OUTPUT SCHEMA</div>
      {['positive_signals', 'negative_signals', 'domain_findings', 'analytical_observations'].map(f => (
        <div key={f} className="text-[11px] font-mono text-indigo-300/70 py-0.5">→ {f}</div>
      ))}
    </div>
  );
}

const nodeTypes = { agent: AgentNode, center: CenterNode, schema: SchemaNode };

export default function AgentsPage() {
  const cx = 600, cy = 400, radius = 350;

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      { id: 'center', type: 'center', position: { x: cx - 100, y: cy - 50 }, data: {} },
      { id: 'schema', type: 'schema', position: { x: cx - 120, y: cy + 320 }, data: {} },
    ];

    agents.forEach((a, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2;
      nodes.push({
        id: `agent-${a.id}`,
        type: 'agent',
        position: { x: cx + Math.cos(angle) * radius - 90, y: cy + Math.sin(angle) * radius - 40 },
        data: { emoji: a.emoji, num: a.id, name: a.name, questions: a.q },
      });
    });

    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = agents.map(a => ({
      id: `center-agent-${a.id}`,
      source: 'center',
      target: `agent-${a.id}`,
      style: { stroke: '#a855f7', strokeWidth: 1.5, opacity: 0.3 },
      type: 'straight',
    }));
    edges.push({
      id: 'center-schema',
      source: 'center',
      target: 'schema',
      style: { stroke: '#6366f1', strokeWidth: 1.5, opacity: 0.4 },
      animated: true,
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
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg" nodeColor={() => '#a855f7'} maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
