import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShipStorage from './shipUI';

const createStats = (name, gameboard) => {
  const stats = document.createElement('div');
  stats.classList.add('board-stats');

  const nameTag = document.createElement('p');
  nameTag.classList.add('board-stats-name');
  nameTag.textContent = name;

  const shipsLeft = document.createElement('p');
  shipsLeft.classList.add('board-stats-ships');
  shipsLeft.textContent = `Remaining ships: ${gameboard.activeShips()}`;

  stats.append(nameTag, shipsLeft);

  return stats;
};

const renderGameboard = (player, isEnemy = false) => {
  const { name, shipStorage, gameboard } = player;
  const { board } = gameboard;
  const gameboardUI = document.createElement('div');
  const playerClass = isEnemy ? 'enemy' : 'user';

  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  const boardUI = renderBoard(board, name, isEnemy);
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
