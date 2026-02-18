'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import BlockedNode from './BlockedNode';
import SectionLabel from './SectionLabel';

// Color scheme
const COLORS = {
  code: { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd' },      // Blue - Code nodes
  claude: { bg: '#14532d', border: '#22c55e', text: '#86efac' },     // Green - Claude API
  perplexity: { bg: '#3b0764', border: '#a855f7', text: '#d8b4fe' }, // Purple - Perplexity API
  blocked: { bg: '#450a0a', border: '#ef4444', text: '#fca5a5' },    // Red - BLOCKED
  input: { bg: '#1a1a2e', border: '#6366f1', text: '#a5b4fc' },      // Indigo - Webhook input
};

// Agent positions - fanned out horizontally
const agentNames = [
  'Physical Environment\n& Housing Stock',
  'Financial Positions\n& Transactions',
  'Distress &\nLegal Activity',
  'Ownership Structure\n& Occupancy',
  'Market Dynamics\n& Demographics',
  'Temporal &\nSeasonal Patterns',
  'Economic Stress\n& Leading Indicators',
  'Investor &\nCompetitive Landscape',
  'Regulatory &\nPolitical Environment',
  'Neighborhood &\nMicro-Location Intel',
];

const AGENT_Y = 680;
const AGENT_Y2 = 850;
const AGENT_START_X = 50;
const AGENT_SPACING = 220;

function makeNodes(): Node[] {
  const nodes: Node[] = [];

  // === SECTION LABELS ===
  nodes.push(
    { id: 'section-input', type: 'sectionLabel', position: { x: 340, y: -20 }, data: { label: 'INPUT' }, draggable: false },
    { id: 'section-l0', type: 'sectionLabel', position: { x: 280, y: 280 }, data: { label: 'LAYER 0: STRATEGY EDUCATION' }, draggable: false },
    { id: 'section-l1', type: 'sectionLabel', position: { x: 300, y: 560 }, data: { label: 'LAYER 1: RESEARCH AGENTS (Perplexity)' }, draggable: false },
    { id: 'section-l2', type: 'sectionLabel', position: { x: 270, y: 1020 }, data: { label: 'LAYER 2: INTELLIGENCE ENRICHMENT' }, draggable: false },
    { id: 'section-output', type: 'sectionLabel', position: { x: 340, y: 1400 }, data: { label: 'OUTPUT' }, draggable: false },
    { id: 'section-blocked', type: 'sectionLabel', position: { x: 1350, y: 280 }, data: { label: 'BIAS PROTECTION CHAIN' }, draggable: false },
  );

  // === INPUT SECTION ===
  nodes.push({
    id: 'webhook',
    type: 'custom',
    position: { x: 350, y: 30 },
    data: {
      label: '🔵 Webhook (Input)',
      sublabel: 'POST endpoint',
      details: ['zip_code', 'city', 'county', 'state', 'exit_strategy', 'buy_box_criteria'],
      nodeType: 'input',
    },
  });

  nodes.push({
    id: 'extract',
    type: 'custom',
    position: { x: 650, y: 30 },
    data: {
      label: '⚙️ Extract Input',
      sublabel: 'CODE NODE',
      details: ['Parses webhook payload', 'Extracts geo_context', 'Routes exit_strategy → L0'],
      nodeType: 'code',
    },
  });

  // === LAYER 0 SECTION ===
  nodes.push({
    id: 'build-l0',
    type: 'custom',
    position: { x: 300, y: 340 },
    data: {
      label: '⚙️ Build L0 Prompt',
      sublabel: 'CODE NODE',
      details: ['Assembles strategy education prompt', 'Input: exit_strategy + buy_box'],
      nodeType: 'code',
    },
  });

  nodes.push({
    id: 'layer0',
    type: 'custom',
    position: { x: 620, y: 340 },
    data: {
      label: '🟢 Layer 0: Strategy Education',
      sublabel: 'CLAUDE API',
      details: ['Educates about strategy mechanics', 'Success factors & failure modes', 'NEVER directs — educates only'],
      nodeType: 'claude',
    },
  });

  // === LAYER 1: 10 AGENTS ===
  agentNames.forEach((name, i) => {
    const row = i < 5 ? 0 : 1;
    const col = i % 5;
    const x = AGENT_START_X + col * AGENT_SPACING;
    const y = row === 0 ? AGENT_Y : AGENT_Y2;

    nodes.push({
      id: `agent-${i + 1}`,
      type: 'custom',
      position: { x, y },
      data: {
        label: `Agent ${i + 1}`,
        sublabel: name,
        details: ['PERPLEXITY API', 'positive_signals[]', 'negative_signals[]', 'domain_findings[]', 'analytical_observations[]'],
        nodeType: 'perplexity',
      },
    });
  });

  // === MERGE + LAYER 2 ===
  nodes.push({
    id: 'merge',
    type: 'custom',
    position: { x: 400, y: 1070 },
    data: {
      label: '⚙️ Merge Agent Results',
      sublabel: 'CODE NODE — Append Mode',
      details: ['Combines all 10 agent outputs', 'Single merged intelligence package'],
      nodeType: 'code',
    },
  });

  nodes.push({
    id: 'build-l2',
    type: 'custom',
    position: { x: 400, y: 1190 },
    data: {
      label: '⚙️ Build L2 Prompt',
      sublabel: 'CODE NODE',
      details: ['Assembles Layer 2 analysis prompt', 'Passes merged findings'],
      nodeType: 'code',
    },
  });

  nodes.push({
    id: 'layer2',
    type: 'custom',
    position: { x: 700, y: 1190 },
    data: {
      label: '🟢 Layer 2: Intelligence Enrichment',
      sublabel: 'CLAUDE API — 16K tokens, 300s timeout',
      details: ['Cross-domain tags', 'Conflict identification', 'Mosaic patterns', 'Proxy validations', 'Propensity to sell', 'Data quality assessment'],
      nodeType: 'claude',
    },
  });

  // === OUTPUT ===
  nodes.push({
    id: 'parse',
    type: 'custom',
    position: { x: 450, y: 1450 },
    data: {
      label: '⚙️ Parse Output',
      sublabel: 'CODE NODE',
      details: ['Assembles final intelligence package:', 'L0 education + Raw agent findings + L2 enrichments'],
      nodeType: 'code',
    },
  });

  // === BLOCKED CARDS (Bias Protection) ===
  nodes.push({
    id: 'blocked-l0',
    type: 'blocked',
    position: { x: 1280, y: 340 },
    data: {
      label: '🚫 BLOCKED from Layer 0',
      details: ['Column definitions', 'Scoring logic', 'List data'],
    },
  });

  nodes.push({
    id: 'blocked-agents',
    type: 'blocked',
    position: { x: 1280, y: 680 },
    data: {
      label: '🚫 BLOCKED from Agents',
      details: ['Column definitions', 'Scoring logic', 'List data'],
    },
  });

  nodes.push({
    id: 'blocked-l2',
    type: 'blocked',
    position: { x: 1280, y: 1190 },
    data: {
      label: '🚫 BLOCKED from Layer 2',
      details: ['Exit strategy', 'Column definitions', 'Scoring logic'],
    },
  });

  return nodes;
}

function makeEdges(): Edge[] {
  const edges: Edge[] = [];
  const animatedStyle = { stroke: '#3b82f6', strokeWidth: 2 };
  const defaultEdge = {
    type: 'smoothstep' as const,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
    style: animatedStyle,
  };

  // Input flow
  edges.push({ id: 'e-webhook-extract', source: 'webhook', target: 'extract', ...defaultEdge });
  edges.push({ id: 'e-extract-buildl0', source: 'extract', target: 'build-l0', ...defaultEdge });

  // L0 flow
  edges.push({ id: 'e-buildl0-layer0', source: 'build-l0', target: 'layer0', ...defaultEdge });

  // Layer 0 → all 10 agents (fan out)
  for (let i = 1; i <= 10; i++) {
    edges.push({
      id: `e-layer0-agent${i}`,
      source: 'layer0',
      target: `agent-${i}`,
      ...defaultEdge,
      style: { stroke: '#a855f7', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
    });
  }

  // All 10 agents → Merge (fan in)
  for (let i = 1; i <= 10; i++) {
    edges.push({
      id: `e-agent${i}-merge`,
      source: `agent-${i}`,
      target: 'merge',
      ...defaultEdge,
      style: { stroke: '#a855f7', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
    });
  }

  // L2 flow
  edges.push({ id: 'e-merge-buildl2', source: 'merge', target: 'build-l2', ...defaultEdge });
  edges.push({ id: 'e-buildl2-layer2', source: 'build-l2', target: 'layer2', ...defaultEdge });
  edges.push({ id: 'e-layer2-parse', source: 'layer2', target: 'parse', ...defaultEdge, style: { stroke: '#22c55e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } });

  // Blocked connections (dashed red)
  const blockedEdge = {
    type: 'smoothstep' as const,
    animated: false,
    style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '8 4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
  };

  edges.push({ id: 'e-blocked-l0', source: 'blocked-l0', target: 'layer0', ...blockedEdge, label: '✕', labelStyle: { fill: '#ef4444', fontSize: 16, fontWeight: 700 } });
  edges.push({ id: 'e-blocked-agents', source: 'blocked-agents', target: 'agent-5', ...blockedEdge, label: '✕', labelStyle: { fill: '#ef4444', fontSize: 16, fontWeight: 700 } });
  edges.push({ id: 'e-blocked-l2', source: 'blocked-l2', target: 'layer2', ...blockedEdge, label: '✕', labelStyle: { fill: '#ef4444', fontSize: 16, fontWeight: 700 } });

  return edges;
}

const nodeTypes = {
  custom: CustomNode,
  blocked: BlockedNode,
  sectionLabel: SectionLabel,
};

export default function PipelineDiagram() {
  const initialNodes = useMemo(() => makeNodes(), []);
  const initialEdges = useMemo(() => makeEdges(), []);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gray-950/90 backdrop-blur-sm border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Signal V2 — Pipeline Architecture</h1>
          <p className="text-sm text-gray-400">V4 Agentic Intelligence Pipeline • 18 Nodes • 10 Research Agents</p>
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/60 border border-blue-400"></span> Code Node</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500/60 border border-green-400"></span> Claude API</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500/60 border border-purple-400"></span> Perplexity API</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500/60 border border-red-400"></span> BLOCKED</span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={2}
        className="bg-gray-950"
        defaultEdgeOptions={{ type: 'smoothstep' }}
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-gray-800 !border-gray-700 !rounded-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!text-gray-300 [&>button:hover]:!bg-gray-700" />
        <MiniMap
          className="!bg-gray-900 !border-gray-700 !rounded-lg"
          nodeColor={(node) => {
            const type = node.data?.nodeType as string;
            if (type === 'code') return '#3b82f6';
            if (type === 'claude') return '#22c55e';
            if (type === 'perplexity') return '#a855f7';
            if (type === 'input') return '#6366f1';
            return '#ef4444';
          }}
          maskColor="rgba(0,0,0,0.7)"
        />
      </ReactFlow>
    </div>
  );
}
