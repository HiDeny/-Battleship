import createGameLoop from '../modules/gameLoop';
import createPlayer from '../modules/player';

let p1;
let p2;
let game;

/* eslint-disable no-undef */
beforeEach(() => {
  p1 = createPlayer('Player 1');
  p2 = createPlayer('Player 2');
  game = createGameLoop(p1, p2);
});

test('Setup: Players', () => {
  expect(game.player1.gameboard).toBeDefined();
  expect(game.player1.shipStorage).toBeDefined();

  expect(game.player2.gameboard).toBeDefined();
  expect(game.player2.shipStorage).toBeDefined();
});

// test('Setup: Ships', () => {
//   const p1 = createPlayer('Name');
//   const p2 = createAiPlayer('Name');
//   const testGame = createGameLoop(p1, p2);

//   const testGame = GameController();
//   testGame.setShips();

//   expect(testGame.player1.gameboard.activeShips()).toBe(7);
//   expect(testGame.player2.gameboard.activeShips()).toBe(7);
// });

// test('Play turn by turn', async () => {
//   game.player1.placeShip('Destroyer2', [1, 1]);
//   game.player2.placeShip('Destroyer2', [2, 2]);

//   expect(game.activePlayer.name).toBe('Player 2');
//   expect(await game.playRound([1, 0])).toBe('miss');
//   expect(game.activePlayer.name).toBe('Player 1');
//   expect(await game.playRound([1, 0])).toBe('miss');
//   console.log(game.activePlayer.name);
//   expect(await game.playRound([5, 5])).toBe('miss');
//   console.log(game.activePlayer.name);
//   expect(await game.playRound([4, 2])).toBe('miss');
// });

//! SwitchTurn is not working properly here for some reason
// test('Ending conditions (P1 win)', async () => {
//   game.player1.placeShip('Destroyer2', [1, 1]);
//   game.player2.placeShip('Destroyer2', [2, 2]);

//   console.log(game.activePlayer.name);
//   await game.playRound([1, 2]);
//   console.log(game.activePlayer.name);
//   await game.playRound([1, 1]);
//   console.log(game.activePlayer.name);
//   await game.playRound([4, 5]);
//   await game.playRound([1, 2]);

//   expect(await game.playRound([2, 3])).toBe('Player 1 WIN!');
// });

// test('Ending conditions (P2 win)', async () => {
//   game.player1.placeShip('Destroyer2', [1, 1]);
//   game.player2.placeShip('Destroyer2', [2, 2]);

//   await game.playRound([1, 2]);
//   await game.playRound([1, 1]);
//   await game.playRound([4, 5]);
//   await game.playRound([1, 2]);

//   expect(await game.playRound([3, 3])).toBe('Player 2 WIN!');
// });
