import 'normalize.css';
import './view/styles.css';

import GameController from './controller/game';
import ScreenController from './controller/screenController';

import PubSub from './modules/pubsub';

const screenController = ScreenController();
let currentGame;
let nameP1;
let nameP2;

screenController.displayWelcome();

PubSub.subscribe('game-setup', (names) => {
  [nameP1, nameP2] = names;
  currentGame = GameController(nameP1, nameP2);
  screenController.displayHUD();
  screenController.displayGame(currentGame);
});

PubSub.subscribe('game-status', (phase) => {
  if (phase === 'Start') {
    currentGame.setShips();
    PubSub.publish('game-turn', currentGame.player2);
    currentGame.playRound(null);
  }
  if (phase === 'Restart') {
    currentGame = GameController(nameP1, nameP2);
    screenController.displayRestartGame(currentGame);
    PubSub.publish('game-round', 0);
  }
});

PubSub.subscribe('field-click', async (coordinates) => {
  const shotResult = await currentGame.playRound(coordinates);
  if (shotResult === 'miss') await currentGame.playRound(null);
});
