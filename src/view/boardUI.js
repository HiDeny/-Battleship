import PubSub from '../modules/pubsub';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const createFieldUI = (field, isEnemy) => {
  const fieldButton = document.createElement('button');
  const [row, column] = field.coordinates;

  fieldButton.dataset.row = row;
  fieldButton.dataset.column = column;
  fieldButton.classList.add('board-field');

  if (isEnemy) fieldButton.onclick = handleClickField;

  PubSub.subscribe('field-ship', (coordinates) => {
    if (coordinates === field.coordinates) {
      fieldButton.classList.add('ship');
    }
  });

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  return fieldButton;
};

const createRowUI = () => {
  const container = document.createElement('div');
  container.classList.add('row');

  return container;
};

const renderBoardUI = (board, isEnemy = false) => {
  const container = document.createElement('div');
  container.classList.add('board-container');

  board.forEach((row) => {
    const newRow = createRowUI();
    container.append(newRow);

    row.forEach((field) => {
      const fieldUI = createFieldUI(field, isEnemy);
      newRow.append(fieldUI);
    });
  });

  return container;
};

export default renderBoardUI;
