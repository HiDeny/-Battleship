/* eslint-disable no-param-reassign */

import { handleDragStart, handleDragEnd } from '../controller/drag-and-drop';
import {
  clearFields,
  getFields,
  getRandomEmptyFields,
  populateFields,
  isAvailableFields,
  updateFieldsShip,
} from './fieldsHelper';

const noRotateAnimation = (div) => {
  div.classList.add('no-rotate');
  setTimeout(() => {
    div.classList.remove('no-rotate');
  }, 700);
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

  let allAvailable = true;

  if (newFieldsCore.length !== Number(length) || newFieldsCore.includes(null)) {
    noRotateAnimation(target);
    return;
  }

  // Remove ship from current fields to not mess with the check
  updateFieldsShip(currentFieldsCore, 'false');
  allAvailable = isAvailableFields(newFieldsCore, newFieldsOffset);

  if (!allAvailable) {
    updateFieldsShip(currentFieldsCore, 'true');
    noRotateAnimation(target);
    return;
  }

  clearFields(currentFields);
  populateFields(newFields);
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

const renderShips = (shipStorage, boardUI) => {
  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    const { fields, row, column } = getRandomEmptyFields(newShip, boardUI);

    newShip.dataset.row = row;
    newShip.dataset.column = column;

    const baseField = fields.coreFields.find(
      ({ dataset }) =>
        Number(dataset.row) === row && Number(dataset.column) === column
    );

    baseField.append(newShip);
    populateFields(fields);
  });
};

export default renderShips;
