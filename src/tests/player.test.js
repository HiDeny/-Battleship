/* eslint-disable no-undef */
import createPlayer from '../modules/player';

const playerHuman = createPlayer('Mark');
const playerComputer = createPlayer('John', false);

test('Player: have board', () => {
  expect(playerHuman.gameboard).toBeDefined();
});

test('Player: Place ship', () => {
  playerHuman.placeShip('AircraftCarrier', [9, 4]);

  expect(playerHuman.gameboard.shipsOnBoard.length).toBeGreaterThan(0);
});

test('Player: Attack', () => {
  const enemyBoard = playerComputer.gameboard;
  enemyBoard.placeShip('Battleship', [1, 8, true]);

  expect(playerHuman.attack(enemyBoard, [1, 2])).toBe('Miss!');
});
