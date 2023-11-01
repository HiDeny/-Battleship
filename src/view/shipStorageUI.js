import { handleDragStart, handleDragEnd } from './drag-and-drop';

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  const dir = Math.random() < 0.5 ? 'vertical' : 'horizontal';

  shipContainer.classList.add(`${type}`);
  shipContainer.classList.add('ship');
  shipContainer.dataset.length = length;
  shipContainer.dataset.direction = dir;
  shipContainer.dataset.row = null;
  shipContainer.dataset.column = null;

  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', handleDragStart);
  shipContainer.addEventListener('dragend', handleDragEnd);
  shipContainer.addEventListener('click', () => {
    const { direction, row, column } = shipContainer.dataset;
    const isVertical = direction === 'vertical';
    const addShip = isVertical ? Number(column) : Number(row);
    const removeShip = isVertical ? Number(row) : Number(column);
    const shipEnd = addShip + Number(length - 1);
    const fieldsToClear = [];
    const fieldsToPopulate = [];

    if (row && column && shipEnd <= 9 && shipEnd >= 0) {
      for (
        let i = removeShip + 1;
        i <= removeShip + Number(length - 1);
        i += 1
      ) {
        const rowDir = isVertical ? i : Number(row);
        const columnDir = isVertical ? Number(column) : i;
        const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
        const element = document.querySelector(selector);
        fieldsToClear.push(element);
      }

      for (let i = addShip + 1; i <= addShip + Number(length - 1); i += 1) {
        const rowDir = isVertical ? Number(row) : i;
        const columnDir = isVertical ? i : Number(column);
        const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
        const element = document.querySelector(selector);
        const { ship, offset } = element.dataset;
        if (ship !== 'true') fieldsToPopulate.push(element);
      }
    }

    if (fieldsToPopulate.length === Number(length - 1)) {
      shipContainer.dataset.direction =
        direction === 'vertical' ? 'horizontal' : 'vertical';
      fieldsToClear.forEach((element) => (element.dataset.ship = false));
      fieldsToPopulate.forEach((element) => (element.dataset.ship = true));
    }
  });

  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.classList.add('ship-block');
    shipBlock.draggable = false;
    shipContainer.append(shipBlock);
  }

  return shipContainer;
};

const renderShipStorage = (shipStorage, boardUI) => {
  const shipsOnBoard = new Set();

  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    const { length, direction } = newShip.dataset;
    const isVertical = direction === 'vertical';

    let newRow = Math.floor(Math.random() * 10);
    let newColumn = Math.floor(Math.random() * 10);
    let coordinatesString = `${newRow},${newColumn}`;
    let isOnBoard = shipsOnBoard.has(coordinatesString);
    let isOutOfBoardRow = newRow + (length - 1) > 9;
    let isOutOfBoardColumn = newColumn + (length - 1) > 9;
    let availableFields = [];
    let keepGoing = true;

    // Check other fields if they are occupied
    // While occupied, get new location
    while (keepGoing) {
      while (isOnBoard || isOutOfBoardRow || isOutOfBoardColumn) {
        newRow = Math.floor(Math.random() * 10);
        newColumn = Math.floor(Math.random() * 10);
        coordinatesString = `${newRow},${newColumn}`;

        isOnBoard = shipsOnBoard.has(coordinatesString);
        isOutOfBoardRow = newRow + (length - 1) > 9;
        isOutOfBoardColumn = newColumn + (length - 1) > 9;
      }

      const dynamicDir = isVertical ? Number(newRow) : Number(newColumn);
      const shipEnd = dynamicDir + Number(length - 1);

      for (let i = dynamicDir; i <= shipEnd; i += 1) {
        const rowDir = isVertical ? i : Number(newRow);
        const columnDir = isVertical ? Number(newColumn) : i;
        const fieldToCheck = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
        const currentField = boardUI.querySelector(fieldToCheck);
        const { ship, offset } = currentField.dataset;
        if (ship !== 'true') availableFields.push(currentField);
      }

      if (
        !isOnBoard &&
        !isOutOfBoardRow &&
        !isOutOfBoardColumn &&
        availableFields.length === Number(length)
      ) {
        availableFields.forEach((currentField) => {
          currentField.dataset.ship = 'true';
        });
        availableFields = [];
        keepGoing = false;
      } else {
        newRow = Math.floor(Math.random() * 10);
        newColumn = Math.floor(Math.random() * 10);
        coordinatesString = `${newRow},${newColumn}`;

        isOnBoard = shipsOnBoard.has(coordinatesString);
        isOutOfBoardRow = newRow + (length - 1) > 9;
        isOutOfBoardColumn = newColumn + (length - 1) > 9;
        availableFields = [];
      }
    }

    const selector = `div[data-row='${newRow}'][data-column='${newColumn}']`;
    const newField = boardUI.querySelector(selector);
    newShip.dataset.row = newRow;
    newShip.dataset.column = newColumn;
    newField.append(newShip);
  });
};

export default renderShipStorage;
