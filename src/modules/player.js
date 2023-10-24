import createGameboard from './gameboard';
import createShip from './ship';

const getRandomCoordinates = () => {
  const randomX = Math.floor(Math.random() * 10);
  const randomY = Math.floor(Math.random() * 10);

  return [randomX, randomY];
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

          while (
            randomCoord[1] + shipLength > 9 ||
            shipsOnBoard.includes(`${randomCoord[0]}, ${randomCoord[1]}`) ||
            shipsOnBoard.includes(
              `${randomCoord[0]}, ${randomCoord[1] + shipLength}`
            )
          ) {
            randomCoord = getRandomCoordinates();
          }

          const row = randomCoord[0];
          const column = randomCoord[1];

          let columnStart = column - 1;
          const columnEnd = column + shipLength + 1;

          while (columnStart < columnEnd) {
            const oneUpField = `${row + 1}, ${columnStart}`;
            const nextField = `${row}, ${columnStart}`;
            const oneDownField = `${row - 1}, ${columnStart}`;

            shipsOnBoard.push(oneUpField);
            shipsOnBoard.push(nextField);
            shipsOnBoard.push(oneDownField);

            columnStart += 1;
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
    isComputer,
  };
};

export default createPlayer;
