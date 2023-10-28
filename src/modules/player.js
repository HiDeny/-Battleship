import createGameboard from './gameboard';
import createShip from './ship';

import { getRandomCoordinates, checkCoordinates } from './coordinates';

const possibleShots = (coordinates) => ({
  up: [coordinates[0] + 1, coordinates[1]],
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] + 1],
  right: [coordinates[0] + 1, coordinates[1] - 1],
});

const createPlayer = (name, isComputer = false) => {
  const gameboard = createGameboard();
  const markedFields = new Set();
  const possibleHits = [];

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
      while (markedFields.has(`${randomShot[0]},${randomShot[1]}`)) {
        randomShot = getRandomCoordinates();
      }
      markedFields.add(`${randomShot[0]},${randomShot[1]}`);
      return enemyBoard.receiveAttack(randomShot);
    },
    aiAttack(enemyBoard) {
      let currentShot = possibleHits.length
        ? possibleHits.shift()
        : getRandomCoordinates();

      if (!possibleHits.length) {
        while (markedFields.has(`${currentShot[0]},${currentShot[1]}`)) {
          currentShot = getRandomCoordinates();
        }
      }

      console.log(possibleHits);
      const result = enemyBoard.receiveAttack(currentShot);
      // offsets

      if (result === 'miss') {
        const missedShotStr = `${currentShot[0]},${currentShot[1]}`;
        markedFields.add(missedShotStr);
      }

      if (result === 'hit') {
        const nextPossibleHits = Object.values(possibleShots(currentShot));

        nextPossibleHits.forEach((possibleHit) => {
          const nextX = possibleHit[0];
          const nextY = possibleHit[1];
          const nextPossibleHitStr = `${nextX},${nextY}`;

          if (
            nextX < 9 &&
            nextY < 9 &&
            nextX >= 0 &&
            nextY >= 0 &&
            !markedFields.has(nextPossibleHitStr)
          ) {
            possibleHits.push(possibleHit);
            markedFields.add(currentShot);
          }
        });
      }

      return result;
    },
  };
};

export default createPlayer;
