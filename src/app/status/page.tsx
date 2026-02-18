'use client';

import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function HubNode({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="rounded-2xl border-2 border-[#3A76F0]/50 bg-[#3A76F0]/10 px-6 py-4 text-center shadow-xl shadow-[#3A76F0]/10">
      <div className="text-3xl mb-1">⚡</div>
      <div className="text-lg font-extrabold text-white">Signal V2</div>
      <div className="text-xs text-[#3A76F0]">Build Status</div>
    </div>
  );
}

function CategoryNode({ data }: { data: Record<string, unknown> }) {
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    built: { border: '#22c55e', bg: '#22c55e12', text: '#22c55e' },
    progress: { border: '#eab308', bg: '#eab30812', text: '#eab308' },
    planned: { border: '#ef4444', bg: '#ef444412', text: '#ef4444' },
  };
  const c = colors[data.status as string];
  return (
    <div className="rounded-xl border-2 px-4 py-3 text-center min-w-[140px]"
      style={{ borderColor: `${c.border}66`, backgroundColor: c.bg }}>
      <div className="w-3 h-3 rounded-full mx-auto mb-1.5" style={{ backgroundColor: c.border }} />
      <div className="text-sm font-bold" style={{ color: c.text }}>{data.label as string}</div>
    </div>
  );
}

function ItemNode({ data }: { data: Record<string, unknown> }) {
  const colors: Record<string, { border: string; bg: string; text: string }> = {
    built: { border: '#22c55e', bg: '#22c55e08', text: '#22c55ecc' },
    progress: { border: '#eab308', bg: '#eab30808', text: '#eab308cc' },
    planned: { border: '#ef4444', bg: '#ef444408', text: '#ef4444cc' },
  };
  const c = colors[data.status as string];
  return (
    <div className="rounded-lg border px-3 py-2 min-w-[180px] max-w-[220px]"
      style={{ borderColor: `${c.border}33`, backgroundColor: c.bg }}>
      <div className="text-xs font-medium" style={{ color: c.text }}>{data.label as string}</div>
    </div>
  );
}

const nodeTypes = { hub: HubNode, category: CategoryNode, item: ItemNode };

const built = ['V2 architecture design', '10 agent prompts', 'Layer 0 prompt', 'Layer 2 prompt', 'n8n workflow (18 nodes)', 'Architecture dashboard', 'Evolution page'];
const progress = ['V2 workflow deploy & test', 'Full pipeline testing'];
const planned = ['Layer 3 column mapping', 'Base44 entities', 'Production webhook', '50-ZIP batch processing'];

export default function StatusPage() {
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [
      { id: 'hub', type: 'hub', position: { x: 400, y: 0 }, data: {} },
      { id: 'cat-built', type: 'category', position: { x: 50, y: 150 }, data: { label: 'Built', status: 'built' } },
      { id: 'cat-progress', type: 'category', position: { x: 380, y: 150 }, data: { label: 'In Progress', status: 'progress' } },
      { id: 'cat-planned', type: 'category', position: { x: 680, y: 150 }, data: { label: 'Planned', status: 'planned' } },
    ];

    built.forEach((item, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      nodes.push({
        id: `built-${i}`, type: 'item',
        position: { x: -40 + col * 200, y: 280 + row * 60 },
        data: { label: item, status: 'built' },
      });
    });

    progress.forEach((item, i) => {
      nodes.push({
        id: `progress-${i}`, type: 'item',
        position: { x: 330, y: 280 + i * 60 },
        data: { label: item, status: 'progress' },
      });
    });

    planned.forEach((item, i) => {
      nodes.push({
        id: `planned-${i}`, type: 'item',
        position: { x: 620, y: 280 + i * 60 },
        data: { label: item, status: 'planned' },
      });
    });

    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [
      { id: 'hub-built', source: 'hub', target: 'cat-built', style: { stroke: '#22c55e', strokeWidth: 2, opacity: 0.4 }, type: 'smoothstep' },
      { id: 'hub-progress', source: 'hub', target: 'cat-progress', style: { stroke: '#eab308', strokeWidth: 2, opacity: 0.4 }, type: 'smoothstep' },
      { id: 'hub-planned', source: 'hub', target: 'cat-planned', style: { stroke: '#ef4444', strokeWidth: 2, opacity: 0.4 }, type: 'smoothstep' },
    ];

    built.forEach((_, i) => {
      edges.push({ id: `cat-built-${i}`, source: 'cat-built', target: `built-${i}`, style: { stroke: '#22c55e', strokeWidth: 1, opacity: 0.2 }, type: 'smoothstep' });
    });
    progress.forEach((_, i) => {
      edges.push({ id: `cat-progress-${i}`, source: 'cat-progress', target: `progress-${i}`, style: { stroke: '#eab308', strokeWidth: 1, opacity: 0.2 }, type: 'smoothstep' });
    });
    planned.forEach((_, i) => {
      edges.push({ id: `cat-planned-${i}`, source: 'cat-planned', target: `planned-${i}`, style: { stroke: '#ef4444', strokeWidth: 1, opacity: 0.2 }, type: 'smoothstep' });
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
        fitView fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3} maxZoom={2}
        className="bg-gray-950"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => {
            if (node.type === 'hub') return '#3A76F0';
            const s = node.data?.status as string;
            if (s === 'built') return '#22c55e';
            if (s === 'progress') return '#eab308';
            return '#ef4444';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
