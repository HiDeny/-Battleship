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
  event.target.classList.add('dragging');
};

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging');
  const wasOver = document.querySelectorAll('.draggingOver');
  const wasAvailable = document.querySelectorAll('.available');
  const wasNotAvailable = document.querySelectorAll('.not-available');

  wasOver.forEach((element) => element.classList.remove('draggingOver'));
  wasAvailable.forEach((element) => element.classList.remove('available'));
  wasNotAvailable.forEach((element) => {
    element.classList.remove('not-available');
  });
};

const renderShip = (newShip) => {
  const shipContainer = document.createElement('div');
  const { length, type } = newShip;
  shipContainer.classList.add(`${type}`);

  shipContainer.dataset.type = type;
  shipContainer.dataset.length = length;
  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', handleDragStart);
  shipContainer.addEventListener('dragend', handleDragEnd);

  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.classList.add('ship-block');
    shipBlock.draggable = false;
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
