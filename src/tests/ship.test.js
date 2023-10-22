/* eslint-disable no-undef */
import createShip from '../modules/ship';

const testShip = createShip(3);

test('Ship: have length', () => {
  expect(testShip.length).toBeGreaterThan(0);
});

test('Ship: been hit', () => {
  expect(testShip.getHealth()).toBe(testShip.length);
  expect(testShip.hit()).toBe(true);
  expect(testShip.getHealth()).toBe(testShip.length - 1);
});

test('Ship: is sunk', () => {
  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});

test.todo('Ship: is sunk');
