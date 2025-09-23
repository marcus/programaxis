```mermaid
flowchart LR
  %% Tech Tree for AI Coding Game
  %% Revenue is the global KPI influenced by many branches

  %% =======================
  %% SUBGRAPHS (PARALLEL LADDERS)
  %% =======================

  subgraph A[AI Models]
    direction LR
    A0["Cut & Paste"]
    A1["Autocomplete"]
    A2["Copilot Agents"]
    A3["Self-Improving Models"]
    A4["Superintelligence"]
    A0 --> A1 --> A2 --> A3 --> A4
  end

  subgraph B[Editor & Software Tools]
    direction LR
    B0["Plain Editor"]
    B1["Full IDE + Debugger"]
    B2["AI-Native Editor (tests/docs)"]
    B3["Immersive IDE (VR/AR)"]
    B4["Autonomous IDE (auto-ship)"]
    B0 --> B1 --> B2 --> B3 --> B4
  end

  subgraph C[Hardware / Compute]
    direction LR
    C0["Office Laptop"]
    C1["Multi-Core CPU"]
    C2["Single GPU"]
    C3["Multi-GPU Rig / Cloud"]
    C4["Quantum/Exotic Compute"]
    C0 --> C1 --> C2 --> C3 --> C4
  end

  subgraph D[Ergonomics & Workspace]
    direction LR
    D0["Basic Desk/Chair"]
    D1["Ergo Chair + Dual Monitors"]
    D2["Standing Desk + Input Upgrades"]
    D3["AI Posture/Break Coach"]
    D4["Neural I/O Pod"]
    D0 --> D1 --> D2 --> D3 --> D4
  end

  subgraph E["AI Agents (Team Size)"]
    direction LR
    E0["Solo Dev"]
    E1["Helper Agent"]
    E2["Specialist Agent Squad"]
    E3["Swarm / Auto-Delegation"]
    E4["Virtual Company at Scale"]
    E0 --> E1 --> E2 --> E3 --> E4
  end

  subgraph F[Marketing & Distribution]
    direction LR
    F0["Word of Mouth"]
    F1["Targeted Ads + Influencers"]
    F2["Automated A/B + CRM"]
    F3["Memetic Marketing Engine"]
    F4["Cultural Monopoly"]
    F0 --> F1 --> F2 --> F3 --> F4
  end

  subgraph G[Platforms & Game Features]
    direction LR
    G0["PC Only • 2D Side-Scroller"]
    G1["Mobile Port • DLC"]
    G2["Online Multiplayer • IAP"]
    G3["Cross-Platform • VR/AR • i18n"]
    G4["Reality-Scale Gen Worlds"]
    G0 --> G1 --> G2 --> G3 --> G4
  end

  subgraph H[Graphics & Content Gen]
    direction LR
    H0["Hand-Drawn / Stock SFX"]
    H1["Contract Artists / Procedural"]
    H2["Early AI Art & Audio"]
    H3["Hi-Fi 3D Gen + OST"]
    H4["Infinite Photoreal Simulation"]
    H0 --> H1 --> H2 --> H3 --> H4
  end

  %% =======================
  %% KPI / GOAL
  %% =======================
  R["Revenue (KPI)"]
  style R fill:#fff,stroke:#333,stroke-width:2px

  %% =======================
  %% CROSS-BRANCH DEPENDENCIES
  %% =======================

  %% Hardware gates AI Models & Agents scaling
  C1 -.->|enables| A1
  C2 -.->|train/infer faster| A2
  C3 -.->|scale training/inference| A3
  C4 -.->|new model classes| A4

  C2 -.->|parallel agents viable| E2
  C3 -.->|many agents concurrent| E3
  C4 -.->|planetary agent fleets| E4

  %% Editor quality boosts model leverage & agent coordination
  B1 -.->|debugging/observability| A2
  B2 -.->|tight model loop| A3
  B3 -.->|spatial workflows| A3
  B4 -.->|hands-off pipelines| E3

  %% Ergonomics boosts sustained output & error rate
  D1 -.->|focus + comfort| B1
  D2 -.->|longer sessions| B2
  D3 -.->|reduced fatigue| E2
  D4 -.->|direct thought I/O| B4

  %% Platforms & Features depend on Models, Tools, Agents
  A2 -.->|networking scaffolds| G2
  B2 -.->|build/release automation| G3
  E2 -.->|multi-platform porting| G3
  A3 -.->|dynamic content| G4

  %% Graphics pipeline needs Models + Hardware + Tools
  C2 -.->|realtime render/Gen| H2
  C3 -.->|hi-fi pipelines| H3
  A3 -.->|style-consistent gen| H3
  A4 -.->|world-level synthesis| H4
  B2 -.->|asset toolchains| H3

  %% Marketing benefits from Platforms reach & content cadence
  G1 -.->|new channels| F1
  G2 -.->|live-ops targets| F2
  G3 -.->|global/i18n reach| F3
  A3 -.->|auto-creative variants| F3
  A4 -.->|culture shaping| F4

  %% Agents accelerate Marketing ops
  E2 -.->|campaign ops| F2
  E3 -.->|continuous growth loops| F3

  %% KPI inflows: each branch contributes to revenue when sufficiently advanced
  A2 -->|better features/fewer bugs| R
  A3 -->|faster shipping & quality| R
  A4 -->|category-defining hits| R

  B2 -->|dev velocity| R
  B4 -->|fully automated shipping| R

  C2 -->|performance unlocks| R
  C3 -->|scale events + live-ops| R

  D2 -->|sustained throughput| R

  E2 -->|parallel delivery| R
  E3 -->|massive scope| R
  E4 -->|world domination tier| R

  F2 -->|"lower CAC/LTV↑"| R
  F3 -->|viral growth| R
  F4 -->|monopoly profits| R

  G2 -->|"monetization (IAP/DLC)"| R
  G3 -->|market expansion| R
  G4 -->|new realities to monetize| R

  H2 -->|"asset cost↓ quality↑"| R
  H3 -->|premium visuals/audio| R
  H4 -->|limitless content| R
  ```