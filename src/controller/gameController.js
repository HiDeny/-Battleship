import createPlayer from '../modules/player';
import createAiPlayer from '../modules/Ai/aiPlayer';
import createGameLoop from '../modules/gameLoop';
import PubSub from '../modules/pubsub';

const GameController = () => {
  let currentNames;
  let player1;
  let player2;
  let currentGame;

  PubSub.subscribe('game-setup', (names) => {
    const [nameP1, nameP2] = names;
    currentNames = names;

    player1 = createPlayer(nameP1);
    player2 = nameP2 ? createPlayer(nameP2) : createAiPlayer('Enemy');
    currentGame = createGameLoop(player1, player2);

    PubSub.publish('game-ready', currentGame);
  });

  PubSub.subscribe('game-status', (phase) => {
    if (phase === 'Start') {
      currentGame.setShips();
      PubSub.publish('game-turn', player2);
      currentGame.playRound(null);
    }
    if (phase === 'Restart') {
      const [nameP1, nameP2] = currentNames;

      player1 = createPlayer(nameP1);
      player2 = nameP2 ? createPlayer(nameP2) : createAiPlayer('Enemy');
      currentGame = createGameLoop(player1, player2);

      PubSub.publish('game-round', 0);
      PubSub.publish('game-ready', currentGame);
    }
  });

  PubSub.subscribe('field-click', async (coordinates) => {
    const shotResult = await currentGame.playRound(coordinates);
    if (shotResult === 'miss') await currentGame.playRound(null);
  });
};

export default GameController;
