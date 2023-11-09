import renderGameboard from '../view/gameBoardUI';
import createHud from '../view/hudUI';
import createWelcomeScreen from '../view/welcomeScreen';

const ScreenController = () => {
  const hello = 'hey';

  return {
    displayWelcome() {
      const welcomeScreen = createWelcomeScreen();
      document.body.append(welcomeScreen);
    },
    displayHUD() {
      const hud = createHud();
      document.body.append(hud);
    },
    displayGame(game) {
      document.body.append(renderGameboard(game.player1));
      document.body.append(renderGameboard(game.player2, true));
    },
    displayRestartGame(game) {
      const oldGameBoardP1 = document.querySelector('.gameboard.user');
      const oldGameBoardP2 = document.querySelector('.gameboard.enemy');

      oldGameBoardP1.replaceWith(renderGameboard(game.player1));
      oldGameBoardP2.replaceWith(renderGameboard(game.player2, true));
    },
  };
};

export default ScreenController;
