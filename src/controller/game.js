import createPlayer from '../modules/player';

const GameController = () => {
  const player1 = createPlayer('Player');
  const player2 = createPlayer('Computer', false);

  return {
    player1,
    player2,
    setShips() {
      player1.placeShipsAtRandom();
      player2.placeShipsAtRandom();
    },
  };
};

export default GameController;
