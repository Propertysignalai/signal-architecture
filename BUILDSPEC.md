# Signal V2 Architecture Dashboard — Immersive Rebuild

## Vision
Replace the current multi-page dashboard with ONE immersive scrolling experience. This is an interactive visual layer on top of GitHub — telling the story of Signal V2 in plain English. Think Apple product page meets data visualization.

## Current State
- Next.js 16.1.6, React 19, Tailwind CSS v4, @xyflow/react installed
- Existing pages: /, /philosophy, /agents, /bias-protection, /data-flow, /status
- Nav component at src/components/Nav.tsx
- Evolution page with canvas animations at src/app/philosophy/page.tsx (KEEP THIS — it's good)
- Pipeline diagram at src/components/PipelineDiagram.tsx (KEEP for reference but we're replacing the home page)

## What to Build

### New Home Page (src/app/page.tsx)
One long scrolling page with these sections, each full-viewport height or close to it:

### Section 1: Hero
- "All Signal. No Noise." as the main headline
- Subtitle: "The real estate intelligence system that thinks like the best investor — with unlimited research capacity and zero bias."
- Subtle animated particle/dot background (like the V2 canvas viz from the evolution page — dots representing agents, slowly moving)
- Scroll indicator at bottom

### Section 2: The Evolution (link to /philosophy)
- Compact version: 3 columns showing Start → V1 → V2 with key stats
- "Explore the full evolution →" link to /philosophy page
- Keep it brief — the full evolution page already exists

### Section 3: The System — Interactive Pipeline
- Simplified visual of the pipeline: Input → Layer 0 → 10 Agents → Merge → Layer 2 → Output
- Each node is a clickable card that expands to show:
  - What it does (plain English, 2-3 sentences)
  - What data flows in
  - What data flows out  
  - Build status (green = built, yellow = in progress, red = planned)
- Use a vertical flow layout (not React Flow — too complex for mobile). Simple cards connected by animated lines/arrows
- Color coding: blue for code nodes, green for Claude AI nodes, purple for Perplexity

### Section 4: The Swarm — 10 Agent Grid
- 10 agent cards in a responsive grid (2 cols mobile, 5 cols desktop)
- Each card shows: number, name emoji, domain name
- Click/tap a card → it expands to reveal:
  - Domain description (1-2 sentences)
  - 3-4 key questions it investigates
  - Output format (positive_signals, negative_signals, domain_findings, analytical_observations)
- Purple/indigo color theme for agents

Agent data:
1. 🏠 Property & Housing Stock — Age, condition, vacancy patterns, housing type distribution
2. 💰 Financial & Equity — Positions, mortgage stress, equity patterns, assessment ratios
3. ⚖️ Distress & Legal — Foreclosures, tax liens, code violations, legal filings
4. 👥 Ownership & Occupancy — Tenure, investor vs owner-occupied, turnover, entity ownership
5. 📊 Market Dynamics — Price trends, days on market, absorption rate, listing patterns
6. 📅 Temporal & Seasonal — Cyclical patterns, seasonal trends, market timing indicators
7. 💼 Economic Stress — Employment, income levels, business closures, economic indicators
8. 🏢 Investor & Competitive — Institutional activity, flip volume, rental competition
9. 📜 Regulatory & Political — Zoning changes, tax policy, code enforcement intensity
10. 📍 Neighborhood & Microlocation — School quality, crime trends, infrastructure, walkability

### Section 5: The Chain — Bias Protection
- Vertical flow showing 4 layers as cards
- Between each layer, show what information is ALLOWED to pass (green) and BLOCKED (red)
- Animated data flow lines between layers

Layers:
- L0 Strategy Orchestrator: KNOWS strategy, educates agents about mechanics. NEVER directs research. BLOCKS: scoring criteria, signal classification
- L1 Research Agents (×10): KNOWS domain + education from L0. Reasons freely. BLOCKS: strategy details, scoring logic, exit criteria
- L2 Intelligence Analyst: KNOWS nothing about strategy. Dedup, conflict resolution, mosaic patterns, proxy validation. BLOCKS: exit strategy, column definitions, scoring logic
- L3 Column Mapper (PLANNED): Maps intelligence to scoring columns. NOT YET BUILT.

### Section 6: Build Status
- Clean checklist with status indicators
- Built (green): V2 architecture design, 10 agent prompts, Layer 0 prompt, Layer 2 prompt, n8n workflow (18 nodes), Architecture dashboard, Evolution page
- In Progress (yellow): V2 workflow deploy & test, Full pipeline testing
- Planned (red): Layer 3 column mapping, Base44 entity creation, Production webhook, 50-ZIP batch processing

### Section 7: Footer
- "All Signal. No Noise." repeated
- "The filtering principle at every layer of the architecture."
- Links to GitHub repo

## Design System
- Background: #0a0b0f (very dark, almost black)
- Surface cards: #13141a with border rgba(255,255,255,0.06)
- Primary accent: #3A76F0 (Signal blue)
- Agent accent: #8B5CF6 (purple/indigo)
- Success: #22c55e
- Warning: #eab308
- Danger: #ef4444
- Text: #e9e9eb primary, #8b8d97 secondary, #62646e tertiary
- Font: Inter (already loaded)
- Rounded corners: 16px for cards, 12px for inner elements
- Subtle gradients and glows, not flat

## Technical Requirements
- All in 'use client' components where needed
- Smooth scroll behavior
- Sections use intersection observer for scroll-triggered animations (fade in on scroll)
- Mobile responsive (everything must work on phone)
- Expandable cards use simple state toggle (no complex animation library needed)
- Keep the Nav component but simplify: just "Signal V2" logo + "Evolution" link (since everything else is on one page now)
- Keep /philosophy route as-is (the evolution page stays)

## Nav Update
Update Nav to:
- Signal V2 (logo/home link)
- Evolution (link to /philosophy)  
- GitHub (external link to https://github.com/Propertysignalai/signal-architecture)
That's it. Everything else is sections on the home page. Add smooth scroll anchors.

## Files to Create/Modify
- src/app/page.tsx — Complete rewrite (the immersive home page)
- src/components/Nav.tsx — Simplify
- src/components/ParticleBackground.tsx — Animated dot background for hero
- src/components/PipelineSection.tsx — Interactive pipeline cards
- src/components/AgentGrid.tsx — Expandable agent cards
- src/components/BiasChain.tsx — Bias protection flow
- src/components/StatusSection.tsx — Build status
- src/components/ScrollReveal.tsx — Intersection observer wrapper for fade-in animations

## After Building
Run: npx next build
Then: git add -A && git commit -m "Immersive single-page dashboard: interactive pipeline, agent grid, bias chain, scroll animations" && git push origin main
