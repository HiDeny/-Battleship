const field = (coordinates) => {
  let mark = null;
  let boat = null;

  return {
    coordinates,

    boat(newBoat) {
      if (newBoat && !boat) boat = newBoat;
      return boat;
    },
    markField() {
      if (mark !== null) throw new Error(`Already marked!`);

      if (boat) boat.hit();
      mark = boat ? 'Hit!' : 'Miss!';

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
      board[i][j] = field(`X:${i}, Y:${j}`);
    }
  }

  return board;
};

const createGameboard = () => {
  const board = initBoard();
  const shipsOnBoard = [];

  const checkCoordinates = (length, dynamicDir, fixedDir) => {
    if (dynamicDir + length > 9 || fixedDir > 9) {
      throw new Error('Out of board!');
    }

    for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
      const currentField = board[fixedDir][i];
      if (currentField.haveBoat) {
        throw new Error('Check coordinates: Field Occupied!');
      }
    }

    return true;
  };

  return {
    getBoard() {
      return board;
    },
    placeShip(newShip, coordinates) {
      const [row, column, isVertical] = coordinates;

      // Dir === True  (ship will be placed vertically)
      const dynamicDir = isVertical ? row : column;
      const fixedDir = isVertical ? column : row;

      checkCoordinates(newShip.length, dynamicDir, fixedDir);

      for (let i = dynamicDir; i < dynamicDir + newShip.length; i += 1) {
        const currentField = board[fixedDir][i];
        currentField.boat(newShip);
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
    checkShips() {
      if (!shipsOnBoard.length) return 'No ships on board';
      let activeShips = 0;

      shipsOnBoard.forEach((ship) => {
        activeShips += ship.health > 0 ? 1 : 0;
      });

      return !activeShips ? 'All ships destroyed' : 'Active ships on board';
    },
    shipsOnBoard,
  };
};

export default createGameboard;
