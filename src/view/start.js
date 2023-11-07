import PubSub from '../modules/pubsub';

const handleClickStart = () => {
  const ships = document.querySelectorAll('.ship');

  ships.forEach((ship) => {
    ship.classList.add('ship-set');
    const type = ship.classList[1];
    const { row, column, direction } = ship.dataset;
    const isVertical = direction === 'vertical';
    const coordinates = [Number(row), Number(column), isVertical];
    PubSub.publish('field-ship-drag', type, coordinates);
  });

  PubSub.publish('game-start', true);
};

export const crateStartButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Start';
  button.classList.add('startBtn');
  button.addEventListener('click', handleClickStart);

  return button;
};
