import createGameboard from './gameboard';
import createShip from './ship';

const createPlayer = (name, isReal = true) => {
  const gameboard = createGameboard();

  const storedShips = [
    { AircraftCarrier: createShip(5) },
    { Battleship: createShip(4) },
    { Cruiser: createShip(3) },
    { Destroyer1: createShip(2) },
    { Destroyer2: createShip(2) },
    { Submarine1: createShip(1) },
    { Submarine2: createShip(1) },
  ];

  const madeShots = [];

  return {
    storedShips,
    gameboard,
    madeShots,
  };
};

export default createPlayer;
