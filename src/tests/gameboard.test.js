/* eslint-disable no-undef */
import createBoard from '../modules/gameboard';
import createShip from '../modules/ship';

test('Gameboard: Place ships at specific coordinates (horizontal)', () => {
  const testGameboard = createBoard();
  const testShip = createShip(3);

  const coordinates = [8, 1, false];
  const { board } = testGameboard;

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].ship).toHaveProperty('length');
  }
});

test('Gameboard: Place ships at specific coordinates (vertical)', () => {
  const testGameboard = createBoard();
  const testShip = createShip(3);
  const coordinates = [5, 1, true];
  const { board } = testGameboard;

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[0]; i < coordinates[0] + testShip.length; i += 1) {
    expect(board[i][coordinates[1]].ship).toHaveProperty('length');
  }
});

// test('Gameboard: Place ships at specific coordinates (fail)', () => {
//   const testGameboard = createBoard();
//   const testShip1 = { ship: createShip(3) };
//   const testShip2 = { ship: createShip(3) };
//   const coordinates = [6, 0];

//   testGameboard.placeShip(testShip1, coordinates);
//   expect(() => testGameboard.placeShip(testShip2, coordinates)).toThrow();
// });

test('Gameboard: receiveAttack (Hit)', () => {
  const testGameboard = createBoard();
  const testShip1 = createShip(3);
  const coordinates = [6, 0];
  testGameboard.placeShip(testShip1, coordinates);
  expect(testGameboard.receiveAttack(coordinates)).toBe('hit');
});

test('Gameboard: receiveAttack (Miss)', () => {
  const testGameboard = createBoard();
  const testShip1 = createShip(3);
  const coordinates = [6, 0];
  testGameboard.placeShip(testShip1, coordinates);

  expect(testGameboard.receiveAttack([7, 1])).toBe('miss');
});

test('Gameboard: receiveAttack (Error - already hit)', () => {
  const testGameboard = createBoard();
  const testShip1 = createShip(3);
  const coordinates = [6, 0];
  testGameboard.placeShip(testShip1, coordinates);

  testGameboard.receiveAttack(coordinates);
  expect(() => testGameboard.receiveAttack(coordinates)).toThrow();
});

test('Gameboard: receiveAttack (Error - out Of Board)', () => {
  const testGameboard = createBoard();
  const testShip1 = createShip(3);
  const coordinates = [6, 0];
  testGameboard.placeShip(testShip1, coordinates);

  expect(() => testGameboard.receiveAttack([10, 12])).toThrow();
});

test('Gameboard: report whether if all ships sunk (no ships)', () => {
  const testGameboard = createBoard();
  expect(testGameboard.activeShips()).toBe(0);
});

test('Gameboard: report whether if all sunk (not all sunk)', () => {
  const testGameboard = createBoard();
  const testShip1 = createShip(3);
  const coordinates = [6, 0];
  const testShip2 = createShip(3);
  const coordinates2 = [7, 1, true];

  testGameboard.placeShip(testShip1, coordinates);
  testGameboard.placeShip(testShip2, coordinates2);
  expect(testGameboard.activeShips()).toBe(2);

  testGameboard.receiveAttack([6, 0]);
  testGameboard.receiveAttack([6, 1]);
  testGameboard.receiveAttack([6, 2]);

  expect(testGameboard.activeShips()).toBe(1);
});

test('Gameboard: report whether if all sunk (all sunk)', () => {
  const isSunkTest = createBoard();
  isSunkTest.placeShip(createShip(2), [8, 1, false]);
  isSunkTest.placeShip(createShip(1), [1, 1, false]);
  isSunkTest.placeShip(createShip(1), [5, 1, false]);
  expect(isSunkTest.activeShips()).toBe(3);

  isSunkTest.receiveAttack([8, 1]);
  isSunkTest.receiveAttack([8, 2]);

  isSunkTest.receiveAttack([1, 1]);

  isSunkTest.receiveAttack([5, 1]);

  expect(isSunkTest.activeShips()).toBe(0);
});
