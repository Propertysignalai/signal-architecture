import { Node, Edge } from '@xyflow/react';

interface LayoutOptions {
  direction?: 'TB' | 'LR';
  nodeWidth?: number;
  nodeHeight?: number;
  horizontalSpacing?: number;
  verticalSpacing?: number;
}

/**
 * Auto-layout nodes using a topological sort + layered positioning.
 * Similar to dagre but without the dependency.
 */
export function autoLayout(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Node[] {
  const {
    direction = 'TB',
    nodeWidth = 260,
    nodeHeight = 120,
    horizontalSpacing = 80,
    verticalSpacing = 100,
  } = options;

  if (nodes.length === 0) return nodes;

  // Build adjacency lists
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  const nodeMap = new Map<string, Node>();

  nodes.forEach((n) => {
    nodeMap.set(n.id, n);
    children.set(n.id, []);
    parents.set(n.id, []);
  });

  edges.forEach((e) => {
    if (nodeMap.has(e.source) && nodeMap.has(e.target)) {
      children.get(e.source)!.push(e.target);
      parents.get(e.target)!.push(e.source);
    }
  });

  // Assign layers via longest-path algorithm
  const layers = new Map<string, number>();
  const visited = new Set<string>();

  function assignLayer(id: string): number {
    if (layers.has(id)) return layers.get(id)!;
    if (visited.has(id)) return 0; // cycle guard
    visited.add(id);

    const pars = parents.get(id) || [];
    let maxParentLayer = -1;
    for (const p of pars) {
      maxParentLayer = Math.max(maxParentLayer, assignLayer(p));
    }
    const layer = maxParentLayer + 1;
    layers.set(id, layer);
    return layer;
  }

  nodes.forEach((n) => assignLayer(n.id));

  // Group nodes by layer
  const layerGroups = new Map<number, string[]>();
  layers.forEach((layer, id) => {
    if (!layerGroups.has(layer)) layerGroups.set(layer, []);
    layerGroups.get(layer)!.push(id);
  });

  // Sort layers
  const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);

  // Position nodes
  const positions = new Map<string, { x: number; y: number }>();
  const isVertical = direction === 'TB';

  sortedLayers.forEach((layerIdx) => {
    const group = layerGroups.get(layerIdx)!;
    const count = group.length;
    const totalWidth = count * nodeWidth + (count - 1) * horizontalSpacing;
    const startX = -totalWidth / 2;

    group.forEach((id, i) => {
      if (isVertical) {
        positions.set(id, {
          x: startX + i * (nodeWidth + horizontalSpacing),
          y: layerIdx * (nodeHeight + verticalSpacing),
        });
      } else {
        positions.set(id, {
          x: layerIdx * (nodeWidth + horizontalSpacing),
          y: startX + i * (nodeHeight + horizontalSpacing),
        });
      }
    });
  });

  // Improve: center children under their parents (median heuristic)
  for (let pass = 0; pass < 3; pass++) {
    sortedLayers.forEach((layerIdx) => {
      const group = layerGroups.get(layerIdx)!;
      group.forEach((id) => {
        const pars = parents.get(id) || [];
        if (pars.length > 0) {
          const avgParentX = pars.reduce((sum, p) => sum + (positions.get(p)?.x || 0), 0) / pars.length;
          const pos = positions.get(id)!;
          // Nudge toward parent center
          pos.x = pos.x * 0.3 + avgParentX * 0.7;
        }
      });

      // Resolve overlaps within layer
      const sorted = [...group].sort((a, b) => (positions.get(a)?.x || 0) - (positions.get(b)?.x || 0));
      for (let i = 1; i < sorted.length; i++) {
        const prev = positions.get(sorted[i - 1])!;
        const curr = positions.get(sorted[i])!;
        const minGap = nodeWidth + horizontalSpacing;
        if (curr.x - prev.x < minGap) {
          curr.x = prev.x + minGap;
        }
      }
    });
  }

  // Apply positions
  return nodes.map((n) => {
    const pos = positions.get(n.id);
    if (pos) {
      return { ...n, position: { x: pos.x, y: pos.y } };
    }
    return n;
  });
}
