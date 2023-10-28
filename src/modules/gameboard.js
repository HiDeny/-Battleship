import { field, populateFields } from './board-field';

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

      shipsOnBoard.forEach((completeShip) => {
        livingShips -= completeShip.isSunk() ? 1 : 0;
      });

      return livingShips;
    },
  };
};

export default createGameboard;
