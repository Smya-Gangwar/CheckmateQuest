const prisma = require("../prisma/client");

const addCoins = async (sessionId, delta, reason, tileId) => {
  const session =
    await prisma.gameSession.findUnique({
      where: {
        id: sessionId,
      },
    });

  const newBalance = Math.max(0,session.coins + delta);

  await prisma.gameSession.update({
    where: {
      id: sessionId,
    },
    data: {
      coins: newBalance,
    },
  });

  await prisma.coinTransaction.create({
    data: {
      session_id: sessionId,
      tile_id: tileId,
      delta,
      reason,
      balance_after: newBalance,
    },
  });

  return newBalance;
};

module.exports = {
  addCoins,
};