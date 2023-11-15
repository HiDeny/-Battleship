import PubSub from './pubsub';

const createGameLoop = (player1, player2) => {
  let round = 0;

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

    if (activeShipsP1 < 1) return `${player2.name} WIN!`;
    if (activeShipsP2 < 1) return `${player1.name} WIN!`;
    return false;
  };

  return {
    player1,
    player2,
    activePlayer,
    setShips() {
      player1.placeShips();
      player2.placeShips();

      PubSub.publish('game-ships-check');
    },
    async playRound(coordinates) {
      const currentAttack = await activePlayer.attack(
        opponentPlayer.gameboard,
        coordinates
      );

      if (currentAttack === 'miss') {
        switchTurns();
        round += 1;
        PubSub.publish('game-round', round);
      }

      if (gameOver()) {
        const gameResult = gameOver();
        PubSub.publish('game-status', 'Game Over', gameResult);
        return gameResult;
      }

      return currentAttack;
    },
  };
};

export default createGameLoop;
