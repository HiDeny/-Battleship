const getFields = (row, column, length, direction) => {
  const isVertical = direction === 'vertical';

  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);
  const availableFields = [];

  for (let i = dynamicDir; i <= shipEnd; i += 1) {
    const rowDir = isVertical ? i : Number(row);
    const columnDir = isVertical ? Number(column) : i;
    const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    const element = document.querySelector(selector);
    availableFields.push(element);
  }

  return availableFields;
};

export const handleDragStart = (event) => {
  event.target.classList.add('dragging');

  const { length, direction, row, column } = event.target.dataset;

  const occupiedFields = getFields(row, column, length, direction);
  occupiedFields.forEach((div) => {
    div.classList.add('draggedFrom');
    div.dataset.ship = false;
  });
};

export const handleDragEnd = (event) => {
  const draggedFrom = document.querySelectorAll('.draggedFrom');
  const available = document.querySelectorAll('.available');
  const notAvailable = document.querySelectorAll('.not-available');

  const oldX = Number(draggedFrom[0].dataset.row);
  const oldY = Number(draggedFrom[0].dataset.column);
  const { row, column } = event.target.dataset;
  const isSame = oldX === Number(row) && oldY === Number(column);

  draggedFrom.forEach((div) => {
    if (isSame) div.dataset.ship = true;
    div.classList.remove('draggedFrom');
  });

  available.forEach((div) => div.classList.remove('available'));
  notAvailable.forEach((div) => div.classList.remove('not-available'));
  event.target.classList.remove('dragging');
};

export const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const [type] = dragged.classList;
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;
  // const isVertical = direction === 'vertical';

  // const dynamicDir = isVertical ? Number(row) : Number(column);
  // const shipEnd = dynamicDir + Number(length - 1);
  // const coordinates = [Number(row), Number(column), isVertical];
  const availableFields = getFields(row, column, length, direction);
  let allAvailable = true;
  availableFields.forEach((div) => {
    const { ship, offset } = div.dataset;
    if (ship === 'true') allAvailable = false;
  });

  // if (shipEnd <= 9 && shipEnd >= 0) {
  //   for (let i = dynamicDir; i <= shipEnd; i += 1) {
  //     const rowDir = isVertical ? i : Number(row);
  //     const columnDir = isVertical ? Number(column) : i;
  //     const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
  //     const element = document.querySelector(selector);
  //     const { ship, offset } = element.dataset;
  //     if (ship !== 'true') availableFields.push(element);
  //   }
  // }

  if (allAvailable) {
    event.target.append(dragged);
    dragged.dataset.row = row;
    dragged.dataset.column = column;
    availableFields.forEach((div) => {
      div.dataset.ship = true;
    });

    // PubSub.publish('field-ship-drag', type, coordinates);
    // dragged.remove();
  }
};

export const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const availableFields = getFields(row, column, length, direction);
  availableFields.forEach((div) => {
    const { ship, offset } = div.dataset;
    const isAvailable = ship === 'true' ? 'not-available' : 'available';
    div.classList.add(isAvailable);
  });

  // const isVertical = direction === 'vertical';
  // const dynamicDir = isVertical ? Number(row) : Number(column);
  // const shipEnd = dynamicDir + Number(length - 1);

  // if (shipEnd <= 9 && shipEnd >= 0) {
  //   for (let i = dynamicDir; i <= shipEnd; i += 1) {
  //     const rowDir = isVertical ? i : row;
  //     const columnDir = isVertical ? column : i;
  //     const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
  //     const element = document.querySelector(selector);
  //     const { ship, offset } = element.dataset;

  //     if (ship !== 'true' && !offset) {
  //       element.classList.add('available');
  //     } else {
  //       element.classList.add('not-available');
  //     }
  //   }
  // }
};

export const handleDragLeave = (event) => {
  event.preventDefault();
  const available = document.querySelectorAll('.available');
  const notAvailable = document.querySelectorAll('.not-available');

  available.forEach((element) => {
    element.classList.remove('available');
  });
  notAvailable.forEach((element) => {
    element.classList.remove('not-available');
  });
};
