import createGameboard from './gameboard';
import createShip from './ship';

import { getRandomCoordinates, checkCoordinates } from './coordinates';

const createPlayer = (name, isComputer = false) => {
  const gameboard = createGameboard();
  const markedFields = [];

  const shipStorage = {
    AircraftCarrier: createShip(5),
    Battleship: createShip(4),
    Cruiser: createShip(3),
    Destroyer1: createShip(2),
    Destroyer2: createShip(2),
    Submarine1: createShip(1),
    Submarine2: createShip(1),
  };

  return {
    name,
    shipStorage,
    gameboard,
    isComputer,
    placeShip(shipType, coordinates) {
      const completeShip = { type: shipType, boat: shipStorage[shipType] };
      gameboard.placeShip(completeShip, coordinates);
      return completeShip.boat;
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    },
    placeShipsAtRandom() {
      const shipsOnBoard = [];

      Object.keys(shipStorage).forEach((shipType) => {
        const boat = shipStorage[shipType];
        const { length } = boat;

        let newCoordinates = getRandomCoordinates();
        const toCheck = {
          coordinates: newCoordinates,
          board: gameboard.board,
          shipLength: length,
        };

        while (!checkCoordinates(toCheck)) {
          newCoordinates = getRandomCoordinates();
          toCheck.coordinates = newCoordinates;
        }

        return this.placeShip(shipType, newCoordinates);
      });

      return shipsOnBoard;
    },
    randomAttack(enemyBoard) {
      let randomShot = getRandomCoordinates();
      while (markedFields.includes(`${randomShot[0]}, ${randomShot[1]}`)) {
        randomShot = getRandomCoordinates();
      }
      markedFields.push(`${randomShot[0]}, ${randomShot[1]}`);
      return enemyBoard.receiveAttack(randomShot);
    },
  };
};

export default createPlayer;
