'use client';

import { useMemo, memo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const LayerNode = memo(function LayerNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  const isPlanned = Boolean(data.planned);
  return (
    <div className="relative px-5 py-4 rounded-xl border-2 shadow-lg backdrop-blur-sm min-w-[240px] max-w-[280px] transition-all hover:scale-105 hover:shadow-xl"
      style={{ borderColor: `${hex}99`, borderStyle: isPlanned ? 'dashed' : 'dashed', backgroundColor: `${hex}15`, boxShadow: `0 4px 20px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: `${hex}20`, color: hex }}>
          {data.label as string}
        </span>
        {isPlanned && <span className="text-[9px] font-bold text-red-400 tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded">PLANNED</span>}
      </div>
      <div className="text-base font-bold text-white">{data.name as string}</div>
      <div className="text-[10px] text-gray-400 mt-1">{data.desc as string}</div>
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
    <div className="relative px-3 py-2.5 rounded-xl border shadow-lg backdrop-blur-sm min-w-[200px] max-w-[220px] transition-all hover:scale-105"
      style={{ borderColor: `${colors.hex}40`, borderStyle: 'dashed', backgroundColor: `${colors.hex}10`, boxShadow: `0 4px 15px ${colors.hex}10` }}>
      <Handle type="target" position={Position.Left} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="text-[9px] font-bold tracking-wider mb-1.5" style={{ color: colors.hex }}>{colors.label}</div>
      {(data.items as string[]).map((item, i) => (
        <div key={i} className="text-[10px] leading-relaxed py-0.5 flex items-start gap-1" style={{ color: `${colors.hex}bb` }}>
          <span className="mt-0.5" style={{ color: `${colors.hex}80` }}>›</span> {item}
        </div>
      ))}
      <Handle type="source" position={Position.Right} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { layer: LayerNode, info: InfoNode };

const layerData = [
  { id: 'l0', label: 'L0', name: 'Strategy Orchestrator', hex: '#10b981', desc: 'Educates agents about strategy mechanics',
    knows: ['Exit strategy details', 'Strategy mechanics', 'Buy box criteria'],
    unknown: ['What agents will find', 'Market conditions', 'Scoring formulas'],
    blocked: ['Cannot direct research', 'Cannot suggest signals', 'Cannot bias output'] },
  { id: 'l1', label: 'L1', name: '10 Research Agents', hex: '#3b82f6', desc: 'Domain specialists reasoning freely',
    knows: ['Domain expertise', 'Education from L0', 'ZIP code data'],
    unknown: ['Scoring criteria', 'Other agents\' findings', 'Signal classification'],
    blocked: ['No scoring logic', 'No signal labels', 'No direct strategy'] },
  { id: 'l2', label: 'L2', name: 'Intelligence Analyst', hex: '#a855f7', desc: 'Strategy-blind synthesis & dedup',
    knows: ['All agent outputs', 'Dedup logic', 'Conflict resolution'],
    unknown: ['Investor strategy', 'Why agents investigated', 'Score calculations'],
    blocked: ['No strategy access', 'No column defs', 'No signal classification'] },
  { id: 'l3', label: 'L3', name: 'Column Mapper', hex: '#ef4444', desc: 'Maps intelligence to scoring columns', planned: true,
    knows: ['Synthesized intel', 'Column definitions', 'Strategy weights'],
    unknown: ['Raw agent outputs', 'Research methodology'],
    blocked: ['Cannot modify upstream', 'Cannot re-run agents'] },
];

export default function BiasProtectionPage() {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];
    const ySpacing = 280;
    const xCenter = 400;
    layerData.forEach((layer, i) => {
      const y = i * ySpacing;
      nodes.push({ id: layer.id, type: 'layer', position: { x: xCenter - 120, y }, data: { ...layer } });
      nodes.push({ id: `${layer.id}-knows`, type: 'info', position: { x: xCenter - 420, y: y + 10 }, data: { type: 'knows', items: layer.knows } });
      nodes.push({ id: `${layer.id}-unknown`, type: 'info', position: { x: xCenter + 220, y: y + 10 }, data: { type: 'unknown', items: layer.unknown } });
      nodes.push({ id: `${layer.id}-blocked`, type: 'info', position: { x: xCenter + 500, y: y + 10 }, data: { type: 'blocked', items: layer.blocked } });
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
          style: { stroke: color, strokeWidth: 1.5 },
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
        nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.15 }} minZoom={0.2} maxZoom={2} className="bg-gray-950"
        defaultEdgeOptions={{ type: 'smoothstep' }}>
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg" nodeColor={(node) => node.type === 'layer' ? '#3b82f6' : '#4b5563'} maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
