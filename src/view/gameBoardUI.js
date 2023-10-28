import PubSub from '../modules/pubsub';
import renderBoard from './boardUI';
import renderShipStorage from './shipStorageUI';

// let beingDragged;

// const handleDragStart = (event) => {
//   console.log(event.target.field);
//   beingDragged = event.target;
//   event.target.classList.add('dragging');
// };

// const handleDragEnd = (event) => {
//   console.log(event.target);
//   event.target.classList.remove('dragging');
// };

// const handleDragOver = (event) => {
//   event.preventDefault();
//   const { length } = beingDragged.dataset;
//   const { row, column } = event.target.dataset;

//   event.target.classList.add('draggingOver');
// };

// const handleDragLeave = (event) => {
//   event.preventDefault();
//   event.target.classList.remove('draggingOver');
// };

// const handleDragDrop = (event) => {
//   event.preventDefault();
//   event.target.classList.remove('draggingOver');

//   const { length } = beingDragged.dataset;
//   const { row, column } = event.target.dataset;

//   PubSub.publish('field-ship-drag', {
//     length,
//     coordinates: [row, column, true],
//   });
// };

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

  if (isEnemy) {
    PubSub.subscribe('game-currentPlayer', (activePlayer) => {
      if (activePlayer === player) boardUI.classList.add('disabled');
      if (activePlayer !== player) boardUI.classList.remove('disabled');
    });
  }

  if (!isEnemy) {
    const shipsUI = renderShipStorage(shipStorage);
    gameboardUI.append(shipsUI);
  }

  return gameboardUI;
};

export default renderGameboard;
