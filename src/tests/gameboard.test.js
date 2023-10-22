/* eslint-disable no-undef */
import createGameboard from '../modules/gameboard';
import createShip from '../modules/ship';

const testGameboard = createGameboard();

test('Gameboard: Place ships at specific coordinates (horizontal)', () => {
  const testShip = createShip(3);

  // Switch to object ?
  const coordinates = [8, 1, false];
  const { board } = testGameboard;

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].ship).toHaveProperty('length');
  }
});

test('Gameboard: Place ships at specific coordinates (vertical)', () => {
  const testShip = createShip(3);
  const coordinates = [5, 1, true];
  const { board } = testGameboard;

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[0]; i < coordinates[0] + testShip.length; i += 1) {
    expect(board[i][coordinates[1]].ship).toHaveProperty('length');
  }
});

test('Gameboard: Place ships at specific coordinates (fail)', () => {
  const testShip = createShip(3);
  const coordinates = [6, 0];

  expect(() => testGameboard.placeShip(testShip, coordinates)).toThrow();
});

test('Gameboard: receiveAttack (Hit)', () => {
  const coordinates = [6, 1];

  expect(testGameboard.receiveAttack(coordinates)).toBe('hit');
});

test('Gameboard: receiveAttack (Miss)', () => {
  const coordinates = [6, 0];
  expect(testGameboard.receiveAttack(coordinates)).toBe('miss');
});

test('Gameboard: receiveAttack (Error - already hit)', () => {
  const coordinates = [6, 0];
  expect(() => testGameboard.receiveAttack(coordinates)).toThrow();
});

test('Gameboard: receiveAttack (Error - out Of Board)', () => {
  const coordinates = [10, 12];
  expect(() => testGameboard.receiveAttack(coordinates)).toThrow();
});

test('Gameboard: report whether if all ships sunk (no ships)', () => {
  const testGameboard2 = createGameboard();
  expect(testGameboard2.activeShips()).toBe(false);
});

test('Gameboard: report whether if all sunk (not all sunk)', () => {
  expect(testGameboard.activeShips()).toBe(true);
});

test('Gameboard: report whether if all sunk (all sunk)', () => {
  const isSunkTest = createGameboard();
  isSunkTest.placeShip(createShip(2), [8, 1, false]);

  isSunkTest.receiveAttack([8, 1]);
  isSunkTest.receiveAttack([8, 2]);

  isSunkTest.shipsOnBoard.forEach((ship) => {
    console.log(ship.getHealth());
  });

  expect(isSunkTest.activeShips()).toBe(false);
});
