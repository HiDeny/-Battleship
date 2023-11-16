import PubSub from '../modules/pubsub';
import './style/hud.css';

const switchHudInfo = () => {
  document.querySelector('.hud-manual').classList.toggle('hide');
  document.querySelector('.hud-stage-container').classList.toggle('hide');

  const isCelebrating = document.querySelector('.celebration');
  if (isCelebrating) isCelebrating.classList.remove('celebration');
};

const crateStartButton = () => {
  const button = document.createElement('button');
  let stage = 'Start';

  button.textContent = stage;
  button.classList.add('startBtn');
  button.classList.add('buttonStyle1');
  button.addEventListener('click', () => {
    button.disabled = true;
    PubSub.publish('game-status', stage);
    if (stage === 'Start') {
      stage = 'Restart';
      switchHudInfo();
    } else {
      stage = 'Start';
    }

    setTimeout(() => {
      button.disabled = false;
    }, 600);
    button.textContent = stage;
  });

  return button;
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
  container.classList.add('hud-stage-container');
  container.classList.add('hide');

  const currentStage = document.createElement('h3');
  currentStage.classList.add('hud-stage-text');
  currentStage.textContent = 'Setup Ships';

  PubSub.subscribe('game-turn', (player) => {
    currentStage.textContent = `${player.name}'s turn!`;
  });

  PubSub.subscribe('game-status', (phase, result) => {
    if (phase === 'Game Over') {
      currentStage.classList.add('celebration');
      currentStage.textContent = result.toUpperCase();
    }
  });

  container.append(currentStage);
  return container;
};

const createManual = () => {
  const container = document.createElement('div');
  container.classList.add('hud-manual');

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
