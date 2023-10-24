import createPlayer from '../modules/player';
import PubSub from '../modules/pubsub';

const GameController = () => {
  let round = 0;
  const player1 = createPlayer('Player');
  const player2 = createPlayer('Computer', false);

  let activePlayer = player1;
  let opponentPlayer = player2;

  const switchTurns = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    opponentPlayer = opponentPlayer === player2 ? player1 : player2;
  };

  const gameOver = () => {
    if (!player1.gameboard.activeShips()) return 'Player 2 WIN!';
    if (!player2.gameboard.activeShips()) return 'Player 1 WIN!';
    return false;
  };

  return {
    player1,
    player2,
    round,
    setShips() {
      player1.placeShipsAtRandom();
      player2.placeShipsAtRandom();
    },
    playRound(coordinates, randomAttack = false) {
      const isGameOver = gameOver();
      if (isGameOver) {
        PubSub.publish('game-round', isGameOver);
        return isGameOver;
      }

      if (randomAttack) {
        activePlayer.randomAttack(opponentPlayer.gameboard);
      } else {
        activePlayer.attack(opponentPlayer.gameboard, coordinates);
      }

      round += 1;
      PubSub.publish('game-round', round);

      switchTurns();
      return false;
    },
    // playGameRandom(activePlayer = player1) {
    //   if (!player1.gameboard.activeShips()) return 'Player 2 WIN!';
    //   if (!player2.gameboard.activeShips()) return 'Player 1 WIN!';

    //   const inActivePlayer = activePlayer === player1 ? player2 : player1;

    //   round += 1;
    //   activePlayer.randomAttack(inActivePlayer.gameboard);
    //   return this.playGameRandom(inActivePlayer);
    // },
  };
};

export default GameController;
