import PubSub from '../modules/pubsub';

const createRoundsUI = () => {
  const rounds = document.createElement('h2');
  rounds.textContent = 0;
  rounds.classList.add('hud-rounds');

  PubSub.subscribe('game-round', (round) => {
    rounds.textContent = round;
  });

  return rounds;
};

const createNamesUI = (player1, player2) => {
  const container = document.createElement('div');
  container.classList.add('hud-namesContainer');

  const name1 = document.createElement('div');
  name1.classList.add('hud-name1');
  name1.textContent = player1;
  container.append(name1);

  const name2 = document.createElement('div');
  name2.classList.add('hud-name2');
  name2.textContent = player2;
  container.append(name2);

  return container;
};

const createResultUI = (player1, player2) => {
  const result = document.createElement('div');
  result.classList.add('hud-result');

  const coordinatesDisplay = document.createElement('p');
  coordinatesDisplay.classList.add('hud-position');
  coordinatesDisplay.textContent = 'Coordinates';

  const shotResult = document.createElement('p');
  shotResult.classList.add('hud-shotResult');
  shotResult.textContent = 'Shot Result';

  result.append(coordinatesDisplay);
  result.append(shotResult);

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    coordinatesDisplay.textContent = `Row: ${coordinates[0]} , Column: ${coordinates[1]}`;
    shotResult.textContent = `${mark.toUpperCase()}!`;
  });

  return result;
};

export { createNamesUI, createRoundsUI, createResultUI };
