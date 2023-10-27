import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import renderPlayerGameboard from './view/boardUI';

import { createResultUI, createRoundsUI } from './view/hudUI';

import PubSub from './modules/pubsub';

const testGame = GameController();

const { player1, player2 } = testGame;

const player1GameBoard = renderPlayerGameboard(player1);
const player2GameBoard = renderPlayerGameboard(player2, true);

const rounds = createRoundsUI();
const result = createResultUI();

// document.body.append(nameUI);
document.body.append(rounds);
document.body.append(result);

document.body.append(player1GameBoard);
document.body.append(player2GameBoard);

testGame.setShips();

PubSub.subscribe('field-click', (coordinates) => {
  testGame.playRound(coordinates);

  setTimeout(() => {
    testGame.playRound(null, true);
  }, 1000);
});

// player2.placeShipsAtRandom();
PubSub.subscribe('field-ship-drag', ({ length, coordinates }) => {
  player1.placeShip(length, coordinates);
});
