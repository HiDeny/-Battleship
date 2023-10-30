const handleDragStart = (event) => {
  // event.preventDefault();
  event.target.classList.add('dragging');

  const { length, direction, row, column } = event.target.dataset;
  const isVertical = direction === 'vertical';

  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);

  if (row && column && shipEnd <= 9 && shipEnd >= 0) {
    for (let i = dynamicDir; i <= shipEnd; i += 1) {
      const rowDir = isVertical ? i : Number(row);
      const columnDir = isVertical ? Number(column) : i;
      const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
      const element = document.querySelector(selector);
      element.classList.add('draggedFrom');
      element.dataset.ship = false;
    }
  }
};

const handleDragEnd = (event) => {
  const wasOver = document.querySelectorAll('.draggingOver');
  const wasAvailable = document.querySelectorAll('.available');
  const wasNotAvailable = document.querySelectorAll('.not-available');

  wasOver.forEach((element) => element.classList.remove('draggingOver'));
  wasAvailable.forEach((element) => element.classList.remove('available'));
  wasNotAvailable.forEach((element) => {
    element.classList.remove('not-available');
  });

  const draggedFrom = document.querySelectorAll('.draggedFrom');
  if (draggedFrom.length) {
    const oldX = Number(draggedFrom[0].dataset.row);
    const oldY = Number(draggedFrom[0].dataset.column);
    const { row, column } = event.target.dataset;
    const isSame = oldX === Number(row) && oldY === Number(column);

    draggedFrom.forEach((element) => {
      if (isSame) element.dataset.ship = true;
      element.classList.remove('draggedFrom');
    });
  }

  event.target.classList.remove('dragging');
};

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  let lastDir = 'vertical';

  shipContainer.classList.add(`${type}`);
  shipContainer.classList.add('ship');
  shipContainer.dataset.length = length;
  shipContainer.dataset.direction = lastDir;
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

const renderShipStorage = (shipStorage) => {
  const storage = document.createElement('div');
  storage.classList.add('board-ships');

  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    storage.append(newShip);
  });

  return storage;
};

export default renderShipStorage;
