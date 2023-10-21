/* eslint-disable no-undef */
import createGameboard from '../modules/gameboard';
import createShip from '../modules/ship';

const testGameboard = createGameboard();

test('Gameboard: Place ships at specific coordinates', () => {
  const testShip = createShip(2);
  const coordinates = [9, 1, false];
  const board = testGameboard.getBoard();

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].boat).toHaveProperty('length');
  }
});

test('Gameboard: Place ships at specific coordinates', () => {
  const testShip = createShip(3);
  const coordinates = [8, 1];
  const board = testGameboard.getBoard();

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].boat).toHaveProperty('length');
  }
});

test('Gameboard: receiveAttack (Hit)', () => {
  const coordinates = [9, 1];

  expect(testGameboard.receiveAttack(coordinates)).toBe('Hit!');
});

test('Gameboard: receiveAttack (Miss)', () => {
  const coordinates = [7, 1];
  expect(testGameboard.receiveAttack(coordinates)).toBe('Miss!');
});

test('Gameboard: receiveAttack (Error)', () => {
  const coordinates = [7, 1];
  expect(() => {
    testGameboard.receiveAttack(coordinates);
  }).toThrow();
});

test.todo('Gameboard: keep track of missed attacks');

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

  testGameboard.receiveAttack([9, 2]);

  expect(testGameboard.checkShips()).toBe('All ships destroyed');
});
