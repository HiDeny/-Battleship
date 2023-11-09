import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import renderGameboard from './view/gameBoardUI';

import createHud from './view/hudUI';

import PubSub from './modules/pubsub';

const hud = createHud();

let currentGame = GameController();

document.body.append(hud);
document.body.append(renderGameboard(currentGame.player1));
document.body.append(renderGameboard(currentGame.player2, true));

PubSub.subscribe('game-status', async (phase) => {
  if (phase === 'Start') {
    currentGame.setShips();
    PubSub.publish('game-turn', currentGame.player2);
    currentGame.playRound(null);
  }
  if (phase === 'Restart') {
    currentGame = GameController();

    const oldGameBoardP1 = document.querySelector('.gameboard.user');
    const oldGameBoardP2 = document.querySelector('.gameboard.enemy');

    oldGameBoardP1.replaceWith(renderGameboard(currentGame.player1));
    oldGameBoardP2.replaceWith(renderGameboard(currentGame.player2, true));

    PubSub.publish('game-round', 0);
  }
});

PubSub.subscribe('field-click', async (coordinates) => {
  const shotResult = await currentGame.playRound(coordinates);
  if (shotResult === 'miss') await currentGame.playRound(null);
});
