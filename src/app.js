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

const aiShot = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(testGame.playRound(null, true));
    }, 500);
  });

const aiPlay = async () => {
  let shots = 1;

  for (let i = 0; i < shots; i += 1) {
    const shotResult = await aiShot();
    if (shotResult === 'ship sunk' || shotResult === 'hit') {
      shots += 1;
    }
  }
};

PubSub.subscribe('game-status', async (phase) => {
  if (phase === 'start') {
    testGame.setShips();
    await aiPlay();
  }
});

PubSub.subscribe('field-click', async (coordinates) => {
  let shotResult = testGame.playRound(coordinates);
  if (shotResult === 'miss') await aiPlay();
});

// player2.placeShipsAtRandom();
