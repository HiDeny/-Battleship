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

const crateStartButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Start';
  button.classList.add('startBtn');
  button.addEventListener('click', handleClickStart);

  return button;
};

const createRoundsUI = () => {
  const container = document.createElement('div');
  container.classList.add('hud-round-container');

  const name = document.createElement('p');
  name.textContent = 'Round: ';
  name.classList.add('hud-round-name');

  const round = document.createElement('h2');
  round.textContent = 0;
  round.classList.add('hud-round');

  PubSub.subscribe('game-round', (currentRound) => {
    round.textContent = currentRound;
  });

  container.append(name, round);

  return container;
};

const createResultUI = () => {
  const result = document.createElement('div');
  result.classList.add('hud-result');

  const coordinatesDisplay = document.createElement('p');
  coordinatesDisplay.classList.add('hud-position');
  coordinatesDisplay.textContent = 'Coordinates';

  const shotResult = document.createElement('p');
  shotResult.classList.add('hud-shotResult');
  shotResult.textContent = 'Shot Result';

  result.append(coordinatesDisplay);
  result.append(shotResult);

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    coordinatesDisplay.textContent = `Row: ${coordinates[0]} , Column: ${coordinates[1]}`;
    shotResult.textContent = `${mark.toUpperCase()}!`;
  });

  return result;
};

const crateHud = () => {
  const hud = document.createElement('div');
  hud.classList.add('hud');

  const startButton = crateStartButton();
  const rounds = createRoundsUI();
  const result = createResultUI();

  hud.append(startButton, result, rounds);

  return hud;
};

export default crateHud;
