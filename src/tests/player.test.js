/* eslint-disable no-undef */
import createPlayer from '../modules/player';

const playerHuman = createPlayer('Mark');
const playerComputer = createPlayer('John', false);

test('Player: have board', () => {
  expect(playerHuman.gameboard).toBeDefined();
});

test.skip('Player: Place ship', () => {
  const enemyBoard = playerComputer.gameboard;
  console.log(playerComputer.storedShips);
  expect(playerHuman.attack(enemyBoard, [1, 2])).toBe('Miss!');
});

test.skip('Player: Attack', () => {
  const enemyBoard = playerComputer.gameboard;
  console.log(playerComputer.storedShips);
  expect(playerHuman.attack(enemyBoard, [1, 2])).toBe('Miss!');
});
