// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';
import './view/styles.css';

import renderBoardUI from './view/boardUI';
import createGameboard from './modules/gameboard';
import GameController from './controller/game';

import testPubSub from './modules/pubsub';

const testSub = testPubSub.subscribe('field-click', (coordinates) => {
  console.log(coordinates);
});

const testGame = GameController();
testGame.setShips();
console.log(testGame.playRound([1, 1]));
const uiTestGameboard = createGameboard();

const player1Board = renderBoardUI(testGame.player1);
player1Board.classList.add('player1');

const player2Board = renderBoardUI(testGame.player2);
player2Board.classList.add('player2');

document.body.append(player1Board);
document.body.append(player2Board);
