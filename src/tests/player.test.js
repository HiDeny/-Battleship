/* eslint-disable no-undef */
import createPlayer from '../modules/player';

const playerHuman = createPlayer('Mark');
const playerComputer = createPlayer('John', false);

test('Player: have board', () => {
  expect(playerHuman.gameboard).toBeDefined();
});

test.todo('Player: Can attack');
