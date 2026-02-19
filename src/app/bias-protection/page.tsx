'use client';

import { useMemo, memo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const statusColors: Record<string, { label: string; hex: string }> = {
  built: { label: 'BUILT', hex: '#22c55e' },
  planned: { label: 'PLANNED', hex: '#ef4444' },
};

const LayerNode = memo(function LayerNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  const isPlanned = Boolean(data.planned);
  const st = isPlanned ? statusColors.planned : statusColors.built;
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${hex}88`, borderStyle: 'dashed', backgroundColor: `${hex}12`, boxShadow: `0 4px 25px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: `${hex}20`, color: hex }}>
          {data.label as string}
        </span>
        <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${st.hex}15`, color: st.hex }}>
          {st.label}
        </span>
      </div>
      <div className="text-sm font-bold text-white leading-tight mb-1">{data.name as string}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">BIAS-ISOLATED LAYER</div>
      <div className="text-[11px] text-gray-400 leading-relaxed mb-2">{data.desc as string}</div>
      <div className="pt-2 border-t border-white/[0.06]">
        <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUTPUT: </span>
        <span className="text-[10px] text-gray-400 font-mono">{data.output as string}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const InfoNode = memo(function InfoNode({ data }: { data: Record<string, unknown> }) {
  const type = data.type as string;
  const colors = type === 'knows' ? { hex: '#22c55e', label: '✅ KNOWS' }
    : type === 'blocked' ? { hex: '#ef4444', label: '🚫 BLOCKED' }
    : { hex: '#6b7280', label: '❓ UNKNOWN' };

  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[220px] max-w-[260px] transition-all hover:scale-105 hover:shadow-xl cursor-pointer"
      style={{ borderColor: `${colors.hex}88`, borderStyle: 'dashed', backgroundColor: `${colors.hex}12`, boxShadow: `0 4px 25px ${colors.hex}20` }}>
      <Handle type="target" position={Position.Left} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md inline-block mb-2" style={{ backgroundColor: `${colors.hex}20`, color: colors.hex }}>
        {colors.label}
      </div>
      {(data.items as string[]).map((item, i) => (
        <div key={i} className="text-[11px] text-gray-400 leading-relaxed py-0.5 flex items-start gap-1">
          <span className="mt-0.5" style={{ color: `${colors.hex}80` }}>›</span> {item}
        </div>
      ))}
      <Handle type="source" position={Position.Right} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { layer: LayerNode, info: InfoNode };

const layerData = [
  { id: 'l0', label: 'L0', name: 'Strategy Orchestrator', hex: '#10b981',
    desc: 'Educates agents about strategy mechanics, success factors, and failure modes. Never directs research — only teaches context so agents can reason independently.',
    output: 'Strategy education context → all 10 agents',
    knows: ['Exit strategy details', 'Strategy mechanics', 'Buy box criteria'],
    unknown: ['What agents will find', 'Market conditions', 'Scoring formulas'],
    blocked: ['Cannot direct research', 'Cannot suggest signals', 'Cannot bias output'] },
  { id: 'l1', label: 'L1', name: '10 Research Agents', hex: '#3b82f6',
    desc: 'Domain specialists with Perplexity API access. Each reasons freely within their domain, guided only by L0 education. No prescribed fields or scoring awareness.',
    output: 'Raw domain findings per agent (structured)',
    knows: ['Domain expertise', 'Education from L0', 'ZIP code data'],
    unknown: ['Scoring criteria', 'Other agents\' findings', 'Signal classification'],
    blocked: ['No scoring logic', 'No signal labels', 'No direct strategy'] },
  { id: 'l2', label: 'L2', name: 'Intelligence Enrichment', hex: '#a855f7',
    desc: 'Cross-domain analysis: enrichment tagging, conflict detection, mosaic pattern recognition, proxy validation, propensity-to-sell assessment, and data quality scoring. Adds intelligence, never removes raw findings.',
    output: 'Enriched intelligence package → storage',
    knows: ['All agent outputs', 'Enrichment tagging', 'Cross-agent confirmation', 'Conflict detection', 'Mosaic pattern recognition', 'Proxy validation', 'Propensity to sell assessment', 'Data quality scoring'],
    unknown: ['Investor strategy', 'Why agents investigated', 'Score calculations'],
    blocked: ['No strategy access', 'No column defs', 'No signal classification — raw findings pass through intact'] },
  { id: 'l3', label: 'L3', name: 'Column Mapper', hex: '#ef4444', planned: true,
    desc: 'First layer to see BOTH research intelligence AND scoring column definitions. Maps synthesized findings to JavaScript scoring functions for Layer 4 execution.',
    output: 'JS scoring functions → Layer 4 (Vercel)',
    knows: ['Synthesized intel', 'Column definitions', 'Strategy weights'],
    unknown: ['Raw agent outputs', 'Research methodology'],
    blocked: ['Cannot modify upstream', 'Cannot re-run agents'] },
];

export default function BiasProtectionPage() {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    const ySpacing = 320;
    const xCenter = 400;
    layerData.forEach((layer, i) => {
      const y = i * ySpacing;
      nodes.push({ id: layer.id, type: 'layer', position: { x: xCenter - 120, y }, data: { ...layer } });
      nodes.push({ id: `${layer.id}-knows`, type: 'info', position: { x: xCenter - 440, y: y + 10 }, data: { type: 'knows', items: layer.knows } });
      nodes.push({ id: `${layer.id}-unknown`, type: 'info', position: { x: xCenter + 240, y: y + 10 }, data: { type: 'unknown', items: layer.unknown } });
      nodes.push({ id: `${layer.id}-blocked`, type: 'info', position: { x: xCenter + 540, y: y + 10 }, data: { type: 'blocked', items: layer.blocked } });
    });
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    for (let i = 0; i < layerData.length - 1; i++) {
      edges.push({
        id: `${layerData[i].id}-${layerData[i + 1].id}`,
        source: layerData[i].id, target: layerData[i + 1].id,
        style: { stroke: layerData[i].hex, strokeWidth: 2 },
        animated: true, type: 'smoothstep',
      });
    }
    layerData.forEach(layer => {
      ['knows', 'unknown', 'blocked'].forEach(type => {
        const color = type === 'knows' ? '#22c55e' : type === 'blocked' ? '#ef4444' : '#6b7280';
        edges.push({
          id: `${layer.id}-${type}`, source: layer.id, target: `${layer.id}-${type}`,
          style: { stroke: color, strokeWidth: 2 },
          animated: true, type: 'smoothstep',
        });
      });
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
            if (node.type === 'layer') {
              const h = node.data?.hex as string;
              return h || '#3b82f6';
            }
            return '#4b5563';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
