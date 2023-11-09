import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShipStorage from './shipUI';

const renderGameboard = (player, isEnemy = false) => {
  const { name, shipStorage, gameboard } = player;
  const { board } = gameboard;
  const gameboardUI = document.createElement('div');
  const playerClass = isEnemy ? 'enemy' : 'user';

  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);

  const boardUI = renderBoard(board, name, isEnemy);
  gameboardUI.append(boardUI);

  if (!isEnemy) {
    renderShipStorage(shipStorage, boardUI);
  }

  PubSub.subscribe('game-turn', (activePlayer) => {
    if (activePlayer === player) boardUI.classList.add('disabled');
    if (activePlayer !== player) boardUI.classList.remove('disabled');
  });

  PubSub.subscribe('game-status', (phase) => {
    if (phase === 'Game Over') boardUI.classList.add('disabled');
  });

  return gameboardUI;
};

export default renderGameboard;
