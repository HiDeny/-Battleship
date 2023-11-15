export const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomRow, randomColumn, isVertical];
};

const checkOutOfBoard = (row, column, isVertical, shipLength) => {
  const dynamicDir = isVertical ? Number(row) : Number(column);
  return row > 9 || column > 9 || dynamicDir + shipLength - 1 > 9;
};

const checkOffset = (row, column, isVertical, shipLength, board) => {
  const dynamicDir = isVertical ? Number(row) : Number(column);

  const oneBefore = dynamicDir - 1;
  if (oneBefore > -1) {
    let currentField = board[row][oneBefore];
    let oneUpField = row + 1 <= 9 ? board[row + 1][oneBefore] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][oneBefore] : false;

    if (isVertical === true) {
      currentField = board[oneBefore][column];
      oneUpField = column + 1 <= 9 ? board[oneBefore][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[oneBefore][column - 1] : false;
    }

    if (currentField.ship !== null) return true;
    if (oneUpField.ship !== null) return true;
    if (oneDownField.ship !== null) return true;
  }

  const oneAfter = dynamicDir + shipLength;
  if (oneAfter < 10) {
    let currentField = board[row][oneAfter];
    let oneUpField = row + 1 <= 9 ? board[row + 1][oneAfter] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][oneAfter] : false;

    if (isVertical === true) {
      currentField = board[oneAfter][column];
      oneUpField = column + 1 <= 9 ? board[oneAfter][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[oneAfter][column - 1] : false;
    }

    if (currentField.ship !== null) return true;
    if (oneUpField.ship !== null) return true;
    if (oneDownField.ship !== null) return true;
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
      oneUpField = column + 1 <= 9 ? board[i][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[i][column - 1] : false;
    }

    if (currentField.ship !== null || oneDownField.offset === true) return true;
    if (oneUpField.ship !== null) return true;
    if (oneDownField.ship !== null) return true;
  }

  return false;
};

export const checkShipCoordinates = (toCheck) => {
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

export const possibleShots = (coordinates) => ({
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] - 1],
  up: [coordinates[0] + 1, coordinates[1]],
  right: [coordinates[0], coordinates[1] + 1],
});

export const checkNextShot = (markedFields, nextMark) => {
  const markX = nextMark[0];
  const markY = nextMark[1];
  const nextMarkStr = `${markX},${markY}`;

  const isInsideX = markX >= 0 && markX <= 9;
  const isInsideY = markY >= 0 && markY <= 9;
  const isInside = isInsideX && isInsideY;

  const alreadyMarked = markedFields.has(nextMarkStr);

  return !alreadyMarked && isInside;
};

export const getRandomNextShot = (markedFields) => {
  let randomShot = getRandomCoordinates();
  while (!checkNextShot(markedFields, randomShot)) {
    randomShot = getRandomCoordinates();
  }
  return randomShot;
};
