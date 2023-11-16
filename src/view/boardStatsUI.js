const createShipsLeft = () => {
  const container = document.createElement('div');
  container.classList.add('board-stats-ships');

  const text = document.createElement('p');
  text.classList.add('board-stats-ships-text');
  text.textContent = 'Remaining ships: ';

  const count = document.createElement('p');
  count.classList.add('board-stats-ships-count');
  count.textContent = 0;

  container.append(text, count);

  return container;
};

const createStatsUI = (name) => {
  const stats = document.createElement('div');
  stats.classList.add('board-stats');

  const nameTag = document.createElement('p');
  nameTag.classList.add('board-stats-name');
  nameTag.textContent = name;

  const shipsLeft = createShipsLeft();

  stats.append(nameTag, shipsLeft);

  return stats;
};

export default createStatsUI;
