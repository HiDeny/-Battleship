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

const createResultUI = () => {
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
