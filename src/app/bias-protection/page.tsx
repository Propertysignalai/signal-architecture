'use client';

import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function LayerNode({ data }: { data: Record<string, unknown> }) {
  const borderColor = data.planned ? 'border-red-500/40 border-dashed' : `border-${data.color as string}-500/40`;
  return (
    <div className={`rounded-xl border-2 ${data.planned ? 'border-dashed border-red-500/40' : ''} bg-gray-900/80 px-5 py-4 min-w-[240px] shadow-lg`}
      style={!data.planned ? { borderColor: `${data.hex as string}66`, borderWidth: 2, borderStyle: 'solid' } : undefined}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md"
          style={{ backgroundColor: `${data.hex as string}15`, color: data.hex as string }}>
          {data.label as string}
        </span>
        {Boolean(data.planned) && <span className="text-[9px] font-bold text-red-400 tracking-wider">PLANNED</span>}
      </div>
      <div className="text-base font-bold text-white">{data.name as string}</div>
      <div className="text-xs text-gray-400 mt-1">{data.desc as string}</div>
    </div>
  );
}

function InfoNode({ data }: { data: Record<string, unknown> }) {
  const type = data.type as string;
  const colors = type === 'knows' ? { bg: '#22c55e', label: '✅ KNOWS' }
    : type === 'blocked' ? { bg: '#ef4444', label: '🚫 BLOCKED' }
    : { bg: '#6b7280', label: '❓ UNKNOWN' };

  return (
    <div className="rounded-lg border px-3 py-2 min-w-[200px] max-w-[220px]"
      style={{ borderColor: `${colors.bg}33`, backgroundColor: `${colors.bg}08` }}>
      <div className="text-[9px] font-bold tracking-wider mb-1.5" style={{ color: colors.bg }}>{colors.label}</div>
      {(data.items as string[]).map((item, i) => (
        <div key={i} className="text-[11px] leading-relaxed py-0.5" style={{ color: `${colors.bg}aa` }}>• {item}</div>
      ))}
    </div>
  );
}

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
      nodes.push({
        id: layer.id, type: 'layer',
        position: { x: xCenter - 120, y },
        data: { ...layer },
      });
      nodes.push({
        id: `${layer.id}-knows`, type: 'info',
        position: { x: xCenter - 400, y: y + 10 },
        data: { type: 'knows', items: layer.knows },
      });
      nodes.push({
        id: `${layer.id}-unknown`, type: 'info',
        position: { x: xCenter + 200, y: y + 10 },
        data: { type: 'unknown', items: layer.unknown },
      });
      nodes.push({
        id: `${layer.id}-blocked`, type: 'info',
        position: { x: xCenter + 480, y: y + 10 },
        data: { type: 'blocked', items: layer.blocked },
      });
    });
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    // Layer connections
    for (let i = 0; i < layerData.length - 1; i++) {
      edges.push({
        id: `${layerData[i].id}-${layerData[i + 1].id}`,
        source: layerData[i].id, target: layerData[i + 1].id,
        style: { stroke: layerData[i].hex, strokeWidth: 2, opacity: 0.4 },
        animated: true,
        type: 'smoothstep',
      });
    }
    // Satellite connections
    layerData.forEach(layer => {
      ['knows', 'unknown', 'blocked'].forEach(type => {
        const color = type === 'knows' ? '#22c55e' : type === 'blocked' ? '#ef4444' : '#6b7280';
        edges.push({
          id: `${layer.id}-${type}`,
          source: layer.id, target: `${layer.id}-${type}`,
          style: { stroke: color, strokeWidth: 1, opacity: 0.2 },
          type: 'straight',
        });
      });
    });
    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <main className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] w-full bg-gray-950">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2} maxZoom={2}
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => node.type === 'layer' ? '#3b82f6' : node.type === 'info' ? '#4b5563' : '#6b7280'}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
