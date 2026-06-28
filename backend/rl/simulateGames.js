const board = require("./best_board.json");
const { simulateBoard } = require("./multiAgentSimulator");

const result = simulateBoard(board);

console.log("\n=== FINAL BOARD TEST ===");
console.table(result.agentResults);

console.log({
  avgScore: result.avgScore,
  avgExplored: result.avgExplored,
  avgTrapHits: result.avgTrapHits,
  variance: result.variance
});