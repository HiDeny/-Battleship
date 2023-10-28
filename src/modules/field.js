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
      const { type, boat } = newShip;
      if (ship !== null) throw new Error('Field Occupied!');
      ship = boat;
      PubSub.publish('field-ship', coordinates, type);
    },
    get offset() {
      return offset;
    },
    set offset(value) {
      offset = value;
    },

    markField() {
      if (mark !== null) throw new Error(`Already marked!`);

      if (ship) {
        ship.hit();

        if (ship.isSunk()) {
          // ship.offset.forEach(coordinates.markField());
          console.log('Ship Sunk');
        }
      }
      mark = ship ? 'hit' : 'miss';

      PubSub.publish('field-mark', coordinates, mark);
      return mark;
    },
    get mark() {
      return mark;
    },
  };
};

export const populateFields = (board, newShip, row, column, isVertical) => {
  const { length } = newShip.boat;
  const dynamicDir = isVertical ? row : column;
  const dynamicPlusBoat = dynamicDir + length;

  if (dynamicDir - 1 > -1) {
    const oneBefore = isVertical
      ? board[dynamicDir - 1][column]
      : board[row][dynamicDir - 1];

    oneBefore.offset = true;
    // newShip.offset.push(oneBefore);
  }

  if (dynamicPlusBoat < 10) {
    const oneAfter = isVertical
      ? board[dynamicPlusBoat][column]
      : board[row][dynamicPlusBoat];

    oneAfter.offset = true;
    // newShip.offset.push(oneAfter);
  }

  for (let i = dynamicDir; i < dynamicDir + newShip.boat.length; i += 1) {
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
      // newShip.offset.push(oneUpField);
    }

    if (oneDownField) {
      oneDownField.offset = true;
      // newShip.offset.push(oneDownField);
    }
  }
};
