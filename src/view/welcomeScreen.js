import PubSub from '../modules/pubsub';

// Select Name
const createNameInput = (placeholder) => {
  const label = document.createElement('label');
  label.setAttribute('for', 'name');
  label.textContent = 'Your name';

  const nameInput = document.createElement('input');
  nameInput.classList.add('welcome-name-input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.placeholder = placeholder;

  label.append(nameInput);
  return label;
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
  container.classList.add('welcome-name-container');

  const nameP1 = createNameInput('Player 1');
  container.append(nameP1);

  let nameP2 = false;
  if (twoPlayers) {
    nameP2 = createNameInput('Player 2');
    container.append(nameP2);
  }

  const startButton = createStartButton();
  startButton.addEventListener('click', () => {
    const name1 = nameP1.children[0].value || nameP1.children[0].placeholder;
    let name2 = nameP2;
    if (twoPlayers) {
      name2 = nameP2.children[0].value || nameP2.children[0].placeholder;
    }

    PubSub.publish('game-setup', [name1, name2]);
    document.querySelector('.welcome-container').remove();
  });

  container.append(startButton);

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
