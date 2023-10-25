import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import renderBoardUI from './view/boardUI';

import { createNamesUI, createResultUI, createRoundsUI } from './view/hudUI';

import PubSub from './modules/pubsub';

const testGame = GameController();

const { player1, player2 } = testGame;

const player1Board = player1.gameboard.board;
const player2Board = player2.gameboard.board;

const player1BoardUI = renderBoardUI(player1Board);
player1BoardUI.classList.add('player1');

const player2BoardUI = renderBoardUI(player2Board, true);
player2BoardUI.classList.add('player2');

const nameUI = createNamesUI(player1.name, player2.name);
const rounds = createRoundsUI();
const result = createResultUI();

document.body.append(nameUI);
document.body.append(rounds);
document.body.append(result);

document.body.append(player1BoardUI);
document.body.append(player2BoardUI);

testGame.setShips();

PubSub.subscribe('field-click', (coordinates) => {
  testGame.playRound(coordinates);

  setTimeout(() => {
    testGame.playRound(null, true);
  }, 1000);
});
