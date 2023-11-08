import createPlayer from '../modules/player';
import createAiPlayer from '../modules/Ai/aiPlayer';
import PubSub from '../modules/pubsub';

const GameController = (twoPlayers = false) => {
  let round = 0;
  const player1 = createPlayer('You');
  const player2 = twoPlayers
    ? createPlayer('Player2')
    : createAiPlayer('Enemy');

  let activePlayer = player2;
  let opponentPlayer = player1;

  const switchTurns = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    opponentPlayer = opponentPlayer === player2 ? player1 : player2;
    PubSub.publish('game-currentPlayer', activePlayer);
  };

  const gameOver = () => {
    if (player1.gameboard.activeShips() < 1) return 'Player 2 WIN!';
    if (player2.gameboard.activeShips() < 1) return 'Player 1 WIN!';
    return false;
  };

  return {
    player1,
    player2,
    round,
    setShips() {
      player1.placeShips();
      player2.placeShips();
    },
    async playRound(coordinates) {
      const currentAttack = await activePlayer.attack(
        opponentPlayer.gameboard,
        coordinates
      );

      if (currentAttack === 'miss') switchTurns();

      if (gameOver()) {
        const gameResult = gameOver();
        PubSub.publish('game-status', 'Game Over', gameResult);
        return gameResult;
      }

      round += 1;
      PubSub.publish('game-round', round);
      return currentAttack;
    },
  };
};

export default GameController;
