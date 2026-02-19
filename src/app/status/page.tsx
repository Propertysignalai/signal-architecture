'use client';

import { useMemo, memo, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const HubNode = memo(function HubNode() {
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] text-center transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: '#3A76F088', borderStyle: 'dashed', backgroundColor: '#3A76F012', boxShadow: '0 4px 25px #3A76F020' }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-3xl mb-1">⚡</div>
      <div className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-2" style={{ backgroundColor: '#3A76F020', color: '#3A76F0' }}>
        ROADMAP
      </div>
      <div className="text-lg font-bold text-white mb-1">Signal V2</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">Map-to-Mailbox pipeline with 4-layer bias protection, 10 research agents, and intelligent scoring.</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">STATUS: </span>
        <span className="text-[10px] text-gray-400 font-mono">Core pipeline validated</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const CategoryNode = memo(function CategoryNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] text-center transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${hex}88`, borderStyle: 'dashed', backgroundColor: `${hex}12`, boxShadow: `0 4px 25px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">{data.emoji as string}</span>
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: `${hex}20`, color: hex }}>
          {data.badge as string}
        </span>
      </div>
      <div className="text-sm font-bold text-white mb-1">{data.label as string}</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">{data.desc as string}</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold tracking-wider" style={{ color: hex }}>{data.count as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const ItemNode = memo(function ItemNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-5 py-3 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${hex}88`, borderStyle: 'dashed', backgroundColor: `${hex}12`, boxShadow: `0 4px 25px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-xs font-bold text-white flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
        {data.label as string}
      </div>
      {Boolean(data.desc) && <div className="text-[11px] text-gray-400 leading-relaxed mt-1">{String(data.desc)}</div>}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { hub: HubNode, category: CategoryNode, item: ItemNode };

const built = [
  { label: 'V2 architecture design', desc: 'Complete 8-phase pipeline with bias protection' },
  { label: '10 agent prompts', desc: 'Domain-specific research prompts validated' },
  { label: 'Layer 0 prompt', desc: 'Strategy education without research direction' },
  { label: 'Layer 2 prompt', desc: 'Intelligence enrichment with cross-domain analysis' },
  { label: 'n8n workflow (18 nodes)', desc: 'Full orchestration pipeline deployed' },
  { label: 'Architecture dashboard', desc: 'React Flow visualization of all systems' },
  { label: 'Evolution page', desc: 'V1→V2 architectural journey documentation' },
  { label: 'V2 workflow deploy & test', desc: 'End-to-end pipeline validation complete' },
  { label: 'Full pipeline testing', desc: '10 agents validated with real ZIP data' },
];
const progress = [
  { label: 'Agent prompt tuning', desc: 'Agents 5, 8, 10 need deeper domain coverage' },
  { label: 'Rerun consistency testing', desc: 'Verifying output stability across multiple runs' },
];
const planned = [
  { label: 'Layer 3 column mapping', desc: 'Maps intelligence → JS scoring functions' },
  { label: 'Layer 4 execution (Vercel)', desc: 'Serverless scoring against 50K+ property rows' },
  { label: 'Base44 entities', desc: 'Persistent storage for research & scoring data' },
  { label: 'Production webhook', desc: 'Live endpoint for automated pipeline triggers' },
  { label: 'Multi-ZIP batch orchestration', desc: 'Parallel processing across ZIP batches' },
  { label: 'No-strategy mode', desc: 'Propensity-only scoring without exit strategy' },
  { label: 'Contrasting market test', desc: 'Validate with healthy/growing market ZIPs' },
];

function makeStatusNodes(): Node[] {
  const nodes: Node[] = [
    { id: 'hub', type: 'hub', position: { x: 400, y: 0 }, data: {} },
    { id: 'cat-built', type: 'category', position: { x: 30, y: 180 }, data: { label: 'Built', hex: '#22c55e', emoji: '✅', badge: `${built.length} ITEMS`, desc: 'Core pipeline components completed and validated.', count: `${built.length} components delivered` } },
    { id: 'cat-progress', type: 'category', position: { x: 380, y: 180 }, data: { label: 'In Progress', hex: '#eab308', emoji: '🔧', badge: `${progress.length} ITEMS`, desc: 'Active tuning and testing for production readiness.', count: `${progress.length} items in flight` } },
    { id: 'cat-planned', type: 'category', position: { x: 720, y: 180 }, data: { label: 'Planned', hex: '#ef4444', emoji: '📋', badge: `${planned.length} ITEMS`, desc: 'Next phase: scoring execution and production deployment.', count: `${planned.length} items queued` } },
  ];
  built.forEach((item, i) => {
    nodes.push({ id: `built-${i}`, type: 'item', position: { x: -60 + (i % 2) * 240, y: 360 + Math.floor(i / 2) * 75 }, data: { label: item.label, desc: item.desc, hex: '#22c55e' } });
  });
  progress.forEach((item, i) => {
    nodes.push({ id: `progress-${i}`, type: 'item', position: { x: 330, y: 360 + i * 75 }, data: { label: item.label, desc: item.desc, hex: '#eab308' } });
  });
  planned.forEach((item, i) => {
    nodes.push({ id: `planned-${i}`, type: 'item', position: { x: 660, y: 360 + i * 75 }, data: { label: item.label, desc: item.desc, hex: '#ef4444' } });
  });
  return nodes;
}

export default function StatusPage() {
  const initialNodes = useMemo(() => makeStatusNodes(), []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      { id: 'hub-built', source: 'hub', target: 'cat-built', style: { stroke: '#22c55e', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
      { id: 'hub-progress', source: 'hub', target: 'cat-progress', style: { stroke: '#eab308', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
      { id: 'hub-planned', source: 'hub', target: 'cat-planned', style: { stroke: '#ef4444', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
    ];
    built.forEach((_, i) => edges.push({ id: `cat-built-${i}`, source: 'cat-built', target: `built-${i}`, style: { stroke: '#22c55e', strokeWidth: 2 }, animated: true, type: 'smoothstep' }));
    progress.forEach((_, i) => edges.push({ id: `cat-progress-${i}`, source: 'cat-progress', target: `progress-${i}`, style: { stroke: '#eab308', strokeWidth: 2 }, animated: true, type: 'smoothstep' }));
    planned.forEach((_, i) => edges.push({ id: `cat-planned-${i}`, source: 'cat-planned', target: `planned-${i}`, style: { stroke: '#ef4444', strokeWidth: 2 }, animated: true, type: 'smoothstep' }));
    return edges;
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleOrganize = useCallback(() => {
    setNodes(makeStatusNodes());
    setTimeout(() => {
      const fitBtn = document.querySelector('.react-flow__controls-fitview') as HTMLButtonElement;
      fitBtn?.click();
    }, 50);
  }, [setNodes]);

  return (
    <main className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] w-full bg-gray-950 relative">
      <div className="absolute top-3 right-3 z-10">
        <button onClick={handleOrganize} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3A76F0]/20 text-[#3A76F0] text-xs font-bold hover:bg-[#3A76F0]/30 transition-colors border border-[#3A76F0]/30 backdrop-blur-sm">
          ✨ Organize
        </button>
      </div>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.15} maxZoom={2} className="bg-gray-950"
        defaultEdgeOptions={{ type: 'smoothstep' }}>
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'hub') return '#3A76F0';
            const h = node.data?.hex as string;
            return h || '#6b7280';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
