import createPlayer from '../modules/player';

const GameController = () => {
  const player1 = createPlayer('Player');
  const player2 = createPlayer('Computer', false);
  let round = 0;

  return {
    player1,
    player2,
    setShips() {
      player1.placeShipsAtRandom();
      player2.placeShipsAtRandom();
    },
    playRound(activePlayer = player1) {
      const shipsP1 = player1.gameboard.activeShips();
      const shipsP2 = player2.gameboard.activeShips();
      const inActivePlayer = activePlayer === player1 ? player2 : player1;

      if (!shipsP1) return 'Player 2 WIN!';
      if (!shipsP2) return 'Player 1 WIN!';

      round += 1;
      activePlayer.randomAttack(inActivePlayer.gameboard);
      return this.playRound(inActivePlayer);
    },
  };
};

export default GameController;
