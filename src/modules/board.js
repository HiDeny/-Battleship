import createBoardField from './board-field';
import { getFields } from './coordHelper';

const setOffset = (currentField, ship) => {
  if (!currentField) return;
  // eslint-disable-next-line no-param-reassign
  currentField.offset = true;
  ship.offset.push(currentField);
};

const populateFields = (board, newShip, coordinates) => {
  const [row, column, isVertical] = coordinates;
  const { length } = newShip;
  const dynamicDir = isVertical ? row : column;
  const oneBefore = dynamicDir - 1;
  const oneAfter = dynamicDir + length;

  // Offset before ship
  if (oneBefore > -1) {
    const coordToCheck = isVertical ? [oneBefore, column] : [row, oneBefore];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    setOffset(base, newShip);
    setOffset(up, newShip);
    setOffset(down, newShip);
  }

  // Offset after ship
  if (oneAfter < 10) {
    const coordToCheck = isVertical ? [oneAfter, column] : [row, oneAfter];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    setOffset(base, newShip);
    setOffset(up, newShip);
    setOffset(down, newShip);
  }

  for (let i = dynamicDir; i < oneAfter; i += 1) {
    const coordToCheck = isVertical ? [i, column] : [row, i];
    const { base, up, down } = getFields(coordToCheck, isVertical, board);

    base.ship = newShip;
    setOffset(up, newShip);
    setOffset(down, newShip);
  }
};

const initBoard = () => {
  const board = [];
  const rows = 10;
  const columns = 10;

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i][j] = createBoardField([i, j]);
    }
  }

  return board;
};

const createBoard = () => {
  const board = initBoard();
  const shipsOnBoard = [];

  return {
    board,
    shipsOnBoard,
    placeShip(newShip, coordinates) {
      populateFields(board, newShip, coordinates);
      shipsOnBoard.push(newShip);
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) throw new Error('No ships on board!');

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

      return livingShips;
    },
  };
};

export default createBoard;
