import createPlayer from '../modules/player';
import createAiPlayer from '../modules/Ai/aiPlayer';
import PubSub from '../modules/pubsub';

const GameController = () => {
  let round = 0;
  const player1 = createPlayer('You');
  const player2 = createAiPlayer('Enemy');

  let activePlayer = player1;
  let opponentPlayer = player2;

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
      player1.placeShipsAtRandom();
      player2.placeShips();
    },
    playRound(coordinates, aiPlayer = false) {
      let currentAttack;
      if (aiPlayer) {
        currentAttack = activePlayer.attack(opponentPlayer.gameboard);
      } else {
        currentAttack = activePlayer.attack(
          opponentPlayer.gameboard,
          coordinates
        );
      }

      if (gameOver()) {
        const gameResult = gameOver();
        PubSub.publish('game-round', gameResult);
        return gameResult;
      }

      switchTurns();

      round += 1;
      PubSub.publish('game-round', round);
      return currentAttack;
    },
  };
};

export default GameController;
