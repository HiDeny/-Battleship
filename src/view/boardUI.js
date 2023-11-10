import videoFile from './assets/backvid.mp4';

import PubSub from '../modules/pubsub';
import {
  handleDragDrop,
  handleDragOver,
  handleDragLeave,
  handleDragEnter,
} from '../controller/drag-and-drop';

const handleClickField = (event) => {
  const { row, column } = event.target.dataset;
  PubSub.publish('field-click', [row, column]);
};

const createFieldUI = (field, isEnemy) => {
  const fieldButton = document.createElement(isEnemy ? 'button' : 'div');
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;
  fieldButton.dataset.ship = false;

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) fieldButton.classList.add(mark);
  });

  if (isEnemy) fieldButton.onclick = handleClickField;
  if (!isEnemy) {
    fieldButton.addEventListener('dragenter', handleDragEnter);
    fieldButton.addEventListener('dragover', handleDragOver);
    fieldButton.addEventListener('dragleave', handleDragLeave);
    fieldButton.addEventListener('drop', handleDragDrop);
  }

  if (!isEnemy) {
    PubSub.subscribe('field-ship', (coordinates, type) => {
      if (coordinates === field.coordinates) {
        fieldButton.dataset.ship = true;
        fieldButton.classList.add(type);
      }
    });

    PubSub.subscribe('field-ship-offset', (coordinates) => {
      if (coordinates === field.coordinates) {
        fieldButton.dataset.offset = true;
      }
    });
  }

  return fieldButton;
};

const createVideoBackground = () => {
  const video = document.createElement('video');
  video.classList.add('video-container');

  video.autoplay = true;
  video.loop = true;
  video.src = videoFile;
  video.type = 'video/mp4';

  return video;
};

const renderBoard = (board, name, isEnemy) => {
  const boardUI = document.createElement('div');
  boardUI.classList.add('board');
  boardUI.setAttribute('name', name);

  boardUI.append(createVideoBackground());

  board.forEach((row) => {
    row.forEach((field) => {
      const fieldUI = createFieldUI(field, isEnemy);
      boardUI.append(fieldUI);
    });
  });

  return boardUI;
};

export default renderBoard;
