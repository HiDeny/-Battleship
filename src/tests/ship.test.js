/* eslint-disable no-undef */
import createShipStorage from '../modules/ship';

const shipStorage = createShipStorage();

test('Ship: have length', () => {
  const testShip = shipStorage.Cruiser;
  expect(testShip.length).toBeGreaterThan(0);
});

test('Ship: been hit', () => {
  const testShip = shipStorage.Cruiser;

  expect(testShip.health).toBe(testShip.length);
  testShip.hit();
  expect(testShip.health).toBe(testShip.length - 1);
});

test('Ship: is sunk', () => {
  const testShip = shipStorage.Cruiser;

  expect(testShip.isSunk()).toBe(false);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe(true);
});
