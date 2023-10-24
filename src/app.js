import 'normalize.css';
import './view/styles.css';

import renderBoardUI from './view/boardUI';
import GameController from './controller/game';

import PubSub from './modules/pubsub';

const testGame = GameController();

const player1Board = renderBoardUI(testGame.player1);
player1Board.classList.add('player1');

const player2Board = renderBoardUI(testGame.player2, true);
player2Board.classList.add('player2');

document.body.append(player1Board);
document.body.append(player2Board);

testGame.setShips();
// console.log(testGame.playRound([1, 1]));

const testSub = PubSub.subscribe('field-click', (coordinates) => {
  console.log(coordinates);
  console.log(testGame.playRound(coordinates));
});
