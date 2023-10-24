const createRoundsUI = (field) => {
  const container = document.createElement('div');
  container.classList.add('hud-rounds');
  if (field.ship) container.classList.add('ship');
  if (field.mark) container.classList.add(`${field.mark}`);

  return container;
};

const createNamesUI = (player1, player2) => {
  const container = document.createElement('div');
  container.classList.add('hud-namesContainer');

  const name1 = document.createElement('div');
  name1.classList.add('hud-name1');
  container.append(name1);

  const name2 = document.createElement('div');
  name2.classList.add('hud-name2');
  container.append(name2);

  return container;
};

export default { createNamesUI, createRoundsUI };
