import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const [type] = dragged.classList;
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const isVertical = direction === 'vertical';

  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);
  const coordinates = [Number(row), Number(column), isVertical];
  const availableFields = [];

  if (shipEnd <= 9 && shipEnd >= 0) {
    for (let i = dynamicDir; i <= shipEnd; i += 1) {
      const rowDir = isVertical ? i : Number(row);
      const columnDir = isVertical ? Number(column) : i;
      const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
      const element = document.querySelector(selector);
      const { ship, offset } = element.dataset;
      if (ship !== 'true') availableFields.push(element);
      // if (!ship && !offset) availableFields += 1;
    }
  }

  if (availableFields.length === Number(length)) {
    event.target.append(dragged);
    dragged.dataset.row = row;
    dragged.dataset.column = column;
    availableFields.forEach((field) => {
      field.dataset.ship = true;
    });

    // PubSub.publish('field-ship-drag', type, coordinates);
    // dragged.remove();
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, direction } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const isVertical = direction === 'vertical';
  const dynamicDir = isVertical ? Number(row) : Number(column);
  const shipEnd = dynamicDir + Number(length - 1);

  if (shipEnd <= 9 && shipEnd >= 0) {
    for (let i = dynamicDir; i <= shipEnd; i += 1) {
      const rowDir = isVertical ? i : row;
      const columnDir = isVertical ? column : i;
      const selector = `div[data-row='${rowDir}'][data-column='${columnDir}']`;
      const element = document.querySelector(selector);
      const { ship, offset } = element.dataset;

      if (ship !== 'true' && !offset) {
        element.classList.add('available');
      } else {
        element.classList.add('not-available');
      }
    }
  }
};

const handleDragLeave = (event) => {
  event.preventDefault();
  const over = document.querySelectorAll('.draggingOver');
  const available = document.querySelectorAll('.available');
  const notAvailable = document.querySelectorAll('.not-available');

  over.forEach((element) => {
    element.classList.remove('draggingOver');
  });
  available.forEach((element) => {
    element.classList.remove('available');
  });
  notAvailable.forEach((element) => {
    element.classList.remove('not-available');
  });
};

const createFieldUI = (field, isEnemy) => {
  const fieldButton = document.createElement(isEnemy ? 'button' : 'div');
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  if (isEnemy) fieldButton.onclick = handleClickField;
  if (!isEnemy) {
    fieldButton.addEventListener('dragover', handleDragOver);
    fieldButton.addEventListener('dragleave', handleDragLeave);
    fieldButton.addEventListener('drop', handleDragDrop);
  }
  // Remove isEnemy
  if (!isEnemy) {
    PubSub.subscribe('field-ship', (coordinates, type) => {
      if (coordinates === field.coordinates) {
        fieldButton.dataset.ship = true;
        fieldButton.classList.add(type);
      }
    });

    PubSub.subscribe('field-ship-offset', (coordinates) => {
      if (coordinates === field.coordinates) {
        fieldButton.dataset.offset = true;
      }
    });
  }

  return fieldButton;
};

const renderBoard = (board, name, isEnemy) => {
  const boardUI = document.createElement('div');
  boardUI.classList.add('board');
  boardUI.setAttribute('name', name);

  board.forEach((row) => {
    row.forEach((field) => {
      const fieldUI = createFieldUI(field, isEnemy);
      boardUI.append(fieldUI);
    });
  });

  return boardUI;
};

export default renderBoard;
