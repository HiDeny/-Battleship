/* eslint-disable no-param-reassign */
export const getFields = (...args) => {
  const [row, column, length, direction, container = document] = args;
  const isVertical = direction === 'vertical';

  const rowNum = Number(row);
  const columnNum = Number(column);
  const lengthNum = Number(length);

  const dynamicDir = isVertical ? rowNum : columnNum;
  const shipEnd = dynamicDir + lengthNum - 1;

  const coreFields = [];
  const offsetFields = [];

  const getField = (rowDir, columnDir) => {
    const selectorBase = `[data-row='${rowDir}'][data-column='${columnDir}']`;
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

export const isAvailableFields = (coreFields, offsetFields) => {
  let available = true;

  coreFields.forEach((div) => {
    if (div.dataset.ship === 'true') available = false;
  });

  offsetFields.forEach((div) => {
    if (!div) return;
    if (div.dataset.ship === 'true') available = false;
  });

  return available;
};

export const getRandomEmptyFields = (newShip, boardUI) => {
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
      keepGoing = !isAvailableFields(coreFields, offsetFields);
    }
  }

  return { fields: newFields, row: newRow, column: newColumn };
};

export const updateFieldsShip = (coreFields, mark) => {
  coreFields.forEach((div) => {
    div.dataset.ship = mark;
  });
};

export const updateFieldsOffset = (offsetFields, mark) => {
  offsetFields.forEach((div) => {
    if (!div) return;
    div.dataset.offset = mark;
  });
};

export const clearFields = (fieldsToClear) => {
  const { coreFields, offsetFields } = fieldsToClear;

  updateFieldsShip(coreFields, 'false');
  updateFieldsOffset(offsetFields, 'false');
};

export const populateFields = (fieldsToPopulate) => {
  const { coreFields, offsetFields } = fieldsToPopulate;

  updateFieldsShip(coreFields, 'true');
  updateFieldsOffset(offsetFields, 'true');
};
