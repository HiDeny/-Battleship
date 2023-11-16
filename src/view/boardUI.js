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

const createFieldUI = (field) => {
  const fieldButton = document.createElement('button');
  const [row, column] = field.coordinates;

  fieldButton.classList.add('board-field');
  fieldButton.dataset.column = column;
  fieldButton.dataset.row = row;
  fieldButton.dataset.ship = false;

  return fieldButton;
};

const renderBoard = (board, isEnemy) => {
  const boardUI = document.createElement('div');
  boardUI.classList.add('board');

  boardUI.append(createVideoBackground());

  board.forEach((row) => {
    row.forEach((field) => {
      const fieldButton = createFieldUI(field);
      
      if (isEnemy) {
        fieldButton.onclick = handleClickField;
      } else {
        fieldButton.addEventListener('dragover', handleDragOver);
        fieldButton.addEventListener('dragleave', handleDragLeave);
        fieldButton.addEventListener('drop', handleDragDrop);
      }

      boardUI.append(fieldButton);
    });
  });

  return boardUI;
};

export default renderBoard;
