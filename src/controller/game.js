import createPlayer from '../modules/player';

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
    playRound(coordinates) {
      const isGameOver = gameOver();
      if (isGameOver) return isGameOver;
      player1.attack(player2.gameboard, coordinates);

      setTimeout(() => {
        player2.randomAttack(player1.gameboard);
      }, 1000);

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
