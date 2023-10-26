import PubSub from './pubsub';

const field = (coordinates) => {
  let mark = null;
  let ship = null;

  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      ship = newShip;
      PubSub.publish('field-ship', coordinates);
    },
    markField() {
      if (mark !== null) throw new Error(`Already marked!`);

      if (ship) ship.hit();
      mark = ship ? 'hit' : 'miss';

      PubSub.publish('field-mark', coordinates, mark);
      return mark;
    },
    get mark() {
      return mark;
    },
  };
};

const initBoard = () => {
  const board = [];
  const rows = 10;
  const columns = 10;

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i][j] = field([i, j]);
    }
  }

  return board;
};

const createGameboard = () => {
  const board = initBoard();
  const shipsOnBoard = [];

  const checkCoordinates = (length, row, column, isVertical) => {
    const dynamicDir = isVertical ? row : column;

    if (row > 9 || column > 9 || dynamicDir + length > 10) {
      throw new Error('Out of board!');
    }

    for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
      let currentField = board[row][i];
      if (isVertical) currentField = board[i][column];

      if (currentField.ship) {
        throw new Error('Check coordinates: Field Occupied!');
      }
    }

    return true;
  };

  return {
    board,
    placeShip(newShip, coordinates) {
      const [row, column, isVertical] = coordinates;
      // Dir === True  (ship will be placed vertically)
      const dynamicDir = isVertical ? row : column;

      checkCoordinates(newShip.length, row, column, isVertical);

      for (let i = dynamicDir; i < dynamicDir + newShip.length; i += 1) {
        let currentField = board[row][i];
        if (isVertical) currentField = board[i][column];

        currentField.ship = newShip;
      }
      shipsOnBoard.push(newShip);

      return `Start: X:${row}, Y:${column} End: X:${row}, Y:${
        column + (newShip.length - 1)
      }`;
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) return 'No ships on board';

      const [row, column] = coordinates;
      const currentField = board[row][column];
      const markField = currentField.markField();

      return markField;
    },
    activeShips() {
      let livingShips = shipsOnBoard.length;

      shipsOnBoard.forEach((ship) => {
        livingShips -= ship.isSunk() ? 1 : 0;
      });

      return livingShips > 0;
    },
    shipsOnBoard,
  };
};

export default createGameboard;
