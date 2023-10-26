import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

let beingDragged;

const handleDragStart = (event) => {
  console.log(event.target.field);
  beingDragged = event.target;
  event.target.classList.add('dragging');
};

const handleDragEnd = (event) => {
  console.log(event.target);
  event.target.classList.remove('dragging');
};

const handleDragOver = (event) => {
  event.preventDefault();
  const { length } = beingDragged.dataset;
  const { row, column } = event.target.dataset;

  event.target.classList.add('draggingOver');
};

const handleDragLeave = (event) => {
  event.preventDefault();
  event.target.classList.remove('draggingOver');
};

const handleDragDrop = (event) => {
  event.preventDefault();
  event.target.classList.remove('draggingOver');

  const { length } = beingDragged.dataset;
  const { row, column } = event.target.dataset;

  PubSub.publish('field-ship-drag', {
    length,
    coordinates: [row, column, true],
  });
};

const createFieldUI = (field) => {
  const fieldButton = document.createElement('button');
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;

  fieldButton.onclick = handleClickField;
  fieldButton.addEventListener('dragover', handleDragOver);
  fieldButton.addEventListener('dragleave', handleDragLeave);
  fieldButton.addEventListener('drop', handleDragDrop);

  // Need Fix
  PubSub.subscribe('field-ship', (coordinates) => {
    if (coordinates === field.coordinates) {
      fieldButton.classList.add('ship');
      fieldButton.draggable = true;
      fieldButton.addEventListener('dragstart', handleDragStart);
      fieldButton.addEventListener('dragend', handleDragEnd);
    }
  });

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  return fieldButton;
};

const renderBoardUI = (board) => {
  const boardUI = document.createElement('div');
  boardUI.classList.add('gameboard-board');

  board.forEach((row) => {
    row.forEach((field) => {
      const fieldUI = createFieldUI(field);
      boardUI.append(fieldUI);
    });
  });

  return boardUI;
};

const handleClickRotateButton = ({ target }) => {
  target.dataset;
};

const rotateShipButton = () => {
  const rotateButton = document.createElement('button');
  rotateButton.classList.add('rotateShip');

  let isVertical = true;
  rotateButton.textContent = isVertical
    ? 'Rotate Horizontal'
    : 'Rotate Vertical';

  rotateButton.addEventListener('click', () => {
    isVertical = !isVertical;
    rotateButton.dataset.isVertical = isVertical;
  });

  return;
};

const renderShipStorageUI = (shipStorage) => {
  const storage = document.createElement('div');
  storage.classList.add('board-ships');

  Object.keys(shipStorage).forEach((type) => {
    const currentShipType = shipStorage[type];
    const { shipLength } = currentShipType;

    for (let j = 0; j < currentShipType.quantity; j += 1) {
      const shipContainer = document.createElement('div');
      shipContainer.classList.add(`ship-storage`);

      shipContainer.dataset.length = shipLength;
      shipContainer.draggable = true;

      shipContainer.addEventListener('dragstart', handleDragStart);
      shipContainer.addEventListener('dragend', handleDragEnd);

      for (let i = 0; i < shipLength; i += 1) {
        const shipBlock = document.createElement('div');
        shipBlock.classList.add('ship-block');
        shipContainer.append(shipBlock);
      }
      storage.append(shipContainer);
    }
  });

  return storage;
};

const renderPlayerGameboard = (player, isEnemy = false) => {
  const { name, storedShips, gameboard } = player;
  const gameboardUI = document.createElement('div');
  const playerClass = isEnemy ? 'enemyBoard' : 'userBoard';

  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  const boardUI = renderBoardUI(gameboard.board);
  gameboardUI.append(boardUI);
  // if (!isEnemy) boardUI.style['pointer-events'] = 'none';

  if (!isEnemy) {
    const shipsUI = renderShipStorageUI(storedShips);
    gameboardUI.append(shipsUI);
  }

  return gameboardUI;
};

export default renderPlayerGameboard;
