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
      const inActivePlayer = activePlayer === player1 ? player2 : player1;

      while (
        player1.gameboard.activeShips() &&
        player2.gameboard.activeShips()
      ) {
        round += 1
        activePlayer.randomAttack(inActivePlayer.gameboard);
        this.playRound(inActivePlayer);
      }
      return !player2.gameboard.activeShips()
        ? 'Player 1 WIN!'
        : 'Player 2 WIN!';
    },
  };
};

export default GameController;
