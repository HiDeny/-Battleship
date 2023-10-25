import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const createFieldUI = (field) => {
  const fieldButton = document.createElement('button');
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;

  fieldButton.onclick = handleClickField;

  PubSub.subscribe('field-ship', (coordinates) => {
    if (coordinates === field.coordinates) {
      fieldButton.classList.add('ship');
    }
  });

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  return fieldButton;
};

const createRowUI = () => {
  const container = document.createElement('div');
  container.classList.add('row');

  return container;
};

const renderBoardUI = (board) => {
  const container = document.createElement('div');
  container.classList.add('board-container');

  board.forEach((row) => {
    const newRow = createRowUI();
    container.append(newRow);

    row.forEach((field) => {
      const fieldUI = createFieldUI(field);
      newRow.append(fieldUI);
    });
  });

  return container;
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
      shipContainer.classList.add(`length${shipLength}`);
      shipContainer.draggable = true;

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
  const boardUI = renderBoardUI(gameboard.board);
  const shipsUI = renderShipStorageUI(storedShips);
  const playerClass = isEnemy ? 'enemyBoard' : 'userBoard';

  // document.documentElement.style.setProperty
  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);
  if (!isEnemy) boardUI.style['pointer-events'] = 'none';

  gameboardUI.append(boardUI);
  gameboardUI.append(shipsUI);

  return gameboardUI;
};

export default renderPlayerGameboard;
