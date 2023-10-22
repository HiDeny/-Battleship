const createFieldUI = (field) => {
  const container = document.createElement('div');
  container.classList.add('board-field');
  if (field.ship) container.classList.add('ship');
  if (field.mark) container.classList.add(`${field.mark}`);

  return container;
};

const createRowUI = () => {
  const container = document.createElement('div');
  container.classList.add('row');

  return container;
};

const renderBoardUI = (board) => {
  const container = document.createElement('div');
  container.classList.add('board-container');

  board.forEach((row) => {
    const newRow = createRowUI();
    container.append(newRow);

    row.forEach((field) => newRow.append(createFieldUI(field)));
  });

  return container;
};

export default renderBoardUI;
