/* eslint-disable no-undef */
import createPlayer from '../modules/player';

const playerHuman = createPlayer('Mark');
const playerComputer = createPlayer('John', true);

test('Player: have board', () => {
  expect(playerHuman.gameboard).toBeDefined();
});

test('Player: Place ship', () => {
  playerHuman.placeShip('AircraftCarrier', [4, 4, true]);

  expect(playerHuman.gameboard.shipsOnBoard.length).toBeGreaterThan(0);
});

test('Player: Place ship (fail)', () => {
  expect(() =>
    playerHuman.placeShip('AircraftCarrier', [4, 4, true])
  ).toThrow();
});

test('Player: Attack (Hit)', () => {
  const enemyBoard = playerComputer.gameboard;
  playerComputer.placeShip('Battleship', [0, 1, true]);

  expect(playerHuman.attack(enemyBoard, [1, 1])).toBe('Hit!');
});

test('Player: Attack (Miss)', () => {
  const enemyBoard = playerComputer.gameboard;

  expect(playerHuman.attack(enemyBoard, [1, 2])).toBe('Miss!');
});

test('Computer: Attack', () => {
  const enemyBoard = playerHuman.gameboard;

  expect(playerComputer.randomAttack(enemyBoard)).toMatch(/(Hit!)|(Miss!)/g);
});

test('Set ships at random', () => {
  const newTestPlayer = createPlayer('Hamid');
  newTestPlayer.placeShipsAtRandom();

  Object.keys(newTestPlayer.storedShips).forEach((shipName) => {
    expect(newTestPlayer.storedShips[shipName].quantity).toBe(0);
  });
});
