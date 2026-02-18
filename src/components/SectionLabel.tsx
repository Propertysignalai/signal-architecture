'use client';

import React, { memo } from 'react';

interface SectionLabelData {
  label: string;
}

function SectionLabel({ data }: { data: SectionLabelData }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.2em] text-gray-600 uppercase select-none pointer-events-none">
      {data.label}
    </div>
  );
}

export default memo(SectionLabel);
