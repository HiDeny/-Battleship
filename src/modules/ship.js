const createShip = (length, shipType) => {
  const type = shipType;
  const coordinates = [];
  const offset = [];
  let hits = 0;

  return {
    length,
    coordinates,
    offset,
    type,
    getHealth() {
      return length - hits;
    },
    isSunk() {
      return length - hits < 1;
    },
    hit() {
      hits += 1;
    },
  };
};

export default createShip;
