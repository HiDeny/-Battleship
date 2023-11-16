import PubSub from './pubsub';

const createBoardField = (coordinates) => {
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
    },
    get offset() {
      return offset;
    },
    set offset(value) {
      offset = value;
    },

    markField(isOffset = false) {
      if (mark !== null && !isOffset) throw new Error(`Already marked!`);

      mark = ship ? 'hit' : 'miss';
      PubSub.publish('field-mark', coordinates, mark);

      if (ship) {
        ship.hit();

        if (ship.isSunk()) {
          ship.offset.forEach((field) => field.markField(true));
          PubSub.publish('game-ships-check');
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

export default createBoardField;
