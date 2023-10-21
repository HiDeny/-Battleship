const field = (coordinates) => {
  let hit = null;
  let boat = null;

  return {
    coordinates,

    setBoat(newBoat) {
      if (boat) throw new Error('SetBoat: Field Occupied!');
      boat = newBoat;
      return boat;
    },
    markHit() {
      if (hit === 'Hit!' || hit === 'Miss!') throw new Error(`Already marked!`);

      hit = boat ? 'Hit!' : 'Miss!';
      if (boat) boat.hit();

      return hit;
    },
    get haveBoat() {
      return boat;
    },
  };
};

const createGameboard = () => {
  const rows = 10;
  const columns = 10;
  const board = [];

  const activeShips = [];

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
    placeShip(newShip, coordinates) {
      // Update placement strategy 
      const [row, column, dir] = coordinates;

      for (let i = column; i < column + newShip.length; i += 1) {
        const currentField = board[row][i];
        currentField.setBoat(newShip);
      }
      activeShips.push(newShip);

      return `Start: X:${row}, Y:${column} End: X:${row}, Y:${
        column + (newShip.length - 1)
      }`;
    },
    receiveAttack(coordinates) {
      const [row, column] = coordinates;
      const currentField = board[row][column];
      const gotHit = currentField.markHit();

      return gotHit;
    },
    allSunk() {
      if (!activeShips.length) return 'No ships on board yet.';
      let livingShips = 0;

      activeShips.forEach((ship) => {
        if (ship.health > 0) livingShips += 1;
      });

      return livingShips > 0 ? 'Living ships on board' : 'All ships sunk';
    },
    activeShips,
  };
};

export default createGameboard;
