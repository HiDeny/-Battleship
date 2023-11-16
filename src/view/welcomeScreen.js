import PubSub from '../modules/pubsub';
import './style/welcome.css';

const submitNames = () => {
  const inputP1 = document.querySelector(`input[data-player='Player 1']`);
  const inputP2 = document.querySelector(`input[data-player='Player 2']`);

  const name1 = inputP1.value || 'Player 1';
  const name2 = inputP2 ? inputP2.value || 'Player2' : false;

  PubSub.publish('game-setup', [name1, name2]);
  document.querySelector('.welcome-container').remove();
};

const handleKeyPressEnter = ({ key }) => {
  if (key === 'Enter') {
    submitNames();
    document.removeEventListener('keypress', handleKeyPressEnter);
  }
};

// Select Name
const createNameInput = (player) => {
  const container = document.createElement('div');
  container.classList.add('welcome-name-container');

  const label = document.createElement('label');
  label.setAttribute('for', 'name');
  label.textContent = player;

  const input = document.createElement('input');
  input.classList.add('welcome-name-input');
  input.type = 'text';
  input.name = 'name';
  input.autocomplete = false;
  input.placeholder = 'NAME';
  input.dataset.player = player;

  label.append(input);
  container.append(label);
  return container;
};

const createStartButton = () => {
  const button = document.createElement('button');
  button.classList.add('welcome-start-button');
  button.classList.add('buttonStyle1');
  button.textContent = 'START';

  return button;
};

const createNameSelect = (twoPlayers = false) => {
  const container = document.createElement('div');
  container.classList.add('welcome-name-select');

  const nameP1 = createNameInput('Player 1');
  container.append(nameP1);

  let nameP2 = false;
  if (twoPlayers) {
    nameP2 = createNameInput('Player 2');
    container.append(nameP2);
  }

  const startButton = createStartButton();
  startButton.onclick = submitNames;
  container.append(startButton);

  document.addEventListener('keypress', handleKeyPressEnter);

  return container;
};

const createModeButton = (content) => {
  const button = document.createElement('button');
  button.classList.add('welcome-mode-btn');
  button.classList.add('buttonStyle1');
  button.textContent = content;

  return button;
};

const createModeSelect = () => {
  // Player vs Player || Player vs Computer
  const container = document.createElement('div');
  container.classList.add('welcome-mode');

  const pve = createModeButton('Player VS Computer');
  pve.addEventListener('click', () => {
    container.replaceWith(createNameSelect());
  });

  const pvp = createModeButton('Player VS Player');
  // Two players update
  pvp.disabled = true;
  pvp.addEventListener('click', () => {
    container.replaceWith(createNameSelect(true));
  });

  container.append(pve, pvp);

  return container;
};

const createWelcomeScreen = () => {
  const container = document.createElement('div');
  container.classList.add('welcome-container');

  // Title
  const title = document.createElement('h1');
  title.classList.add('welcome-title');
  title.textContent = 'BATTLESHIP';

  const mode = createModeSelect();

  container.append(title, mode);
  return container;
};

export default createWelcomeScreen;
