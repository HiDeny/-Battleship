import GameController from '../controller/game';

/* eslint-disable no-undef */

test('Setup: Players', () => {
  const testGame = GameController();
  expect(testGame.player1.gameboard).toBeDefined();
  expect(testGame.player1.shipStorage).toBeDefined();

  expect(testGame.player2.gameboard).toBeDefined();
  expect(testGame.player2.shipStorage).toBeDefined();
});

test('Setup: Ships', () => {
  const testGame = GameController();
  testGame.setShips();

  expect(testGame.player1.gameboard.activeShips()).toBe(7);
  expect(testGame.player2.gameboard.activeShips()).toBe(7);
});

test('Play turn by turn', () => {
  const testGame = GameController();
  testGame.player1.placeShip('Destroyer2', [1, 1]);
  testGame.player2.placeShip('Destroyer2', [2, 2]);

  expect(testGame.playRound([1, 0])).toBe('miss');
  expect(testGame.playRound([1, 0])).toBe('miss');
  expect(testGame.playRound([5, 5])).toBe('miss');
  expect(testGame.playRound([4, 2])).toBe('miss');
});

test('Ending conditions (P1 win)', () => {
  const testGame = GameController();
  testGame.player1.placeShip('Destroyer2', [1, 1]);
  testGame.player2.placeShip('Destroyer2', [2, 2]);

  testGame.playRound([2, 2]);
  testGame.playRound([5, 5]);
  testGame.playRound([2, 3]);
  expect(testGame.playRound([5, 7])).toBe('Player 1 WIN!');
});
test('Ending conditions (P2 win)', () => {
  const testGame = GameController();
  testGame.player1.placeShip('Destroyer2', [1, 1]);
  testGame.player2.placeShip('Destroyer2', [2, 2]);

  testGame.playRound([1, 2]);
  testGame.playRound([1, 1]);
  testGame.playRound([4, 5]);
  testGame.playRound([1, 2]);
  expect(testGame.playRound([3, 3])).toBe('Player 2 WIN!');
});
