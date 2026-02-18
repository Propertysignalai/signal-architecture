'use client';

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface BlockedNodeData {
  label: string;
  details?: string[];
}

function BlockedNode({ data }: { data: BlockedNodeData }) {
  return (
    <div className="relative px-4 py-3 rounded-xl border border-red-500/50 bg-red-950/60 shadow-lg shadow-red-500/10 backdrop-blur-sm min-w-[200px] max-w-[220px] transition-all hover:scale-105">
      <Handle type="target" position={Position.Top} className="!bg-red-500 !border-red-400 !w-2 !h-2" />
      
      <div className="font-semibold text-sm text-red-300 leading-tight">
        {data.label}
      </div>
      
      {data.details && (
        <div className="mt-2 space-y-1">
          {data.details.map((detail, i) => (
            <div key={i} className="text-[11px] text-red-400/80 flex items-center gap-1.5">
              <span className="text-red-500 font-bold">✕</span>
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="!bg-red-500 !border-red-400 !w-2 !h-2" />
    </div>
  );
}

export default memo(BlockedNode);
