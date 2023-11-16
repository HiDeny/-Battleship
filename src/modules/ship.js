const createShip = (length, shipType) => {
  const type = shipType;
  const offset = [];
  let hits = 0;

  return {
    type,
    length,
    offset,
    get health() {
      return length - hits;
    },
    isSunk() {
      return this.health < 1;
    },
    hit() {
      hits += 1;
    },
  };
};

const createShipStorage = () => ({
  AircraftCarrier: createShip(5, 'AircraftCarrier'),
  Battleship: createShip(4, 'Battleship'),
  Cruiser: createShip(3, 'Cruiser'),
  Destroyer1: createShip(2, 'Destroyer1'),
  Destroyer2: createShip(2, 'Destroyer2'),
  Submarine1: createShip(1, 'Submarine1'),
  Submarine2: createShip(1, 'Submarine2'),
});

export default createShipStorage;
