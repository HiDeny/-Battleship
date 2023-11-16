import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShips from './shipUI';
import createStatsUI from './boardStatsUI';

const renderGameboard = (player, isEnemy = false) => {
  const { name, shipStorage, gameboard } = player;
  const { board } = gameboard;
  const gameboardUI = document.createElement('div');
  const playerClass = isEnemy ? 'player2' : 'player1';

  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  const boardUI = renderBoard(board, isEnemy);
  const stats = createStatsUI(name);

  gameboardUI.append(boardUI, stats);

  if (!isEnemy) renderShips(shipStorage, boardUI);

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
