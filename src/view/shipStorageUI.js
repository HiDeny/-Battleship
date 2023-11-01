import { handleDragStart, handleDragEnd, getFields } from './drag-and-drop';

const handleClickShipRotate = (event) => {
  const { direction, row, column, length } = event.target.dataset;
  const isVertical = direction === 'vertical';
  const newDir = isVertical ? 'horizontal' : 'vertical';

  const fieldsToClear = getFields(row, column, length, direction);
  const fieldsToPopulate = getFields(row, column, length, newDir);
  let allAvailable = true;

  if (fieldsToPopulate.length > Number(length) * 3) {
    fieldsToPopulate.forEach((div) => {
      const oldRow = Number(div.dataset.row);
      const oldColumn = Number(div.dataset.column);
      const isSame = oldRow === Number(row) && oldColumn === Number(column);

      const { ship, offset } = div.dataset;
      if (ship === 'true' && !isSame) allAvailable = false;
    });

    if (allAvailable) {
      event.target.dataset.direction = newDir;
      fieldsToClear.forEach((div) => (div.dataset.ship = false));
      fieldsToPopulate.forEach((div) => (div.dataset.ship = true));
    }
  }
};

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  const dir = Math.random() < 0.5 ? 'vertical' : 'horizontal';

  shipContainer.classList.add('ship');
  shipContainer.classList.add(`${type}`);
  shipContainer.dataset.length = length;
  shipContainer.dataset.direction = dir;
  shipContainer.dataset.row = null;
  shipContainer.dataset.column = null;

  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', handleDragStart);
  shipContainer.addEventListener('dragend', handleDragEnd);
  shipContainer.addEventListener('click', handleClickShipRotate);

  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.classList.add('ship-block');
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
    let occupied = shipsOnBoard.has(coordinatesString);
    let isOutOfBoardRow = newRow + (length - 1) > 9;
    let isOutOfBoardColumn = newColumn + (length - 1) > 9;
    let availableFields = [];
    let keepGoing = true;

    while (keepGoing) {
      while (occupied || isOutOfBoardRow || isOutOfBoardColumn) {
        newRow = Math.floor(Math.random() * 10);
        newColumn = Math.floor(Math.random() * 10);
        coordinatesString = `${newRow},${newColumn}`;

        occupied = shipsOnBoard.has(coordinatesString);
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
        !occupied &&
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

        occupied = shipsOnBoard.has(coordinatesString);
        isOutOfBoardRow = newRow + (length - 1) > 9;
        isOutOfBoardColumn = newColumn + (length - 1) > 9;
        availableFields = [];
      }
    }

    const selector = `div[data-row='${newRow}'][data-column='${newColumn}']`;
    const newField = boardUI.querySelector(selector);
    shipsOnBoard.add(coordinatesString);
    newShip.dataset.row = newRow;
    newShip.dataset.column = newColumn;
    newField.append(newShip);
  });
};

export default renderShipStorage;
