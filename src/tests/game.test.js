import GameController from '../controller/game';

/* eslint-disable no-undef */
const testGame = GameController();

test('Setup: Players', () => {
  expect(testGame.player1.gameboard).toBeDefined();
  expect(testGame.player1.storedShips).toBeDefined();

  expect(testGame.player2.gameboard).toBeDefined();
  expect(testGame.player2.storedShips).toBeDefined();
});

test('Setup: Ships', () => {
  testGame.setShips();

  Object.keys(testGame.player1.storedShips).forEach((ship) => {
    expect(testGame.player1.storedShips[ship].quantity).toBe(0);
  });

  Object.keys(testGame.player2.storedShips).forEach((ship) => {
    expect(testGame.player2.storedShips[ship].quantity).toBe(0);
  });
});

test('Play turn by turn', () => {
  testGame.playGameRandom();
});

test.todo('Ending conditions');
