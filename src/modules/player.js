import createGameboard from './gameboard';
import createShip from './ship';

import { getRandomCoordinates, checkCoordinates } from './coordinates';

const createPlayer = (name, isComputer = false) => {
  const gameboard = createGameboard();
  const markedFields = [];

  const shipStorage = {
    AircraftCarrier: createShip(5, 'AircraftCarrier'),
    Battleship: createShip(4, 'Battleship'),
    Cruiser: createShip(3, 'Cruiser'),
    Destroyer1: createShip(2, 'Destroyer1'),
    Destroyer2: createShip(2, 'Destroyer2'),
    Submarine1: createShip(1, 'Submarine1'),
    Submarine2: createShip(1, 'Submarine2'),
  };

  return {
    name,
    shipStorage,
    gameboard,
    isComputer,
    placeShip(shipType, coordinates) {
      const completeShip = shipStorage[shipType];

      gameboard.placeShip(completeShip, coordinates);
      return completeShip;
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    },
    placeShipsAtRandom() {
      const shipsOnBoard = [];

      Object.keys(shipStorage).forEach((shipType) => {
        const ship = shipStorage[shipType];
        const { length } = ship;

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
