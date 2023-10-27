export const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;

  return [randomRow, randomColumn, isVertical];
};

export const checkCoordinates = (toCheck) => {
  const { coordinates, board, shipLength } = toCheck;
  const [row, column, isVertical] = coordinates;

  const dynamicDir = isVertical ? Number(row) : Number(column);

  if (row > 9 || column > 9 || dynamicDir + shipLength - 1 > 9) {
    return false;
  }

  if (dynamicDir - 1 > -1) {
    const oneBefore = isVertical
      ? board[dynamicDir - 1][column]
      : board[row][dynamicDir - 1];

    if (oneBefore.ship !== null || oneBefore.offset === true) {
      return false;
    }
  }

  const dynamicPlusBoat = dynamicDir + shipLength;
  if (dynamicPlusBoat < 10) {
    const oneAfter = isVertical
      ? board[dynamicPlusBoat][column]
      : board[row][dynamicPlusBoat];

    if (oneAfter.ship !== null || oneAfter.offset === true) {
      return false;
    }
  }

  const start = dynamicDir - 1 >= 0 ? dynamicDir - 1 : dynamicDir;
  for (let i = start; i < dynamicDir + shipLength; i += 1) {
    let currentField = board[row][i];
    let oneUpField = row + 1 <= 9 ? board[row + 1][i] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][i] : false;

    if (isVertical === true) {
      currentField = board[i][column];
      oneUpField = column + 1 <= 8 ? board[i][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[i][column - 1] : false;
    }

    if (currentField.ship !== null) return false;
    if (oneUpField.ship !== null || oneDownField.offset === true) {
      return false;
    }
    if (oneDownField.ship !== null || oneDownField.offset === true) {
      return false;
    }
  }

  return true;
};
