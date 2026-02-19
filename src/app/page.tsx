'use client';

import { useMemo, memo, useState, useCallback } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const phases = [
  { id: 'p1', num: '1', label: 'ZIP Selection\non Map', icon: '🗺️', hex: '#3b82f6',
    sublabel: 'USER ACTION', status: 'planned',
    desc: 'User opens coverage map, clicks to select target ZIPs. Exploration mode — no commitment yet.',
    output: 'Selected ZIP list' },
  { id: 'p2', num: '2', label: 'Research\nPipeline', icon: '🔬', hex: '#22c55e',
    sublabel: 'L0 → L1 → L2', status: 'built',
    desc: 'Per ZIP: Layer 0 strategy education → 10 parallel research agents → Layer 2 intelligence enrichment. Outputs include propensity to sell, mosaic patterns, conflict flags, and data quality assessment. All data SAVED.',
    output: 'Intelligence package per ZIP' },
  { id: 'p3', num: '3', label: 'Map Update\nwith Research', icon: '📊', hex: '#eab308',
    sublabel: 'VISUALIZATION', status: 'partial',
    desc: 'Map reflects research findings: signal strength tiers, propensity, mosaic confidence, distress indicators, trajectory.',
    output: 'Visual intelligence layer' },
  { id: 'p4', num: '4', label: 'Final ZIP\nSelections', icon: '✅', hex: '#8b5cf6',
    sublabel: 'USER DECISION', status: 'planned',
    desc: 'User narrows ZIPs based on research. Phase 1 was "investigate these." Phase 4 is "mail these."',
    output: 'Final ZIP list for mailing' },
  { id: 'p5', num: '5', label: 'Pull Raw\nProperty Data', icon: '📥', hex: '#06b6d4',
    sublabel: 'DATA IMPORT', status: 'built',
    desc: 'Raw CSV from PropStream/BatchLeads/SMARTData uploaded. List Conversion normalizes to 92-column format.',
    output: 'Standardized property list (50K+ rows)' },
  { id: 'p6', num: '6', label: 'Apply Scoring', icon: '🧠', hex: '#ef4444',
    sublabel: 'LAYER 3 + LAYER 4', status: 'planned',
    desc: 'Layer 3 (Claude): First layer to see both research AND scoring columns. Maps intelligence to JS scoring functions. Layer 4 (Vercel): Executes against every row.',
    output: 'Signal Score, Noise Filter, Urgency, Offer $' },
  { id: 'p7', num: '7', label: 'Campaign\nBuilder', icon: '🎯', hex: '#f97316',
    sublabel: 'USER FILTERS', status: 'partial',
    desc: 'Filter by Signal Score, Noise threshold, urgency, offer range, property chars. Set mail count target.',
    output: 'Filtered campaign list' },
  { id: 'p8', num: '8', label: 'Final\nMailing List', icon: '📬', hex: '#ec4899',
    sublabel: 'EXPORT', status: 'exists',
    desc: 'Export CSV for mail house. Each property has: Signal Score, Noise Filter, Urgency, Dynamic Offer, Offer %.',
    output: 'Ready-to-mail list' },
];

const statusColors: Record<string, { label: string; hex: string }> = {
  built: { label: 'BUILT', hex: '#22c55e' },
  partial: { label: 'PARTIAL', hex: '#eab308' },
  planned: { label: 'PLANNED', hex: '#ef4444' },
  exists: { label: 'EXISTS', hex: '#22c55e' },
};

const PhaseNode = memo(function PhaseNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  const st = statusColors[data.status as string];
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${hex}88`, borderStyle: 'dashed', backgroundColor: `${hex}12`, boxShadow: `0 4px 25px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{data.icon as string}</span>
          <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: `${hex}20`, color: hex }}>
            PHASE {data.num as string}
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${st.hex}15`, color: st.hex }}>
          {st.label}
        </span>
      </div>
      <div className="text-sm font-bold text-white whitespace-pre-line leading-tight mb-1">{data.label as string}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">{data.sublabel as string}</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">{data.desc as string}</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUTPUT: </span>
        <span className="text-[10px] text-gray-400 font-mono">{data.output as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const TitleNode = memo(function TitleNode() {
  return (
    <div className="px-6 py-4 text-center">
      <div className="text-2xl font-extrabold text-white mb-1">Signal V2 — Map to Mailbox</div>
      <div className="text-xs text-[#3A76F0] uppercase tracking-wider font-bold">Complete Product Workflow · 8 Phases</div>
      <div className="text-[11px] text-gray-500 mt-2 max-w-[400px]">Research is an investment. Scoring is an application. The map is the interface.</div>
    </div>
  );
});

const InsightNode = memo(function InsightNode() {
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 border-dashed border-[#3A76F0]/60 bg-[#3A76F0]/08 max-w-[380px] shadow-xl shadow-[#3A76F0]/20">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-400 !w-2 !h-2" />
      <div className="text-[11px] font-bold text-[#3A76F0] tracking-wider uppercase mb-2">⚡ CORE ARCHITECTURE PRINCIPLE</div>
      <div className="text-[12px] text-gray-400 leading-relaxed">
        Research and scoring are <span className="text-white font-semibold">decoupled</span>. Research on Monday, pull data on Thursday, score on Friday. Intelligence persists. The map accumulates intelligence over time — it gets smarter with every run.
      </div>
    </div>
  );
});

const DecouplingNode = memo(function DecouplingNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-4 py-3 rounded-xl border border-dashed shadow-md backdrop-blur-sm min-w-[160px] text-center transition-all hover:scale-105"
      style={{ borderColor: `${hex}66`, backgroundColor: `${hex}10`, boxShadow: `0 2px 15px ${hex}15` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-sm font-bold" style={{ color: hex }}>{data.label as string}</div>
      <div className="text-[10px] text-gray-500 mt-0.5">{data.sub as string}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { phase: PhaseNode, title: TitleNode, insight: InsightNode, decoupling: DecouplingNode };

export default function Home() {
  // Layout: 2 columns of 4, flowing down
  const col1x = 100, col2x = 420;
  const startY = 120;
  const yGap = 280;

  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      { id: 'title', type: 'title', position: { x: 160, y: -60 }, data: {}, draggable: true },
    ];

    // Phase nodes in a zigzag pattern
    phases.forEach((p, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      nodes.push({
        id: p.id, type: 'phase',
        position: { x: col === 0 ? col1x : col2x, y: startY + row * yGap },
        data: { ...p },
      });
    });

    // Decoupling labels
    nodes.push({
      id: 'research-label', type: 'decoupling',
      position: { x: -160, y: startY + 0.5 * yGap },
      data: { label: 'RESEARCH', sub: 'Run once, store forever', hex: '#22c55e' },
    });
    nodes.push({
      id: 'scoring-label', type: 'decoupling',
      position: { x: -160, y: startY + 2.5 * yGap },
      data: { label: 'SCORING', sub: 'Apply anytime, any list', hex: '#ef4444' },
    });

    // Insight node
    nodes.push({
      id: 'insight', type: 'insight',
      position: { x: 160, y: startY + 4 * yGap + 20 },
      data: {},
    });

    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    // Sequential phase connections
    for (let i = 0; i < phases.length - 1; i++) {
      edges.push({
        id: `${phases[i].id}-${phases[i + 1].id}`,
        source: phases[i].id, target: phases[i + 1].id,
        style: { stroke: phases[i].hex, strokeWidth: 2 },
        animated: true, type: 'smoothstep',
      });
    }
    // Last phase to insight
    edges.push({
      id: 'p8-insight', source: 'p8', target: 'insight',
      style: { stroke: '#3A76F0', strokeWidth: 1.5 },
      animated: true, type: 'smoothstep',
    });
    // Decoupling labels to phases
    edges.push({
      id: 'research-p2', source: 'research-label', target: 'p2',
      style: { stroke: '#22c55e', strokeWidth: 1, opacity: 0.3 },
      type: 'straight',
    });
    edges.push({
      id: 'scoring-p6', source: 'scoring-label', target: 'p6',
      style: { stroke: '#ef4444', strokeWidth: 1, opacity: 0.3 },
      type: 'straight',
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
            if (node.type === 'phase') {
              const s = node.data?.status as string;
              if (s === 'built' || s === 'exists') return '#22c55e';
              if (s === 'partial') return '#eab308';
              return '#ef4444';
            }
            return '#3A76F0';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
