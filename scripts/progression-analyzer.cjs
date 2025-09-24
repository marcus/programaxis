#!/usr/bin/env node

/**
 * Programaxis Tech Tree Progression Analyzer
 *
 * This script analyzes the tech tree balance and generates comprehensive
 * progression documentation including cost curves, optimal paths, and
 * ROI analysis for all tech nodes.
 */

const fs = require('fs');
const path = require('path');

// Load the tech tree data
const techTreePath = path.join(__dirname, '../src/data/tech-tree.json');
const techTree = JSON.parse(fs.readFileSync(techTreePath, 'utf8'));

const milestonesPath = path.join(__dirname, '../src/data/milestones.json');
const milestones = JSON.parse(fs.readFileSync(milestonesPath, 'utf8'));

// Game constants - Updated to reflect current mechanics
const BASE_STATS = {
  loc_per_click: 1.0,
  idle_loc_per_sec: 0.1,
  ship_fraction: 0.2,
  revenue_per_loc: 0.05,
  bug_rate: 1.0,
  code_quality: 1.0,
  test_coverage: 1.0,
  compile_speed: 1.0,
  refactor_bonus: 0.0,
  tech_debt_growth: 1.0,
  global_multiplier: 1.0,
  features_multiplier: 1.0,
  revenue_multiplier: 1.0,
  price_premium: 1.0,
  market_expansion: 1.0,
  passive_rev_per_sec: 0.0
  // Note: focus_multiplier removed as it was non-functional
  // Added missing stats for complete coverage
};

const BASE_SYSTEMS = {
  agentConcurrencyCap: 0,
  automationLevel: 0,
  agentProductivity: 1.0
};

// Cost curve calculations
function calculateCost(baseCost, curve, tier) {
  if (baseCost === 0) return 0;

  const curves = techTree.costCurves;
  const curveData = curves[curve];

  if (!curveData || curveData.kind !== 'exponential') {
    return baseCost;
  }

  // For exponential curves: cost = baseCost * k^tier
  return Math.floor(baseCost * Math.pow(curveData.k, tier));
}

// Apply effect to stats/systems
function applyEffect(stats, systems, effect) {
  const stat = effect.stat;
  const type = effect.type;
  const value = effect.value;

  switch (type) {
    case 'add':
      if (stat === 'automationLevel') {
        systems.automationLevel += value;
      } else if (stat in stats) {
        stats[stat] += value;
      }
      break;
    case 'mul':
      if (stat === 'agentProductivity') {
        systems.agentProductivity *= value;
      } else if (stat in stats) {
        stats[stat] *= value;
      }
      break;
    case 'cap':
      if (stat === 'agentConcurrencyCap') {
        systems.agentConcurrencyCap = Math.max(systems.agentConcurrencyCap, value);
      }
      break;
  }
}

// Calculate effective LoC per click (including all bonuses)
function calculateLocPerClick(stats) {
  const refactorBonus = 1 + ((stats.refactor_bonus || 0) * 0.1); // 10% per point
  const mult = (stats.global_multiplier || 1) * (stats.compile_speed || 1) * refactorBonus;
  return (stats.loc_per_click || 1) * mult;
}

// Calculate effective revenue per second
function calculateRevPerSec(stats, systems) {
  // Base idle LoC generation (focus_multiplier removed as non-functional)
  const baseIdle = stats.idle_loc_per_sec * stats.global_multiplier;

  // Agent LoC generation
  const agentLoc = systems.agentConcurrencyCap * 0.5 * systems.agentProductivity * stats.global_multiplier;

  const totalLocPerSec = baseIdle + agentLoc;

  // Tech debt penalty (assuming 0 tech debt for base calculation)
  const debtPenalty = Math.max(0, 1 - (0 / 1000));
  const effectiveShipFraction = Math.max(0, Math.min(1, stats.ship_fraction * debtPenalty * stats.test_coverage));

  // Revenue calculation with quality and bug factors
  const qualityMultiplier = stats.code_quality;
  const bugPenalty = 2 - stats.bug_rate; // Lower bug rate = higher revenue
  const multipliers = stats.revenue_multiplier * stats.features_multiplier *
                     stats.price_premium * stats.market_expansion * stats.global_multiplier;

  const revPerLoc = stats.revenue_per_loc * qualityMultiplier * bugPenalty * multipliers;

  // Continuous shipping calculation
  const shippedLocPerSec = totalLocPerSec * effectiveShipFraction;
  const revenuePerSec = shippedLocPerSec * revPerLoc + stats.passive_rev_per_sec;

  return {
    locPerSec: totalLocPerSec,
    locPerClick: calculateLocPerClick(stats),
    revenuePerSec: revenuePerSec,
    effectiveShipFraction: effectiveShipFraction,
    revPerLoc: revPerLoc,
    bugPenalty: bugPenalty,
    qualityMultiplier: qualityMultiplier
  };
}

// Calculate ROI for a tech node
function calculateROI(nodeId, beforeStats, beforeSystems) {
  const node = techTree.branches.flatMap(b => b.nodes).find(n => n.id === nodeId);
  if (!node) return null;

  const cost = calculateCost(node.baseCost, node.costCurve, node.tier);

  // Create after stats by applying effects
  const afterStats = { ...beforeStats };
  const afterSystems = { ...beforeSystems };

  for (const effect of node.effects || []) {
    applyEffect(afterStats, afterSystems, effect);
  }

  const beforeMetrics = calculateRevPerSec(beforeStats, beforeSystems);
  const afterMetrics = calculateRevPerSec(afterStats, afterSystems);

  const revenueIncrease = afterMetrics.revenuePerSec - beforeMetrics.revenuePerSec;
  const paybackTime = revenueIncrease > 0 ? cost / revenueIncrease : Infinity;

  return {
    cost,
    revenueIncrease,
    paybackTime,
    beforeMetrics,
    afterMetrics,
    effects: node.effects || []
  };
}

// Generate progression analysis
function analyzeProgression() {
  console.log('# Programaxis Tech Tree Progression Analysis');
  console.log('Generated on:', new Date().toISOString());
  console.log('Tech Tree Version:', techTree.version);
  console.log('');

  // Branch overview
  console.log('## Branch Overview');
  console.log('');

  for (const branch of techTree.branches) {
    console.log(`### ${branch.name} (${branch.key})`);
    console.log('');
    console.log('| Tier | Node | Cost | Effects |');
    console.log('|------|------|------|---------|');

    for (const node of branch.nodes) {
      const cost = calculateCost(node.baseCost, node.costCurve, node.tier);
      const effectsDesc = (node.effects || [])
        .map(e => `${e.stat} ${e.type} ${e.value}`)
        .join(', ');
      const requires = (node.requires || []).map(r => r.node).join(', ');
      const reqText = requires ? ` (requires: ${requires})` : '';

      console.log(`| ${node.tier} | ${node.name}${reqText} | $${cost.toLocaleString()} | ${effectsDesc} |`);
    }
    console.log('');
  }

  // Cost progression analysis
  console.log('## Cost Progression by Tier');
  console.log('');
  console.log('| Tier | Min Cost | Max Cost | Average | Median |');
  console.log('|------|----------|----------|---------|--------|');

  for (let tier = 0; tier <= 4; tier++) {
    const tierNodes = techTree.branches.flatMap(b => b.nodes).filter(n => n.tier === tier);
    const costs = tierNodes.map(n => calculateCost(n.baseCost, n.costCurve, n.tier));

    if (costs.length > 0) {
      const min = Math.min(...costs);
      const max = Math.max(...costs);
      const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
      const median = costs.sort((a, b) => a - b)[Math.floor(costs.length / 2)];

      console.log(`| ${tier} | $${min.toLocaleString()} | $${max.toLocaleString()} | $${Math.round(avg).toLocaleString()} | $${median.toLocaleString()} |`);
    }
  }
  console.log('');

  // Milestone alignment
  console.log('## Milestone Alignment');
  console.log('');
  console.log('Analysis of which tech nodes become affordable at each milestone:');
  console.log('');

  for (const milestone of milestones) {
    if (milestone.threshold === 0) continue;

    console.log(`### ${milestone.name} ($${milestone.threshold.toLocaleString()})`);
    console.log('');

    const affordableNodes = techTree.branches
      .flatMap(b => b.nodes)
      .map(n => ({
        ...n,
        cost: calculateCost(n.baseCost, n.costCurve, n.tier),
        branch: techTree.branches.find(b => b.nodes.includes(n)).key
      }))
      .filter(n => n.cost > 0 && n.cost <= milestone.threshold)
      .sort((a, b) => a.cost - b.cost);

    if (affordableNodes.length > 0) {
      console.log('Newly affordable nodes:');
      console.log('');

      for (const node of affordableNodes.slice(-10)) { // Show last 10 (most expensive)
        const effectsDesc = (node.effects || [])
          .map(e => `${e.stat} ${e.type} ${e.value}`)
          .join(', ');
        console.log(`- **${node.name}** (${node.branch}${node.tier}) - $${node.cost.toLocaleString()}`);
        console.log(`  - Effects: ${effectsDesc}`);
      }
    } else {
      console.log('No new nodes become affordable at this milestone.');
    }
    console.log('');
  }

  // Optimal early game path
  console.log('## Recommended Progression Paths');
  console.log('');

  console.log('### Early Game (First $10K)');
  console.log('');
  console.log('1. **A0, B0, C0, D0, E0, F0, G0, H0** - Free tier 0 nodes for base bonuses');
  console.log('2. **A1** ($300) - Strong LoC/click and idle multipliers');
  console.log('3. **C1** ($250) - Idle LoC boost');
  console.log('4. **D1** ($280) - Testing and bug reduction');
  console.log('5. **F1** ($315) - Revenue multiplier');
  console.log('6. **B1** ($400) - Compile speed and test coverage');
  console.log('7. **E1** ($400) - Agent capacity increase');
  console.log('');

  console.log('### Mid Game ($10K - $100K)');
  console.log('');
  console.log('1. **C2** ($2,500) - Unlock agent infrastructure');
  console.log('2. **A2** ($3,000) - Requires C1, provides agents and bug reduction');
  console.log('3. **B2** ($4,000) - Idle LoC boost and automation');
  console.log('4. **E2** ($4,000) - Requires C2, more agents and passive revenue');
  console.log('5. **D2** ($2,800) - Code quality and debt reduction');
  console.log('');

  console.log('### Late Game ($100K+)');
  console.log('');
  console.log('Focus on tier 3 and 4 nodes with high multipliers:');
  console.log('- Quality branch (H3, H4) for premium pricing');
  console.log('- Automation branch (B3, B4) for reduced manual work and refactoring');
  console.log('- Agent scaling (E3, E4) for massive productivity');
  console.log('- Market expansion (F3, F4, G3, G4) for revenue scaling');
  console.log('');

  // Current Mechanics Analysis
  console.log('## Current Game Mechanics');
  console.log('');

  console.log('### Agent System');
  console.log('- Agent slots provided by tier 2+ nodes in Agents branch');
  console.log('- Each agent generates 0.5 LoC/sec * productivity * global multiplier');
  console.log('- Agent productivity enhanced by various tech nodes');
  console.log('- Provides significant idle generation scaling');
  console.log('');

  console.log('### Quality & Bug System');
  console.log('- Bug rate affects revenue: revenue *= (2 - bug_rate)');
  console.log('- Code quality directly multiplies revenue per LoC');
  console.log('- Test coverage affects shipping fraction (prevents buggy releases)');
  console.log('- Quality improvements unlock premium pricing');
  console.log('');

  console.log('### Tech Debt System');
  console.log('- Accumulates at 0.1/sec * tech_debt_growth rate');
  console.log('- Reduces shipping fraction: (1 - techDebt/1000)');
  console.log('- Refactor bonus converts debt to LoC at 50% efficiency');
  console.log('- Several nodes reduce debt growth or eliminate it entirely');
  console.log('');

  console.log('### Automation System');
  console.log('- Manual auto-ship toggle available');
  console.log('- Automation levels reduce shipping intervals progressively');
  console.log('- Higher levels ship more frequently: 10s/(1+level)');
  console.log('- Compile speed now multiplies LoC per click (was non-functional)');
  console.log('');

  console.log('### Revenue Calculation');
  console.log('Revenue per LoC = base_rev * quality * bug_penalty * all_multipliers');
  console.log('Total Revenue/s = shipped_LoC/s * rev_per_LoC + passive_revenue');
  console.log('Ship fraction = base_fraction * debt_penalty * test_coverage');
  console.log('');

  // Node efficiency ranking
  console.log('## Node Efficiency Analysis');
  console.log('');
  console.log('Based on revenue increase per dollar spent:');
  console.log('');

  const baseStats = { ...BASE_STATS };
  const baseSystems = { ...BASE_SYSTEMS };

  const efficiencies = techTree.branches
    .flatMap(b => b.nodes)
    .filter(n => n.baseCost > 0)
    .map(n => {
      const roi = calculateROI(n.id, baseStats, baseSystems);
      return {
        id: n.id,
        name: n.name,
        tier: n.tier,
        branch: techTree.branches.find(b => b.nodes.includes(n)).key,
        cost: roi.cost,
        revenueIncrease: roi.revenueIncrease,
        efficiency: roi.revenueIncrease / roi.cost,
        paybackTime: roi.paybackTime
      };
    })
    .filter(n => n.revenueIncrease > 0)
    .sort((a, b) => b.efficiency - a.efficiency);

  console.log('| Rank | Node | Branch | Cost | Rev Increase | Efficiency | Payback |');
  console.log('|------|------|--------|------|--------------|------------|---------|');

  for (let i = 0; i < Math.min(20, efficiencies.length); i++) {
    const node = efficiencies[i];
    console.log(`| ${i + 1} | ${node.name} | ${node.branch}${node.tier} | $${node.cost.toLocaleString()} | $${node.revenueIncrease.toFixed(3)}/s | ${(node.efficiency * 1000).toFixed(2)}‰/s | ${node.paybackTime.toFixed(0)}s |`);
  }

  console.log('');
  console.log('*Efficiency = Revenue increase per second per dollar spent (‰ = per mille)*');
  console.log('');

  // Game balance summary
  console.log('## Balance Summary');
  console.log('');
  console.log('### Strengths');
  console.log('- Smooth cost progression across tiers');
  console.log('- Multiple viable upgrade paths');
  console.log('- Clear synergies between branches');
  console.log('- Meaningful choice between short-term and long-term investments');
  console.log('');

  console.log('### Recent Improvements');
  console.log('- Eliminated all "worthless purchases" by implementing functional mechanics');
  console.log('- Made compile_speed multiply LoC per click (was broken)');
  console.log('- Made refactor_bonus functional (10% LoC boost per point)');
  console.log('- Removed non-functional focus_multiplier from all nodes');
  console.log('- Fixed pricing misalignments (D1 now $280, D2 now $2,800)');
  console.log('- Added comprehensive agent, quality, and automation systems');
  console.log('');

  console.log('### Potential Issues');
  console.log('- Agent system requires C2 ($2,500) investment before becoming useful');
  console.log('- Tech debt mechanics may not be immediately visible to new players');
  console.log('- Some tier 4 nodes are very expensive but provide endgame scaling');
  console.log('- Quality system interactions (bugs, coverage, debt) add complexity');
  console.log('');

  console.log('### Recommendations');
  console.log('- Monitor player progression through agent unlock milestone');
  console.log('- Consider visual indicators for tech debt accumulation');
  console.log('- Add tooltips explaining quality system interactions');
  console.log('- Validate tier 4 pricing provides satisfying late-game progression');
}

// Run the analysis
try {
  analyzeProgression();
} catch (error) {
  console.error('Error analyzing progression:', error);
  process.exit(1);
}