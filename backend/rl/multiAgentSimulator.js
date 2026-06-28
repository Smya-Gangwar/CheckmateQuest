const { runSafeAgent } = require("./playerAgentSafe");
const { runRiskyAgent } = require("./playerAgentRisky");
const { runGreedyAgent } = require("./playerAgentGreedy");
const { runExplorerAgent } = require("./playerAgentExplorer");

const agents = [
  { name: "safe", fn: runSafeAgent },
  { name: "risky", fn: runRiskyAgent },
  { name: "greedy", fn: runGreedyAgent },
  { name: "explorer", fn: runExplorerAgent }
];

const simulateBoard = (board) => {
  const results = [];
  for (const agent of agents) {
    const RUNS = 20;
    let totalScore = 0;
    let totalTrapHits = 0;
    let totalExplored = 0;

    for (let i = 0; i < RUNS; i++) {
        const r = agent.fn(board);
        totalScore += r.score;
        totalTrapHits += r.trapHits;
        totalExplored += r.explored;
    }

    const result = {
        score: totalScore / RUNS,
        trapHits: totalTrapHits / RUNS,
        explored: totalExplored / RUNS
    };

    results.push({
      agent: agent.name,
      ...result
    });
  }

  const avgScore = results.reduce((a, r) => a + r.score, 0) / results.length;
  const avgExplored = results.reduce((a, r) => a + r.explored, 0) / results.length;
  const avgTrapHits = results.reduce((a, r) => a + r.trapHits, 0) / results.length;
  const variance = results.reduce((a, r) => a + Math.pow(r.score - avgScore, 2),0) / results.length;

  return {
    avgScore,
    avgExplored,
    avgTrapHits,
    variance,
    agentResults: results
  };
};

module.exports = {
  simulateBoard
};