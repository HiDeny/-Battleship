/* eslint-disable no-undef */
import createGameboard from '../gameboard';
import createShip from '../ship';

const testGameboard = createGameboard();

test('Gameboard: Place ships at specific coordinates', () => {
  const testShip = createShip(2);
  const coordinates = [9, 1];
  const board = testGameboard.getBoard();

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].haveBoat).toHaveProperty('length');
  }
});

test('Gameboard: Place ships at specific coordinates', () => {
  const testShip = createShip(4);
  const coordinates = [8, 1];
  const board = testGameboard.getBoard();

  testGameboard.placeShip(testShip, coordinates);

  for (let i = coordinates[1]; i < coordinates[1] + testShip.length; i += 1) {
    expect(board[coordinates[0]][i].haveBoat).toHaveProperty('length');
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

test.todo('Gameboard: report whether if all ships have been sunk.');
