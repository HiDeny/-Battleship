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

document.body.append(renderBoardUI(testGame.player1.gameboard.board));
document.body.append(renderBoardUI(testGame.player2.gameboard.board));
