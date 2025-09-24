```mermaid
flowchart TB
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

  subgraph D[Workflow & Process]
    direction LR
    D0["Basic Workflow"]
    D1["Testing Framework"]
    D2["Quality Assurance"]
    D3["Auto-Refactoring"]
    D4["Perfect Process"]
    D0 --> D1 --> D2 --> D3 --> D4
  end

  subgraph E["Team Scaling"]
    direction LR
    E0["Solo Dev"]
    E1["Helper Agent"]
    E2["Specialist Squad"]
    E3["Agent Swarm"]
    E4["Virtual Company"]
    E0 --> E1 --> E2 --> E3 --> E4
  end

  subgraph F[Marketing & Revenue]
    direction LR
    F0["Word of Mouth"]
    F1["Targeted Marketing"]
    F2["Growth Hacking"]
    F3["Viral Marketing"]
    F4["Market Domination"]
    F0 --> F1 --> F2 --> F3 --> F4
  end

  subgraph G[Product Features]
    direction LR
    G0["Basic Game"]
    G1["DLC & Updates"]
    G2["Multiplayer & IAP"]
    G3["Cross-Platform"]
    G4["Metaverse Integration"]
    G0 --> G1 --> G2 --> G3 --> G4
  end

  subgraph H[Quality & Polish]
    direction LR
    H0["Placeholder Art"]
    H1["Professional Assets"]
    H2["AI-Generated Content"]
    H3["Premium Quality"]
    H4["Perfect Code"]
    H0 --> H1 --> H2 --> H3 --> H4
  end

  subgraph I[Shipping & CI/CD]
    direction LR
    I0["Manual Deploy"]
    I1["Basic CI Pipeline"]
    I2["Continuous Integration"]
    I3["Continuous Deployment"]
    I4["Zero-Downtime Deploy"]
    I0 --> I1 --> I2 --> I3 --> I4
  end

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

  %% Process quality gates shipping automation & quality
  D1 -.->|testing foundation| I2
  D2 -.->|quality gates| I3
  D3 -.->|auto-refactoring| I4
  D1 -.->|testing enables| B1
  D2 -.->|quality processes| B2

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

  %% CI/CD enables rapid iteration & deployment
  I1 -.->|automated shipping| B2
  I2 -.->|continuous integration| B3
  I3 -.->|deployment automation| E3
  I4 -.->|zero-downtime scaling| G3

  %% =======================
  %% KPI / GOAL (CENTERED AT BOTTOM)
  %% =======================
  R["💰 Revenue (KPI) 💰"]
  style R fill:#ffd700,stroke:#333,stroke-width:3px,color:#000

  %% =======================
  %% KPI INFLOWS (ALL POINTING DOWN)
  %% =======================

  %% AI Models contributions
  A2 -->|better features/fewer bugs| R
  A3 -->|faster shipping & quality| R
  A4 -->|category-defining hits| R

  %% Editor contributions
  B2 -->|dev velocity| R
  B4 -->|fully automated shipping| R

  %% Hardware contributions
  C2 -->|performance unlocks| R
  C3 -->|scale events + live-ops| R

  %% Process & Quality contributions
  D2 -->|quality assurance| R
  D3 -->|automated refactoring| R
  D4 -->|perfect process| R

  %% Agents contributions
  E2 -->|parallel delivery| R
  E3 -->|massive scope| R
  E4 -->|world domination tier| R

  %% Marketing contributions
  F2 -->|"lower CAC/LTV↑"| R
  F3 -->|viral growth| R
  F4 -->|monopoly profits| R

  %% Platforms contributions
  G2 -->|"monetization (IAP/DLC)"| R
  G3 -->|market expansion| R
  G4 -->|new realities to monetize| R

  %% Graphics contributions
  H2 -->|"asset cost↓ quality↑"| R
  H3 -->|premium visuals/audio| R
  H4 -->|limitless content| R

  %% CI/CD & Shipping contributions
  I1 -->|automated deployments| R
  I2 -->|faster iteration cycles| R
  I3 -->|continuous delivery| R
  I4 -->|instant feature rollouts| R
  ```