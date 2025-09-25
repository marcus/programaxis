# Programaxis Tech Tree Progression Analysis
Generated on: 2025-09-25T15:11:00.656Z
Tech Tree Version: 2

## Branch Overview

### AI Models (A)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Cut & Paste | $1 | loc_per_click add 0.5 |
| 1 | Autocomplete (requires: A0) | $225 | loc_per_click mul 1.2, idle_loc_per_sec mul 1.3 |
| 2 | Code Review Bot (requires: A1) | $6,760 | bug_rate mul 0.9, agentConcurrencyCap add 1 |
| 3 | Copilot Agents (requires: A2, C2) | $43,940 | agentConcurrencyCap add 3, agentProductivity mul 1.3 |
| 4 | Pair Programming AI | $68,546 | loc_per_click mul 1.2, agentProductivity mul 1.2 |
| 5 | Self-Improving Models (requires: B4) | $1,898,437 | code_quality mul 1.2, automationLevel add 1, agentProductivity mul 1.2 |
| 6 | Superintelligence (requires: C5) | $33,554,432 | agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10 |

### Editor & Software Tools (B)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Plain Editor | $1 | loc_per_click add 0.3 |
| 1 | Full IDE + Debugger (requires: B0) | $300 | compile_speed mul 1.2, test_coverage mul 1.2 |
| 2 | Linter Suite (requires: B1) | $5,915 | bug_rate mul 0.95, compile_speed mul 1.3 |
| 3 | AI-Native Editor (requires: B2) | $54,925 | idle_loc_per_sec mul 1.2, automationLevel add 1 |
| 4 | Cloud IDE | $85,683 | idle_loc_per_sec mul 1.3, agentConcurrencyCap add 5 |
| 5 | Immersive IDE (VR/AR) | $2,278,125 | refactor_bonus add 2, ship_fraction mul 1.2, loc_per_click mul 1.2 |
| 6 | Autonomous IDE | $53,687,091 | automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2 |

### Hardware / Compute (C)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Office Laptop | $1 | idle_loc_per_sec add 0.1 |
| 1 | Multi-Core CPU (requires: C0) | $187 | idle_loc_per_sec mul 1.3, compile_speed mul 1.2, agentProductivity mul 1.1 |
| 2 | SSD Array (requires: C1) | $5,070 | compile_speed mul 1.2, idle_loc_per_sec mul 1.3 |
| 3 | Single GPU (requires: C2) | $39,546 | agentConcurrencyCap add 2, agentProductivity mul 1.25 |
| 4 | Server Farm | $62,834 | agentConcurrencyCap add 4, idle_loc_per_sec mul 1.3 |
| 5 | Multi-GPU Cloud | $2,126,250 | agentConcurrencyCap add 8, global_multiplier mul 1.2, agentProductivity mul 1.2 |
| 6 | Quantum Computer | $41,943,040 | agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2 |

### Workflow & Process (D)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Basic Workflow | $1 | ship_fraction add 0.03 |
| 1 | Testing Framework (requires: D0) | $250 | test_coverage mul 1.3, bug_rate mul 0.85 |
| 2 | Agile Methodology (requires: D1) | $6,760 | ship_fraction mul 1.2, agentProductivity mul 1.1 |
| 3 | Quality Assurance (requires: D2) | $48,334 | code_quality mul 1.25, tech_debt_growth mul 0.9 |
| 4 | DevOps Culture | $74,258 | ship_fraction mul 1.2, automationLevel add 1 |
| 5 | Auto-Refactoring | $2,430,000 | refactor_bonus add 0.5, tech_debt_growth mul 0.8, code_quality mul 1.2 |
| 6 | Perfect Process | $46,976,204 | tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2 |

### Team Scaling (E)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Solo Dev | $1 | agentConcurrencyCap cap 1, idle_loc_per_sec add 0.05 |
| 1 | Pair Programming (requires: E0) | $625 | agentConcurrencyCap add 2, agentProductivity mul 1.3 |
| 2 | Code Review Team (requires: E1) | $6,760 | agentConcurrencyCap add 3, agentProductivity mul 1.2, bug_rate mul 0.9 |
| 3 | Scrum Team (requires: E2, C2) | $43,940 | agentConcurrencyCap add 5, agentProductivity mul 1.2, passive_rev_per_sec add 0.05 |
| 4 | Cross-Functional Team | $68,546 | agentConcurrencyCap add 8, agentProductivity mul 1.2, idle_loc_per_sec mul 1.2 |
| 5 | Engineering Department (requires: C4) | $2,657,812 | agentConcurrencyCap add 15, agentProductivity mul 1.3, global_multiplier mul 1.2 |
| 6 | Multi-Team Organization (requires: C5) | $53,687,091 | agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3 |

### Marketing & Revenue (F)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Word of Mouth | $1 | revenue_per_loc add 0.003 |
| 1 | Targeted Marketing (requires: F0) | $281 | revenue_multiplier mul 1.2 |
| 2 | Social Media (requires: F1) | $7,605 | passive_rev_per_sec add 0.01, market_expansion mul 1.2 |
| 3 | Growth Hacking | $54,925 | market_expansion mul 1.3, passive_rev_per_sec add 0.05 |
| 4 | Influencer Network | $85,683 | revenue_multiplier mul 1.3, price_premium mul 1.2 |
| 5 | Viral Marketing | $2,278,125 | price_premium mul 1.2, passive_rev_per_sec add 0.05 |
| 6 | Market Domination | $53,687,091 | revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1 |

### Product Features (G)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Basic Game | $1 | revenue_multiplier mul 1.05 |
| 1 | DLC & Updates (requires: G0) | $1,000 | features_multiplier mul 1.25, passive_rev_per_sec add 0.015 |
| 2 | Season Pass (requires: G1) | $8,450 | passive_rev_per_sec add 0.02, features_multiplier mul 1.2 |
| 3 | Multiplayer & IAP (requires: A2) | $65,910 | features_multiplier mul 1.2, revenue_multiplier mul 1.2 |
| 4 | Mobile Port | $99,963 | market_expansion mul 1.3, passive_rev_per_sec add 0.1 |
| 5 | Cross-Platform (requires: B3, E2) | $3,037,500 | market_expansion mul 1.2, features_multiplier mul 1.3 |
| 6 | Premium Platform (requires: A5) | $60,397,977 | revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3 |

### Quality & Polish (H)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Placeholder Art | $1 | revenue_per_loc add 0.002 |
| 1 | Professional Assets (requires: H0) | $937 | bug_rate mul 0.9, test_coverage mul 1.1 |
| 2 | Unit Tests (requires: H1) | $6,760 | test_coverage mul 1.2, bug_rate mul 0.95 |
| 3 | AI-Generated Content (requires: C3) | $43,940 | code_quality mul 1.25, price_premium mul 1.1 |
| 4 | QA Team | $68,546 | bug_rate mul 0.5, qa_agents add 5 |
| 5 | Premium Quality (requires: D5) | $2,126,250 | price_premium mul 1.2, bug_rate mul 0.7 |
| 6 | Perfect Code (requires: A6) | $50,331,648 | bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2 |

### Shipping & CI/CD (I)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Manual Deploy | $1 | ship_fraction add 0.03 |
| 1 | Basic CI Pipeline (requires: I0) | $337 | automationLevel add 1 |
| 2 | Git Hooks (requires: I1) | $7,605 | automationLevel add 0.5, bug_rate mul 0.95 |
| 3 | Continuous Integration (requires: D1) | $61,516 | automationLevel add 1, ship_fraction add 0.1 |
| 4 | Blue-Green Deploy | $85,683 | ship_fraction mul 1.3, devops_agents add 2 |
| 5 | Continuous Deployment (requires: D5) | $2,657,812 | automationLevel add 2, revenue_multiplier mul 1.3 |
| 6 | Zero-Downtime Deploy (requires: D5) | $60,397,977 | automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2 |

## Cost Progression by Tier

| Tier | Min Cost | Max Cost | Average | Median |
|------|----------|----------|---------|--------|
| 0 | $1 | $1 | $1 | $1 |
| 1 | $187 | $1,000 | $460 | $300 |
| 2 | $5,070 | $8,450 | $6,854 | $6,760 |
| 3 | $39,546 | $65,910 | $50,775 | $48,334 |
| 4 | $62,834 | $99,963 | $77,749 | $74,258 |
| 5 | $1,898,437 | $3,037,500 | $2,387,812 | $2,278,125 |
| 6 | $33,554,432 | $60,397,977 | $50,518,061 | $53,687,091 |

## Milestone Alignment

Analysis of which tech nodes become affordable at each milestone:

### First Sale ($100)

Newly affordable nodes:

- **Cut & Paste** (A0) - $1
  - Effects: loc_per_click add 0.5
- **Plain Editor** (B0) - $1
  - Effects: loc_per_click add 0.3
- **Office Laptop** (C0) - $1
  - Effects: idle_loc_per_sec add 0.1
- **Basic Workflow** (D0) - $1
  - Effects: ship_fraction add 0.03
- **Solo Dev** (E0) - $1
  - Effects: agentConcurrencyCap cap 1, idle_loc_per_sec add 0.05
- **Word of Mouth** (F0) - $1
  - Effects: revenue_per_loc add 0.003
- **Basic Game** (G0) - $1
  - Effects: revenue_multiplier mul 1.05
- **Placeholder Art** (H0) - $1
  - Effects: revenue_per_loc add 0.002
- **Manual Deploy** (I0) - $1
  - Effects: ship_fraction add 0.03

### Micro-Studio ($2,000)

Newly affordable nodes:

- **Manual Deploy** (I0) - $1
  - Effects: ship_fraction add 0.03
- **Multi-Core CPU** (C1) - $187
  - Effects: idle_loc_per_sec mul 1.3, compile_speed mul 1.2, agentProductivity mul 1.1
- **Autocomplete** (A1) - $225
  - Effects: loc_per_click mul 1.2, idle_loc_per_sec mul 1.3
- **Testing Framework** (D1) - $250
  - Effects: test_coverage mul 1.3, bug_rate mul 0.85
- **Targeted Marketing** (F1) - $281
  - Effects: revenue_multiplier mul 1.2
- **Full IDE + Debugger** (B1) - $300
  - Effects: compile_speed mul 1.2, test_coverage mul 1.2
- **Basic CI Pipeline** (I1) - $337
  - Effects: automationLevel add 1
- **Pair Programming** (E1) - $625
  - Effects: agentConcurrencyCap add 2, agentProductivity mul 1.3
- **Professional Assets** (H1) - $937
  - Effects: bug_rate mul 0.9, test_coverage mul 1.1
- **DLC & Updates** (G1) - $1,000
  - Effects: features_multiplier mul 1.25, passive_rev_per_sec add 0.015

### Tooling Pays Off ($25,000)

Newly affordable nodes:

- **DLC & Updates** (G1) - $1,000
  - Effects: features_multiplier mul 1.25, passive_rev_per_sec add 0.015
- **SSD Array** (C2) - $5,070
  - Effects: compile_speed mul 1.2, idle_loc_per_sec mul 1.3
- **Linter Suite** (B2) - $5,915
  - Effects: bug_rate mul 0.95, compile_speed mul 1.3
- **Code Review Bot** (A2) - $6,760
  - Effects: bug_rate mul 0.9, agentConcurrencyCap add 1
- **Agile Methodology** (D2) - $6,760
  - Effects: ship_fraction mul 1.2, agentProductivity mul 1.1
- **Code Review Team** (E2) - $6,760
  - Effects: agentConcurrencyCap add 3, agentProductivity mul 1.2, bug_rate mul 0.9
- **Unit Tests** (H2) - $6,760
  - Effects: test_coverage mul 1.2, bug_rate mul 0.95
- **Social Media** (F2) - $7,605
  - Effects: passive_rev_per_sec add 0.01, market_expansion mul 1.2
- **Git Hooks** (I2) - $7,605
  - Effects: automationLevel add 0.5, bug_rate mul 0.95
- **Season Pass** (G2) - $8,450
  - Effects: passive_rev_per_sec add 0.02, features_multiplier mul 1.2

### Indie Darling ($250,000)

Newly affordable nodes:

- **Server Farm** (C4) - $62,834
  - Effects: agentConcurrencyCap add 4, idle_loc_per_sec mul 1.3
- **Multiplayer & IAP** (G3) - $65,910
  - Effects: features_multiplier mul 1.2, revenue_multiplier mul 1.2
- **Pair Programming AI** (A4) - $68,546
  - Effects: loc_per_click mul 1.2, agentProductivity mul 1.2
- **Cross-Functional Team** (E4) - $68,546
  - Effects: agentConcurrencyCap add 8, agentProductivity mul 1.2, idle_loc_per_sec mul 1.2
- **QA Team** (H4) - $68,546
  - Effects: bug_rate mul 0.5, qa_agents add 5
- **DevOps Culture** (D4) - $74,258
  - Effects: ship_fraction mul 1.2, automationLevel add 1
- **Cloud IDE** (B4) - $85,683
  - Effects: idle_loc_per_sec mul 1.3, agentConcurrencyCap add 5
- **Influencer Network** (F4) - $85,683
  - Effects: revenue_multiplier mul 1.3, price_premium mul 1.2
- **Blue-Green Deploy** (I4) - $85,683
  - Effects: ship_fraction mul 1.3, devops_agents add 2
- **Mobile Port** (G4) - $99,963
  - Effects: market_expansion mul 1.3, passive_rev_per_sec add 0.1

### Live-Ops On ($2,000,000)

Newly affordable nodes:

- **Multiplayer & IAP** (G3) - $65,910
  - Effects: features_multiplier mul 1.2, revenue_multiplier mul 1.2
- **Pair Programming AI** (A4) - $68,546
  - Effects: loc_per_click mul 1.2, agentProductivity mul 1.2
- **Cross-Functional Team** (E4) - $68,546
  - Effects: agentConcurrencyCap add 8, agentProductivity mul 1.2, idle_loc_per_sec mul 1.2
- **QA Team** (H4) - $68,546
  - Effects: bug_rate mul 0.5, qa_agents add 5
- **DevOps Culture** (D4) - $74,258
  - Effects: ship_fraction mul 1.2, automationLevel add 1
- **Cloud IDE** (B4) - $85,683
  - Effects: idle_loc_per_sec mul 1.3, agentConcurrencyCap add 5
- **Influencer Network** (F4) - $85,683
  - Effects: revenue_multiplier mul 1.3, price_premium mul 1.2
- **Blue-Green Deploy** (I4) - $85,683
  - Effects: ship_fraction mul 1.3, devops_agents add 2
- **Mobile Port** (G4) - $99,963
  - Effects: market_expansion mul 1.3, passive_rev_per_sec add 0.1
- **Self-Improving Models** (A5) - $1,898,437
  - Effects: code_quality mul 1.2, automationLevel add 1, agentProductivity mul 1.2

### Brand Found ($15,000,000)

Newly affordable nodes:

- **Mobile Port** (G4) - $99,963
  - Effects: market_expansion mul 1.3, passive_rev_per_sec add 0.1
- **Self-Improving Models** (A5) - $1,898,437
  - Effects: code_quality mul 1.2, automationLevel add 1, agentProductivity mul 1.2
- **Multi-GPU Cloud** (C5) - $2,126,250
  - Effects: agentConcurrencyCap add 8, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Premium Quality** (H5) - $2,126,250
  - Effects: price_premium mul 1.2, bug_rate mul 0.7
- **Immersive IDE (VR/AR)** (B5) - $2,278,125
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2, loc_per_click mul 1.2
- **Viral Marketing** (F5) - $2,278,125
  - Effects: price_premium mul 1.2, passive_rev_per_sec add 0.05
- **Auto-Refactoring** (D5) - $2,430,000
  - Effects: refactor_bonus add 0.5, tech_debt_growth mul 0.8, code_quality mul 1.2
- **Engineering Department** (E5) - $2,657,812
  - Effects: agentConcurrencyCap add 15, agentProductivity mul 1.3, global_multiplier mul 1.2
- **Continuous Deployment** (I5) - $2,657,812
  - Effects: automationLevel add 2, revenue_multiplier mul 1.3
- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3

### Global Hit ($1,000,000,000)

Newly affordable nodes:

- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3
- **Superintelligence** (A6) - $33,554,432
  - Effects: agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10
- **Quantum Computer** (C6) - $41,943,040
  - Effects: agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2
- **Perfect Process** (D6) - $46,976,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2
- **Perfect Code** (H6) - $50,331,648
  - Effects: bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2
- **Autonomous IDE** (B6) - $53,687,091
  - Effects: automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Multi-Team Organization** (E6) - $53,687,091
  - Effects: agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3
- **Market Domination** (F6) - $53,687,091
  - Effects: revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1
- **Premium Platform** (G6) - $60,397,977
  - Effects: revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3
- **Zero-Downtime Deploy** (I6) - $60,397,977
  - Effects: automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2

### Studio Group ($10,000,000,000)

Newly affordable nodes:

- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3
- **Superintelligence** (A6) - $33,554,432
  - Effects: agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10
- **Quantum Computer** (C6) - $41,943,040
  - Effects: agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2
- **Perfect Process** (D6) - $46,976,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2
- **Perfect Code** (H6) - $50,331,648
  - Effects: bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2
- **Autonomous IDE** (B6) - $53,687,091
  - Effects: automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Multi-Team Organization** (E6) - $53,687,091
  - Effects: agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3
- **Market Domination** (F6) - $53,687,091
  - Effects: revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1
- **Premium Platform** (G6) - $60,397,977
  - Effects: revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3
- **Zero-Downtime Deploy** (I6) - $60,397,977
  - Effects: automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2

### Platform Owner ($100,000,000,000)

Newly affordable nodes:

- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3
- **Superintelligence** (A6) - $33,554,432
  - Effects: agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10
- **Quantum Computer** (C6) - $41,943,040
  - Effects: agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2
- **Perfect Process** (D6) - $46,976,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2
- **Perfect Code** (H6) - $50,331,648
  - Effects: bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2
- **Autonomous IDE** (B6) - $53,687,091
  - Effects: automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Multi-Team Organization** (E6) - $53,687,091
  - Effects: agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3
- **Market Domination** (F6) - $53,687,091
  - Effects: revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1
- **Premium Platform** (G6) - $60,397,977
  - Effects: revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3
- **Zero-Downtime Deploy** (I6) - $60,397,977
  - Effects: automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2

### Cultural Monopoly ($1,000,000,000,000)

Newly affordable nodes:

- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3
- **Superintelligence** (A6) - $33,554,432
  - Effects: agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10
- **Quantum Computer** (C6) - $41,943,040
  - Effects: agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2
- **Perfect Process** (D6) - $46,976,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2
- **Perfect Code** (H6) - $50,331,648
  - Effects: bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2
- **Autonomous IDE** (B6) - $53,687,091
  - Effects: automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Multi-Team Organization** (E6) - $53,687,091
  - Effects: agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3
- **Market Domination** (F6) - $53,687,091
  - Effects: revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1
- **Premium Platform** (G6) - $60,397,977
  - Effects: revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3
- **Zero-Downtime Deploy** (I6) - $60,397,977
  - Effects: automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2

### Reality Architect ($10,000,000,000,000)

Newly affordable nodes:

- **Cross-Platform** (G5) - $3,037,500
  - Effects: market_expansion mul 1.2, features_multiplier mul 1.3
- **Superintelligence** (A6) - $33,554,432
  - Effects: agentProductivity mul 1.3, global_multiplier mul 1.2, agentConcurrencyCap add 10
- **Quantum Computer** (C6) - $41,943,040
  - Effects: agentConcurrencyCap add 15, idle_loc_per_sec mul 1.3, compile_speed mul 1.5, global_multiplier mul 1.2
- **Perfect Process** (D6) - $46,976,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 1.3, global_multiplier mul 1.2
- **Perfect Code** (H6) - $50,331,648
  - Effects: bug_rate mul 0.5, revenue_per_loc mul 1.3, global_multiplier mul 1.2
- **Autonomous IDE** (B6) - $53,687,091
  - Effects: automationLevel add 2, global_multiplier mul 1.2, agentProductivity mul 1.2
- **Multi-Team Organization** (E6) - $53,687,091
  - Effects: agentConcurrencyCap add 25, agentProductivity mul 1.3, automationLevel add 1, global_multiplier mul 1.3
- **Market Domination** (F6) - $53,687,091
  - Effects: revenue_multiplier mul 1.3, passive_rev_per_sec add 0.1
- **Premium Platform** (G6) - $60,397,977
  - Effects: revenue_multiplier mul 1.3, global_multiplier mul 1.2, features_multiplier mul 1.3
- **Zero-Downtime Deploy** (I6) - $60,397,977
  - Effects: automationLevel add 4, ship_fraction mul 1.3, revenue_multiplier mul 1.2

## Recommended Progression Paths

### Early Game (First $10K)

1. **A0, B0, C0, D0, E0, F0, G0, H0** - Free tier 0 nodes for base bonuses
2. **A1** ($300) - Strong LoC/click and idle multipliers
3. **C1** ($250) - Idle LoC boost
4. **D1** ($280) - Testing and bug reduction
5. **F1** ($315) - Revenue multiplier
6. **B1** ($400) - Compile speed and test coverage
7. **E1** ($400) - Agent capacity increase

### Mid Game ($10K - $100K)

1. **C2** ($2,500) - Unlock agent infrastructure
2. **A2** ($3,000) - Requires C1, provides agents and bug reduction
3. **B2** ($4,000) - Idle LoC boost and automation
4. **E2** ($4,000) - Requires C2, more agents and passive revenue
5. **D2** ($2,800) - Code quality and debt reduction

### Late Game ($100K+)

Focus on tier 3 and 4 nodes with high multipliers:
- Quality branch (H3, H4) for premium pricing
- Automation branch (B3, B4) for reduced manual work and refactoring
- Agent scaling (E3, E4) for massive productivity
- Market expansion (F3, F4, G3, G4) for revenue scaling

## Current Game Mechanics

### Agent System
- Agent slots provided by tier 2+ nodes in Agents branch
- Each agent generates 0.5 LoC/sec * productivity * global multiplier
- Agent productivity enhanced by various tech nodes
- Provides significant idle generation scaling

### Quality & Bug System
- Bug rate affects revenue: revenue *= (2 - bug_rate)
- Code quality directly multiplies revenue per LoC
- Test coverage affects shipping fraction (prevents buggy releases)
- Quality improvements unlock premium pricing

### Tech Debt System
- Accumulates at 0.1/sec * tech_debt_growth rate
- Reduces shipping fraction: (1 - techDebt/1000)
- Refactor bonus converts debt to LoC at 50% efficiency
- Several nodes reduce debt growth or eliminate it entirely

### Automation System
- Manual auto-ship toggle available
- Automation levels reduce shipping intervals progressively
- Higher levels ship more frequently: 10s/(1+level)
- Compile speed now multiplies LoC per click (was non-functional)

### Revenue Calculation
Revenue per LoC = base_rev * quality * bug_penalty * all_multipliers
Total Revenue/s = shipped_LoC/s * rev_per_LoC + passive_revenue
Ship fraction = base_fraction * debt_penalty * test_coverage

## Node Efficiency Analysis

Based on revenue increase per dollar spent:

| Rank | Node | Branch | Cost | Rev Increase | Efficiency | Payback |
|------|------|--------|------|--------------|------------|---------|
| 1 | Basic Workflow | D0 | $1 | $0.011/s | 10.65‰/s | 94s |
| 2 | Manual Deploy | I0 | $1 | $0.011/s | 10.65‰/s | 94s |
| 3 | Office Laptop | C0 | $1 | $0.010/s | 9.90‰/s | 101s |
| 4 | Basic Game | G0 | $1 | $0.008/s | 8.17‰/s | 122s |
| 5 | Solo Dev | E0 | $1 | $0.005/s | 4.95‰/s | 202s |
| 6 | Word of Mouth | F0 | $1 | $0.002/s | 2.39‰/s | 418s |
| 7 | Placeholder Art | H0 | $1 | $0.002/s | 1.59‰/s | 627s |
| 8 | Testing Framework | D1 | $250 | $0.081/s | 0.32‰/s | 3091s |
| 9 | Pair Programming | E1 | $625 | $0.144/s | 0.23‰/s | 4353s |
| 10 | Multi-Core CPU | C1 | $187 | $0.039/s | 0.21‰/s | 4781s |
| 11 | Autocomplete | A1 | $225 | $0.034/s | 0.15‰/s | 6587s |
| 12 | Targeted Marketing | F1 | $281 | $0.033/s | 0.12‰/s | 8600s |
| 13 | Full IDE + Debugger | B1 | $300 | $0.033/s | 0.11‰/s | 9181s |
| 14 | DLC & Updates | G1 | $1,000 | $0.056/s | 0.06‰/s | 17907s |
| 15 | Professional Assets | H1 | $937 | $0.034/s | 0.04‰/s | 27311s |
| 16 | Code Review Team | E2 | $6,760 | $0.223/s | 0.03‰/s | 30276s |
| 17 | Code Review Bot | A2 | $6,760 | $0.071/s | 0.01‰/s | 95486s |
| 18 | Scrum Team | E3 | $43,940 | $0.357/s | 0.01‰/s | 123100s |
| 19 | Cross-Functional Team | E4 | $68,546 | $0.508/s | 0.01‰/s | 134947s |
| 20 | SSD Array | C2 | $5,070 | $0.034/s | 0.01‰/s | 148418s |

*Efficiency = Revenue increase per second per dollar spent (‰ = per mille)*

## Balance Summary

### Strengths
- Smooth cost progression across tiers
- Multiple viable upgrade paths
- Clear synergies between branches
- Meaningful choice between short-term and long-term investments

### Recent Improvements
- Eliminated all "worthless purchases" by implementing functional mechanics
- Made compile_speed multiply LoC per click (was broken)
- Made refactor_bonus functional (10% LoC boost per point)
- Removed non-functional focus_multiplier from all nodes
- Fixed pricing misalignments (D1 now $280, D2 now $2,800)
- Added comprehensive agent, quality, and automation systems

### Potential Issues
- Agent system requires C2 ($2,500) investment before becoming useful
- Tech debt mechanics may not be immediately visible to new players
- Some tier 4 nodes are very expensive but provide endgame scaling
- Quality system interactions (bugs, coverage, debt) add complexity

### Recommendations
- Monitor player progression through agent unlock milestone
- Consider visual indicators for tech debt accumulation
- Add tooltips explaining quality system interactions
- Validate tier 4 pricing provides satisfying late-game progression
