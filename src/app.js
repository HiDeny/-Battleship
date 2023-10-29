import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import renderGameboard from './view/gameBoardUI';

import { createResultUI, createRoundsUI } from './view/hudUI';

import PubSub from './modules/pubsub';

const rounds = createRoundsUI();
const result = createResultUI();

const testGame = GameController();
const { player1, player2 } = testGame;

const player1GameBoard = renderGameboard(player1);
const player2GameBoard = renderGameboard(player2, true);

document.body.append(rounds);
document.body.append(result);

document.body.append(player1GameBoard);
document.body.append(player2GameBoard);

testGame.setShips();

// const playQuickGame = (round = 0) => {
//   const currentRound = testGame.playRound(null, true);
//   if (
//     currentRound !== 'hit' &&
//     currentRound !== 'miss' &&
//     currentRound !== 'ship sunk'
//   )
//     return false;

//   setTimeout(() => {
//     playQuickGame(round);
//   }, 300);
// };

// playQuickGame();

PubSub.subscribe('field-click', (coordinates) => {
  testGame.playRound(coordinates);

  setTimeout(() => {
    testGame.playRound(null, true);
  }, 500);
});

// // player2.placeShipsAtRandom();
// PubSub.subscribe('field-ship-drag', ({ length, coordinates }) => {
//   player1.placeShip(length, coordinates);
// });
