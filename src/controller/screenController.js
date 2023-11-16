import PubSub from '../modules/pubsub';
import createHud from '../view/hudUI';
import createWelcomeScreen from '../view/welcomeScreen';
import renderGameboard from '../view/gameBoardUI';

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

  let currentGame;

  PubSub.subscribe('game-ready', (game) => {
    cleanOldBoards();
    currentGame = game;

    const hud = createHud();
    const gameboard1 = renderGameboard(game.player1);
    const gameboard2 = renderGameboard(game.player2, true);

    document.body.append(hud, gameboard1, gameboard2);
  });

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    const { activePlayer, player1 } = currentGame;
    const boardToMark = activePlayer === player1 ? 'player2' : 'player1';
    const container = document.querySelector(`div.gameboard.${boardToMark}`);

    const [row, column] = coordinates;
    const selectorBase = `[data-row='${row}'][data-column='${column}']`;
    const field = container.querySelector(selectorBase);

    field.classList.add(mark);
  });
};

export default ScreenController;
