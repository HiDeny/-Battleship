import createGameboard from '../gameboard';
import createShipStorage from '../ship';

import {
  getRandomCoordinates,
  checkShipCoordinates,
  getRandomNextShot,
} from '../coordinates';
import { saveHit, saveMiss, saveSunk, shotDelay } from './aiHelpers';

const createAiPlayer = (name) => {
  const gameboard = createGameboard();
  const fieldHits = new Map();
  const markedFields = new Set();
  let possibleHits = [];
  let highProbabilityShot = [];

  const shipStorage = createShipStorage();

  const getNextShot = () => {
    if (highProbabilityShot.length > 0) {
      return highProbabilityShot.pop();
    }
    if (possibleHits.length > 0) {
      return possibleHits.shift();
    }
    return getRandomNextShot(markedFields);
  };

  const saveShotResult = (shot, result) => {
    if (result === 'miss') saveMiss(markedFields, shot);
    if (result === 'hit') {
      saveHit(markedFields, fieldHits, possibleHits, highProbabilityShot, shot);
    }

    // Ship sunk
    if (Array.isArray(result)) {
      saveSunk(markedFields, fieldHits, shot, result);
      possibleHits = [];
      highProbabilityShot = [];
    }
  };

  return {
    name,
    shipStorage,
    gameboard,
    placeShips() {
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

        while (!checkShipCoordinates(toCheck)) {
          newCoordinates = getRandomCoordinates();
          toCheck.coordinates = newCoordinates;
        }

        gameboard.placeShip(ship, newCoordinates);
        return ship;
      });

      return shipsOnBoard;
    },
    async attack(enemyBoard) {
      let shots = 1;

      for (let i = 0; i < shots; i += 1) {
        const currentShot = getNextShot();
        const result = await shotDelay(enemyBoard, currentShot);
        saveShotResult(currentShot, result);

        if (result === 'hit' || result === 'ship sunk') {
          shots += 1;
        }
      }

      return 'miss';
    },
  };
};

export default createAiPlayer;
