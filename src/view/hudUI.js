import PubSub from '../modules/pubsub';

const handleClickStart = ({ target }) => {
  target.disabled = true;
  PubSub.publish('game-status', 'Start');
};
const handleClickRestart = ({ target }) => {
  PubSub.publish('game-status', 'Restart');
  target.onclick = handleClickStart;
  target.textContent = 'Start';
};

const crateStartButton = () => {
  const button = document.createElement('button');
  button.textContent = 'Start';
  button.classList.add('startBtn');
  button.onclick = handleClickStart;

  PubSub.subscribe('game-status', (phase) => {
    if (phase === 'Game Over') {
      button.disabled = false;
      button.textContent = 'Restart';
      button.onclick = handleClickRestart;
    }
  });

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

  PubSub.subscribe('game-status', (phase, gameResult) => {
    coordinatesDisplay.textContent = phase;

    if (phase === 'Game Over') {
      shotResult.textContent = `${gameResult.toUpperCase()}!`;
    }
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
