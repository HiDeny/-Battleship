/* eslint-disable no-param-reassign */

import {
  handleDragStart,
  handleDragEnd,
  getFields,
} from '../controller/drag-and-drop';

const noRotateAnimation = (div) => {
  div.classList.add('no-rotate');
  setTimeout(() => {
    div.classList.remove('no-rotate');
  }, 700);
};

const clearFields = (coreFields, offsetFields) => {
  coreFields.forEach((div) => {
    div.dataset.ship = 'false';
  });
  offsetFields.forEach((div) => {
    if (!div) return;
    div.dataset.offset = 'false';
  });
};

const populateFields = (coreFields, offsetFields) => {
  coreFields.forEach((div) => {
    div.dataset.ship = 'true';
  });
  offsetFields.forEach((div) => {
    if (!div) return;
    div.dataset.offset = 'true';
  });
};

const handleClickShipRotate = ({ target }) => {
  const { direction, row, column, length } = target.dataset;
  const isVertical = direction === 'vertical';

  const newDir = isVertical ? 'horizontal' : 'vertical';
  const newFields = getFields(row, column, length, newDir);
  const newFieldsCore = newFields.coreFields;
  const newFieldsOffset = newFields.offsetFields;

  const currentFields = getFields(row, column, length, direction);
  const currentFieldsCore = currentFields.coreFields;
  const currentFieldsOffset = currentFields.offsetFields;

  let allAvailable = true;

  if (newFieldsCore.length !== Number(length) || newFieldsCore.includes(null)) {
    noRotateAnimation(target);
    return;
  }

  // Remove ship from current fields to not mess with the check
  currentFieldsCore.forEach((div) => {
    div.dataset.ship = 'false';
  });

  // Check New fields
  newFieldsCore.forEach((div) => {
    if (!div || div.dataset.ship === 'true') allAvailable = false;
  });

  newFieldsOffset.forEach((div) => {
    if (!div) return;
    if (div.dataset.ship === 'true') allAvailable = false;
  });

  if (!allAvailable) {
    currentFieldsCore.forEach((div) => {
      div.dataset.ship = 'true';
    });

    noRotateAnimation(target);
    return;
  }

  clearFields(currentFieldsCore, currentFieldsOffset);
  populateFields(newFieldsCore, newFieldsOffset);
  target.dataset.direction = newDir;
};

const renderShip = ({ length, type }) => {
  const shipContainer = document.createElement('div');
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

const getRandomEmptyFields = (newShip, boardUI) => {
  const { length, direction } = newShip.dataset;
  let newRow;
  let newColumn;
  let newFields;
  let keepGoing = true;

  while (keepGoing) {
    newRow = Math.floor(Math.random() * 10);
    newColumn = Math.floor(Math.random() * 10);

    while (newRow + (length - 1) > 9 || newColumn + (length - 1) > 9) {
      newRow = Math.floor(Math.random() * 10);
      newColumn = Math.floor(Math.random() * 10);
    }

    newFields = getFields(newRow, newColumn, length, direction, boardUI);
    const { coreFields, offsetFields } = newFields;

    if (coreFields.length === Number(length) && !coreFields.includes(null)) {
      keepGoing = false;

      // eslint-disable-next-line no-loop-func
      coreFields.forEach((div) => {
        const { ship, offset } = div.dataset;
        if (ship === 'true' || offset === 'true') keepGoing = true;
      });

      // eslint-disable-next-line no-loop-func
      offsetFields.forEach((div) => {
        if (!div) return;
        if (div.dataset.ship === 'true') keepGoing = true;
      });
    }
  }

  return { fields: newFields, row: newRow, column: newColumn };
};

const renderShips = (shipStorage, boardUI) => {
  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    const { fields, row, column } = getRandomEmptyFields(newShip, boardUI);

    const { coreFields, offsetFields } = fields;
    newShip.dataset.row = row;
    newShip.dataset.column = column;

    const baseField = coreFields.find(
      (div) =>
        Number(div.dataset.row) === row && Number(div.dataset.column) === column
    );
    baseField.append(newShip);

    populateFields(coreFields, offsetFields);
  });
};

export default renderShips;
