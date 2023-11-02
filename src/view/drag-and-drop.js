export const getFields = (row, column, length, direction, from = document) => {
  const isVertical = direction === 'vertical';

  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);
  const coreFields = [];
  const offsetFields = [];

  if (dynamicDir - 1 > -1) {
    const rowDir = isVertical ? dynamicDir - 1 : Number(row);
    const columnDir = isVertical ? Number(column) : dynamicDir - 1;
    const oneUpRow = isVertical ? rowDir : rowDir + 1;
    const oneDownRow = isVertical ? rowDir : rowDir - 1;
    const oneUpColumn = isVertical ? columnDir + 1 : columnDir;
    const oneDownColumn = isVertical ? columnDir - 1 : columnDir;

    const selectorBase = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    const elementBase = from.querySelector(selectorBase);
    offsetFields.push(elementBase);

    const selectorOneUp = `div[data-row='${oneUpRow}'][data-column='${oneUpColumn}']`;
    const elementOneUp = from.querySelector(selectorOneUp);
    offsetFields.push(elementOneUp);

    const selectorOneDown = `div[data-row='${oneDownRow}'][data-column='${oneDownColumn}']`;
    const elementOneDown = from.querySelector(selectorOneDown);
    offsetFields.push(elementOneDown);
  }

  if (shipEnd + 1 < 10) {
    const rowDir = isVertical ? shipEnd + 1 : Number(row);
    const columnDir = isVertical ? Number(column) : shipEnd + 1;
    const oneUpRow = isVertical ? rowDir : rowDir + 1;
    const oneDownRow = isVertical ? rowDir : rowDir - 1;
    const oneUpColumn = isVertical ? columnDir + 1 : columnDir;
    const oneDownColumn = isVertical ? columnDir - 1 : columnDir;

    const selectorBase = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    const elementBase = from.querySelector(selectorBase);
    offsetFields.push(elementBase);

    const selectorOneUp = `div[data-row='${oneUpRow}'][data-column='${oneUpColumn}']`;
    const elementOneUp = from.querySelector(selectorOneUp);
    offsetFields.push(elementOneUp);

    const selectorOneDown = `div[data-row='${oneDownRow}'][data-column='${oneDownColumn}']`;
    const elementOneDown = from.querySelector(selectorOneDown);
    offsetFields.push(elementOneDown);
  }

  for (let i = dynamicDir; i <= shipEnd; i += 1) {
    const rowDir = isVertical ? i : Number(row);
    const columnDir = isVertical ? Number(column) : i;
    const oneUpRow = isVertical ? rowDir : rowDir + 1;
    const oneDownRow = isVertical ? rowDir : rowDir - 1;
    const oneUpColumn = isVertical ? columnDir + 1 : columnDir;
    const oneDownColumn = isVertical ? columnDir - 1 : columnDir;

    const selectorBase = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    const elementBase = from.querySelector(selectorBase);
    coreFields.push(elementBase);

    const selectorOneUp = `div[data-row='${oneUpRow}'][data-column='${oneUpColumn}']`;
    const elementOneUp = from.querySelector(selectorOneUp);
    offsetFields.push(elementOneUp);

    const selectorOneDown = `div[data-row='${oneDownRow}'][data-column='${oneDownColumn}']`;
    const elementOneDown = from.querySelector(selectorOneDown);
    offsetFields.push(elementOneDown);
  }

  return { coreFields, offsetFields };
};

export const handleDragStart = (event) => {
  event.target.classList.add('dragging');

  const { length, direction, row, column } = event.target.dataset;

  const occupiedFields = getFields(row, column, length, direction);
  const { coreFields, offsetFields } = occupiedFields;
  coreFields.forEach((div) => {
    div.classList.add('draggedFrom');
    div.dataset.ship = false;
  });

  offsetFields.forEach((div) => {
    if (div) {
      div.dataset.offset = false;
    }
  });
};

export const handleDragEnd = (event) => {
  console.log(event.target);
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
  console.log(event.target);
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  // const [type] = dragged.classList;
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;

  const newPosition = getFields(row, column, length, direction);
  const { coreFields, offsetFields } = newPosition;
  let allAvailable = true;

  if (!coreFields.includes(null) && coreFields.length === Number(length)) {
    coreFields.forEach((div) => {
      const { ship, offset } = div.dataset;
      if (ship === 'true' || offset === 'true') allAvailable = false;
    });

    offsetFields.forEach((div) => {
      if (div) {
        const { ship } = div.dataset;
        if (ship === 'true') allAvailable = false;
      }
    });

    if (allAvailable) {
      event.target.append(dragged);
      dragged.dataset.row = row;
      dragged.dataset.column = column;

      coreFields.forEach((div) => {
        div.dataset.ship = true;
      });

      offsetFields.forEach((div) => {
        if (div) {
          div.dataset.offset = true;
        }
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
  const { coreFields, offsetFields } = currentFields;

  if (!coreFields.includes(null) && coreFields.length === Number(length)) {
    coreFields.forEach((div) => {
      const { ship, offset } = div.dataset;
      let correctClass = 'available';
      if (ship === 'true' || offset === 'true') correctClass = 'not-available';
      div.classList.add(correctClass);
    });

    offsetFields.forEach((div) => {
      if (div) {
        const { ship } = div.dataset;
        let correctClass = 'available';
        if (ship === 'true') correctClass = 'not-available';
        div.classList.add(correctClass);
      }
    });
  } else {
    coreFields.forEach((div) => {
      if (div) {
        div.classList.add('not-available');
      }
    });

    offsetFields.forEach((div) => {
      if (div) {
        div.classList.add('not-available');
      }
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
