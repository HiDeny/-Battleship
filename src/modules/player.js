import createBoard from './board';
import createShipStorage from './ship';

const createPlayer = (name) => {
  const gameboard = createBoard();
  const shipStorage = createShipStorage();

  return {
    name,
    shipStorage,
    gameboard,
    placeShip(shipType, coordinates) {
      const completeShip = shipStorage[shipType];

      gameboard.placeShip(completeShip, coordinates);
      return completeShip;
    },
    placeShips() {
      const ships = document.querySelectorAll('.ship');

      ships.forEach((ship) => {
        ship.classList.add('ship-set');
        const type = ship.classList[1];
        const { row, column, direction } = ship.dataset;
        const isVertical = direction === 'vertical';
        const coordinates = [Number(row), Number(column), isVertical];
        this.placeShip(type, coordinates);
      });
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    },
  };
};

export default createPlayer;
