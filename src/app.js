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

PubSub.subscribe('field-ship-drag', (type, coordinates) => {
  player1.placeShip(type, coordinates);
});

PubSub.subscribe('game-start', () => {
  testGame.startGame();
});

const aiPlay = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(testGame.playRound(null, true));
    }, 500);
  });

PubSub.subscribe('field-click', async (coordinates) => {
  let shotResult = testGame.playRound(coordinates);

  if (shotResult === 'miss') {
    let shots = 1;

    for (let i = 0; i < shots; i += 1) {
      shotResult = await aiPlay();
      if (shotResult === 'ship sunk' || shotResult === 'hit') {
        shots += 1;
      }
    }
  }
});

// player2.placeShipsAtRandom();
