const field = (coordinates) => {
  let haveBoat = false;
  // let isHit = null;

  return {
    coordinates,
    haveBoat,
    // setBoat() {
    //   haveBoat = !haveBoat;
    //   return haveBoat;
    // },
    markHit() {
      isHit = haveBoat ? 'Hit' : 'Miss';
      return isHit;
    },
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
    placeShip(ship, arr) {
      const row = arr[0];
      const column = arr[1];

      for (let i = column; i < column + ship.length; i += 1) {
        const currentField = board[row][i];
        currentField.haveBoat = ship;
      }

      return `Start: X:${row}, Y:${column} End: X:${row}, Y:${
        column + (ship.length - 1)
      }`;
    },
  };
};

const test = createGameboard();
// console.log(test.getBoard());
export default createGameboard;
