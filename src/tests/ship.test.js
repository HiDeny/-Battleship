/* eslint-disable no-undef */
import createShip from '../modules/ship';

test('Ship: have length', () => {
  const testShip = createShip(3);
  expect(testShip.length).toBeGreaterThan(0);
});

test('Ship: been hit', () => {
  const testShip = createShip(3);

  expect(testShip.getHealth()).toBe(testShip.length);
  testShip.hit();
  expect(testShip.getHealth()).toBe(testShip.length - 1);
});

test('Ship: is sunk', () => {
  const testShip = createShip(3);

  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});