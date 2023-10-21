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

  expect(testGameboard.receiveAttack(coordinates)).toBe('Hit!');
});

test('Gameboard: receiveAttack (Miss)', () => {
  const coordinates = [6, 0];
  expect(testGameboard.receiveAttack(coordinates)).toBe('Miss!');
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
  expect(testGameboard2.checkShips()).toBe('No ships on board');
});

test('Gameboard: report whether if all sunk (not all sunk)', () => {
  expect(testGameboard.checkShips()).toBe('Active ships on board');
});

test('Gameboard: report whether if all sunk (all sunk)', () => {
  testGameboard.receiveAttack([8, 1]);
  testGameboard.receiveAttack([8, 2]);
  testGameboard.receiveAttack([8, 3]);

  testGameboard.receiveAttack([5, 1]);
  testGameboard.receiveAttack([7, 1]);

  expect(testGameboard.checkShips()).toBe('All ships destroyed');
});
