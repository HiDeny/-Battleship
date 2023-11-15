import PubSub from './pubsub';

export const field = (coordinates) => {
  let mark = null;
  let ship = null;
  let offset = null;

  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      if (ship !== null) throw new Error('Field Occupied!');
      ship = newShip;
      PubSub.publish('field-ship', coordinates, newShip.type);
    },
    get offset() {
      return offset;
    },
    set offset(value) {
      offset = value;
      PubSub.publish('field-ship-offset', coordinates);
    },

    markField(isOffset = false) {
      if (mark !== null && !isOffset) throw new Error(`Already marked!`);

      mark = ship ? 'hit' : 'miss';
      PubSub.publish('field-mark', coordinates, mark);

      if (ship) {
        ship.hit();

        if (ship.isSunk()) {
          PubSub.publish('game-ships-check');
          // Move this to board
          ship.offset.forEach((offsetField) => offsetField.markField(true));
          return ['ship sunk', ship];
        }
      }

      return mark;
    },
    get mark() {
      return mark;
    },
  };
};

// Fix offset + 1 - 1
const offsetFront = (board, newShip, coordinates) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? row : column;

  if (dynamicDir - 1 > -1) {
    let oneBefore = board[row][dynamicDir - 1];
    let oneUpField = row + 1 <= 9 ? board[row + 1][dynamicDir - 1] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][dynamicDir - 1] : false;

    if (isVertical === true) {
      oneBefore = board[dynamicDir - 1][column];
      oneUpField = column + 1 <= 9 ? board[dynamicDir - 1][column + 1] : false;
      oneDownField =
        column - 1 >= 0 ? board[dynamicDir - 1][column - 1] : false;
    }

    oneBefore.offset = true;
    newShip.offset.push(oneBefore);

    if (oneUpField) {
      oneUpField.offset = true;
      newShip.offset.push(oneUpField);
    }

    if (oneDownField) {
      oneDownField.offset = true;
      newShip.offset.push(oneDownField);
    }
  }
};

// Fix offset + 1 - 1
const offsetBack = (board, newShip, coordinates) => {
  const [row, column, isVertical] = coordinates;
  const { length } = newShip;

  const dynamicDir = isVertical ? row : column;
  const dynamicPlusShip = dynamicDir + length;

  if (dynamicPlusShip < 10) {
    let oneAfter = board[row][dynamicPlusShip];
    let oneUpField = row + 1 <= 9 ? board[row + 1][dynamicPlusShip] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][dynamicPlusShip] : false;

    if (isVertical === true) {
      oneAfter = board[dynamicPlusShip][column];
      oneUpField = column + 1 <= 9 ? board[dynamicPlusShip][column + 1] : false;
      oneDownField =
        column - 1 >= 0 ? board[dynamicPlusShip][column - 1] : false;
    }

    oneAfter.offset = true;
    newShip.offset.push(oneAfter);

    if (oneUpField) {
      oneUpField.offset = true;
      newShip.offset.push(oneUpField);
    }

    if (oneDownField) {
      oneDownField.offset = true;
      newShip.offset.push(oneDownField);
    }
  }
};

export const populateFields = (board, newShip, coordinates) => {
  const [row, column, isVertical] = coordinates;

  const { length } = newShip;

  const dynamicDir = isVertical ? row : column;

  offsetFront(board, newShip, coordinates);
  offsetBack(board, newShip, coordinates);

  for (let i = dynamicDir; i < dynamicDir + length; i += 1) {
    let currentField = board[row][i];
    let oneUpField = row + 1 <= 9 ? board[row + 1][i] : false;
    let oneDownField = row - 1 >= 0 ? board[row - 1][i] : false;

    if (isVertical === true) {
      currentField = board[i][column];
      oneUpField = column + 1 <= 9 ? board[i][column + 1] : false;
      oneDownField = column - 1 >= 0 ? board[i][column - 1] : false;
    }

    currentField.ship = newShip;

    if (oneUpField) {
      oneUpField.offset = true;
      newShip.offset.push(oneUpField);
    }

    if (oneDownField) {
      oneDownField.offset = true;
      newShip.offset.push(oneDownField);
    }
  }
};
