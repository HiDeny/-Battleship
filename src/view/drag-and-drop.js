export const getFields = (row, column, length, direction) => {
  const isVertical = direction === 'vertical';

  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);
  const availableFields = [];
  const offsetFields = [];

  const start = dynamicDir - 1 < 0 ? 0 : dynamicDir - 1;
  const end = shipEnd + 1 > 10 ? shipEnd : shipEnd + 1;

  for (let i = start; i <= end; i += 1) {
    const rowDir = isVertical ? i : Number(row);
    const columnDir = isVertical ? Number(column) : i;
    const oneUpRow = isVertical ? rowDir : rowDir + 1;
    const oneDownRow = isVertical ? rowDir : rowDir - 1;
    const oneUpColumn = isVertical ? columnDir + 1 : columnDir;
    const oneDownColumn = isVertical ? columnDir - 1 : columnDir;

    const selectorBase = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    const selectorOneUp = `div[data-row='${oneUpRow}'][data-column='${oneUpColumn}']`;
    const selectorOneDown = `div[data-row='${oneDownRow}'][data-column='${oneDownColumn}']`;
    const elementBase = document.querySelector(selectorBase);
    const elementOneUp = document.querySelector(selectorOneUp);
    const elementOneDown = document.querySelector(selectorOneDown);
    if (elementBase) availableFields.push(elementBase);
    if (elementOneUp) availableFields.push(elementOneUp);
    if (elementOneDown) availableFields.push(elementOneDown);
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

  const newPosition = getFields(row, column, length, direction);
  let allAvailable = true;

  if (newPosition.length > Number(length) * 3) {
    newPosition.forEach((div) => {
      const { ship, offset } = div.dataset;
      if (ship === 'true') allAvailable = false;
    });

    if (allAvailable) {
      event.target.append(dragged);
      dragged.dataset.row = row;
      dragged.dataset.column = column;
      newPosition.forEach((div) => {
        div.dataset.ship = true;
      });
    }
  }
};

export const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const currentFields = getFields(row, column, length, direction);

  if (currentFields.length > Number(length) * 3) {
    currentFields.forEach((div) => {
      const { ship, offset } = div.dataset;
      const isAvailable = ship === 'true' ? 'not-available' : 'available';
      div.classList.add(isAvailable);
    });
  } else {
    currentFields.forEach((div) => {
      div.classList.add('not-available');
    });
  }
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
