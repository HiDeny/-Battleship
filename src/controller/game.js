import createPlayer from '../modules/player';

const GameController = () => {
  const player1 = createPlayer('Player');
  const player2 = createPlayer('Computer', false);

  return {
    setShips() {
      player1.placeShip('AircraftCarrier', [0, 0, true]);
      player1.placeShip('Battleship', [0, 5, false]);
      player1.placeShip('Cruiser', [9, 7, false]);
      player1.placeShip('Destroyer', [5, 5, true]);
      player1.placeShip('Destroyer', [3, 4, false]);
      player1.placeShip('Submarine', [2, 8, true]);
      player1.placeShip('Submarine', [6, 2, false]);

      player2.placeShip('AircraftCarrier', [0, 0, true]);
      player2.placeShip('Battleship', [0, 5, false]);
      player2.placeShip('Cruiser', [9, 7, false]);
      player2.placeShip('Destroyer', [5, 5, true]);
      player2.placeShip('Destroyer', [3, 4, false]);
      player2.placeShip('Submarine', [2, 8, true]);
      player2.placeShip('Submarine', [6, 2, false]);
    },
  };
};
