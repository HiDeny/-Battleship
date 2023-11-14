import renderGameboard from '../view/gameBoardUI';
import createHud from '../view/hudUI';
import createWelcomeScreen from '../view/welcomeScreen';
import PubSub from '../modules/pubsub';

const cleanOldBoards = () => {
  const oldHud = document.querySelector('.hud');
  const oldGameBoardP1 = document.querySelector('.gameboard.player1');
  const oldGameBoardP2 = document.querySelector('.gameboard.player2');

  if (oldHud) oldHud.remove();
  if (oldGameBoardP1) oldGameBoardP1.remove();
  if (oldGameBoardP2) oldGameBoardP2.remove();
};

const ScreenController = () => {
  const welcomeScreen = createWelcomeScreen();
  document.body.append(welcomeScreen);

  PubSub.subscribe('game-ready', (game) => {
    cleanOldBoards();

    const hud = createHud();
    const gameboard1 = renderGameboard(game.player1);
    const gameboard2 = renderGameboard(game.player2, true);

    document.body.append(hud, gameboard1, gameboard2);
  });
};

export default ScreenController;
