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
  let activeShipsP1;
  let activeShipsP2;

  PubSub.subscribe('game-ready', (game) => {
    cleanOldBoards();
    currentGame = game;
    activeShipsP1 = 0;
    activeShipsP2 = 0;

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

  PubSub.subscribe('game-ships-check', () => {
    const { player1, player2 } = currentGame;
    const checkShipsP1 = player1.gameboard.activeShips();
    const checkShipsP2 = player2.gameboard.activeShips();

    if (checkShipsP1 !== activeShipsP1) {
      const container = document.querySelector('.player1');
      const count = container.querySelector('.board-stats-ships-count');
      count.textContent = checkShipsP1;
      count.classList.add('alert');

      setTimeout(() => {
        count.classList.remove('alert');
      }, 700);

      activeShipsP1 = checkShipsP1;
    }

    if (checkShipsP2 !== activeShipsP2) {
      const container = document.querySelector('.player2');
      const count = container.querySelector('.board-stats-ships-count');
      count.textContent = checkShipsP2;
      count.classList.add('alert');

      setTimeout(() => {
        count.classList.remove('alert');
      }, 700);

      activeShipsP2 = checkShipsP2;
    }
  });
};

export default ScreenController;
