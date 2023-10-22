import GameController from '../controller/game';

/* eslint-disable no-undef */
const testGame = GameController();

test('Setup: Players', () => {
  expect(testGame.player1.gameboard).toBeDefined();
  expect(testGame.player1.storedShips).toBeDefined();

  expect(testGame.player2.gameboard).toBeDefined();
  expect(testGame.player2.storedShips).toBeDefined();
});

test.todo('Setup: Ships');

test.todo('Play turn by turn');

test.todo('Ending conditions');
