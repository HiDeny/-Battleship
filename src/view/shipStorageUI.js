// const rotateShipButton = () => {
//   const rotateButton = document.createElement('button');
//   rotateButton.classList.add('rotateShip');

//   let isVertical = true;
//   rotateButton.textContent = isVertical
//     ? 'Rotate Horizontal'
//     : 'Rotate Vertical';

//   rotateButton.addEventListener('click', () => {
//     isVertical = !isVertical;
//     rotateButton.dataset.isVertical = isVertical;
//   });

//   return;
// };

// let beingDragged;

const handleDragStart = (event) => {
  console.log(event.target);
  event.target.classList.add('dragging');
};

const handleDragEnd = (event) => {
  console.log(event.target);
  event.target.classList.remove('dragging');
};

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  shipContainer.classList.add(`${type}`);

  shipContainer.dataset.length = length;
  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', handleDragStart);
  shipContainer.addEventListener('dragend', handleDragEnd);

  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.classList.add('ship-block');
    shipContainer.append(shipBlock);
  }

  return shipContainer;
};

const renderShipStorage = (shipStorage) => {
  const storage = document.createElement('div');
  storage.classList.add('board-ships');

  Object.keys(shipStorage).forEach((shipType) => {
    const newShip = renderShip(shipStorage[shipType]);
    storage.append(newShip);
  });

  return storage;
};

export default renderShipStorage;
