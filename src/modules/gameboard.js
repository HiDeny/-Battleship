import PubSub from './pubsub';

const field = (coordinates) => {
  let mark = null;
  let ship = null;
  let offset = null;

  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      const { type, boat } = newShip;
      if (ship !== null) throw new Error('Field Occupied!');
      ship = boat;
      PubSub.publish('field-ship', coordinates, type);
    },
    get offset() {
      return offset;
    },
    set offset(value) {
      offset = value;
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

  const updateOffset = (row, column, isVertical, length) => {
    const dynamicDir = isVertical ? row : column;
    const dynamicPlusBoat = dynamicDir + length;

    if (dynamicDir - 1 > -1) {
      const oneBefore = isVertical
        ? board[dynamicDir - 1][column]
        : board[row][dynamicDir - 1];

      oneBefore.offset = true;
    }

    if (dynamicPlusBoat < 10) {
      const oneAfter = isVertical
        ? board[dynamicPlusBoat][column]
        : board[row][dynamicPlusBoat];

      oneAfter.offset = true;
    }
  };

  const populateFields = (newShip, row, column, isVertical) => {
    const dynamicDir = isVertical ? row : column;

    for (let i = dynamicDir; i < dynamicDir + newShip.boat.length; i += 1) {
      let currentField = board[row][i];
      let oneUpField = row + 1 <= 9 ? board[row + 1][i] : false;
      let oneDownField = row - 1 >= 0 ? board[row - 1][i] : false;

      if (isVertical === true) {
        currentField = board[i][column];
        oneUpField = column + 1 <= 9 ? board[i][column + 1] : false;
        oneDownField = column - 1 >= 0 ? board[i][column - 1] : false;
      }

      currentField.ship = newShip;
      if (oneUpField) oneUpField.offset = true;
      if (oneDownField) oneDownField.offset = true;
    }
  };

  return {
    board,
    shipsOnBoard,
    placeShip(newShip, coordinates) {
      const { boat } = newShip;
      const row = Number(coordinates[0]);
      const column = Number(coordinates[1]);
      const isVertical = coordinates[2] || false;

      updateOffset(row, column, isVertical, boat.length);
      populateFields(newShip, row, column, isVertical);
      shipsOnBoard.push(newShip);
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) return false;

      const [row, column] = coordinates;
      const currentField = board[row][column];
      const markField = currentField.markField();

      return markField;
    },
    activeShips() {
      let livingShips = shipsOnBoard.length;

      shipsOnBoard.forEach((completeShip) => {
        livingShips -= completeShip.boat.isSunk() ? 1 : 0;
      });

      return livingShips;
    },
  };
};

export default createGameboard;
