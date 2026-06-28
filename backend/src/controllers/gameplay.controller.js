const gameplayService = require(
  "../services/gameplay.service"
);

const getBoardState = async (
  req,
  res
) => {
  try {
    const { sessionId } = req.params;
    const boardState =
      await gameplayService.getBoardState(
        Number(sessionId)
      );
    res.json(boardState);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

const openTile = async (
  req,
  res
) => {
  try {
    const { sessionId } = req.params;
    const { tile_id } = req.body;
    const result = await gameplayService.openTile(
      Number(sessionId),
      Number(tile_id)
    );
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

const submitAnswer = async (
  req, res
) => {
  try {
    const { sessionId } = req.params;
    const { tile_id, answer } = req.body;
    const result = await gameplayService.submitAnswer(
      Number(sessionId),
      Number(tile_id),
      answer
    );
    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

const getHint = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await gameplayService.getHint(
      Number(sessionId)
    );

    res.json(result);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  getBoardState,
  openTile,
  submitAnswer,
  getHint
};