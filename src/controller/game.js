import createPlayer from '../modules/player';
import createAiPlayer from '../modules/Ai/aiPlayer';
import PubSub from '../modules/pubsub';

const GameController = (playerOne = 'User', playerTwo = false) => {
  let round = 0;
  const player1 = createPlayer(playerOne);
  const player2 = playerTwo ? createPlayer(playerTwo) : createAiPlayer('Enemy');

  let activePlayer = player2;
  let opponentPlayer = player1;

  const switchTurns = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    opponentPlayer = opponentPlayer === player2 ? player1 : player2;
    PubSub.publish('game-turn', activePlayer);
  };

  const gameOver = () => {
    const activeShipsP1 = player1.gameboard.activeShips();
    const activeShipsP2 = player2.gameboard.activeShips();
    PubSub.publish('ships-left', [activeShipsP1, activeShipsP2]);

    if (activeShipsP1 < 1) return `${player2.name} WIN!`;
    if (activeShipsP2 < 1) return `${player1.name} WIN!`;
    return false;
  };

  return {
    player1,
    player2,
    round,
    setShips() {
      player1.placeShips();
      player2.placeShips();

      const activeShipsP1 = player1.gameboard.activeShips();
      const activeShipsP2 = player2.gameboard.activeShips();

      PubSub.publish('ships-left', [activeShipsP1, activeShipsP2]);
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
