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
      let currentShot = null;

      if (highProbabilityShot.length > 0) {
        currentShot = highProbabilityShot.shift();
      } else if (possibleHits.length > 0 && highProbabilityShot.length < 1) {
        currentShot = possibleHits.shift();
      } else {
        let randomShot = getRandomCoordinates();
        currentShot = [randomShot[0], randomShot[1]];

        while (markedFields.has(`${currentShot[0]},${currentShot[1]}`)) {
          randomShot = getRandomCoordinates();
          currentShot = [randomShot[0], randomShot[1]];
        }
      }

      const result = enemyBoard.receiveAttack(currentShot);
      const currentShotStr = `${currentShot[0]},${currentShot[1]}`;

      if (result === 'miss') {
        const missedShotStr = `${currentShot[0]},${currentShot[1]}`;
        markedFields.add(missedShotStr);
      }

      if (result === 'hit') {
        const nextPossibleHits = possibleShots(currentShot);
        fieldHits.set(currentShotStr, currentShot);

        Object.keys(nextPossibleHits).forEach((key) => {
          const nextShot = nextPossibleHits[key];
          const nextX = nextShot[0];
          const nextY = nextShot[1];
          const nextPossibleHitStr = `${nextX},${nextY}`;

          if (fieldHits.has(nextPossibleHitStr)) {
            if (key === 'up') {
              highProbabilityShot.push(nextPossibleHits.down);
            }
            if (key === 'left') {
              highProbabilityShot.push(nextPossibleHits.right);
            }
            if (key === 'right') {
              highProbabilityShot.push(nextPossibleHits.left);
            }
            if (key === 'down') {
              highProbabilityShot.push(nextPossibleHits.up);
            }
          }

          if (
            nextX <= 9 &&
            nextY <= 9 &&
            nextX >= 0 &&
            nextY >= 0 &&
            !markedFields.has(nextPossibleHitStr)
          ) {
            possibleHits.push(nextShot);
            markedFields.add(currentShotStr);
          }
        });
      }

      if (result === 'ship sunk') {
        // offsets
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

      // console.log(highProbabilityShot);
      // console.log(possibleHits);

      return result;
    },
  };
};

export default createPlayer;

// Map(3) {size: 3, 7,9 => ship sunk, 5,2 => {up: Array(2), …}, 5,1 => {…}}

// 0:
// {"7,9" => "ship sunk"}
// 1:
// {"5,2" => Object}
// key:
// '5,2'
// value:
// {up: Array(2), down: Array(2), left: Array(2), right: Array(2)}
// 2:
// {"5,1" => Object}
// key:
// '5,1'

// down:
// (2) [4, 1]
// left:
// (2) [5, 0]
// right:
// (2) [5, 2]
// up:
// (2) [6, 1]
// [[Prototype]]:
// Object
// size:
// 3
// [[Prototype]]:
// Map
