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

const renderShipStorage = (shipStorage) => {
  const storage = document.createElement('div');
  storage.classList.add('board-ships');

  Object.keys(shipStorage).forEach((shipType) => {
    const currentShip = shipStorage[shipType];

    const shipContainer = document.createElement('div');
    shipContainer.classList.add(`${shipType}`);

    shipContainer.dataset.length = currentShip.length;
    shipContainer.draggable = true;

    for (let i = 0; i < currentShip.length; i += 1) {
      const shipBlock = document.createElement('div');
      shipBlock.classList.add('ship-block');
      shipContainer.append(shipBlock);
    }

    // shipContainer.addEventListener('dragstart', handleDragStart);
    // shipContainer.addEventListener('dragend', handleDragEnd);

    storage.append(shipContainer);
  });

  return storage;
};

export default renderShipStorage;
