const createFieldUI = (field) => {
  const container = document.createElement('div');
  container.classList.add('board-field');
  if (field.ship) container.classList.add('ship');
  if (field.mark) container.classList.add(`${field.mark}`);

  const [row, column] = field.coordinates;
  container.dataset.row = row;
  container.dataset.column = column;

  return container;
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
