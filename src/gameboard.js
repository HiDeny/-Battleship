const field = (name) => {
  return {
    name,
    haveBoat: null,
    isHit: null,
  };
};

const createGameboard = () => {
  const rows = 10;
  const columns = 10;
  const board = [];

  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i][j] = field(`X: ${i}, Y: ${j}`);
    }
  }

  return {
    getBoard() {
      return board;
    },
    placeShip(ship, start) {
      for (let i = start; i < start + ship.legth; i += 1) {
        const currentField = board[i];
        currentField.haveBoat = true;
      }
      return 'Ship placed';
    },
  };
};

const test = createGameboard();
console.log(test.getBoard());
export default createGameboard;
