import testPubSub from '../modules/pubsub';

const createFieldUI = (field) => {
  const fieldButton = document.createElement('button');
  fieldButton.classList.add('board-field');
  if (field.ship) fieldButton.classList.add('ship');
  if (field.mark) fieldButton.classList.add(`${field.mark}`);

  const [row, column] = field.coordinates;
  fieldButton.dataset.row = row;
  fieldButton.dataset.column = column;

  fieldButton.onclick = (event) => {
    // console.log(event.target);
    const coordinates = [event.target.dataset.row, event.target.dataset.column];
    testPubSub.publish('field-click', coordinates);
  };

  return fieldButton;
};

const createRowUI = () => {
  const container = document.createElement('div');
  container.classList.add('row');

  return container;
};

const renderBoardUI = (player) => {
  const container = document.createElement('div');
  container.classList.add('board-container');

  player.gameboard.board.forEach((row) => {
    const newRow = createRowUI();
    container.append(newRow);

    row.forEach((field) => {
      const fieldUI = createFieldUI(field);
      newRow.append(fieldUI);
    });
  });

  return container;
};

export default renderBoardUI;
