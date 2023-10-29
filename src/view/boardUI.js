import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const handleDragDrop = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const shipEndX = Number(row) + Number(length);
  // const shipEndY = Number(column) + Number(length);
  const availableFields = [];

  for (let i = Number(row); i < shipEndX; i += 1) {
    const currentElement = document.querySelector(
      `div[data-row='${i}'][data-column='${column}']`
    );
    if (currentElement) {
      availableFields.push(currentElement);
    }
  }

  if (availableFields.length === Number(length)) {
    availableFields.forEach((field) => field.classList.add('placed'));
  }

  // PubSub.publish('field-ship-drag', {
  //   length,
  //   coordinates: [row, column, true],
  // });
};

const handleDragOver = (event) => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const { length } = dragged.dataset;
  const { row, column } = event.target.dataset;
  const shipEndX = Number(row) + Number(length - 1);
  // const shipEndY = Number(column) + Number(length - 1);
  // const availableFields = [];

  if (shipEndX <= 9 && shipEndX >= 0) {
    for (let i = Number(row); i <= shipEndX; i += 1) {
      const currentElement = document.querySelector(
        `div[data-row='${i}'][data-column='${column}']`
      );
      currentElement.classList.add('draggingOver');
    }
  }
};

const handleDragLeave = (event) => {
  event.preventDefault();
  const wasOver = document.querySelectorAll('.draggingOver');
  wasOver.forEach((element) => element.classList.remove('draggingOver'));
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

  fieldButton.addEventListener('dragover', handleDragOver);
  fieldButton.addEventListener('dragleave', handleDragLeave);
  fieldButton.addEventListener('drop', handleDragDrop);

  // Need Fix
  if (isEnemy) fieldButton.onclick = handleClickField;
  // Remove isEnemy
  if (!isEnemy || isEnemy) {
    PubSub.subscribe('field-ship', (coordinates, type) => {
      if (coordinates === field.coordinates) {
        fieldButton.classList.add('ship');
        fieldButton.classList.add(type);
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
