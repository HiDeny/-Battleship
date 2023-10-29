import createGameboard from './gameboard';
import createShip from './ship';

import { getRandomCoordinates, checkCoordinates } from './coordinates';

const possibleShots = (coordinates) => ({
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] - 1],
  up: [coordinates[0] + 1, coordinates[1]],
  right: [coordinates[0], coordinates[1] + 1],
});

const createPlayer = (name, isComputer = false) => {
  const gameboard = createGameboard();
  const fieldHits = new Map();
  const markedFields = new Set();
  let possibleHits = [];
  let highProbabilityShot = [];

  const shipStorage = {
    AircraftCarrier: createShip(5, 'AircraftCarrier'),
    Battleship: createShip(4, 'Battleship'),
    Cruiser: createShip(3, 'Cruiser'),
    Destroyer1: createShip(2, 'Destroyer1'),
    Destroyer2: createShip(2, 'Destroyer2'),
    Submarine1: createShip(1, 'Submarine1'),
    Submarine2: createShip(1, 'Submarine2'),
  };

  const checkNextMark = (nextMark) => {
    const markX = nextMark[0];
    const markY = nextMark[1];
    const nextMarkStr = `${markX},${markY}`;

    const isInsideX = markX >= 0 && markX <= 9;
    const isInsideY = markY >= 0 && markY <= 9;
    const isInside = isInsideX && isInsideY;

    const alreadyMarked = markedFields.has(nextMarkStr);

    return !alreadyMarked && isInside;
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
      while (!checkNextMark(randomShot)) {
        randomShot = getRandomCoordinates();
      }
      markedFields.add(`${randomShot[0]},${randomShot[1]}`);
      return enemyBoard.receiveAttack(randomShot);
    },
    aiAttack(enemyBoard) {
      let currentShot = null;

      if (highProbabilityShot.length > 0) {
        currentShot = highProbabilityShot.pop();
      } else if (possibleHits.length > 0 && highProbabilityShot.length < 1) {
        currentShot = possibleHits.shift();
      } else {
        let randomShot = getRandomCoordinates();
        currentShot = [randomShot[0], randomShot[1]];

        while (!checkNextMark(randomShot)) {
          randomShot = getRandomCoordinates();
          currentShot = [randomShot[0], randomShot[1]];
        }
      }

      const result = enemyBoard.receiveAttack(currentShot);
      const currentShotStr = `${currentShot[0]},${currentShot[1]}`;

      if (result === 'miss') markedFields.add(currentShotStr);

      if (result === 'hit') {
        const nextPossibleHits = possibleShots(currentShot);
        fieldHits.set(currentShotStr, currentShot);

        Object.keys(nextPossibleHits).forEach((key) => {
          const nextShot = nextPossibleHits[key];
          const nextX = nextShot[0];
          const nextY = nextShot[1];
          const nextShotStr = `${nextX},${nextY}`;

          if (fieldHits.has(nextShotStr)) {
            const lastHit = fieldHits.get(nextShotStr);
            const oneExtra = possibleShots(lastHit)[key];
            let oppositeDir;

            if (key === 'up') oppositeDir = nextPossibleHits.down;
            if (key === 'left') oppositeDir = nextPossibleHits.right;
            if (key === 'right') oppositeDir = nextPossibleHits.left;
            if (key === 'down') oppositeDir = nextPossibleHits.up;

            if (checkNextMark(oppositeDir)) {
              highProbabilityShot.push(oppositeDir);
            }
            if (checkNextMark(oneExtra)) {
              highProbabilityShot.unshift(oneExtra);
            }
          }

          if (checkNextMark(nextShot)) {
            possibleHits.push(nextShot);
            markedFields.add(currentShotStr);
          }
        });
      }

      if (result === 'ship sunk') {
        fieldHits.set(currentShotStr, currentShot);
        markedFields.add(currentShotStr);

        fieldHits.values().forEach((position) => {
          const offsetFields = possibleShots(position);

          Object.values(offsetFields).forEach((offset) => {
            const offsetStr = `${offset[0]},${offset[1]}`;

            if (!markedFields.has(offsetStr)) {
              markedFields.add(offsetStr);
            }
          });
        });

        possibleHits = [];
        highProbabilityShot = [];
      }

      return result;
    },
  };
};

export default createPlayer;
