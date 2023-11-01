import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShipStorage from './shipStorageUI';

// const handleClickRotateButton = ({ target }) => {
//   target.dataset;
// };

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

  PubSub.subscribe('game-currentPlayer', (activePlayer) => {
    if (activePlayer === player) boardUI.classList.add('disabled');
    if (activePlayer !== player) boardUI.classList.remove('disabled');
  });

  return gameboardUI;
};

export default renderGameboard;
