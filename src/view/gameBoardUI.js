import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShipStorage from './shipUI';

const createShipsLeft = (gameboard) => {
  const container = document.createElement('div');
  container.classList.add('board-stats-ships');

  const text = document.createElement('p');
  text.classList.add('board-stats-ships-text');
  text.textContent = 'Remaining ships: ';

  let activeShips = 0;
  const count = document.createElement('p');
  count.classList.add('board-stats-ships-count');
  count.textContent = activeShips;

  PubSub.subscribe('game-ships-check', () => {
    const currentShips = gameboard.activeShips();

    if (activeShips !== currentShips) {
      count.textContent = currentShips;
      count.classList.add('alert');

      setTimeout(() => {
        count.classList.remove('alert');
      }, 700);

      activeShips = currentShips;
    }
  });

  container.append(text, count);

  return container;
};

const createStats = (name, gameboard) => {
  const stats = document.createElement('div');
  stats.classList.add('board-stats');

  const nameTag = document.createElement('p');
  nameTag.classList.add('board-stats-name');
  nameTag.textContent = name;

  const shipsLeft = createShipsLeft(gameboard);

  stats.append(nameTag, shipsLeft);

  return stats;
};

const renderGameboard = (player, isEnemy = false) => {
  const { name, shipStorage, gameboard } = player;
  const { board } = gameboard;
  const gameboardUI = document.createElement('div');
  const playerClass = isEnemy ? 'player2' : 'player1';

  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  const boardUI = renderBoard(board, isEnemy);
  const stats = createStats(name, gameboard);

  gameboardUI.append(boardUI, stats);

  if (!isEnemy) {
    renderShipStorage(shipStorage, boardUI);
  }
  if (isEnemy) {
    boardUI.classList.add('disabled');
    stats.classList.add('disabled');
  }

  PubSub.subscribe('game-turn', (activePlayer) => {
    if (activePlayer === player) {
      boardUI.classList.add('disabled');
      stats.classList.add('disabled');
    }
    if (activePlayer !== player) {
      boardUI.classList.remove('disabled');
      stats.classList.remove('disabled');
    }
  });

  PubSub.subscribe('game-status', (phase) => {
    if (phase === 'Game Over') {
      boardUI.classList.add('disabled');
      stats.classList.add('disabled');
    }
  });

  return gameboardUI;
};

export default renderGameboard;
