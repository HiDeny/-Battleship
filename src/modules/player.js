import createGameboard from './gameboard';
import createShip from './ship';

const createPlayer = (name, isHuman = true) => {
  const gameboard = createGameboard();

  const storedShips = {
    AircraftCarrier: { ship: createShip(5), quantity: 1 },
    Battleship: { ship: createShip(4), quantity: 1 },
    Cruiser: { ship: createShip(3), quantity: 1 },
    Destroyer: { ship: createShip(2), quantity: 2 },
    Submarine1: { ship: createShip(1), quantity: 2 },
  };

  const madeShots = [];

  return {
    storedShips,
    gameboard,
    madeShots,
    placeShip(shipName, coordinates) {
      const current = storedShips[shipName];

      if (current.quantity <= 0) {
        throw new Error(`No more ${shipName} in storage`);
      }

      current.quantity -= 1;
      gameboard.placeShip(current.ship, coordinates);

      return current;
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    },
  };
};

export default createPlayer;
