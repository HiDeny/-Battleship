import createGameboard from './gameboard';
import createShip from './ship';

const getRandomCoordinates = () => {
  const randomX = Math.floor(Math.random() * 10);
  const randomY = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomX, randomY, isVertical];
};

const checkCoordinates = (coordinates, shipLength, shipsOnBoard) => {
  const [row, column, isVertical] = coordinates;

  const coordinatesStart = `${row}, ${column}`;
  let coordinatesEnd = `${row}, ${column + shipLength}`;
  let dynamicDir = column;

  if (isVertical) {
    coordinatesEnd = `${row + shipLength}, ${column}`;
    dynamicDir = row;
  }

  if (dynamicDir + shipLength > 9) return false;
  if (shipsOnBoard.includes(coordinatesStart)) return false;
  if (shipsOnBoard.includes(coordinatesEnd)) return false;

  return true;
};

const createPlayer = (name, isComputer = false) => {
  const gameboard = createGameboard();
  const markedFields = [];

  const storedShips = {
    AircraftCarrier: { shipLength: 5, quantity: 1 },
    Battleship: { shipLength: 4, quantity: 1 },
    Cruiser: { shipLength: 3, quantity: 1 },
    Destroyer: { shipLength: 2, quantity: 2 },
    Submarine: { shipLength: 1, quantity: 2 },
  };

  return {
    name,
    storedShips,
    gameboard,
    isComputer,
    placeShip(shipLength, coordinates) {
      const newShip = createShip(shipLength);
      gameboard.placeShip(newShip, coordinates);

      return newShip;
    },
    placeShipsAtRandom() {
      const shipsOnBoard = [];
      // Add vertical placing

      Object.keys(storedShips).forEach((type) => {
        const currentShipType = storedShips[type];
        const { shipLength } = currentShipType;

        while (currentShipType.quantity > 0) {
          let randomCoord = getRandomCoordinates();

          while (!checkCoordinates(randomCoord, shipLength, shipsOnBoard)) {
            randomCoord = getRandomCoordinates();
          }

          const [row, column, isVertical] = randomCoord;
          const dynamicDir = isVertical ? row : column;

          let start = dynamicDir - 1;
          const end = dynamicDir + shipLength + 1;

          while (start < end) {
            let oneUpField = `${row + 1}, ${start}`;
            let nextField = `${row}, ${start}`;
            let oneDownField = `${row - 1}, ${start}`;

            if (isVertical) {
              oneUpField = `${start}, ${column + 1}`;
              nextField = `${start}, ${column}`;
              oneDownField = `${start}, ${column - 1}`;
            }

            shipsOnBoard.push(oneUpField);
            shipsOnBoard.push(nextField);
            shipsOnBoard.push(oneDownField);

            start += 1;
          }

          this.placeShip(shipLength, randomCoord);
          currentShipType.quantity -= 1;
        }
      });

      return shipsOnBoard;
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
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
