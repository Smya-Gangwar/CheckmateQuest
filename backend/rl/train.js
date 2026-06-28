const fs = require("fs");

const { sampleBoard } = require("./boardSampler");
const { evaluateBoard } = require("./rewardEngine");
const { simulateBoard } = require("./multiAgentSimulator");
const { mutateBoard } = require("./mutator");

const validateBoard = (board) => {
  const counts = {};

  for (const tile of board) {
    counts[tile.tile_type] =
      (counts[tile.tile_type] || 0) + 1;
  }

  return (
    counts.PAWN === 42 &&
    counts.KNIGHT === 3 &&
    counts.ROOK === 3 &&
    counts.TRAP === 8 &&
    counts.TREASURE === 8
  );
};

const getBoardFitness = (board) => {
  const staticReward = evaluateBoard(board);
  const sim = simulateBoard(board);
  const total =
    staticReward +
    sim.avgScore * 0.6 +
    sim.avgExplored * 15 -
    sim.avgTrapHits * 22 -
    sim.variance * 0.15;

  return {
    total,
    staticReward,
    sim
  };
};

let population = Array.from(
  { length: 20 },
  () => sampleBoard()
);

let bestBoard = population[0];
let bestData = getBoardFitness(bestBoard);

const GENERATIONS = 5000;

for (let i = 0; i < GENERATIONS; i++) {
  const parent = population[
      Math.floor(
        Math.random() * population.length
      )
    ];

  const candidate = mutateBoard(parent);
  if (!validateBoard(candidate)) {
    continue;
  }

  const candidateData = getBoardFitness(candidate);

  // Track global best
  if (candidateData.total > bestData.total) {
    bestBoard = candidate;
    bestData = candidateData;
    console.log(`Generation ${i}: ${bestData.total.toFixed(2)}`);
    console.table(bestData.sim.agentResults);
  }

  population.push(candidate);
  population.sort(
    (a, b) =>
      getBoardFitness(b).total -
      getBoardFitness(a).total
  );
  population = population.slice(0, 20);
}

const path = require("path");
const versionsDir = path.join(__dirname, "versions");

if (!fs.existsSync(versionsDir)) {
  fs.mkdirSync(versionsDir);
}

const existingBoards = fs
  .readdirSync(versionsDir)
  .filter((f) => f.startsWith("board_v"));

const nextVersion = existingBoards.length + 1;

// Save latest production board
/*fs.writeFileSync(
  path.join(__dirname, "best_board.json"),
  JSON.stringify(bestBoard, null, 2)
);*/

// Save latest production metrics
/*fs.writeFileSync(
  path.join(__dirname, "best_metrics.json"),
  JSON.stringify(bestData, null, 2)
);*/

// Save versioned snapshots
fs.writeFileSync(
  path.join(
    versionsDir,
    `board_v${nextVersion}.json`
  ),
  JSON.stringify(bestBoard, null, 2)
);

fs.writeFileSync(
  path.join(
    versionsDir,
    `metrics_v${nextVersion}.json`
  ),
  JSON.stringify(bestData, null, 2)
);

console.log(
  `Saved board version v${nextVersion}`
);

console.log("\nTraining complete.");
console.log("Best reward:", bestData.total.toFixed(2));