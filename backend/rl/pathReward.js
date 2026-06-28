const evaluatePath = ({
  score,
  traps,
  uniqueVisited,
}) => {
  let reward = 0;
  reward += score;
  reward += uniqueVisited * 4;
  reward -= traps * 12;
  return reward;
};

module.exports = {
  evaluatePath,
};