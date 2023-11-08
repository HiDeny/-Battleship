import PubSub from '../modules/pubsub';

const crateStartButton = () => {
  const button = document.createElement('button');
  let stage = 'Start';

  button.textContent = stage;
  button.classList.add('startBtn');
  button.addEventListener('click', () => {
    PubSub.publish('game-status', stage);
    stage = stage === 'Start' ? 'Restart' : 'Start';
    button.textContent = stage;
  });

  return button;
};

const createShipsLeftUI = () => {
  const shipsLeft = document.createElement('p');
  shipsLeft.classList.add('ships-left');
  shipsLeft.textContent = `Active Ships: 0`;

  return shipsLeft;
};

const createRoundUI = () => {
  const round = document.createElement('p');
  round.classList.add('hud-round');
  round.textContent = `Round: 0`;

  PubSub.subscribe('game-round', (currentRound) => {
    round.textContent = `Round: ${currentRound}`;
  });

  return round;
};

const createStageUI = () => {
  const container = document.createElement('div');
  container.classList.add('hud-stage');

  const shipsLeftP1 = createShipsLeftUI();

  const currentStage = document.createElement('h3');
  currentStage.classList.add('hud-stage');
  currentStage.textContent = 'Setup Ships';

  const shipsLeftP2 = createShipsLeftUI();

  PubSub.subscribe('ships-left', (arr) => {
    const [shipsP1, shipsP2] = arr;
    shipsLeftP1.textContent = `Active Ships: ${shipsP1}`;
    shipsLeftP2.textContent = `Active Ships: ${shipsP2}`;
  });

  PubSub.subscribe('game-status', (phase) => {
    currentStage.textContent = phase;
  });

  PubSub.subscribe('game-turn', (player) => {
    currentStage.textContent = `${player.name}'s turn!`;
  });

  container.append(shipsLeftP1, currentStage, shipsLeftP2);
  return container;
};

const createManual = () => {
  const container = document.createElement('div');
  container.classList.add('hud-manual');
  container.classList.add('hide');

  const title = document.createElement('h3');
  title.textContent = 'ORGANIZE YOUR SHIPS';

  const rotateHint = document.createElement('p');
  rotateHint.textContent = 'Click to rotate';

  const dragHint = document.createElement('p');
  dragHint.textContent = 'Drag to move';

  container.append(title, rotateHint, dragHint);

  return container;
};

const crateHud = () => {
  const hud = document.createElement('div');
  hud.classList.add('hud');

  const startButton = crateStartButton();
  const gameStage = createStageUI();
  const manual = createManual();
  const round = createRoundUI();

  hud.append(startButton, manual, gameStage, round);

  return hud;
};

export default crateHud;
