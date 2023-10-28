import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const createFieldUI = (field, isEnemy) => {
  const correctElement = isEnemy ? 'button' : 'div';
  const fieldButton = document.createElement(correctElement);
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  // fieldButton.addEventListener('dragover', handleDragOver);
  // fieldButton.addEventListener('dragleave', handleDragLeave);
  // fieldButton.addEventListener('drop', handleDragDrop);

  // Need Fix
  if (isEnemy) fieldButton.onclick = handleClickField;
  if (!isEnemy) {
    PubSub.subscribe('field-ship', (coordinates, type) => {
      if (coordinates === field.coordinates) {
        fieldButton.classList.add('ship');
        fieldButton.classList.add(type);
        // fieldButton.draggable = true;
        // fieldButton.addEventListener('dragstart', handleDragStart);
        // fieldButton.addEventListener('dragend', handleDragEnd);
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
