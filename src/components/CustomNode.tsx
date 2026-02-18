'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  code: { bg: 'bg-blue-950/80', border: 'border-blue-500/60', text: 'text-blue-200', glow: 'shadow-blue-500/20' },
  claude: { bg: 'bg-green-950/80', border: 'border-green-500/60', text: 'text-green-200', glow: 'shadow-green-500/20' },
  perplexity: { bg: 'bg-purple-950/80', border: 'border-purple-500/60', text: 'text-purple-200', glow: 'shadow-purple-500/20' },
  input: { bg: 'bg-indigo-950/80', border: 'border-indigo-500/60', text: 'text-indigo-200', glow: 'shadow-indigo-500/20' },
};

interface CustomNodeData {
  label: string;
  sublabel?: string;
  details?: string[];
  nodeType: string;
}

function CustomNode({ data }: { data: CustomNodeData }) {
  const colors = COLORS[data.nodeType] || COLORS.code;

  return (
    <div className={`relative px-4 py-3 rounded-xl border ${colors.bg} ${colors.border} ${colors.glow} shadow-lg backdrop-blur-sm min-w-[180px] max-w-[220px] transition-all hover:scale-105 hover:shadow-xl`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
      
      <div className={`font-semibold text-sm ${colors.text} leading-tight`}>
        {data.label}
      </div>
      
      {data.sublabel && (
        <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-medium">
          {data.sublabel}
        </div>
      )}
      
      {data.details && data.details.length > 0 && (
        <div className="mt-2 space-y-0.5">
          {data.details.map((detail, i) => (
            <div key={i} className="text-[10px] text-gray-400 leading-tight flex items-start gap-1">
              <span className="text-gray-600 mt-0.5">›</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-gray-500 !border-gray-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(CustomNode);
