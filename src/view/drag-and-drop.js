export const getFields = (
  row,
  column,
  length,
  direction,
  container = document
) => {
  const isVertical = direction === 'vertical';

  const rowNum = Number(row);
  const columnNum = Number(column);
  const lengthNum = Number(length);

  const dynamicDir = isVertical ? rowNum : columnNum;
  const shipEnd = dynamicDir + lengthNum - 1;

  const coreFields = [];
  const offsetFields = [];

  const getField = (rowDir, columnDir) => {
    const selectorBase = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
    return container.querySelector(selectorBase);
  };

  const getSet = (baseRow, baseColumn) => ({
    base: getField(baseRow, baseColumn),
    oneUp: isVertical
      ? getField(baseRow, baseColumn + 1)
      : getField(baseRow + 1, baseColumn),
    oneDown: isVertical
      ? getField(baseRow, baseColumn - 1)
      : getField(baseRow - 1, baseColumn),
  });

  if (dynamicDir - 1 > -1) {
    const set = isVertical
      ? getSet(rowNum - 1, columnNum)
      : getSet(rowNum, columnNum - 1);

    offsetFields.push(set.base, set.oneUp, set.oneDown);
  }

  if (shipEnd + 1 < 10) {
    const set = isVertical
      ? getSet(shipEnd + 1, columnNum)
      : getSet(rowNum, shipEnd + 1);

    offsetFields.push(set.base, set.oneUp, set.oneDown);
  }

  for (let i = dynamicDir; i <= shipEnd; i += 1) {
    const set = isVertical ? getSet(i, columnNum) : getSet(rowNum, i);

    coreFields.push(set.base);
    offsetFields.push(set.oneUp, set.oneDown);
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
    if (!div) return;
    div.dataset.offset = false;
  });
};

export const handleDragEnd = (event) => {
  const draggedFrom = document.querySelectorAll('.draggedFrom');
  const availableShip = document.querySelectorAll('.available-ship');
  const availableOffset = document.querySelectorAll('.available-offset');
  const notAvailable = document.querySelectorAll('.not-available');

  const { row, column } = event.target.dataset;
  const oldX = Number(draggedFrom[0].dataset.row);
  const oldY = Number(draggedFrom[0].dataset.column);
  const isSame = oldX === Number(row) && oldY === Number(column);

  draggedFrom.forEach((div) => {
    if (isSame) div.dataset.ship = true;
    div.classList.remove('draggedFrom');
  });

  availableShip.forEach((div) => div.classList.remove('available-ship'));
  availableOffset.forEach((div) => div.classList.remove('available-offset'));
  notAvailable.forEach((div) => div.classList.remove('not-available'));
  event.target.classList.remove('dragging');

  availableShip.forEach((element) => {
    element.classList.remove('available-ship');
  });
  availableOffset.forEach((element) => {
    element.classList.remove('available-offset');
  });
  notAvailable.forEach((element) => {
    element.classList.remove('not-available');
  });
};

export const handleDragEnter = (event) => {
  event.preventDefault();
};

export const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
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
      if (!div) return;
      if (div.dataset.ship === 'true') allAvailable = false;
    });

    if (allAvailable) {
      event.target.append(dragged);
      dragged.dataset.row = row;
      dragged.dataset.column = column;

      coreFields.forEach((div) => {
        div.dataset.ship = true;
      });

      offsetFields.forEach((div) => {
        if (!div) return;
        div.dataset.offset = true;
      });
    }
  }
};

export const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;

  // Drop one lower where the ship is.

  const { row, column } = event.target.dataset;
  const currentFields = getFields(row, column, length, direction);
  const { coreFields, offsetFields } = currentFields;

  if (!coreFields.includes(null) && coreFields.length === Number(length)) {
    coreFields.forEach((div) => {
      let correctClass = 'available-ship';
      const { ship, offset } = div.dataset;

      if (ship === 'true' || offset === 'true') correctClass = 'not-available';
      div.classList.add(correctClass);
    });

    offsetFields.forEach((div) => {
      if (!div) return;

      let correctClass = 'available-offset';
      if (div.dataset.ship === 'true') correctClass = 'not-available';

      div.classList.add(correctClass);
    });
  } else {
    coreFields.forEach((div) => {
      if (!div) return;
      div.classList.add('not-available');
    });

    offsetFields.forEach((div) => {
      if (!div) return;
      div.classList.add('not-available');
    });
  }
};

export const handleDragLeave = (event) => {
  event.preventDefault();
  const availableShip = document.querySelectorAll('.available-ship');
  const availableOffset = document.querySelectorAll('.available-offset');
  const notAvailable = document.querySelectorAll('.not-available');

  availableShip.forEach((div) => div.classList.remove('available-ship'));
  availableOffset.forEach((div) => div.classList.remove('available-offset'));
  notAvailable.forEach((div) => div.classList.remove('not-available'));
};
