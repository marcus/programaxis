# Programaxis Tech Tree Progression Analysis
Generated on: 2025-09-23T16:23:51.351Z
Tech Tree Version: 2

## Branch Overview

### AI Models (A)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Cut & Paste | $0 | loc_per_click add 0.1 |
| 1 | Autocomplete | $336 | loc_per_click mul 1.3, idle_loc_per_sec mul 1.2 |
| 2 | Copilot Agents (requires: C1) | $3,967 | agentConcurrencyCap cap 2, bug_rate mul 0.9 |
| 3 | Self-Improving Models (requires: B2) | $49,290 | code_quality mul 1.5, automationLevel add 1 |
| 4 | Superintelligence (requires: C4) | $581,633 | agentProductivity mul 2, global_multiplier mul 1.5 |

### Editor & Software Tools (B)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Plain Editor | $0 | loc_per_click add 0.05 |
| 1 | Full IDE + Debugger | $448 | compile_speed mul 1.25, test_coverage mul 1.1 |
| 2 | AI-Native Editor | $5,289 | idle_loc_per_sec mul 1.4, automationLevel add 1 |
| 3 | Immersive IDE (VR/AR) | $65,721 | refactor_bonus add 2, ship_fraction mul 1.2 |
| 4 | Autonomous IDE | $775,511 | automationLevel add 2, global_multiplier mul 1.3 |

### Hardware / Compute (C)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Office Laptop | $0 | idle_loc_per_sec add 0.05 |
| 1 | Multi-Core CPU | $280 | idle_loc_per_sec mul 1.2, compile_speed mul 1.1 |
| 2 | Single GPU | $3,306 | agentConcurrencyCap cap 3, agentProductivity mul 1.25 |
| 3 | Multi-GPU / Cloud | $41,075 | agentConcurrencyCap cap 5, global_multiplier mul 1.2 |
| 4 | Quantum / Exotic Compute | $484,694 | agentConcurrencyCap cap 10, idle_loc_per_sec mul 2 |

### Workflow & Process (D)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Basic Workflow | $0 | ship_fraction add 0.05 |
| 1 | Testing Framework | $179 | test_coverage mul 1.15, bug_rate mul 0.95 |
| 2 | Quality Assurance | $2,115 | code_quality mul 1.25, tech_debt_growth mul 0.9 |
| 3 | Auto-Refactoring | $24,333 | refactor_bonus add 5, tech_debt_growth mul 0.8 |
| 4 | Perfect Process | $310,204 | tech_debt_growth mul 0, ship_fraction mul 2 |

### Team Scaling (E)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Solo Dev | $0 | agentConcurrencyCap cap 1 |
| 1 | Helper Agent | $448 | agentConcurrencyCap cap 2, agentProductivity mul 1.1 |
| 2 | Specialist Squad (requires: C2) | $5,289 | agentConcurrencyCap cap 3, passive_rev_per_sec add 0.1 |
| 3 | Agent Swarm (requires: C3) | $65,721 | agentConcurrencyCap cap 6, agentProductivity mul 1.5 |
| 4 | Virtual Company (requires: C4) | $775,511 | agentConcurrencyCap cap 12, agentProductivity mul 2 |

### Marketing & Revenue (F)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Word of Mouth | $0 | revenue_per_loc add 0.01 |
| 1 | Targeted Marketing | $352 | revenue_multiplier mul 1.2 |
| 2 | Growth Hacking | $4,165 | market_expansion mul 1.3, passive_rev_per_sec add 0.05 |
| 3 | Viral Marketing | $51,755 | price_premium mul 1.5, passive_rev_per_sec add 0.2 |
| 4 | Market Domination | $610,714 | revenue_multiplier mul 2, passive_rev_per_sec add 1 |

### Product Features (G)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Basic Game | $0 | features_multiplier add 0.1 |
| 1 | DLC & Updates | $403 | features_multiplier mul 1.25, passive_rev_per_sec add 0.02 |
| 2 | Multiplayer & IAP (requires: A2) | $4,760 | features_multiplier mul 1.4, revenue_multiplier mul 1.2 |
| 3 | Cross-Platform (requires: B2, E2) | $59,149 | market_expansion mul 1.6, features_multiplier mul 1.3 |
| 4 | Metaverse Integration (requires: A3) | $697,959 | revenue_multiplier mul 3, global_multiplier mul 1.4 |

### Quality & Polish (H)

| Tier | Node | Cost | Effects |
|------|------|------|---------|
| 0 | Placeholder Art | $0 | code_quality add 0.05 |
| 1 | Professional Assets | $285 | bug_rate mul 0.9, test_coverage mul 1.1 |
| 2 | AI-Generated Content (requires: C2) | $3,372 | code_quality mul 1.25, price_premium mul 1.1 |
| 3 | Premium Quality (requires: D3) | $41,897 | price_premium mul 1.5, bug_rate mul 0.7 |
| 4 | Perfect Code (requires: A4) | $494,388 | bug_rate mul 0.1, revenue_per_loc mul 2 |

## Cost Progression by Tier

| Tier | Min Cost | Max Cost | Average | Median |
|------|----------|----------|---------|--------|
| 0 | $0 | $0 | $0 | $0 |
| 1 | $179 | $448 | $341 | $352 |
| 2 | $2,115 | $5,289 | $4,033 | $4,165 |
| 3 | $24,333 | $65,721 | $49,868 | $51,755 |
| 4 | $310,204 | $775,511 | $591,327 | $610,714 |

## Milestone Alignment

Analysis of which tech nodes become affordable at each milestone:

### First Sale ($1,000)

Newly affordable nodes:

- **Testing Framework** (D1) - $179
  - Effects: test_coverage mul 1.15, bug_rate mul 0.95
- **Multi-Core CPU** (C1) - $280
  - Effects: idle_loc_per_sec mul 1.2, compile_speed mul 1.1
- **Professional Assets** (H1) - $285
  - Effects: bug_rate mul 0.9, test_coverage mul 1.1
- **Autocomplete** (A1) - $336
  - Effects: loc_per_click mul 1.3, idle_loc_per_sec mul 1.2
- **Targeted Marketing** (F1) - $352
  - Effects: revenue_multiplier mul 1.2
- **DLC & Updates** (G1) - $403
  - Effects: features_multiplier mul 1.25, passive_rev_per_sec add 0.02
- **Full IDE + Debugger** (B1) - $448
  - Effects: compile_speed mul 1.25, test_coverage mul 1.1
- **Helper Agent** (E1) - $448
  - Effects: agentConcurrencyCap cap 2, agentProductivity mul 1.1

### Micro-Studio ($10,000)

Newly affordable nodes:

- **Full IDE + Debugger** (B1) - $448
  - Effects: compile_speed mul 1.25, test_coverage mul 1.1
- **Helper Agent** (E1) - $448
  - Effects: agentConcurrencyCap cap 2, agentProductivity mul 1.1
- **Quality Assurance** (D2) - $2,115
  - Effects: code_quality mul 1.25, tech_debt_growth mul 0.9
- **Single GPU** (C2) - $3,306
  - Effects: agentConcurrencyCap cap 3, agentProductivity mul 1.25
- **AI-Generated Content** (H2) - $3,372
  - Effects: code_quality mul 1.25, price_premium mul 1.1
- **Copilot Agents** (A2) - $3,967
  - Effects: agentConcurrencyCap cap 2, bug_rate mul 0.9
- **Growth Hacking** (F2) - $4,165
  - Effects: market_expansion mul 1.3, passive_rev_per_sec add 0.05
- **Multiplayer & IAP** (G2) - $4,760
  - Effects: features_multiplier mul 1.4, revenue_multiplier mul 1.2
- **AI-Native Editor** (B2) - $5,289
  - Effects: idle_loc_per_sec mul 1.4, automationLevel add 1
- **Specialist Squad** (E2) - $5,289
  - Effects: agentConcurrencyCap cap 3, passive_rev_per_sec add 0.1

### Tooling Pays Off ($100,000)

Newly affordable nodes:

- **AI-Native Editor** (B2) - $5,289
  - Effects: idle_loc_per_sec mul 1.4, automationLevel add 1
- **Specialist Squad** (E2) - $5,289
  - Effects: agentConcurrencyCap cap 3, passive_rev_per_sec add 0.1
- **Auto-Refactoring** (D3) - $24,333
  - Effects: refactor_bonus add 5, tech_debt_growth mul 0.8
- **Multi-GPU / Cloud** (C3) - $41,075
  - Effects: agentConcurrencyCap cap 5, global_multiplier mul 1.2
- **Premium Quality** (H3) - $41,897
  - Effects: price_premium mul 1.5, bug_rate mul 0.7
- **Self-Improving Models** (A3) - $49,290
  - Effects: code_quality mul 1.5, automationLevel add 1
- **Viral Marketing** (F3) - $51,755
  - Effects: price_premium mul 1.5, passive_rev_per_sec add 0.2
- **Cross-Platform** (G3) - $59,149
  - Effects: market_expansion mul 1.6, features_multiplier mul 1.3
- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5

### Indie Darling ($1,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Live-Ops On ($10,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Brand Found ($100,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Global Hit ($1,000,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Studio Group ($10,000,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Platform Owner ($100,000,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Cultural Monopoly ($1,000,000,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

### Reality Architect ($10,000,000,000,000)

Newly affordable nodes:

- **Immersive IDE (VR/AR)** (B3) - $65,721
  - Effects: refactor_bonus add 2, ship_fraction mul 1.2
- **Agent Swarm** (E3) - $65,721
  - Effects: agentConcurrencyCap cap 6, agentProductivity mul 1.5
- **Perfect Process** (D4) - $310,204
  - Effects: tech_debt_growth mul 0, ship_fraction mul 2
- **Quantum / Exotic Compute** (C4) - $484,694
  - Effects: agentConcurrencyCap cap 10, idle_loc_per_sec mul 2
- **Perfect Code** (H4) - $494,388
  - Effects: bug_rate mul 0.1, revenue_per_loc mul 2
- **Superintelligence** (A4) - $581,633
  - Effects: agentProductivity mul 2, global_multiplier mul 1.5
- **Market Domination** (F4) - $610,714
  - Effects: revenue_multiplier mul 2, passive_rev_per_sec add 1
- **Metaverse Integration** (G4) - $697,959
  - Effects: revenue_multiplier mul 3, global_multiplier mul 1.4
- **Autonomous IDE** (B4) - $775,511
  - Effects: automationLevel add 2, global_multiplier mul 1.3
- **Virtual Company** (E4) - $775,511
  - Effects: agentConcurrencyCap cap 12, agentProductivity mul 2

## Recommended Progression Paths

### Early Game (First $10K)

1. **A0, B0, C0, D0, E0, F0, G0, H0** - Free tier 0 nodes for base bonuses
2. **A1** ($300) - Strong LoC/click and idle multipliers
3. **C1** ($250) - Idle LoC boost
4. **D1** ($160) - Testing and bug reduction
5. **F1** ($315) - Revenue multiplier
6. **B1** ($400) - Compile speed and test coverage
7. **E1** ($400) - Agent capacity increase

### Mid Game ($10K - $100K)

1. **C2** ($2,500) - Unlock agent infrastructure
2. **A2** ($3,000) - Requires C1, provides agents and bug reduction
3. **B2** ($4,000) - Idle LoC boost and automation
4. **E2** ($4,000) - Requires C2, more agents and passive revenue
5. **D2** ($1,600) - Code quality and debt reduction

### Late Game ($100K+)

Focus on tier 3 and 4 nodes with high multipliers:
- Quality branch (H3, H4) for premium pricing
- Automation branch (B3, B4) for reduced manual work
- Agent scaling (E3, E4) for massive productivity
- Market expansion (F3, F4, G3, G4) for revenue scaling

## Node Efficiency Analysis

Based on revenue increase per dollar spent:

| Rank | Node | Branch | Cost | Rev Increase | Efficiency | Payback |
|------|------|--------|------|--------------|------------|---------|
| 1 | DLC & Updates | G1 | $403 | $0.020/s | 0.05‰/s | 19901s |
| 2 | Helper Agent | E1 | $448 | $0.011/s | 0.02‰/s | 40727s |
| 3 | Specialist Squad | E2 | $5,289 | $0.115/s | 0.02‰/s | 45991s |
| 4 | Growth Hacking | F2 | $4,165 | $0.050/s | 0.01‰/s | 82803s |
| 5 | Single GPU | C2 | $3,306 | $0.019/s | 0.01‰/s | 176320s |
| 6 | Viral Marketing | F3 | $51,755 | $0.201/s | 0.00‰/s | 258130s |
| 7 | Copilot Agents | A2 | $3,967 | $0.011/s | 0.00‰/s | 357387s |
| 8 | Market Domination | F4 | $610,714 | $1.001/s | 0.00‰/s | 610104s |
| 9 | Testing Framework | D1 | $179 | $0.000/s | 0.00‰/s | 862651s |
| 10 | Multi-GPU / Cloud | C3 | $41,075 | $0.036/s | 0.00‰/s | 1127195s |
| 11 | Professional Assets | H1 | $285 | $0.000/s | 0.00‰/s | 1357143s |
| 12 | Multi-Core CPU | C1 | $280 | $0.000/s | 0.00‰/s | 1400000s |
| 13 | Agent Swarm | E3 | $65,721 | $0.045/s | 0.00‰/s | 1460467s |
| 14 | Autocomplete | A1 | $336 | $0.000/s | 0.00‰/s | 1680000s |
| 15 | Targeted Marketing | F1 | $352 | $0.000/s | 0.00‰/s | 1760000s |
| 16 | Full IDE + Debugger | B1 | $448 | $0.000/s | 0.00‰/s | 4480000s |
| 17 | Virtual Company | E4 | $775,511 | $0.120/s | 0.00‰/s | 6462592s |
| 18 | Multiplayer & IAP | G2 | $4,760 | $0.001/s | 0.00‰/s | 7000000s |
| 19 | Quality Assurance | D2 | $2,115 | $0.000/s | 0.00‰/s | 8460000s |
| 20 | AI-Generated Content | H2 | $3,372 | $0.000/s | 0.00‰/s | 8992000s |

*Efficiency = Revenue increase per second per dollar spent (‰ = per mille)*

## Balance Summary

### Strengths
- Smooth cost progression across tiers
- Multiple viable upgrade paths
- Clear synergies between branches
- Meaningful choice between short-term and long-term investments

### Potential Issues
- Some tier 4 nodes may be too expensive relative to their benefits
- Agent system requires significant investment before becoming effective
- Tech debt mechanics may not be immediately visible to players

### Recommendations
- Monitor player progression data to identify bottlenecks
- Consider adding intermediate milestones between $100M and $1B
- Ensure all tier 4 nodes provide satisfying endgame power
- Add tooltips explaining complex mechanics like tech debt and agent productivity
