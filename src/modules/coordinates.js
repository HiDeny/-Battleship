export const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomRow, randomColumn, isVertical];
};

const checkOutOfBoard = (row, column, isVertical, shipLength) => {
  const dynamicDir = isVertical ? Number(row) : Number(column);

  if (row > 9 || column > 9 || dynamicDir + shipLength - 1 > 9) {
    return true;
  }
  return false;
};

const checkOffset = (row, column, isVertical, shipLength, board) => {
  const dynamicDir = isVertical ? Number(row) : Number(column);

  if (dynamicDir - 1 > -1) {
    const oneBefore = isVertical
      ? board[dynamicDir - 1][column]
      : board[row][dynamicDir - 1];

    if (oneBefore.ship !== null || oneBefore.offset === true) {
      return true;
    }
  }

  const dynamicPlusShip = dynamicDir + shipLength;
  if (dynamicPlusShip < 10) {
    const oneAfter = isVertical
      ? board[dynamicPlusShip][column]
      : board[row][dynamicPlusShip];

    if (oneAfter.ship !== null || oneAfter.offset === true) {
      return true;
    }
  }

  return false;
};

const checkFields = (row, column, isVertical, shipLength, board) => {
  const dynamicDir = isVertical ? Number(row) : Number(column);

  for (let i = dynamicDir; i < dynamicDir + shipLength; i += 1) {
    let currentField = board[row][i];
    let oneUpField = row + 1 <= 9 ? board[row + 1][i] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][i] : false;

    if (isVertical === true) {
      currentField = board[i][column];
      oneUpField = column + 1 <= 8 ? board[i][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[i][column - 1] : false;
    }

    if (currentField.ship !== null) {
      return true;
    }
    if (oneUpField.ship !== null || oneDownField.offset === true) {
      return true;
    }
    if (oneDownField.ship !== null || oneDownField.offset === true) {
      return true;
    }
  }

  return false;
};

export const checkCoordinates = (toCheck) => {
  const { coordinates, board, shipLength } = toCheck;
  const [row, column, isVertical] = coordinates;

  if (checkOutOfBoard(row, column, isVertical, shipLength)) {
    return false;
  }

  if (checkOffset(row, column, isVertical, shipLength, board)) {
    return false;
  }

  if (checkFields(row, column, isVertical, shipLength, board)) {
    return false;
  }

  return true;
};
