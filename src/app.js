// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css';
import './view/styles.css';

import renderBoardUI from './view/boardUI';
import createGameboard from './modules/gameboard';
import GameController from './controller/game';

const testGame = GameController();
testGame.setShips();
console.log(testGame.playRound());
const uiTestGameboard = createGameboard();

const player1Board = renderBoardUI(testGame.player1.gameboard.board);
player1Board.classList.add('player1');

const player2Board = renderBoardUI(testGame.player2.gameboard.board);
player2Board.classList.add('player2');

document.body.append(player1Board);
document.body.append(player2Board);
