const createShip = (length) => {
  let hits = 0;

  return {
    length,
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
