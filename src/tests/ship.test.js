import createShip from '../ship';

const testShip = createShip(3);

test('Ship: have length', () => {
  expect(testShip.length).toBeGreaterThan(0);
});

test('Ship: been hit', () => {
  expect(testShip.health).toBe(testShip.length);
  expect(testShip.hit()).toBe('Got hit');
  expect(testShip.health).toBe(testShip.length - 1);
});

test('Ship: is sunk', () => {
  expect(testShip.isSunk()).toBe(testShip.health);
  testShip.hit();
  testShip.hit();
  testShip.hit();
  expect(testShip.isSunk()).toBe('Ship sunk!');
});

test.todo('Ship: is sunk');
