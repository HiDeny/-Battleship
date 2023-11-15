import PubSub from '../modules/pubsub';
import {
  handleDragDrop,
  handleDragOver,
  handleDragLeave,
} from '../controller/drag-and-drop';

import videoFile from './assets/back-video.mp4';

const createVideoBackground = () => {
  const video = document.createElement('video');
  video.classList.add('video-container');

  video.autoplay = true;
  video.loop = true;
  video.src = videoFile;
  video.type = 'video/mp4';

  return video;
};

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
  if (isEnemy) fieldButton.onclick = handleClickField;

  if (!isEnemy) {
    fieldButton.addEventListener('dragover', handleDragOver);
    fieldButton.addEventListener('dragleave', handleDragLeave);
    fieldButton.addEventListener('drop', handleDragDrop);
  }

  PubSub.subscribe('field-mark', (coordinates, mark) => {
    if (coordinates === field.coordinates) {
      fieldButton.classList.add(mark);
      if (mark === 'hit' && isEnemy) {
        fieldButton.classList.add('hit-enemy');
      }
    }
  });

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

const renderBoard = (board, isEnemy) => {
  const boardUI = document.createElement('div');
  boardUI.classList.add('board');

  boardUI.append(createVideoBackground());

  board.forEach((row) => {
    row.forEach((field) => {
      boardUI.append(createFieldUI(field, isEnemy));
    });
  });

  return boardUI;
};

export default renderBoard;
