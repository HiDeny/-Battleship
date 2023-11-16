import {
  clearFields,
  getFields,
  isAvailableFields,
  populateFields,
  updateFieldsShip,
} from '../view/fieldsHelper';

export const handleDragStart = ({ target }) => {
  target.classList.add('dragging');

  const { length, direction, row, column } = target.dataset;
  const occupiedFields = getFields(row, column, length, direction);

  clearFields(occupiedFields);
  occupiedFields.coreFields.forEach((div) => div.classList.add('draggedFrom'));
};

const clearGuides = () => {
  const availableShip = document.querySelectorAll('.available-ship');
  const availableOffset = document.querySelectorAll('.available-offset');
  const notAvailable = document.querySelectorAll('.not-available');

  availableShip.forEach((div) => div.classList.remove('available-ship'));
  availableOffset.forEach((div) => div.classList.remove('available-offset'));
  notAvailable.forEach((div) => div.classList.remove('not-available'));
};

export const handleDragEnd = ({ target }) => {
  const draggedFrom = document.querySelectorAll('.draggedFrom');

  const { row, column } = target.dataset;
  const oldX = Number(draggedFrom[0].dataset.row);
  const oldY = Number(draggedFrom[0].dataset.column);
  const isSame = oldX === Number(row) && oldY === Number(column);

  if (isSame) updateFieldsShip(draggedFrom, 'true');

  draggedFrom.forEach((div) => div.classList.remove('draggedFrom'));
  target.classList.remove('dragging');
  clearGuides();
};

export const handleDragLeave = (event) => {
  event.preventDefault();
  clearGuides();
};

export const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;

  const newFields = getFields(row, column, length, direction);
  const { coreFields, offsetFields } = newFields;
  let allAvailable = true;

  if (coreFields.length !== Number(length) || coreFields.includes(null)) return;

  allAvailable = isAvailableFields(coreFields, offsetFields);

  if (allAvailable) {
    event.target.append(dragged);
    dragged.dataset.row = row;
    dragged.dataset.column = column;

    populateFields(newFields);
  }
};

export const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;

  const { row, column } = event.target.dataset;
  const currentFields = getFields(row, column, length, direction);
  const { coreFields, offsetFields } = currentFields;

  offsetFields.forEach((div) => {
    if (!div) return;
    const { ship } = div.dataset;
    const style = ship === 'true' ? 'not-available' : 'available-offset';

    div.classList.add(style);
  });

  if (coreFields.length !== Number(length) || coreFields.includes(null)) {
    coreFields.forEach((div) => {
      if (!div) return;
      div.classList.add('not-available');
    });
    return;
  }

  coreFields.forEach((div) => {
    let correctClass = 'available-ship';
    const { ship, offset } = div.dataset;

    if (ship === 'true' || offset === 'true') correctClass = 'not-available';
    div.classList.add(correctClass);
  });
};
