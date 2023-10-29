/* eslint-disable no-undef */
import createPlayer from '../modules/player';

test('Player: have board', () => {
  const testPlayer = createPlayer('Mark');
  expect(testPlayer.gameboard).toBeDefined();
});

test('Player: Place ship', () => {
  const testPlayer = createPlayer('Mark');
  const { board } = testPlayer.gameboard;
  const shipType = 'Destroyer2';
  const coordinates = [4, 4, true];

  expect(testPlayer.placeShip(shipType, coordinates)).toHaveProperty(
    'length',
    2
  );
  expect(board[coordinates[0]][coordinates[1]].ship).not.toBe(null);
  expect(board[coordinates[0] + 1][coordinates[1]].ship).not.toBe(null);
  expect(board[coordinates[0] + 2][coordinates[1]].ship).toBe(null);
});

test('Player: Attack (Hit)', () => {
  const testPlayer = createPlayer('Mark');
  const enemyPlayer = createPlayer('Jack', true);

  const enemyBoard = enemyPlayer.gameboard;
  enemyPlayer.placeShip('Battleship', [0, 1, true]);

  expect(testPlayer.attack(enemyBoard, [1, 1])).toBe('hit');
});

test('Player: Attack (Miss)', () => {
  const testPlayer = createPlayer('Mark');
  const enemyPlayer = createPlayer('Jack', true);

  const enemyBoard = enemyPlayer.gameboard;
  enemyPlayer.placeShip('Battleship', [0, 1, true]);

  expect(testPlayer.attack(enemyBoard, [1, 2])).toBe('miss');
});

test('Set ships at random', () => {
  const testPlayer = createPlayer('Hamid');
  testPlayer.placeShipsAtRandom();

  expect(testPlayer.gameboard.activeShips()).toBe(7);
});
