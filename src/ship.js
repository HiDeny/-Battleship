const createShip = (length) => {
  let health = length;

  return {
    length,
    get health() {
      if (health < 1) return this.isSunk();
      return health;
    },
    isSunk() {
      if (health < 1) return 'Ship sunk!';
      return health;
    },
    hit() {
      health -= 1;
      return 'Got hit';
    },
  };
};

export default createShip;
