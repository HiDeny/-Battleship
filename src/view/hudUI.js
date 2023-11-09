import PubSub from '../modules/pubsub';

const switchHudInfo = () => {
  document.querySelector('.hud-manual').classList.toggle('hide');
  document.querySelector('.hud-stage-container').classList.toggle('hide');
  document.querySelector('.celebration').classList.remove('celebration');
};

const crateStartButton = () => {
  const button = document.createElement('button');
  let stage = 'Start';

  button.textContent = stage;
  button.classList.add('startBtn');
  button.classList.add('buttonStyle1');
  button.addEventListener('click', () => {
    PubSub.publish('game-status', stage);
    stage = stage === 'Start' ? 'Restart' : 'Start';
    button.textContent = stage;
    switchHudInfo();
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
  container.classList.add('hud-stage-container');
  container.classList.add('hide');

  let currentShips1 = 0;
  const shipsLeftP1 = createShipsLeftUI();

  const currentStage = document.createElement('h3');
  currentStage.classList.add('hud-stage-text');
  currentStage.textContent = 'Setup Ships';

  let currentShips2 = 0;
  const shipsLeftP2 = createShipsLeftUI();

  PubSub.subscribe('ships-left', (arr) => {
    const [shipsP1, shipsP2] = arr;
    if (shipsP1 !== currentShips1) {
      shipsLeftP1.textContent = `Active Ships: ${shipsP1}`;
      shipsLeftP1.classList.add('alert');
      currentShips1 = shipsP1;

      setTimeout(() => {
        shipsLeftP1.classList.remove('alert');
      }, 700);
    }

    if (shipsP2 !== currentShips2) {
      shipsLeftP2.textContent = `Active Ships: ${shipsP2}`;
      shipsLeftP2.classList.add('alert');
      currentShips2 = shipsP2;

      setTimeout(() => {
        shipsLeftP2.classList.remove('alert');
      }, 1000);
    }
  });

  PubSub.subscribe('game-turn', (player) => {
    currentStage.textContent = `${player.name}'s turn!`;
  });

  PubSub.subscribe('game-status', (phase, result) => {
    if (phase === 'Game Over') {
      currentStage.classList.add('celebration');
      currentStage.textContent = result.toUpperCase();
    }
  });

  container.append(shipsLeftP1, currentStage, shipsLeftP2);
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
