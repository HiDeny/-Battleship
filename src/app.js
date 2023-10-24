import 'normalize.css';
import './view/styles.css';

import renderBoardUI from './view/boardUI';
import GameController from './controller/game';

import PubSub from './modules/pubsub';

const testGame = GameController();

const player1Board = testGame.player1.gameboard.board;
const player1BoardUI = renderBoardUI(player1Board);
player1BoardUI.classList.add('player1');
document.body.append(player1BoardUI);

const player2Board = testGame.player2.gameboard.board;
const player2BoardUI = renderBoardUI(player2Board, true);
player2BoardUI.classList.add('player2');
document.body.append(player2BoardUI);

testGame.setShips();

PubSub.subscribe('field-click', (coordinates) => {
  console.log(coordinates);
  console.log(testGame.playRound(coordinates));
});
