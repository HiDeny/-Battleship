import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length, type } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const shipEndX = Number(row) + Number(length - 1);
  const shipEndY = Number(column) + Number(length - 1);
  const coordinates = [Number(row), Number(column), true];
  let availableFields = 0;

  if (shipEndX <= 9 && shipEndX >= 0) {
    for (let i = Number(row); i <= shipEndX; i += 1) {
      const currentElement = document.querySelector(
        `div[data-row='${i}'][data-column='${column}']`
      );
      if (!currentElement.dataset.ship && !currentElement.dataset.offset) {
        availableFields += 1;
      }
    }
  }

  // if (shipEndY <= 9 && shipEndY >= 0) {
  //   for (let i = Number(column); i <= shipEndY; i += 1) {
  //     const currentElement = document.querySelector(
  //       `div[data-row='${row}'][data-column='${i}']`
  //     );
  //     currentElement.classList.add('placed');
  //     dragged.remove();
  //   }
  // }
  if (availableFields === Number(length)) {
    PubSub.publish('field-ship-drag', type, coordinates);
    dragged.remove();
  }
};

const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const shipEndX = Number(row) + Number(length - 1);
  const shipEndY = Number(column) + Number(length - 1);

  if (shipEndX <= 9 && shipEndX >= 0) {
    for (let i = Number(row); i <= shipEndX; i += 1) {
      const currentElement = document.querySelector(
        `div[data-row='${i}'][data-column='${column}']`
      );
      if (!currentElement.dataset.ship && !currentElement.dataset.offset) {
        currentElement.classList.add('available');
      } else {
        currentElement.classList.add('not-available');
      }
    }
  }

  // if (shipEndY <= 9 && shipEndY >= 0) {
  //   for (let i = Number(column); i <= shipEndY; i += 1) {
  //     const currentElement = document.querySelector(
  //       `div[data-row='${row}'][data-column='${i}']`
  //     );
  //     currentElement.classList.add('draggingOver');
  //   }
  // }
};

const handleDragLeave = (event) => {
  event.preventDefault();
  const wasOver = document.querySelectorAll('.draggingOver');
  const wasAvailable = document.querySelectorAll('.available');
  const wasNotAvailable = document.querySelectorAll('.not-available');

  wasOver.forEach((element) => element.classList.remove('draggingOver'));
  wasAvailable.forEach((element) => element.classList.remove('available'));
  wasNotAvailable.forEach((element) => {
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

  // Need Fix
  if (isEnemy) fieldButton.onclick = handleClickField;
  if (!isEnemy) {
    fieldButton.addEventListener('dragover', handleDragOver);
    fieldButton.addEventListener('dragleave', handleDragLeave);
    fieldButton.addEventListener('drop', handleDragDrop);
  }
  // Remove isEnemy
  if (!isEnemy || isEnemy) {
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
