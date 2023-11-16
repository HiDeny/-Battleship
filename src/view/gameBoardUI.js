import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShips from './shipUI';
import createStatsUI from './boardStatsUI';

const createGameboardUI = (isEnemy) => {
  const playerClass = isEnemy ? 'player2' : 'player1';

  const gameboardUI = document.createElement('div');
  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  return gameboardUI;
};

const renderGameboard = (player, isEnemy = false) => {
  const { name, shipStorage, gameboard } = player;
  const { board } = gameboard;

  const gameboardUI = createGameboardUI(isEnemy);
  const boardUI = renderBoard(board, isEnemy);
  const stats = createStatsUI(name);

  gameboardUI.append(boardUI, stats);

  if (isEnemy) {
    gameboardUI.classList.add('disabled');
  } else {
    renderShips(shipStorage, boardUI);
  }

  PubSub.subscribe('game-turn', (activePlayer) => {
    if (activePlayer === player) {
      gameboardUI.classList.add('disabled');
    } else {
      gameboardUI.classList.remove('disabled');
    }
  });

  PubSub.subscribe('game-status', (phase) => {
    if (phase === 'Game Over') {
      gameboardUI.classList.add('disabled');
    }
  });

  return gameboardUI;
};

export default renderGameboard;
