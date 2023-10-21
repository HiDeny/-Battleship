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

  const checkCoordinates = (coordinates, length) => {
    const [dynamicDir, fixedDir] = coordinates;

    if (dynamicDir + length > 9 || fixedDir > 9) {
      throw new Error('Out of board!');
    }

    for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
      const currentField = board[fixedDir][i];
      if (currentField.haveBoat) return false;
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

      // Update placement strategy
      const isAvailable = checkCoordinates(
        [dynamicDir, fixedDir],
        newShip.length
      );
      if (!isAvailable) throw new Error('Place Ship: Wrong coordinates!');

      for (let i = dynamicDir; i < dynamicDir + newShip.length; i += 1) {
        const currentField = board[fixedDir][i];
        currentField.setBoat(newShip);
      }
      activeShips.push(newShip);

      return `Start: X:${row}, Y:${column} End: X:${row}, Y:${
        column + (newShip.length - 1)
      }`;
    },
    receiveAttack(coordinates) {
      if (!activeShips.length) return 'No ships on board yet.';
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
