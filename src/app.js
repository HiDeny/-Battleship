import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import renderGameboard from './view/gameBoardUI';

import createHud from './view/hudUI';

import PubSub from './modules/pubsub';

const hud = createHud();

const testGame = GameController();
const { player1, player2 } = testGame;

const player1GameBoard = renderGameboard(player1);
const player2GameBoard = renderGameboard(player2, true);

document.body.append(hud);

document.body.append(player1GameBoard);
document.body.append(player2GameBoard);

PubSub.subscribe('game-status', async (phase) => {
  if (phase === 'start') {
    testGame.setShips();
    testGame.playRound(null);
  }
});

PubSub.subscribe('field-click', async (coordinates) => {
  const shotResult = await testGame.playRound(coordinates);
  if (shotResult === 'miss') await testGame.playRound(null);
});
