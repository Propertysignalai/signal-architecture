'use client';

import { useMemo, memo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node, Edge, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const COLORS: Record<string, { hex: string }> = {
  input: { hex: '#6366f1' },
  code: { hex: '#3b82f6' },
  claude: { hex: '#22c55e' },
  perplexity: { hex: '#a855f7' },
  merge: { hex: '#eab308' },
  output: { hex: '#06b6d4' },
};

const FlowNode = memo(function FlowNode({ data }: { data: Record<string, unknown> }) {
  const c = COLORS[data.nodeType as string] || COLORS.code;
  return (
    <div className="relative px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm min-w-[200px] max-w-[280px] transition-all hover:scale-105 hover:shadow-xl"
      style={{ borderColor: `${c.hex}99`, borderStyle: 'dashed', backgroundColor: `${c.hex}15`, boxShadow: `0 4px 20px ${c.hex}20` }}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{data.icon as string}</span>
        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: c.hex }}>{data.type_label as string}</span>
      </div>
      <div className="text-sm font-semibold text-white mb-2">{data.label as string}</div>
      {Boolean(data.dataIn) && (
        <div className="mb-1">
          <span className="text-[9px] font-bold text-green-400 tracking-wider">IN: </span>
          <span className="text-[10px] text-gray-400 font-mono">{data.dataIn as string}</span>
        </div>
      )}
      {Boolean(data.dataOut) && (
        <div>
          <span className="text-[9px] font-bold text-blue-400 tracking-wider">OUT: </span>
          <span className="text-[10px] text-gray-400 font-mono">{data.dataOut as string}</span>
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
});

const AgentBankNode = memo(function AgentBankNode() {
  return (
    <div className="relative px-5 py-4 rounded-xl border shadow-lg backdrop-blur-sm min-w-[500px] transition-all hover:scale-[1.02]"
      style={{ borderColor: '#a855f799', borderStyle: 'dashed', backgroundColor: '#a855f715', boxShadow: '0 4px 20px #a855f720' }}>
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !border-purple-400 !w-2 !h-2" />
      <div className="text-[10px] font-bold text-purple-400 tracking-wider uppercase mb-2">Layer 1 · 10 Parallel Agents</div>
      <div className="grid grid-cols-5 gap-2">
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <div key={n} className="rounded-lg bg-purple-900/40 border border-dashed border-purple-500/30 px-2 py-1.5 text-center">
            <div className="text-[10px] font-bold text-purple-300">Agent {n}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px] text-gray-400 font-mono">
        <span className="text-blue-400 font-bold font-sans tracking-wider">OUT:</span> 10× &#123;positive_signals, negative_signals, domain_findings, analytical_observations&#125;
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !border-purple-400 !w-2 !h-2" />
    </div>
  );
});

const nodeTypes = { flow: FlowNode, agentBank: AgentBankNode };

const stages = [
  { id: 'input', y: 0, icon: '📥', type_label: 'INPUT', label: 'Webhook Input', nodeType: 'input', dataIn: 'HTTP POST', dataOut: 'zip, city, county, state, strategy, buy_box' },
  { id: 'extract', y: 130, icon: '⚙️', type_label: 'CODE NODE', label: 'Extract Input', nodeType: 'code', dataIn: 'raw webhook body', dataOut: 'zip_code, exit_strategy, buy_box_criteria' },
  { id: 'build-l0', y: 260, icon: '⚙️', type_label: 'CODE NODE', label: 'Build L0 Prompt', nodeType: 'code', dataIn: 'exit_strategy, buy_box', dataOut: 'strategy education prompt' },
  { id: 'l0', y: 390, icon: '🎓', type_label: 'CLAUDE API', label: 'L0 Strategy Education', nodeType: 'claude', dataIn: 'strategy education prompt', dataOut: 'education_context (text)' },
  { id: 'build-agents', y: 520, icon: '⚙️', type_label: 'CODE NODE', label: 'Build Agent Prompts', nodeType: 'code', dataIn: 'zip_code, education_context', dataOut: '10 agent prompt objects' },
  { id: 'merge', y: 800, icon: '🔀', type_label: 'MERGE NODE', label: 'Merge Agent Results', nodeType: 'merge', dataIn: '10 agent outputs', dataOut: 'combined intelligence array' },
  { id: 'build-l2', y: 930, icon: '⚙️', type_label: 'CODE NODE', label: 'Build L2 Prompt', nodeType: 'code', dataIn: 'merged findings', dataOut: 'Layer 2 analysis prompt' },
  { id: 'l2', y: 1060, icon: '🧠', type_label: 'CLAUDE API', label: 'L2 Intelligence Synthesis', nodeType: 'claude', dataIn: 'L2 prompt + all findings', dataOut: 'deduped intel, conflicts, mosaic, propensity' },
  { id: 'output', y: 1190, icon: '📤', type_label: 'OUTPUT', label: 'Parse & Format Output', nodeType: 'output', dataIn: 'L2 analysis JSON', dataOut: 'final intelligence package' },
];

export default function DataFlowPage() {
  const xCenter = 300;
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = stages.map(s => ({
      id: s.id, type: 'flow', position: { x: xCenter - 100, y: s.y }, data: { ...s },
    }));
    nodes.push({ id: 'agent-bank', type: 'agentBank', position: { x: xCenter - 250, y: 650 }, data: {} });
    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    const order = ['input', 'extract', 'build-l0', 'l0', 'build-agents', 'agent-bank', 'merge', 'build-l2', 'l2', 'output'];
    return order.slice(0, -1).map((src, i) => ({
      id: `${src}-${order[i + 1]}`, source: src, target: order[i + 1],
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      animated: true, type: 'smoothstep',
    }));
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
        <MiniMap className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => {
            const t = node.data?.nodeType as string;
            if (t === 'claude') return '#22c55e';
            if (t === 'input') return '#6366f1';
            if (t === 'merge') return '#eab308';
            if (t === 'output') return '#06b6d4';
            if (node.type === 'agentBank') return '#a855f7';
            return '#3b82f6';
          }}
          maskColor="rgba(0,0,0,0.7)" />
      </ReactFlow>
    </main>
  );
}
