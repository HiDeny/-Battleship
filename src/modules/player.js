import createGameboard from './gameboard';
import createShip from './ship';

const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomRow, randomColumn, isVertical];
};

const checkCoordinates = (coordinates, shipLength, shipsOnBoard) => {
  const row = Number(coordinates[0]);
  const column = Number(coordinates[1]);
  const length = Number(shipLength);
  const isVertical = coordinates[2];
  const dynamicDir = isVertical ? row : column;

  if (dynamicDir + length > 9) return false;

  for (let i = dynamicDir - 1; i < dynamicDir + length; i += 1) {
    let oneUpField = `${row + 1},${i}`;
    let nextField = `${row},${i}`;
    let oneDownField = `${row - 1},${i}`;

    if (isVertical === true) {
      oneUpField = `${i},${column + 1}`;
      nextField = `${i},${column}`;
      oneDownField = `${i},${column - 1}`;
    }

    if (shipsOnBoard.includes(oneUpField)) return false;
    if (shipsOnBoard.includes(nextField)) return false;
    if (shipsOnBoard.includes(oneDownField)) return false;
  }

  return true;
};

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
      const currentShip = shipStorage[shipType];
      gameboard.placeShip(currentShip, coordinates);
      return currentShip;
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    },
    placeShipsAtRandom() {
      const shipsOnBoard = [];

      Object.keys(shipStorage).forEach((shipType) => {
        const currentShip = shipStorage[shipType];
        const { length } = currentShip;

        let newCoordinates = getRandomCoordinates();
        let coordinatesCheck = checkCoordinates(
          newCoordinates,
          length,
          shipsOnBoard
        );

        while (!coordinatesCheck) {
          newCoordinates = getRandomCoordinates();
          coordinatesCheck = checkCoordinates(
            newCoordinates,
            length,
            shipsOnBoard
          );
        }

        const row = Number(newCoordinates[0]);
        const column = Number(newCoordinates[1]);
        const isVertical = newCoordinates[2];

        const dynamicDir = isVertical ? row : column;

        for (let i = dynamicDir - 1; i < dynamicDir + length + 1; i += 1) {
          let oneUpField = `${row + 1},${i}`;
          let nextField = `${row},${i}`;
          let oneDownField = `${row - 1},${i}`;

          if (isVertical === true) {
            oneUpField = `${i},${column + 1}`;
            nextField = `${i},${column}`;
            oneDownField = `${i},${column - 1}`;
          }

          shipsOnBoard.push(oneUpField);
          shipsOnBoard.push(nextField);
          shipsOnBoard.push(oneDownField);
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
