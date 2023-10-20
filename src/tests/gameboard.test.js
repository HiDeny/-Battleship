import createGameboard from '../gameboard';
import createShip from '../ship';

const testGameboard = createGameboard();

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

test('Gameboard: Place ships at specific coordinates', () => {
  const testShip = createShip(2);
  expect(testGameboard.placeShip(testShip, 1)).toBe(1, 1 + testShip.length);
});

test.todo('Gameboard: receiveAttack');

test.todo('Gameboard: keep track of missed attacks');

test.todo('Gameboard: report whether if all ships have been sunk.');
