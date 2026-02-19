'use client';

import { useMemo, memo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const HubNode = memo(function HubNode() {
  return (
    <div className="relative px-6 py-4 rounded-xl border-2 border-dashed text-center shadow-xl backdrop-blur-sm transition-all hover:scale-105"
      style={{ borderColor: '#3A76F099', backgroundColor: '#3A76F015', boxShadow: '0 4px 25px #3A76F030' }}>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-400 !w-2 !h-2" />
      <div className="text-3xl mb-1">⚡</div>
      <div className="text-lg font-bold text-white">Signal V2</div>
      <div className="text-[10px] text-[#3A76F0] uppercase tracking-wider font-bold">Build Status</div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-400 !w-2 !h-2" />
    </div>
  );
});

const CategoryNode = memo(function CategoryNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-4 py-3 rounded-xl border-2 border-dashed text-center min-w-[140px] shadow-lg backdrop-blur-sm transition-all hover:scale-105"
      style={{ borderColor: `${hex}99`, backgroundColor: `${hex}15`, boxShadow: `0 4px 20px ${hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: hex }} />
      <div className="text-sm font-bold" style={{ color: hex }}>{data.label as string}</div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const ItemNode = memo(function ItemNode({ data }: { data: Record<string, unknown> }) {
  const hex = data.hex as string;
  return (
    <div className="relative px-3 py-2 rounded-xl border shadow-md backdrop-blur-sm min-w-[180px] max-w-[220px] transition-all hover:scale-105"
      style={{ borderColor: `${hex}40`, borderStyle: 'dashed', backgroundColor: `${hex}08`, boxShadow: `0 2px 10px ${hex}10` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-1.5 !h-1.5" />
      <div className="text-xs font-medium flex items-center gap-2" style={{ color: `${hex}dd` }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: hex }} />
        {data.label as string}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-1.5 !h-1.5" />
    </div>
  );
});

const nodeTypes = { hub: HubNode, category: CategoryNode, item: ItemNode };

const built = ['V2 architecture design', '10 agent prompts', 'Layer 0 prompt', 'Layer 2 prompt', 'n8n workflow (18 nodes)', 'Architecture dashboard', 'Evolution page', 'V2 workflow deploy & test', 'Full pipeline testing (10 agents validated)'];
const progress = ['Agent prompt tuning (Agents 5, 8, 10)', 'Rerun consistency testing'];
const planned = ['Layer 3 column mapping', 'Layer 4 execution (Vercel)', 'Base44 entities', 'Production webhook', 'Multi-ZIP batch orchestration', 'No-strategy mode (propensity-only)', 'Contrasting market test (healthy/growing)'];

export default function StatusPage() {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      { id: 'hub', type: 'hub', position: { x: 400, y: 0 }, data: {} },
      { id: 'cat-built', type: 'category', position: { x: 50, y: 150 }, data: { label: 'Built', hex: '#22c55e' } },
      { id: 'cat-progress', type: 'category', position: { x: 380, y: 150 }, data: { label: 'In Progress', hex: '#eab308' } },
      { id: 'cat-planned', type: 'category', position: { x: 680, y: 150 }, data: { label: 'Planned', hex: '#ef4444' } },
    ];
    built.forEach((item, i) => {
      nodes.push({ id: `built-${i}`, type: 'item', position: { x: -40 + (i % 2) * 200, y: 280 + Math.floor(i / 2) * 55 }, data: { label: item, hex: '#22c55e' } });
    });
    progress.forEach((item, i) => {
      nodes.push({ id: `progress-${i}`, type: 'item', position: { x: 330, y: 280 + i * 55 }, data: { label: item, hex: '#eab308' } });
    });
    planned.forEach((item, i) => {
      nodes.push({ id: `planned-${i}`, type: 'item', position: { x: 620, y: 280 + i * 55 }, data: { label: item, hex: '#ef4444' } });
    });
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      { id: 'hub-built', source: 'hub', target: 'cat-built', style: { stroke: '#22c55e', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
      { id: 'hub-progress', source: 'hub', target: 'cat-progress', style: { stroke: '#eab308', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
      { id: 'hub-planned', source: 'hub', target: 'cat-planned', style: { stroke: '#ef4444', strokeWidth: 2 }, animated: true, type: 'smoothstep' },
    ];
    built.forEach((_, i) => edges.push({ id: `cat-built-${i}`, source: 'cat-built', target: `built-${i}`, style: { stroke: '#22c55e', strokeWidth: 1.5 }, animated: true, type: 'smoothstep' }));
    progress.forEach((_, i) => edges.push({ id: `cat-progress-${i}`, source: 'cat-progress', target: `progress-${i}`, style: { stroke: '#eab308', strokeWidth: 1.5 }, animated: true, type: 'smoothstep' }));
    planned.forEach((_, i) => edges.push({ id: `cat-planned-${i}`, source: 'cat-planned', target: `planned-${i}`, style: { stroke: '#ef4444', strokeWidth: 1.5 }, animated: true, type: 'smoothstep' }));
    return edges;
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <main className="h-[calc(100vh-3rem)] md:h-[calc(100vh-3.5rem)] w-full bg-gray-950">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.2 }} minZoom={0.3} maxZoom={2} className="bg-gray-950"
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
