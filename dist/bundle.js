/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/controller/drag-and-drop.js":
/*!*****************************************!*\
  !*** ./src/controller/drag-and-drop.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleDragDrop: () => (/* binding */ handleDragDrop),
/* harmony export */   handleDragEnd: () => (/* binding */ handleDragEnd),
/* harmony export */   handleDragLeave: () => (/* binding */ handleDragLeave),
/* harmony export */   handleDragOver: () => (/* binding */ handleDragOver),
/* harmony export */   handleDragStart: () => (/* binding */ handleDragStart)
/* harmony export */ });
/* harmony import */ var _view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../view/fieldsHelper */ "./src/view/fieldsHelper.js");

const handleDragStart = ({
  target
}) => {
  target.classList.add('dragging');
  const {
    length,
    direction,
    row,
    column
  } = target.dataset;
  const occupiedFields = (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.getFields)(row, column, length, direction);
  (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.clearFields)(occupiedFields);
  occupiedFields.coreFields.forEach(div => div.classList.add('draggedFrom'));
};
const clearGuides = () => {
  const availableShip = document.querySelectorAll('.available-ship');
  const availableOffset = document.querySelectorAll('.available-offset');
  const notAvailable = document.querySelectorAll('.not-available');
  availableShip.forEach(div => div.classList.remove('available-ship'));
  availableOffset.forEach(div => div.classList.remove('available-offset'));
  notAvailable.forEach(div => div.classList.remove('not-available'));
};
const handleDragEnd = ({
  target
}) => {
  const draggedFrom = document.querySelectorAll('.draggedFrom');
  const {
    row,
    column
  } = target.dataset;
  const oldX = Number(draggedFrom[0].dataset.row);
  const oldY = Number(draggedFrom[0].dataset.column);
  const isSame = oldX === Number(row) && oldY === Number(column);
  if (isSame) (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.updateFieldsShip)(draggedFrom, 'true');
  draggedFrom.forEach(div => div.classList.remove('draggedFrom'));
  target.classList.remove('dragging');
  clearGuides();
};
const handleDragLeave = event => {
  event.preventDefault();
  clearGuides();
};
const handleDragDrop = event => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const {
    length,
    direction
  } = dragged.dataset;
  const {
    row,
    column
  } = event.target.dataset;
  const newFields = (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.getFields)(row, column, length, direction);
  const {
    coreFields,
    offsetFields
  } = newFields;
  let allAvailable = true;
  if (coreFields.length !== Number(length) || coreFields.includes(null)) return;
  allAvailable = (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.isAvailableFields)(coreFields, offsetFields);
  if (allAvailable) {
    event.target.append(dragged);
    dragged.dataset.row = row;
    dragged.dataset.column = column;
    (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.populateFields)(newFields);
  }
};
const handleDragOver = event => {
  event.preventDefault();
  const dragged = document.querySelector('.dragging');
  const {
    length,
    direction
  } = dragged.dataset;
  const {
    row,
    column
  } = event.target.dataset;
  const currentFields = (0,_view_fieldsHelper__WEBPACK_IMPORTED_MODULE_0__.getFields)(row, column, length, direction);
  const {
    coreFields,
    offsetFields
  } = currentFields;
  offsetFields.forEach(div => {
    if (!div) return;
    const {
      ship
    } = div.dataset;
    const style = ship === 'true' ? 'not-available' : 'available-offset';
    div.classList.add(style);
  });
  if (coreFields.length !== Number(length) || coreFields.includes(null)) {
    coreFields.forEach(div => {
      if (!div) return;
      div.classList.add('not-available');
    });
    return;
  }
  coreFields.forEach(div => {
    let correctClass = 'available-ship';
    const {
      ship,
      offset
    } = div.dataset;
    if (ship === 'true' || offset === 'true') correctClass = 'not-available';
    div.classList.add(correctClass);
  });
};

/***/ }),

/***/ "./src/controller/gameController.js":
/*!******************************************!*\
  !*** ./src/controller/gameController.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/player */ "./src/modules/player.js");
/* harmony import */ var _modules_Ai_aiPlayer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/Ai/aiPlayer */ "./src/modules/Ai/aiPlayer.js");
/* harmony import */ var _modules_gameLoop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modules/gameLoop */ "./src/modules/gameLoop.js");
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");




const GameController = () => {
  let currentNames;
  let player1;
  let player2;
  let currentGame;
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].subscribe('game-setup', names => {
    const [nameP1, nameP2] = names;
    currentNames = names;
    player1 = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])(nameP1);
    player2 = nameP2 ? (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])(nameP2) : (0,_modules_Ai_aiPlayer__WEBPACK_IMPORTED_MODULE_1__["default"])('Enemy');
    currentGame = (0,_modules_gameLoop__WEBPACK_IMPORTED_MODULE_2__["default"])(player1, player2);
    _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].publish('game-ready', currentGame);
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].subscribe('game-status', phase => {
    if (phase === 'Start') {
      currentGame.setShips();
      _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].publish('game-turn', player2);
      currentGame.playRound(null);
    }
    if (phase === 'Restart') {
      const [nameP1, nameP2] = currentNames;
      player1 = (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])(nameP1);
      player2 = nameP2 ? (0,_modules_player__WEBPACK_IMPORTED_MODULE_0__["default"])(nameP2) : (0,_modules_Ai_aiPlayer__WEBPACK_IMPORTED_MODULE_1__["default"])('Enemy');
      currentGame = (0,_modules_gameLoop__WEBPACK_IMPORTED_MODULE_2__["default"])(player1, player2);
      _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].publish('game-round', 0);
      _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].publish('game-ready', currentGame);
    }
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_3__["default"].subscribe('field-click', async coordinates => {
    const shotResult = await currentGame.playRound(coordinates);
    if (shotResult === 'miss') await currentGame.playRound(null);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameController);

/***/ }),

/***/ "./src/controller/screenController.js":
/*!********************************************!*\
  !*** ./src/controller/screenController.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");
/* harmony import */ var _view_hudUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/hudUI */ "./src/view/hudUI.js");
/* harmony import */ var _view_welcomeScreen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/welcomeScreen */ "./src/view/welcomeScreen.js");
/* harmony import */ var _view_gameBoardUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../view/gameBoardUI */ "./src/view/gameBoardUI.js");




const cleanOldBoards = () => {
  const oldHud = document.querySelector('.hud');
  const oldGameBoardP1 = document.querySelector('.gameboard.player1');
  const oldGameBoardP2 = document.querySelector('.gameboard.player2');
  if (oldHud) oldHud.remove();
  if (oldGameBoardP1) oldGameBoardP1.remove();
  if (oldGameBoardP2) oldGameBoardP2.remove();
};
const ScreenController = () => {
  const welcomeScreen = (0,_view_welcomeScreen__WEBPACK_IMPORTED_MODULE_2__["default"])();
  document.body.append(welcomeScreen);
  let currentGame;
  let activeShipsP1;
  let activeShipsP2;
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('game-ready', game => {
    cleanOldBoards();
    currentGame = game;
    activeShipsP1 = 0;
    activeShipsP2 = 0;
    const hud = (0,_view_hudUI__WEBPACK_IMPORTED_MODULE_1__["default"])();
    const gameboard1 = (0,_view_gameBoardUI__WEBPACK_IMPORTED_MODULE_3__["default"])(game.player1);
    const gameboard2 = (0,_view_gameBoardUI__WEBPACK_IMPORTED_MODULE_3__["default"])(game.player2, true);
    document.body.append(hud, gameboard1, gameboard2);
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('field-mark', (coordinates, mark) => {
    const {
      activePlayer,
      player1
    } = currentGame;
    const boardToMark = activePlayer === player1 ? 'player2' : 'player1';
    const container = document.querySelector(`div.gameboard.${boardToMark}`);
    const [row, column] = coordinates;
    const selectorBase = `[data-row='${row}'][data-column='${column}']`;
    const field = container.querySelector(selectorBase);
    field.classList.add(mark);
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('game-ships-check', () => {
    const {
      player1,
      player2
    } = currentGame;
    const checkShipsP1 = player1.gameboard.activeShips();
    const checkShipsP2 = player2.gameboard.activeShips();
    if (checkShipsP1 !== activeShipsP1) {
      const container = document.querySelector('.player1');
      const count = container.querySelector('.board-stats-ships-count');
      count.textContent = checkShipsP1;
      count.classList.add('alert');
      setTimeout(() => {
        count.classList.remove('alert');
      }, 700);
      activeShipsP1 = checkShipsP1;
    }
    if (checkShipsP2 !== activeShipsP2) {
      const container = document.querySelector('.player2');
      const count = container.querySelector('.board-stats-ships-count');
      count.textContent = checkShipsP2;
      count.classList.add('alert');
      setTimeout(() => {
        count.classList.remove('alert');
      }, 700);
      activeShipsP2 = checkShipsP2;
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScreenController);

/***/ }),

/***/ "./src/modules/Ai/aiHelpers.js":
/*!*************************************!*\
  !*** ./src/modules/Ai/aiHelpers.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRandomNextShot: () => (/* binding */ getRandomNextShot),
/* harmony export */   saveHit: () => (/* binding */ saveHit),
/* harmony export */   saveMiss: () => (/* binding */ saveMiss),
/* harmony export */   saveSunk: () => (/* binding */ saveSunk),
/* harmony export */   shotDelay: () => (/* binding */ shotDelay)
/* harmony export */ });
/* harmony import */ var _coordHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../coordHelper */ "./src/modules/coordHelper.js");

const checkNextShot = (markedFields, nextMark) => {
  const [markX, markY] = nextMark;
  const nextMarkStr = `${markX},${markY}`;
  const isInsideX = markX >= 0 && markX <= 9;
  const isInsideY = markY >= 0 && markY <= 9;
  const isInside = isInsideX && isInsideY;
  const alreadyMarked = markedFields.has(nextMarkStr);
  return !alreadyMarked && isInside;
};
const getRandomNextShot = markedFields => {
  let randomShot = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_0__.getRandomCoordinates)();
  while (!checkNextShot(markedFields, randomShot)) {
    randomShot = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_0__.getRandomCoordinates)();
  }
  return randomShot;
};
const getOppositeDirection = direction => {
  if (direction === 'up') return 'down';
  if (direction === 'left') return 'right';
  if (direction === 'right') return 'left';
  if (direction === 'down') return 'up';
  return false;
};
const possibleShots = coordinates => ({
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] - 1],
  up: [coordinates[0] + 1, coordinates[1]],
  right: [coordinates[0], coordinates[1] + 1]
});
const saveHit = (markedFields, fieldHits, possibleHits, highProbabilityShot, shot) => {
  const shotStr = `${shot[0]},${shot[1]}`;
  const nextPossibleHits = possibleShots(shot);
  fieldHits.set(shotStr, shot);
  Object.keys(nextPossibleHits).forEach(key => {
    const nextShot = nextPossibleHits[key];
    const nextX = nextShot[0];
    const nextY = nextShot[1];
    const nextShotStr = `${nextX},${nextY}`;
    if (checkNextShot(markedFields, nextShot)) {
      possibleHits.push(nextShot);
      markedFields.add(shotStr);
    }

    // If the shot is already in hits, add two more to high possibility hits
    if (fieldHits.has(nextShotStr)) {
      const lastHit = fieldHits.get(nextShotStr);
      const oneExtra = possibleShots(lastHit)[key];
      const oppositeDirStr = getOppositeDirection(key);
      const oppositeDir = nextPossibleHits[oppositeDirStr];
      if (checkNextShot(markedFields, oppositeDir)) {
        highProbabilityShot.push(oppositeDir);
      }
      if (checkNextShot(markedFields, oneExtra)) {
        highProbabilityShot.unshift(oneExtra);
      }
    }
  });
};
const saveMiss = (markedFields, shot) => {
  const shotStr = `${shot[0]},${shot[1]}`;
  markedFields.add(shotStr);
};
const saveSunk = (markedFields, fieldHits, shot, result) => {
  const sunkenShip = result[1];
  const shotStr = `${shot[0]},${shot[1]}`;
  fieldHits.set(shotStr, shot);
  markedFields.add(shotStr);
  sunkenShip.offset.forEach(field => {
    const {
      coordinates
    } = field;
    const [row, column] = coordinates;
    const offsetStr = `${row},${column}`;
    if (!markedFields.has(offsetStr)) markedFields.add(offsetStr);
  });
};
const shotDelay = async (enemyBoard, currentShot) => new Promise(resolve => {
  setTimeout(() => {
    resolve(enemyBoard.receiveAttack(currentShot));
  }, 1200);
});

/***/ }),

/***/ "./src/modules/Ai/aiPlayer.js":
/*!************************************!*\
  !*** ./src/modules/Ai/aiPlayer.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../board */ "./src/modules/board.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ship */ "./src/modules/ship.js");
/* harmony import */ var _coordHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../coordHelper */ "./src/modules/coordHelper.js");
/* harmony import */ var _aiHelpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./aiHelpers */ "./src/modules/Ai/aiHelpers.js");




const createAiPlayer = name => {
  const gameboard = (0,_board__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const fieldHits = new Map();
  const markedFields = new Set();
  let possibleHits = [];
  let highProbabilityShot = [];
  const shipStorage = (0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const getNextShot = () => {
    if (highProbabilityShot.length > 0) {
      return highProbabilityShot.pop();
    }
    if (possibleHits.length > 0) {
      return possibleHits.shift();
    }
    return (0,_aiHelpers__WEBPACK_IMPORTED_MODULE_3__.getRandomNextShot)(markedFields);
  };
  const saveShotResult = (shot, result) => {
    if (result === 'miss') (0,_aiHelpers__WEBPACK_IMPORTED_MODULE_3__.saveMiss)(markedFields, shot);
    if (result === 'hit') {
      (0,_aiHelpers__WEBPACK_IMPORTED_MODULE_3__.saveHit)(markedFields, fieldHits, possibleHits, highProbabilityShot, shot);
    }
    // Ship sunk
    if (Array.isArray(result)) {
      (0,_aiHelpers__WEBPACK_IMPORTED_MODULE_3__.saveSunk)(markedFields, fieldHits, shot, result);
      possibleHits = [];
      highProbabilityShot = [];
    }
  };
  return {
    name,
    shipStorage,
    gameboard,
    placeShips() {
      const shipsOnBoard = [];
      Object.keys(shipStorage).forEach(shipType => {
        const ship = shipStorage[shipType];
        const {
          length
        } = ship;
        let newCoordinates = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_2__.getRandomCoordinates)();
        const toCheck = {
          coordinates: newCoordinates,
          board: gameboard.board,
          shipLength: length
        };
        while (!(0,_coordHelper__WEBPACK_IMPORTED_MODULE_2__.checkShipCoordinates)(toCheck)) {
          newCoordinates = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_2__.getRandomCoordinates)();
          toCheck.coordinates = newCoordinates;
        }
        gameboard.placeShip(ship, newCoordinates);
        return ship;
      });
      return shipsOnBoard;
    },
    async attack(enemyBoard) {
      let shots = 1;
      for (let i = 0; i < shots; i += 1) {
        const currentShot = getNextShot();
        // eslint-disable-next-line no-await-in-loop
        const result = await (0,_aiHelpers__WEBPACK_IMPORTED_MODULE_3__.shotDelay)(enemyBoard, currentShot);
        saveShotResult(currentShot, result);

        // Array = Ship sunk
        if (result === 'hit' || Array.isArray(result)) {
          shots += 1;
        }
      }
      return 'miss';
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createAiPlayer);

/***/ }),

/***/ "./src/modules/board-field.js":
/*!************************************!*\
  !*** ./src/modules/board-field.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/modules/pubsub.js");

const createBoardField = coordinates => {
  let mark = null;
  let ship = null;
  let offset = null;
  return {
    coordinates,
    get ship() {
      return ship;
    },
    set ship(newShip) {
      if (ship !== null) throw new Error('Field Occupied!');
      ship = newShip;
    },
    get offset() {
      return offset;
    },
    set offset(value) {
      offset = value;
    },
    markField(isOffset = false) {
      if (mark !== null && !isOffset) throw new Error(`Already marked!`);
      mark = ship ? 'hit' : 'miss';
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('field-mark', coordinates, mark);
      if (ship) {
        ship.hit();
        if (ship.isSunk()) {
          ship.offset.forEach(field => field.markField(true));
          _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-ships-check');
          return ['ship sunk', ship];
        }
      }
      return mark;
    },
    get mark() {
      return mark;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBoardField);

/***/ }),

/***/ "./src/modules/board.js":
/*!******************************!*\
  !*** ./src/modules/board.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _board_field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board-field */ "./src/modules/board-field.js");
/* harmony import */ var _coordHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./coordHelper */ "./src/modules/coordHelper.js");


const setOffset = (currentField, ship) => {
  if (!currentField) return;
  // eslint-disable-next-line no-param-reassign
  currentField.offset = true;
  ship.offset.push(currentField);
};
const populateFields = (board, newShip, coordinates) => {
  const [row, column, isVertical] = coordinates;
  const {
    length
  } = newShip;
  const dynamicDir = isVertical ? row : column;
  const oneBefore = dynamicDir - 1;
  const oneAfter = dynamicDir + length;

  // Offset before ship
  if (oneBefore > -1) {
    const coordToCheck = isVertical ? [oneBefore, column] : [row, oneBefore];
    const {
      base,
      up,
      down
    } = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_1__.getFields)(coordToCheck, isVertical, board);
    setOffset(base, newShip);
    setOffset(up, newShip);
    setOffset(down, newShip);
  }

  // Offset after ship
  if (oneAfter < 10) {
    const coordToCheck = isVertical ? [oneAfter, column] : [row, oneAfter];
    const {
      base,
      up,
      down
    } = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_1__.getFields)(coordToCheck, isVertical, board);
    setOffset(base, newShip);
    setOffset(up, newShip);
    setOffset(down, newShip);
  }
  for (let i = dynamicDir; i < oneAfter; i += 1) {
    const coordToCheck = isVertical ? [i, column] : [row, i];
    const {
      base,
      up,
      down
    } = (0,_coordHelper__WEBPACK_IMPORTED_MODULE_1__.getFields)(coordToCheck, isVertical, board);
    base.ship = newShip;
    setOffset(up, newShip);
    setOffset(down, newShip);
  }
};
const initBoard = () => {
  const board = [];
  const rows = 10;
  const columns = 10;
  for (let i = 0; i < rows; i += 1) {
    board[i] = [];
    for (let j = 0; j < columns; j += 1) {
      board[i][j] = (0,_board_field__WEBPACK_IMPORTED_MODULE_0__["default"])([i, j]);
    }
  }
  return board;
};
const createBoard = () => {
  const board = initBoard();
  const shipsOnBoard = [];
  return {
    board,
    shipsOnBoard,
    placeShip(newShip, coordinates) {
      populateFields(board, newShip, coordinates);
      shipsOnBoard.push(newShip);
    },
    receiveAttack(coordinates) {
      if (!shipsOnBoard.length) throw new Error('No ships on board!');
      const [row, column] = coordinates;
      const currentField = board[row][column];
      const markField = currentField.markField();
      return markField;
    },
    activeShips() {
      let livingShips = shipsOnBoard.length;
      shipsOnBoard.forEach(ship => {
        livingShips -= ship.isSunk() ? 1 : 0;
      });
      return livingShips;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createBoard);

/***/ }),

/***/ "./src/modules/coordHelper.js":
/*!************************************!*\
  !*** ./src/modules/coordHelper.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkShipCoordinates: () => (/* binding */ checkShipCoordinates),
/* harmony export */   getFields: () => (/* binding */ getFields),
/* harmony export */   getRandomCoordinates: () => (/* binding */ getRandomCoordinates)
/* harmony export */ });
const getRandomCoordinates = () => {
  const randomRow = Math.floor(Math.random() * 10);
  const randomColumn = Math.floor(Math.random() * 10);
  const isVertical = Math.random() < 0.5;
  return [randomRow, randomColumn, isVertical];
};
const getFields = (coordinates, isVertical, board) => {
  const [row, column] = coordinates;
  const dynamicDir = isVertical ? Number(column) : Number(row);
  const insideBoardUp = dynamicDir + 1 <= 9;
  const insideBoardDown = dynamicDir - 1 >= 0;
  const [upRow, upCol] = isVertical ? [row, column + 1] : [row + 1, column];
  const [downRow, downCol] = isVertical ? [row, column - 1] : [row - 1, column];
  const base = board[row][column];
  const up = insideBoardUp ? board[upRow][upCol] : false;
  const down = insideBoardDown ? board[downRow][downCol] : false;
  return {
    base,
    up,
    down
  };
};
const isOccupiedField = field => field ? field.ship !== null : false;
const checkOutOfBoard = (coordinates, shipLength) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);
  return row > 9 || column > 9 || dynamicDir + shipLength - 1 > 9;
};
const checkOffset = (coordinates, shipLength, board) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);
  const oneBefore = dynamicDir - 1;
  if (oneBefore > -1) {
    const coordToCheck = isVertical ? [oneBefore, column] : [row, oneBefore];
    const {
      base,
      up,
      down
    } = getFields(coordToCheck, isVertical, board);
    if (isOccupiedField(base)) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }
  const oneAfter = dynamicDir + shipLength;
  if (oneAfter < 10) {
    const coordToCheck = isVertical ? [oneAfter, column] : [row, oneAfter];
    const {
      base,
      up,
      down
    } = getFields(coordToCheck, isVertical, board);
    if (isOccupiedField(base)) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }
  return false;
};
const checkFields = (coordinates, shipLength, board) => {
  const [row, column, isVertical] = coordinates;
  const dynamicDir = isVertical ? Number(row) : Number(column);
  for (let i = dynamicDir; i < dynamicDir + shipLength; i += 1) {
    const coordToCheck = isVertical ? [i, column] : [row, i];
    const {
      base,
      up,
      down
    } = getFields(coordToCheck, isVertical, board);
    if (isOccupiedField(base) || base.offset === true) return true;
    if (isOccupiedField(up)) return true;
    if (isOccupiedField(down)) return true;
  }
  return false;
};
const checkShipCoordinates = toCheck => {
  const {
    coordinates,
    board,
    shipLength
  } = toCheck;
  if (checkOutOfBoard(coordinates, shipLength)) return false;
  if (checkOffset(coordinates, shipLength, board)) return false;
  if (checkFields(coordinates, shipLength, board)) return false;
  return true;
};

/***/ }),

/***/ "./src/modules/gameLoop.js":
/*!*********************************!*\
  !*** ./src/modules/gameLoop.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/modules/pubsub.js");

const createGameLoop = (player1, player2) => {
  let round = 0;
  let activePlayer = player2;
  let opponentPlayer = player1;
  const switchTurns = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
    opponentPlayer = opponentPlayer === player2 ? player1 : player2;
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-turn', activePlayer);
  };
  const gameOver = () => {
    const activeShipsP1 = player1.gameboard.activeShips();
    const activeShipsP2 = player2.gameboard.activeShips();
    if (activeShipsP1 < 1) return `${player2.name} WINS!`;
    if (activeShipsP2 < 1) return `${player1.name} WINS!`;
    return false;
  };
  return {
    player1,
    player2,
    get activePlayer() {
      return activePlayer;
    },
    setShips() {
      player1.placeShips();
      player2.placeShips();
      _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-ships-check');
    },
    async playRound(coordinates) {
      const currentAttack = await activePlayer.attack(opponentPlayer.gameboard, coordinates);
      if (currentAttack === 'miss') {
        switchTurns();
        round += 1;
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-round', round);
      }
      if (gameOver()) {
        const gameResult = gameOver();
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-status', 'Game Over', gameResult);
        return gameResult;
      }
      return currentAttack;
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createGameLoop);

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _board__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./board */ "./src/modules/board.js");
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");


const createPlayer = name => {
  const gameboard = (0,_board__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const shipStorage = (0,_ship__WEBPACK_IMPORTED_MODULE_1__["default"])();
  return {
    name,
    shipStorage,
    gameboard,
    placeShip(shipType, coordinates) {
      const completeShip = shipStorage[shipType];
      gameboard.placeShip(completeShip, coordinates);
      return completeShip;
    },
    placeShips() {
      const ships = document.querySelectorAll('.ship');
      ships.forEach(ship => {
        const type = ship.classList[1];
        const {
          row,
          column,
          direction
        } = ship.dataset;
        const isVertical = direction === 'vertical';
        const coordinates = [Number(row), Number(column), isVertical];
        ship.classList.add('ship-set');
        this.placeShip(type, coordinates);
      });
    },
    attack(enemyBoard, coordinates) {
      return enemyBoard.receiveAttack(coordinates);
    }
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createPlayer);

/***/ }),

/***/ "./src/modules/pubsub.js":
/*!*******************************!*\
  !*** ./src/modules/pubsub.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const createPubSub = () => {
  const tracker = {
    // key: eventName, value: [ funcs ]
  };
  return {
    subscribe(eventName, func) {
      if (tracker[eventName]) tracker[eventName].push(func);
      if (!tracker[eventName]) tracker[eventName] = [func];
      return {
        unsubscribe: () => {
          const funcs = tracker[eventName];
          const index = funcs.indexOf(func);
          if (index > -1) funcs.splice(index, 1);
        }
      };
    },
    publish(eventName, ...args) {
      const funcs = tracker[eventName];
      if (Array.isArray(funcs)) {
        funcs.forEach(func => {
          func(...args);
        });
      }
    }
  };
};
const PubSub = createPubSub();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PubSub);

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const createShip = (length, shipType) => {
  const type = shipType;
  const offset = [];
  let hits = 0;
  return {
    type,
    length,
    offset,
    get health() {
      return length - hits;
    },
    isSunk() {
      return this.health < 1;
    },
    hit() {
      hits += 1;
    }
  };
};
const createShipStorage = () => ({
  AircraftCarrier: createShip(5, 'AircraftCarrier'),
  Battleship: createShip(4, 'Battleship'),
  Cruiser: createShip(3, 'Cruiser'),
  Destroyer1: createShip(2, 'Destroyer1'),
  Destroyer2: createShip(2, 'Destroyer2'),
  Submarine1: createShip(1, 'Submarine1'),
  Submarine2: createShip(1, 'Submarine2')
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createShipStorage);

/***/ }),

/***/ "./src/view/boardStatsUI.js":
/*!**********************************!*\
  !*** ./src/view/boardStatsUI.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const createShipsLeft = () => {
  const container = document.createElement('div');
  container.classList.add('board-stats-ships');
  const text = document.createElement('p');
  text.classList.add('board-stats-ships-text');
  text.textContent = 'Remaining ships: ';
  const count = document.createElement('p');
  count.classList.add('board-stats-ships-count');
  count.textContent = 0;
  container.append(text, count);
  return container;
};
const createStatsUI = name => {
  const stats = document.createElement('div');
  stats.classList.add('board-stats');
  const nameTag = document.createElement('p');
  nameTag.classList.add('board-stats-name');
  nameTag.textContent = name;
  const shipsLeft = createShipsLeft();
  stats.append(nameTag, shipsLeft);
  return stats;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createStatsUI);

/***/ }),

/***/ "./src/view/boardUI.js":
/*!*****************************!*\
  !*** ./src/view/boardUI.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");
/* harmony import */ var _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controller/drag-and-drop */ "./src/controller/drag-and-drop.js");
/* harmony import */ var _assets_back_video_mp4__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assets/back-video.mp4 */ "./src/view/assets/back-video.mp4");



const createVideoBackground = () => {
  const video = document.createElement('video');
  video.classList.add('video-container');
  video.autoplay = true;
  video.loop = true;
  video.src = _assets_back_video_mp4__WEBPACK_IMPORTED_MODULE_2__;
  video.type = 'video/mp4';
  return video;
};
const handleClickField = event => {
  const {
    row,
    column
  } = event.target.dataset;
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('field-click', [row, column]);
};
const createFieldUI = field => {
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
  board.forEach(row => {
    row.forEach(field => {
      const fieldButton = createFieldUI(field);
      if (isEnemy) {
        fieldButton.onclick = handleClickField;
      } else {
        fieldButton.addEventListener('dragover', _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.handleDragOver);
        fieldButton.addEventListener('dragleave', _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.handleDragLeave);
        fieldButton.addEventListener('drop', _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_1__.handleDragDrop);
      }
      boardUI.append(fieldButton);
    });
  });
  return boardUI;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderBoard);

/***/ }),

/***/ "./src/view/fieldsHelper.js":
/*!**********************************!*\
  !*** ./src/view/fieldsHelper.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clearFields: () => (/* binding */ clearFields),
/* harmony export */   getFields: () => (/* binding */ getFields),
/* harmony export */   getRandomEmptyFields: () => (/* binding */ getRandomEmptyFields),
/* harmony export */   isAvailableFields: () => (/* binding */ isAvailableFields),
/* harmony export */   populateFields: () => (/* binding */ populateFields),
/* harmony export */   updateFieldsOffset: () => (/* binding */ updateFieldsOffset),
/* harmony export */   updateFieldsShip: () => (/* binding */ updateFieldsShip)
/* harmony export */ });
/* eslint-disable no-param-reassign */
const getFields = (...args) => {
  const [row, column, length, direction, container = document] = args;
  const isVertical = direction === 'vertical';
  const rowNum = Number(row);
  const columnNum = Number(column);
  const lengthNum = Number(length);
  const dynamicDir = isVertical ? rowNum : columnNum;
  const shipEnd = dynamicDir + lengthNum - 1;
  const coreFields = [];
  const offsetFields = [];
  const getField = (rowDir, columnDir) => {
    const selectorBase = `[data-row='${rowDir}'][data-column='${columnDir}']`;
    return container.querySelector(selectorBase);
  };
  const getSet = (baseRow, baseColumn) => ({
    base: getField(baseRow, baseColumn),
    oneUp: isVertical ? getField(baseRow, baseColumn + 1) : getField(baseRow + 1, baseColumn),
    oneDown: isVertical ? getField(baseRow, baseColumn - 1) : getField(baseRow - 1, baseColumn)
  });
  if (dynamicDir - 1 > -1) {
    const set = isVertical ? getSet(rowNum - 1, columnNum) : getSet(rowNum, columnNum - 1);
    offsetFields.push(set.base, set.oneUp, set.oneDown);
  }
  if (shipEnd + 1 < 10) {
    const set = isVertical ? getSet(shipEnd + 1, columnNum) : getSet(rowNum, shipEnd + 1);
    offsetFields.push(set.base, set.oneUp, set.oneDown);
  }
  for (let i = dynamicDir; i <= shipEnd; i += 1) {
    const set = isVertical ? getSet(i, columnNum) : getSet(rowNum, i);
    coreFields.push(set.base);
    offsetFields.push(set.oneUp, set.oneDown);
  }
  return {
    coreFields,
    offsetFields
  };
};
const isAvailableFields = (coreFields, offsetFields) => {
  let available = true;
  coreFields.forEach(div => {
    if (div.dataset.ship === 'true') available = false;
  });
  offsetFields.forEach(div => {
    if (!div) return;
    if (div.dataset.ship === 'true') available = false;
  });
  return available;
};
const getRandomEmptyFields = (newShip, boardUI) => {
  const {
    length,
    direction
  } = newShip.dataset;
  let newRow;
  let newColumn;
  let newFields;
  let keepGoing = true;
  while (keepGoing) {
    newRow = Math.floor(Math.random() * 10);
    newColumn = Math.floor(Math.random() * 10);
    while (newRow + (length - 1) > 9 || newColumn + (length - 1) > 9) {
      newRow = Math.floor(Math.random() * 10);
      newColumn = Math.floor(Math.random() * 10);
    }
    newFields = getFields(newRow, newColumn, length, direction, boardUI);
    const {
      coreFields,
      offsetFields
    } = newFields;
    if (coreFields.length === Number(length) && !coreFields.includes(null)) {
      keepGoing = !isAvailableFields(coreFields, offsetFields);
    }
  }
  return {
    fields: newFields,
    row: newRow,
    column: newColumn
  };
};
const updateFieldsShip = (coreFields, mark) => {
  coreFields.forEach(div => {
    div.dataset.ship = mark;
  });
};
const updateFieldsOffset = (offsetFields, mark) => {
  offsetFields.forEach(div => {
    if (!div) return;
    div.dataset.offset = mark;
  });
};
const clearFields = fieldsToClear => {
  const {
    coreFields,
    offsetFields
  } = fieldsToClear;
  updateFieldsShip(coreFields, 'false');
  updateFieldsOffset(offsetFields, 'false');
};
const populateFields = fieldsToPopulate => {
  const {
    coreFields,
    offsetFields
  } = fieldsToPopulate;
  updateFieldsShip(coreFields, 'true');
  updateFieldsOffset(offsetFields, 'true');
};

/***/ }),

/***/ "./src/view/gameBoardUI.js":
/*!*********************************!*\
  !*** ./src/view/gameBoardUI.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_gameboard_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style/gameboard.css */ "./src/view/style/gameboard.css");
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");
/* harmony import */ var _boardUI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./boardUI */ "./src/view/boardUI.js");
/* harmony import */ var _shipUI__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shipUI */ "./src/view/shipUI.js");
/* harmony import */ var _boardStatsUI__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./boardStatsUI */ "./src/view/boardStatsUI.js");





const createGameboardUI = isEnemy => {
  const playerClass = isEnemy ? 'player2' : 'player1';
  const gameboardUI = document.createElement('div');
  gameboardUI.classList.add('gameboard');
  gameboardUI.classList.add(playerClass);
  return gameboardUI;
};
const renderGameboard = (player, isEnemy = false) => {
  const {
    name,
    shipStorage,
    gameboard
  } = player;
  const {
    board
  } = gameboard;
  const gameboardUI = createGameboardUI(isEnemy);
  const boardUI = (0,_boardUI__WEBPACK_IMPORTED_MODULE_2__["default"])(board, isEnemy);
  const stats = (0,_boardStatsUI__WEBPACK_IMPORTED_MODULE_4__["default"])(name);
  gameboardUI.append(boardUI, stats);
  if (isEnemy) {
    gameboardUI.classList.add('disabled');
  } else {
    (0,_shipUI__WEBPACK_IMPORTED_MODULE_3__["default"])(shipStorage, boardUI);
  }
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe('game-turn', activePlayer => {
    if (activePlayer === player) {
      gameboardUI.classList.add('disabled');
    } else {
      gameboardUI.classList.remove('disabled');
    }
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe('game-status', phase => {
    if (phase === 'Game Over') {
      gameboardUI.classList.add('disabled');
    }
  });
  return gameboardUI;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderGameboard);

/***/ }),

/***/ "./src/view/hudUI.js":
/*!***************************!*\
  !*** ./src/view/hudUI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");
/* harmony import */ var _style_hud_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/hud.css */ "./src/view/style/hud.css");


const switchHudInfo = () => {
  document.querySelector('.hud-manual').classList.toggle('hide');
  document.querySelector('.hud-stage-container').classList.toggle('hide');
  const isCelebrating = document.querySelector('.celebration');
  if (isCelebrating) isCelebrating.classList.remove('celebration');
};
const crateStartButton = () => {
  const button = document.createElement('button');
  let stage = 'Start';
  button.textContent = stage;
  button.classList.add('startBtn');
  button.classList.add('buttonStyle1');
  button.addEventListener('click', () => {
    button.disabled = true;
    _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-status', stage);
    if (stage === 'Start') {
      stage = 'Restart';
      switchHudInfo();
    } else {
      stage = 'Start';
    }
    setTimeout(() => {
      button.disabled = false;
    }, 600);
    button.textContent = stage;
  });
  return button;
};
const createRoundUI = () => {
  const round = document.createElement('p');
  round.classList.add('hud-round');
  round.textContent = `Round: 0`;
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('game-round', currentRound => {
    round.textContent = `Round: ${currentRound}`;
  });
  return round;
};
const createStageUI = () => {
  const container = document.createElement('div');
  container.classList.add('hud-stage-container');
  container.classList.add('hide');
  const currentStage = document.createElement('h3');
  currentStage.classList.add('hud-stage-text');
  currentStage.textContent = 'Setup Ships';
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('game-turn', player => {
    currentStage.textContent = `${player.name}'s turn!`;
  });
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('game-status', (phase, result) => {
    if (phase === 'Game Over') {
      currentStage.classList.add('celebration');
      currentStage.textContent = result.toUpperCase();
    }
  });
  container.append(currentStage);
  return container;
};
const createManual = () => {
  const container = document.createElement('div');
  container.classList.add('hud-manual');
  const title = document.createElement('h3');
  title.textContent = 'ORGANIZE YOUR SHIPS';
  const rotateHint = document.createElement('p');
  rotateHint.textContent = 'Click to rotate';
  const dragHint = document.createElement('p');
  dragHint.textContent = 'Drag to move';
  container.append(title, rotateHint, dragHint);
  return container;
};
const crateHud = () => {
  const hud = document.createElement('div');
  hud.classList.add('hud');
  const startButton = crateStartButton();
  const gameStage = createStageUI();
  const manual = createManual();
  const round = createRoundUI();
  hud.append(startButton, manual, gameStage, round);
  return hud;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (crateHud);

/***/ }),

/***/ "./src/view/shipUI.js":
/*!****************************!*\
  !*** ./src/view/shipUI.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controller/drag-and-drop */ "./src/controller/drag-and-drop.js");
/* harmony import */ var _fieldsHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fieldsHelper */ "./src/view/fieldsHelper.js");
/* eslint-disable no-param-reassign */



const noRotateAnimation = div => {
  div.classList.add('no-rotate');
  setTimeout(() => {
    div.classList.remove('no-rotate');
  }, 700);
};
const handleClickShipRotate = ({
  target
}) => {
  const {
    direction,
    row,
    column,
    length
  } = target.dataset;
  const isVertical = direction === 'vertical';
  const newDir = isVertical ? 'horizontal' : 'vertical';
  const newFields = (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.getFields)(row, column, length, newDir);
  const newFieldsCore = newFields.coreFields;
  const newFieldsOffset = newFields.offsetFields;
  const currentFields = (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.getFields)(row, column, length, direction);
  const currentFieldsCore = currentFields.coreFields;
  let allAvailable = true;
  if (newFieldsCore.length !== Number(length) || newFieldsCore.includes(null)) {
    noRotateAnimation(target);
    return;
  }

  // Remove ship from current fields to not mess with the check
  (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.updateFieldsShip)(currentFieldsCore, 'false');
  allAvailable = (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.isAvailableFields)(newFieldsCore, newFieldsOffset);
  if (!allAvailable) {
    (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.updateFieldsShip)(currentFieldsCore, 'true');
    noRotateAnimation(target);
    return;
  }
  (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.clearFields)(currentFields);
  (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.populateFields)(newFields);
  target.dataset.direction = newDir;
};
const renderShip = ({
  length,
  type
}) => {
  const shipContainer = document.createElement('div');
  const dir = Math.random() < 0.5 ? 'vertical' : 'horizontal';
  shipContainer.classList.add('ship');
  shipContainer.classList.add(`${type}`);
  shipContainer.dataset.length = length;
  shipContainer.dataset.direction = dir;
  shipContainer.dataset.row = null;
  shipContainer.dataset.column = null;
  shipContainer.draggable = true;
  shipContainer.addEventListener('dragstart', _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.handleDragStart);
  shipContainer.addEventListener('dragend', _controller_drag_and_drop__WEBPACK_IMPORTED_MODULE_0__.handleDragEnd);
  shipContainer.addEventListener('click', handleClickShipRotate);
  for (let i = 0; i < length; i += 1) {
    const shipBlock = document.createElement('div');
    shipBlock.classList.add('ship-block');
    shipContainer.append(shipBlock);
  }
  return shipContainer;
};
const renderShips = (shipStorage, boardUI) => {
  Object.keys(shipStorage).forEach(shipType => {
    const newShip = renderShip(shipStorage[shipType]);
    const {
      fields,
      row,
      column
    } = (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.getRandomEmptyFields)(newShip, boardUI);
    newShip.dataset.row = row;
    newShip.dataset.column = column;
    const baseField = fields.coreFields.find(({
      dataset
    }) => Number(dataset.row) === row && Number(dataset.column) === column);
    baseField.append(newShip);
    (0,_fieldsHelper__WEBPACK_IMPORTED_MODULE_1__.populateFields)(fields);
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (renderShips);

/***/ }),

/***/ "./src/view/welcomeScreen.js":
/*!***********************************!*\
  !*** ./src/view/welcomeScreen.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/pubsub */ "./src/modules/pubsub.js");
/* harmony import */ var _style_welcome_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style/welcome.css */ "./src/view/style/welcome.css");


const submitNames = () => {
  const inputP1 = document.querySelector(`input[data-player='Player 1']`);
  const inputP2 = document.querySelector(`input[data-player='Player 2']`);
  const name1 = inputP1.value || 'Player 1';
  const name2 = inputP2 ? inputP2.value || 'Player2' : false;
  _modules_pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('game-setup', [name1, name2]);
  document.querySelector('.welcome-container').remove();
};
const handleKeyPressEnter = ({
  key
}) => {
  if (key === 'Enter') {
    submitNames();
    document.removeEventListener('keypress', handleKeyPressEnter);
  }
};

// Select Name
const createNameInput = player => {
  const container = document.createElement('div');
  container.classList.add('welcome-name-container');
  const label = document.createElement('label');
  label.setAttribute('for', 'name');
  label.textContent = player;
  const input = document.createElement('input');
  input.classList.add('welcome-name-input');
  input.type = 'text';
  input.name = 'name';
  input.autocomplete = false;
  input.placeholder = 'NAME';
  input.dataset.player = player;
  label.append(input);
  container.append(label);
  return container;
};
const createStartButton = () => {
  const button = document.createElement('button');
  button.classList.add('welcome-start-button');
  button.classList.add('buttonStyle1');
  button.textContent = 'START';
  return button;
};
const createNameSelect = (twoPlayers = false) => {
  const container = document.createElement('div');
  container.classList.add('welcome-name-select');
  const nameP1 = createNameInput('Player 1');
  container.append(nameP1);
  let nameP2 = false;
  if (twoPlayers) {
    nameP2 = createNameInput('Player 2');
    container.append(nameP2);
  }
  const startButton = createStartButton();
  startButton.onclick = submitNames;
  container.append(startButton);
  document.addEventListener('keypress', handleKeyPressEnter);
  return container;
};
const createModeButton = content => {
  const button = document.createElement('button');
  button.classList.add('welcome-mode-btn');
  button.classList.add('buttonStyle1');
  button.textContent = content;
  return button;
};
const createModeSelect = () => {
  // Player vs Player || Player vs Computer
  const container = document.createElement('div');
  container.classList.add('welcome-mode');
  const pve = createModeButton('Player VS Computer');
  pve.addEventListener('click', () => {
    container.replaceWith(createNameSelect());
  });
  const pvp = createModeButton('Player VS Player');
  // Two players update
  pvp.disabled = true;
  pvp.addEventListener('click', () => {
    container.replaceWith(createNameSelect(true));
  });
  container.append(pve, pvp);
  return container;
};
const createWelcomeScreen = () => {
  const container = document.createElement('div');
  container.classList.add('welcome-container');

  // Title
  const title = document.createElement('h1');
  title.classList.add('welcome-title');
  title.textContent = 'BATTLESHIP';
  const mode = createModeSelect();
  container.append(title, mode);
  return container;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createWelcomeScreen);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css":
/*!****************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css ***!
  \****************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */

/* Document
   ========================================================================== */

/**
 * 1. Correct the line height in all browsers.
 * 2. Prevent adjustments of font size after orientation changes in iOS.
 */

html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

/* Sections
   ========================================================================== */

/**
 * Remove the margin in all browsers.
 */

body {
  margin: 0;
}

/**
 * Render the \`main\` element consistently in IE.
 */

main {
  display: block;
}

/**
 * Correct the font size and margin on \`h1\` elements within \`section\` and
 * \`article\` contexts in Chrome, Firefox, and Safari.
 */

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

/* Grouping content
   ========================================================================== */

/**
 * 1. Add the correct box sizing in Firefox.
 * 2. Show the overflow in Edge and IE.
 */

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/* Text-level semantics
   ========================================================================== */

/**
 * Remove the gray background on active links in IE 10.
 */

a {
  background-color: transparent;
}

/**
 * 1. Remove the bottom border in Chrome 57-
 * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.
 */

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

/**
 * Add the correct font weight in Chrome, Edge, and Safari.
 */

b,
strong {
  font-weight: bolder;
}

/**
 * 1. Correct the inheritance and scaling of font size in all browsers.
 * 2. Correct the odd \`em\` font sizing in all browsers.
 */

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/**
 * Add the correct font size in all browsers.
 */

small {
  font-size: 80%;
}

/**
 * Prevent \`sub\` and \`sup\` elements from affecting the line height in
 * all browsers.
 */

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/* Embedded content
   ========================================================================== */

/**
 * Remove the border on images inside links in IE 10.
 */

img {
  border-style: none;
}

/* Forms
   ========================================================================== */

/**
 * 1. Change the font styles in all browsers.
 * 2. Remove the margin in Firefox and Safari.
 */

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

/**
 * Show the overflow in IE.
 * 1. Show the overflow in Edge.
 */

button,
input { /* 1 */
  overflow: visible;
}

/**
 * Remove the inheritance of text transform in Edge, Firefox, and IE.
 * 1. Remove the inheritance of text transform in Firefox.
 */

button,
select { /* 1 */
  text-transform: none;
}

/**
 * Correct the inability to style clickable types in iOS and Safari.
 */

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

/**
 * Remove the inner border and padding in Firefox.
 */

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

/**
 * Restore the focus styles unset by the previous rule.
 */

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

/**
 * Correct the padding in Firefox.
 */

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

/**
 * 1. Correct the text wrapping in Edge and IE.
 * 2. Correct the color inheritance from \`fieldset\` elements in IE.
 * 3. Remove the padding so developers are not caught out when they zero out
 *    \`fieldset\` elements in all browsers.
 */

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

/**
 * Add the correct vertical alignment in Chrome, Firefox, and Opera.
 */

progress {
  vertical-align: baseline;
}

/**
 * Remove the default vertical scrollbar in IE 10+.
 */

textarea {
  overflow: auto;
}

/**
 * 1. Add the correct box sizing in IE 10.
 * 2. Remove the padding in IE 10.
 */

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

/**
 * Correct the cursor style of increment and decrement buttons in Chrome.
 */

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/**
 * Remove the inner padding in Chrome and Safari on macOS.
 */

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

/**
 * 1. Correct the inability to style clickable types in iOS and Safari.
 * 2. Change font properties to \`inherit\` in Safari.
 */

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/* Interactive
   ========================================================================== */

/*
 * Add the correct display in Edge, IE 10+, and Firefox.
 */

details {
  display: block;
}

/*
 * Add the correct display in all browsers.
 */

summary {
  display: list-item;
}

/* Misc
   ========================================================================== */

/**
 * Add the correct display in IE 10+.
 */

template {
  display: none;
}

/**
 * Add the correct display in IE 10.
 */

[hidden] {
  display: none;
}
`, "",{"version":3,"sources":["webpack://./node_modules/normalize.css/normalize.css"],"names":[],"mappings":"AAAA,2EAA2E;;AAE3E;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,SAAS;AACX;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,gBAAgB;AAClB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;EACE,uBAAuB,EAAE,MAAM;EAC/B,SAAS,EAAE,MAAM;EACjB,iBAAiB,EAAE,MAAM;AAC3B;;AAEA;;;EAGE;;AAEF;EACE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,6BAA6B;AAC/B;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB,EAAE,MAAM;EAC3B,0BAA0B,EAAE,MAAM;EAClC,iCAAiC,EAAE,MAAM;AAC3C;;AAEA;;EAEE;;AAEF;;EAEE,mBAAmB;AACrB;;AAEA;;;EAGE;;AAEF;;;EAGE,iCAAiC,EAAE,MAAM;EACzC,cAAc,EAAE,MAAM;AACxB;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;;EAGE;;AAEF;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;EAGE;;AAEF;QACQ,MAAM;EACZ,iBAAiB;AACnB;;AAEA;;;EAGE;;AAEF;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;EAEE;;AAEF;;;;EAIE,0BAA0B;AAC5B;;AAEA;;EAEE;;AAEF;;;;EAIE,kBAAkB;EAClB,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;EAIE,8BAA8B;AAChC;;AAEA;;EAEE;;AAEF;EACE,8BAA8B;AAChC;;AAEA;;;;;EAKE;;AAEF;EACE,sBAAsB,EAAE,MAAM;EAC9B,cAAc,EAAE,MAAM;EACtB,cAAc,EAAE,MAAM;EACtB,eAAe,EAAE,MAAM;EACvB,UAAU,EAAE,MAAM;EAClB,mBAAmB,EAAE,MAAM;AAC7B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;;EAGE;;AAEF;;EAEE,sBAAsB,EAAE,MAAM;EAC9B,UAAU,EAAE,MAAM;AACpB;;AAEA;;EAEE;;AAEF;;EAEE,YAAY;AACd;;AAEA;;;EAGE;;AAEF;EACE,6BAA6B,EAAE,MAAM;EACrC,oBAAoB,EAAE,MAAM;AAC9B;;AAEA;;EAEE;;AAEF;EACE,wBAAwB;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,0BAA0B,EAAE,MAAM;EAClC,aAAa,EAAE,MAAM;AACvB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,cAAc;AAChB;;AAEA;;EAEE;;AAEF;EACE,kBAAkB;AACpB;;AAEA;+EAC+E;;AAE/E;;EAEE;;AAEF;EACE,aAAa;AACf;;AAEA;;EAEE;;AAEF;EACE,aAAa;AACf","sourcesContent":["/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/view/style/button.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/view/style/button.css ***!
  \*************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.buttonStyle1 {
  appearance: button;
  background-color: #274659;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: din-round, sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.8px;
  line-height: 20px;
  margin: 0;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter 0.2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: 100%;
  height: 4rem;

  font-family: 'Special-Elite';
  font-size: 1.2rem;
}

.buttonStyle1:after {
  background-clip: padding-box;
  background-color: #3a6782;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  bottom: -4px;
  content: '';
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.buttonStyle1:main,
.buttonStyle1:focus {
  user-select: auto;
}

.buttonStyle1:hover:not(:disabled) {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

.buttonStyle1:disabled {
  cursor: auto;
  border-width: 4px 0 0;
  background: none;
}

.buttonStyle1:disabled::after {
  background-color: #3a67824a;
}

.buttonStyle1:active {
  border-width: 4px 0 0;
  background: none;
}
`, "",{"version":3,"sources":["webpack://./src/view/style/button.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,yBAAyB;EACzB,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,sBAAsB;EACtB,cAAc;EACd,eAAe;EACf,qBAAqB;EACrB,kCAAkC;EAClC,eAAe;EACf,gBAAgB;EAChB,qBAAqB;EACrB,iBAAiB;EACjB,SAAS;EACT,aAAa;EACb,iBAAiB;EACjB,kBAAkB;EAClB,kBAAkB;EAClB,yBAAyB;EACzB,0BAA0B;EAC1B,wBAAwB;EACxB,uBAAuB;EACvB,iBAAiB;EACjB,yBAAyB;EACzB,sBAAsB;EACtB,mBAAmB;EACnB,WAAW;EACX,YAAY;;EAEZ,4BAA4B;EAC5B,iBAAiB;AACnB;;AAEA;EACE,4BAA4B;EAC5B,yBAAyB;EACzB,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,YAAY;EACZ,WAAW;EACX,OAAO;EACP,kBAAkB;EAClB,QAAQ;EACR,MAAM;EACN,WAAW;AACb;;AAEA;;EAEE,iBAAiB;AACnB;;AAEA;EACE,uBAAuB;EACvB,+BAA+B;AACjC;;AAEA;EACE,YAAY;EACZ,qBAAqB;EACrB,gBAAgB;AAClB;;AAEA;EACE,2BAA2B;AAC7B;;AAEA;EACE,qBAAqB;EACrB,gBAAgB;AAClB","sourcesContent":[".buttonStyle1 {\n  appearance: button;\n  background-color: #274659;\n  border: solid transparent;\n  border-radius: 16px;\n  border-width: 0 0 4px;\n  box-sizing: border-box;\n  color: #ffffff;\n  cursor: pointer;\n  display: inline-block;\n  font-family: din-round, sans-serif;\n  font-size: 15px;\n  font-weight: 700;\n  letter-spacing: 0.8px;\n  line-height: 20px;\n  margin: 0;\n  outline: none;\n  overflow: visible;\n  padding: 13px 16px;\n  text-align: center;\n  text-transform: uppercase;\n  touch-action: manipulation;\n  transform: translateZ(0);\n  transition: filter 0.2s;\n  user-select: none;\n  -webkit-user-select: none;\n  vertical-align: middle;\n  white-space: nowrap;\n  width: 100%;\n  height: 4rem;\n\n  font-family: 'Special-Elite';\n  font-size: 1.2rem;\n}\n\n.buttonStyle1:after {\n  background-clip: padding-box;\n  background-color: #3a6782;\n  border: solid transparent;\n  border-radius: 16px;\n  border-width: 0 0 4px;\n  bottom: -4px;\n  content: '';\n  left: 0;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: -1;\n}\n\n.buttonStyle1:main,\n.buttonStyle1:focus {\n  user-select: auto;\n}\n\n.buttonStyle1:hover:not(:disabled) {\n  filter: brightness(1.1);\n  -webkit-filter: brightness(1.1);\n}\n\n.buttonStyle1:disabled {\n  cursor: auto;\n  border-width: 4px 0 0;\n  background: none;\n}\n\n.buttonStyle1:disabled::after {\n  background-color: #3a67824a;\n}\n\n.buttonStyle1:active {\n  border-width: 4px 0 0;\n  background: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/view/style/gameboard.css":
/*!****************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/view/style/gameboard.css ***!
  \****************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/icons8-multiply-100.png */ "./src/view/assets/icons8-multiply-100.png"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/output-onlinegiftools.gif */ "./src/view/assets/output-onlinegiftools.gif"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.gameboard {
  width: max-content;
  height: 380px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  justify-items: center;
  align-items: center;

  padding: 0.9rem;
  border-radius: 1rem;
  background: #32485e;

  transition:
    opacity 1s ease,
    filter 1s ease;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
  filter: grayscale(70%);
}

/** BOARD */

.board {
  position: relative;
  z-index: 2;

  display: grid;
  grid-template-columns: repeat(10, 10%);
  grid-template-rows: repeat(10, 10%);

  background-color: #3db1ff;
  border-radius: 1rem;

  height: 315px;
  padding: 0.9rem;
  aspect-ratio: 1/1;
}

/* STATS */

.board-stats {
  display: flex;
  justify-content: space-between;
  width: 100%;

  font-size: 1rem;
  color: #cbf0ff;
  font-family: 'Special-Elite';
}

.board-stats > p {
  margin: 0;
  align-self: center;
}

.board-stats-ships {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.board-stats-ships > p {
  margin: 0;
}

.board-stats-ships-text {
  font-size: 0.8rem;
}

.board-stats-ships-count {
  font-size: 1.5rem;
  font-family: 'Homemade-Apple';
}

.board-stats-name {
  font-size: 1.1rem;
}

/* SHIP */

.ship {
  cursor: grab;
  z-index: 10;
  position: relative;

  display: flex;
  width: min-content;
  height: min-content;
  flex-direction: column;
  background-color: #d0e5f2;

  border-radius: 1rem 1rem 0.5rem 0.5rem;
}

/* .board-ships {
  grid-column: 1;
  grid-row: 1;

  display: flex;
  align-items: baseline;
  justify-self: center;
  align-self: center;
  gap: 0.25rem;
  width: 300px;

  height: 80%;
  transition: rotate 1s ease;
} */

div[data-direction='horizontal'] {
  flex-direction: row;
}

.ship[data-direction='horizontal'] {
  border-radius: 1rem 0.5rem 0.5rem 1rem;
}

.ship-block {
  aspect-ratio: 1/1;

  height: 30px;
  pointer-events: none;
  position: relative;
  z-index: 3;
}

.no-rotate {
  animation: tilt-shaking 0.35s 3;
}

.ship-set {
  z-index: -1;
}

/* BACKGROUND */
.video-container {
  position: absolute;

  width: 100%;
  height: 100%;

  z-index: -10;
  object-fit: cover;
  border-radius: 0.5rem;

  filter: grayscale(20%);
}

/** FIELD */
.board-field {
  position: relative;
  border: 0.1px solid #ffffff4d;
  width: 30px;
  height: 30px;
  padding: 0;

  overflow: visible;
  background-color: transparent;
}

.miss {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_0___});
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  animation: markField 1s 1;
  pointer-events: none;
}

.hit {
  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_1___});
  background-repeat: no-repeat;
  background-size: 70%;
  background-position: center;
  animation: markField 1s 1;
  pointer-events: none;
}

.available-ship {
  background-color: rgb(77, 128, 1);
}

.available-offset {
  background-color: rgba(168, 251, 44, 0.4);
}

.not-available,
.not-available > * {
  z-index: 10;
  background-color: rgba(255, 0, 0, 0.83);
}

.dragging {
  cursor: grabbing !important;
}

/** Player 1 */
.gameboard.player1 {
  flex-direction: column-reverse;
  grid-row: 3;
}

/** Player 2 */

.gameboard.player2 {
  grid-row: 1;
}

.player2 > .board > .board-field {
  cursor: crosshair;
}

.player2 > .board > .board-field:hover {
  background-color: #2d8ccc;
}

.player2 > .board > .board-field.hit {
  background-color: #abbdc8;
  border-radius: 0.25rem;
}

@keyframes markField {
  0% {
    background-size: 110%;
  }
  50% {
    background-size: 40%;
  }
  100% {
    background-size: 70%;
  }
}

@keyframes tilt-shaking {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
`, "",{"version":3,"sources":["webpack://./src/view/style/gameboard.css"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,aAAa;;EAEb,aAAa;EACb,sBAAsB;EACtB,8BAA8B;;EAE9B,qBAAqB;EACrB,mBAAmB;;EAEnB,eAAe;EACf,mBAAmB;EACnB,mBAAmB;;EAEnB;;kBAEgB;AAClB;;AAEA;EACE,oBAAoB;EACpB,YAAY;EACZ,sBAAsB;AACxB;;AAEA,WAAW;;AAEX;EACE,kBAAkB;EAClB,UAAU;;EAEV,aAAa;EACb,sCAAsC;EACtC,mCAAmC;;EAEnC,yBAAyB;EACzB,mBAAmB;;EAEnB,aAAa;EACb,eAAe;EACf,iBAAiB;AACnB;;AAEA,UAAU;;AAEV;EACE,aAAa;EACb,8BAA8B;EAC9B,WAAW;;EAEX,eAAe;EACf,cAAc;EACd,4BAA4B;AAC9B;;AAEA;EACE,SAAS;EACT,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,WAAW;EACX,mBAAmB;AACrB;;AAEA;EACE,SAAS;AACX;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;EACjB,6BAA6B;AAC/B;;AAEA;EACE,iBAAiB;AACnB;;AAEA,SAAS;;AAET;EACE,YAAY;EACZ,WAAW;EACX,kBAAkB;;EAElB,aAAa;EACb,kBAAkB;EAClB,mBAAmB;EACnB,sBAAsB;EACtB,yBAAyB;;EAEzB,sCAAsC;AACxC;;AAEA;;;;;;;;;;;;;GAaG;;AAEH;EACE,mBAAmB;AACrB;;AAEA;EACE,sCAAsC;AACxC;;AAEA;EACE,iBAAiB;;EAEjB,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;AACZ;;AAEA;EACE,+BAA+B;AACjC;;AAEA;EACE,WAAW;AACb;;AAEA,eAAe;AACf;EACE,kBAAkB;;EAElB,WAAW;EACX,YAAY;;EAEZ,YAAY;EACZ,iBAAiB;EACjB,qBAAqB;;EAErB,sBAAsB;AACxB;;AAEA,WAAW;AACX;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,WAAW;EACX,YAAY;EACZ,UAAU;;EAEV,iBAAiB;EACjB,6BAA6B;AAC/B;;AAEA;EACE,yDAA0D;EAC1D,4BAA4B;EAC5B,oBAAoB;EACpB,2BAA2B;EAC3B,yBAAyB;EACzB,oBAAoB;AACtB;;AAEA;EACE,yDAA4D;EAC5D,4BAA4B;EAC5B,oBAAoB;EACpB,2BAA2B;EAC3B,yBAAyB;EACzB,oBAAoB;AACtB;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,yCAAyC;AAC3C;;AAEA;;EAEE,WAAW;EACX,uCAAuC;AACzC;;AAEA;EACE,2BAA2B;AAC7B;;AAEA,cAAc;AACd;EACE,8BAA8B;EAC9B,WAAW;AACb;;AAEA,cAAc;;AAEd;EACE,WAAW;AACb;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,yBAAyB;EACzB,sBAAsB;AACxB;;AAEA;EACE;IACE,qBAAqB;EACvB;EACA;IACE,oBAAoB;EACtB;EACA;IACE,oBAAoB;EACtB;AACF;;AAEA;EACE;IACE,uBAAuB;EACzB;EACA;IACE,uBAAuB;EACzB;EACA;IACE,uBAAuB;EACzB;EACA;IACE,wBAAwB;EAC1B;EACA;IACE,uBAAuB;EACzB;AACF","sourcesContent":[".gameboard {\n  width: max-content;\n  height: 380px;\n\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n\n  justify-items: center;\n  align-items: center;\n\n  padding: 0.9rem;\n  border-radius: 1rem;\n  background: #32485e;\n\n  transition:\n    opacity 1s ease,\n    filter 1s ease;\n}\n\n.disabled {\n  pointer-events: none;\n  opacity: 0.6;\n  filter: grayscale(70%);\n}\n\n/** BOARD */\n\n.board {\n  position: relative;\n  z-index: 2;\n\n  display: grid;\n  grid-template-columns: repeat(10, 10%);\n  grid-template-rows: repeat(10, 10%);\n\n  background-color: #3db1ff;\n  border-radius: 1rem;\n\n  height: 315px;\n  padding: 0.9rem;\n  aspect-ratio: 1/1;\n}\n\n/* STATS */\n\n.board-stats {\n  display: flex;\n  justify-content: space-between;\n  width: 100%;\n\n  font-size: 1rem;\n  color: #cbf0ff;\n  font-family: 'Special-Elite';\n}\n\n.board-stats > p {\n  margin: 0;\n  align-self: center;\n}\n\n.board-stats-ships {\n  display: flex;\n  gap: 0.4rem;\n  align-items: center;\n}\n\n.board-stats-ships > p {\n  margin: 0;\n}\n\n.board-stats-ships-text {\n  font-size: 0.8rem;\n}\n\n.board-stats-ships-count {\n  font-size: 1.5rem;\n  font-family: 'Homemade-Apple';\n}\n\n.board-stats-name {\n  font-size: 1.1rem;\n}\n\n/* SHIP */\n\n.ship {\n  cursor: grab;\n  z-index: 10;\n  position: relative;\n\n  display: flex;\n  width: min-content;\n  height: min-content;\n  flex-direction: column;\n  background-color: #d0e5f2;\n\n  border-radius: 1rem 1rem 0.5rem 0.5rem;\n}\n\n/* .board-ships {\n  grid-column: 1;\n  grid-row: 1;\n\n  display: flex;\n  align-items: baseline;\n  justify-self: center;\n  align-self: center;\n  gap: 0.25rem;\n  width: 300px;\n\n  height: 80%;\n  transition: rotate 1s ease;\n} */\n\ndiv[data-direction='horizontal'] {\n  flex-direction: row;\n}\n\n.ship[data-direction='horizontal'] {\n  border-radius: 1rem 0.5rem 0.5rem 1rem;\n}\n\n.ship-block {\n  aspect-ratio: 1/1;\n\n  height: 30px;\n  pointer-events: none;\n  position: relative;\n  z-index: 3;\n}\n\n.no-rotate {\n  animation: tilt-shaking 0.35s 3;\n}\n\n.ship-set {\n  z-index: -1;\n}\n\n/* BACKGROUND */\n.video-container {\n  position: absolute;\n\n  width: 100%;\n  height: 100%;\n\n  z-index: -10;\n  object-fit: cover;\n  border-radius: 0.5rem;\n\n  filter: grayscale(20%);\n}\n\n/** FIELD */\n.board-field {\n  position: relative;\n  border: 0.1px solid #ffffff4d;\n  width: 30px;\n  height: 30px;\n  padding: 0;\n\n  overflow: visible;\n  background-color: transparent;\n}\n\n.miss {\n  background-image: url('../assets/icons8-multiply-100.png');\n  background-repeat: no-repeat;\n  background-size: 70%;\n  background-position: center;\n  animation: markField 1s 1;\n  pointer-events: none;\n}\n\n.hit {\n  background-image: url('../assets/output-onlinegiftools.gif');\n  background-repeat: no-repeat;\n  background-size: 70%;\n  background-position: center;\n  animation: markField 1s 1;\n  pointer-events: none;\n}\n\n.available-ship {\n  background-color: rgb(77, 128, 1);\n}\n\n.available-offset {\n  background-color: rgba(168, 251, 44, 0.4);\n}\n\n.not-available,\n.not-available > * {\n  z-index: 10;\n  background-color: rgba(255, 0, 0, 0.83);\n}\n\n.dragging {\n  cursor: grabbing !important;\n}\n\n/** Player 1 */\n.gameboard.player1 {\n  flex-direction: column-reverse;\n  grid-row: 3;\n}\n\n/** Player 2 */\n\n.gameboard.player2 {\n  grid-row: 1;\n}\n\n.player2 > .board > .board-field {\n  cursor: crosshair;\n}\n\n.player2 > .board > .board-field:hover {\n  background-color: #2d8ccc;\n}\n\n.player2 > .board > .board-field.hit {\n  background-color: #abbdc8;\n  border-radius: 0.25rem;\n}\n\n@keyframes markField {\n  0% {\n    background-size: 110%;\n  }\n  50% {\n    background-size: 40%;\n  }\n  100% {\n    background-size: 70%;\n  }\n}\n\n@keyframes tilt-shaking {\n  0% {\n    transform: rotate(0deg);\n  }\n  25% {\n    transform: rotate(5deg);\n  }\n  50% {\n    transform: rotate(0deg);\n  }\n  75% {\n    transform: rotate(-5deg);\n  }\n  100% {\n    transform: rotate(0deg);\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/view/style/hud.css":
/*!**********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/view/style/hud.css ***!
  \**********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.hud {
  grid-row: 2;
  position: relative;

  display: grid;
  grid-template-columns: 20% 60% 20%;
  align-items: center;
  justify-items: center;

  width: 75rem;
  min-width: 60rem;
  height: 100%;

  border-radius: 1rem;
  backdrop-filter: saturate(180%) blur(1.5rem);
  border: #32485e6e 0.2rem solid;

  font-family: 'Special-Elite';
  color: #dff6ff;
}

.hud-stage-container {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 90%;
  width: 95%;

  border-radius: 0.3rem;
  border: #32485e6e 0.2rem solid;
  border-top: none;
  border-bottom: none;

  transition: opacity 300ms ease;
}

.hud-stage-text {
  font-size: 2rem;
  margin: 0;
}

.hud-manual {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;

  height: 100%;
  justify-content: space-evenly;

  transition: opacity 300ms ease;
}

.hud-manual > h3,
.hud-manual > p {
  margin: 0;
}

.hud-manual > h3 {
  justify-self: center;
}

.hud-round {
  display: flex;
  align-items: center;

  margin: 0;
  font-size: 1.5rem;
}

.ships-left {
  margin: 0;
}

.startBtn {
  grid-row: 1;
  grid-column: 1;
  width: 10rem;
}

.hide {
  opacity: 0;
  pointer-events: none;
}
`, "",{"version":3,"sources":["webpack://./src/view/style/hud.css"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,kBAAkB;;EAElB,aAAa;EACb,kCAAkC;EAClC,mBAAmB;EACnB,qBAAqB;;EAErB,YAAY;EACZ,gBAAgB;EAChB,YAAY;;EAEZ,mBAAmB;EACnB,4CAA4C;EAC5C,8BAA8B;;EAE9B,4BAA4B;EAC5B,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,mBAAmB;EACnB,uBAAuB;;EAEvB,WAAW;EACX,UAAU;;EAEV,qBAAqB;EACrB,8BAA8B;EAC9B,gBAAgB;EAChB,mBAAmB;;EAEnB,8BAA8B;AAChC;;AAEA;EACE,eAAe;EACf,SAAS;AACX;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,kBAAkB;;EAElB,YAAY;EACZ,6BAA6B;;EAE7B,8BAA8B;AAChC;;AAEA;;EAEE,SAAS;AACX;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,aAAa;EACb,mBAAmB;;EAEnB,SAAS;EACT,iBAAiB;AACnB;;AAEA;EACE,SAAS;AACX;;AAEA;EACE,WAAW;EACX,cAAc;EACd,YAAY;AACd;;AAEA;EACE,UAAU;EACV,oBAAoB;AACtB","sourcesContent":[".hud {\n  grid-row: 2;\n  position: relative;\n\n  display: grid;\n  grid-template-columns: 20% 60% 20%;\n  align-items: center;\n  justify-items: center;\n\n  width: 75rem;\n  min-width: 60rem;\n  height: 100%;\n\n  border-radius: 1rem;\n  backdrop-filter: saturate(180%) blur(1.5rem);\n  border: #32485e6e 0.2rem solid;\n\n  font-family: 'Special-Elite';\n  color: #dff6ff;\n}\n\n.hud-stage-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n\n  height: 90%;\n  width: 95%;\n\n  border-radius: 0.3rem;\n  border: #32485e6e 0.2rem solid;\n  border-top: none;\n  border-bottom: none;\n\n  transition: opacity 300ms ease;\n}\n\n.hud-stage-text {\n  font-size: 2rem;\n  margin: 0;\n}\n\n.hud-manual {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  position: absolute;\n\n  height: 100%;\n  justify-content: space-evenly;\n\n  transition: opacity 300ms ease;\n}\n\n.hud-manual > h3,\n.hud-manual > p {\n  margin: 0;\n}\n\n.hud-manual > h3 {\n  justify-self: center;\n}\n\n.hud-round {\n  display: flex;\n  align-items: center;\n\n  margin: 0;\n  font-size: 1.5rem;\n}\n\n.ships-left {\n  margin: 0;\n}\n\n.startBtn {\n  grid-row: 1;\n  grid-column: 1;\n  width: 10rem;\n}\n\n.hide {\n  opacity: 0;\n  pointer-events: none;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/view/style/root.css":
/*!***********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/view/style/root.css ***!
  \***********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/Special_Elite/SpecialElite-Regular.ttf */ "./src/view/assets/fonts/Special_Elite/SpecialElite-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/Stardos_Stencil/StardosStencil-Regular.ttf */ "./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/Stardos_Stencil/StardosStencil-Bold.ttf */ "./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Bold.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/fonts/Homemade_Apple/HomemadeApple-Regular.ttf */ "./src/view/assets/fonts/Homemade_Apple/HomemadeApple-Regular.ttf"), __webpack_require__.b);
var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(/*! ../assets/background-1.jpg */ "./src/view/assets/background-1.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `@font-face {
  font-family: 'Special-Elite';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_0___})
    format('truetype');
}

@font-face {
  font-family: 'Stardos-Stencil';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_1___})
    format('truetype');
}

@font-face {
  font-family: 'Stardos-Stencil-Bold';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_2___})
    format('truetype');
}

@font-face {
  font-family: 'Homemade-Apple';
  src: url(${___CSS_LOADER_URL_REPLACEMENT_3___})
    format('truetype');
}

html {
  font-family: Helvetica;
  text-transform: uppercase;
}

body {
  height: 100vh;

  display: grid;
  grid-template-rows: 45% 10% 45%;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  align-items: center;
  justify-items: center;
  margin: auto;

  background-image: url(${___CSS_LOADER_URL_REPLACEMENT_4___});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.alert {
  animation: alert-text 1 1s;
}

.celebration {
  animation: celebration-text infinite 1s;
}

@keyframes celebration-text {
  0% {
    font-size: 3.5rem;
    transform: rotate(0deg);
    color: orange;
  }
  25% {
    transform: rotate(3deg);
  }

  50% {
    font-size: 2rem;
    transform: rotate(0deg);
    color: yellow;
  }
  75% {
    transform: rotate(-3deg);
  }

  100% {
    font-size: 3.5rem;
    transform: rotate(0deg);
    color: orange;
  }
}

@keyframes alert-text {
  0% {
    font-size: 1.5rem;
  }

  50% {
    color: red;
    font-size: 2.5rem;
  }

  100% {
    font-size: 1.5rem;
  }
}
`, "",{"version":3,"sources":["webpack://./src/view/style/root.css"],"names":[],"mappings":"AAAA;EACE,4BAA4B;EAC5B;sBACoB;AACtB;;AAEA;EACE,8BAA8B;EAC9B;sBACoB;AACtB;;AAEA;EACE,mCAAmC;EACnC;sBACoB;AACtB;;AAEA;EACE,6BAA6B;EAC7B;sBACoB;AACtB;;AAEA;EACE,sBAAsB;EACtB,yBAAyB;AAC3B;;AAEA;EACE,aAAa;;EAEb,aAAa;EACb,+BAA+B;EAC/B,0BAA0B;EAC1B,YAAY;EACZ,mBAAmB;EACnB,qBAAqB;EACrB,YAAY;;EAEZ,yDAAmD;EACnD,2BAA2B;EAC3B,4BAA4B;EAC5B,sBAAsB;AACxB;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,uCAAuC;AACzC;;AAEA;EACE;IACE,iBAAiB;IACjB,uBAAuB;IACvB,aAAa;EACf;EACA;IACE,uBAAuB;EACzB;;EAEA;IACE,eAAe;IACf,uBAAuB;IACvB,aAAa;EACf;EACA;IACE,wBAAwB;EAC1B;;EAEA;IACE,iBAAiB;IACjB,uBAAuB;IACvB,aAAa;EACf;AACF;;AAEA;EACE;IACE,iBAAiB;EACnB;;EAEA;IACE,UAAU;IACV,iBAAiB;EACnB;;EAEA;IACE,iBAAiB;EACnB;AACF","sourcesContent":["@font-face {\n  font-family: 'Special-Elite';\n  src: url('../assets/fonts/Special_Elite/SpecialElite-Regular.ttf')\n    format('truetype');\n}\n\n@font-face {\n  font-family: 'Stardos-Stencil';\n  src: url('../assets/fonts/Stardos_Stencil/StardosStencil-Regular.ttf')\n    format('truetype');\n}\n\n@font-face {\n  font-family: 'Stardos-Stencil-Bold';\n  src: url('../assets/fonts/Stardos_Stencil/StardosStencil-Bold.ttf')\n    format('truetype');\n}\n\n@font-face {\n  font-family: 'Homemade-Apple';\n  src: url('../assets/fonts/Homemade_Apple/HomemadeApple-Regular.ttf')\n    format('truetype');\n}\n\nhtml {\n  font-family: Helvetica;\n  text-transform: uppercase;\n}\n\nbody {\n  height: 100vh;\n\n  display: grid;\n  grid-template-rows: 45% 10% 45%;\n  grid-template-columns: 1fr;\n  gap: 0.25rem;\n  align-items: center;\n  justify-items: center;\n  margin: auto;\n\n  background-image: url('../assets/background-1.jpg');\n  background-position: center;\n  background-repeat: no-repeat;\n  background-size: cover;\n}\n\n.alert {\n  animation: alert-text 1 1s;\n}\n\n.celebration {\n  animation: celebration-text infinite 1s;\n}\n\n@keyframes celebration-text {\n  0% {\n    font-size: 3.5rem;\n    transform: rotate(0deg);\n    color: orange;\n  }\n  25% {\n    transform: rotate(3deg);\n  }\n\n  50% {\n    font-size: 2rem;\n    transform: rotate(0deg);\n    color: yellow;\n  }\n  75% {\n    transform: rotate(-3deg);\n  }\n\n  100% {\n    font-size: 3.5rem;\n    transform: rotate(0deg);\n    color: orange;\n  }\n}\n\n@keyframes alert-text {\n  0% {\n    font-size: 1.5rem;\n  }\n\n  50% {\n    color: red;\n    font-size: 2.5rem;\n  }\n\n  100% {\n    font-size: 1.5rem;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/view/style/welcome.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/view/style/welcome.css ***!
  \**************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `.welcome-container {
  z-index: 50;
  position: absolute;

  display: grid;
  grid-template-rows: 2fr 2fr 1fr;
  justify-content: center;
  align-content: center;

  max-width: 45rem;
  max-height: 50rem;
  min-width: 40rem;
  min-height: 40rem;

  background: #ffffff3d;
  backdrop-filter: saturate(180%) blur(1.5rem);
  border-radius: 1rem;
  border: #32485e6e 0.2rem solid;

  font-family: 'Special-Elite';
}

.welcome-title {
  text-align: center;
  align-self: center;

  font-size: 4.5rem;
  font-family: 'Stardos-Stencil-Bold';
  color: #cbf0ff;

  margin: 0;
}

.welcome-mode {
  justify-self: center;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 20rem;
}

/* Name Select */

.welcome-name-select {
  display: grid;
  grid-row: 2 / 4;
  grid-template-rows: repeat(3, 1fr);
}

.welcome-name-container {
  align-self: center;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.welcome-name-container > label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  width: 100%;
}

.welcome-name-input {
  width: auto;
  padding: 0.55rem 0.5rem;
  border: none;
  border-bottom: #65656563 1px solid;
  background-color: transparent;
  box-sizing: border-box;

  font-size: 1.5rem;
  text-align: center;
}

.welcome-name-input:focus-visible {
  border-radius: 0.25rem;
  outline: #656565 1px solid;
  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
}

.welcome-start-button {
  grid-row: 3;
  width: 15rem;
  justify-self: center;
}
`, "",{"version":3,"sources":["webpack://./src/view/style/welcome.css"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,kBAAkB;;EAElB,aAAa;EACb,+BAA+B;EAC/B,uBAAuB;EACvB,qBAAqB;;EAErB,gBAAgB;EAChB,iBAAiB;EACjB,gBAAgB;EAChB,iBAAiB;;EAEjB,qBAAqB;EACrB,4CAA4C;EAC5C,mBAAmB;EACnB,8BAA8B;;EAE9B,4BAA4B;AAC9B;;AAEA;EACE,kBAAkB;EAClB,kBAAkB;;EAElB,iBAAiB;EACjB,mCAAmC;EACnC,cAAc;;EAEd,SAAS;AACX;;AAEA;EACE,oBAAoB;;EAEpB,aAAa;EACb,sBAAsB;EACtB,6BAA6B;;EAE7B,YAAY;AACd;;AAEA,gBAAgB;;AAEhB;EACE,aAAa;EACb,eAAe;EACf,kCAAkC;AACpC;;AAEA;EACE,kBAAkB;EAClB,WAAW;EACX,aAAa;EACb,sBAAsB;AACxB;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,WAAW;EACX,kBAAkB;EAClB,WAAW;AACb;;AAEA;EACE,WAAW;EACX,uBAAuB;EACvB,YAAY;EACZ,kCAAkC;EAClC,6BAA6B;EAC7B,sBAAsB;;EAEtB,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;EACtB,0BAA0B;EAC1B,qDAAqD;AACvD;;AAEA;EACE,WAAW;EACX,YAAY;EACZ,oBAAoB;AACtB","sourcesContent":[".welcome-container {\n  z-index: 50;\n  position: absolute;\n\n  display: grid;\n  grid-template-rows: 2fr 2fr 1fr;\n  justify-content: center;\n  align-content: center;\n\n  max-width: 45rem;\n  max-height: 50rem;\n  min-width: 40rem;\n  min-height: 40rem;\n\n  background: #ffffff3d;\n  backdrop-filter: saturate(180%) blur(1.5rem);\n  border-radius: 1rem;\n  border: #32485e6e 0.2rem solid;\n\n  font-family: 'Special-Elite';\n}\n\n.welcome-title {\n  text-align: center;\n  align-self: center;\n\n  font-size: 4.5rem;\n  font-family: 'Stardos-Stencil-Bold';\n  color: #cbf0ff;\n\n  margin: 0;\n}\n\n.welcome-mode {\n  justify-self: center;\n\n  display: flex;\n  flex-direction: column;\n  justify-content: space-around;\n\n  width: 20rem;\n}\n\n/* Name Select */\n\n.welcome-name-select {\n  display: grid;\n  grid-row: 2 / 4;\n  grid-template-rows: repeat(3, 1fr);\n}\n\n.welcome-name-container {\n  align-self: center;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n}\n\n.welcome-name-container > label {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  text-align: center;\n  width: 100%;\n}\n\n.welcome-name-input {\n  width: auto;\n  padding: 0.55rem 0.5rem;\n  border: none;\n  border-bottom: #65656563 1px solid;\n  background-color: transparent;\n  box-sizing: border-box;\n\n  font-size: 1.5rem;\n  text-align: center;\n}\n\n.welcome-name-input:focus-visible {\n  border-radius: 0.25rem;\n  outline: #656565 1px solid;\n  box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;\n}\n\n.welcome-start-button {\n  grid-row: 3;\n  width: 15rem;\n  justify-self: center;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/normalize.css/normalize.css":
/*!**************************************************!*\
  !*** ./node_modules/normalize.css/normalize.css ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../css-loader/dist/cjs.js!./normalize.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/normalize.css/normalize.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _css_loader_dist_cjs_js_normalize_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/view/style/button.css":
/*!***********************************!*\
  !*** ./src/view/style/button.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_button_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./button.css */ "./node_modules/css-loader/dist/cjs.js!./src/view/style/button.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_button_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_button_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_button_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_button_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/view/style/gameboard.css":
/*!**************************************!*\
  !*** ./src/view/style/gameboard.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_gameboard_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./gameboard.css */ "./node_modules/css-loader/dist/cjs.js!./src/view/style/gameboard.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_gameboard_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_gameboard_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_gameboard_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_gameboard_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/view/style/hud.css":
/*!********************************!*\
  !*** ./src/view/style/hud.css ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_hud_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./hud.css */ "./node_modules/css-loader/dist/cjs.js!./src/view/style/hud.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_hud_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_hud_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_hud_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_hud_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/view/style/root.css":
/*!*********************************!*\
  !*** ./src/view/style/root.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_root_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./root.css */ "./node_modules/css-loader/dist/cjs.js!./src/view/style/root.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_root_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_root_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_root_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_root_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/view/style/welcome.css":
/*!************************************!*\
  !*** ./src/view/style/welcome.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_welcome_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../../node_modules/css-loader/dist/cjs.js!./welcome.css */ "./node_modules/css-loader/dist/cjs.js!./src/view/style/welcome.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_welcome_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_welcome_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_welcome_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_welcome_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/view/assets/back-video.mp4":
/*!****************************************!*\
  !*** ./src/view/assets/back-video.mp4 ***!
  \****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "c430c27431640b2cddb8.mp4";

/***/ }),

/***/ "./src/view/assets/background-1.jpg":
/*!******************************************!*\
  !*** ./src/view/assets/background-1.jpg ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "210040c194e6c7c80d7b.jpg";

/***/ }),

/***/ "./src/view/assets/fonts/Homemade_Apple/HomemadeApple-Regular.ttf":
/*!************************************************************************!*\
  !*** ./src/view/assets/fonts/Homemade_Apple/HomemadeApple-Regular.ttf ***!
  \************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "df147a19521e98ee86fe.ttf";

/***/ }),

/***/ "./src/view/assets/fonts/Special_Elite/SpecialElite-Regular.ttf":
/*!**********************************************************************!*\
  !*** ./src/view/assets/fonts/Special_Elite/SpecialElite-Regular.ttf ***!
  \**********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "cefed1373df28714f8e5.ttf";

/***/ }),

/***/ "./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Bold.ttf":
/*!***********************************************************************!*\
  !*** ./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Bold.ttf ***!
  \***********************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "1f0aada097920b373758.ttf";

/***/ }),

/***/ "./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Regular.ttf":
/*!**************************************************************************!*\
  !*** ./src/view/assets/fonts/Stardos_Stencil/StardosStencil-Regular.ttf ***!
  \**************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "653b33500cc1e43b6fa2.ttf";

/***/ }),

/***/ "./src/view/assets/icons8-multiply-100.png":
/*!*************************************************!*\
  !*** ./src/view/assets/icons8-multiply-100.png ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "787fd4a0044f15055584.png";

/***/ }),

/***/ "./src/view/assets/output-onlinegiftools.gif":
/*!***************************************************!*\
  !*** ./src/view/assets/output-onlinegiftools.gif ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "bacd29fcc1222cdb48d1.gif";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var normalize_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! normalize.css */ "./node_modules/normalize.css/normalize.css");
/* harmony import */ var _view_style_root_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view/style/root.css */ "./src/view/style/root.css");
/* harmony import */ var _view_style_button_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view/style/button.css */ "./src/view/style/button.css");
/* harmony import */ var _controller_gameController__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controller/gameController */ "./src/controller/gameController.js");
/* harmony import */ var _controller_screenController__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./controller/screenController */ "./src/controller/screenController.js");





(0,_controller_screenController__WEBPACK_IMPORTED_MODULE_4__["default"])();
(0,_controller_gameController__WEBPACK_IMPORTED_MODULE_3__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQyxDQUFDO0FBQ2xCdEIsc0VBQWMsQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbnRyb2xsZXIvZHJhZy1hbmQtZHJvcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2NvbnRyb2xsZXIvZ2FtZUNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9jb250cm9sbGVyL3NjcmVlbkNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL0FpL2FpSGVscGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvQWkvYWlQbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2JvYXJkLWZpZWxkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9ib2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvY29vcmRIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL2dhbWVMb29wLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9tb2R1bGVzL3B1YnN1Yi5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3ZpZXcvYm9hcmRTdGF0c1VJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9ib2FyZFVJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9maWVsZHNIZWxwZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy92aWV3L2dhbWVCb2FyZFVJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9odWRVSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3ZpZXcvc2hpcFVJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy93ZWxjb21lU2NyZWVuLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9zdHlsZS9idXR0b24uY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9zdHlsZS9nYW1lYm9hcmQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9zdHlsZS9odWQuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9zdHlsZS9yb290LmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3ZpZXcvc3R5bGUvd2VsY29tZS5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvbm9ybWFsaXplLmNzcy9ub3JtYWxpemUuY3NzPzM0MmYiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy92aWV3L3N0eWxlL2J1dHRvbi5jc3M/YjJiZiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL3ZpZXcvc3R5bGUvZ2FtZWJvYXJkLmNzcz8wMDExIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvdmlldy9zdHlsZS9odWQuY3NzPzEyYWQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy92aWV3L3N0eWxlL3Jvb3QuY3NzPzllYjIiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy92aWV3L3N0eWxlL3dlbGNvbWUuY3NzP2VmOGQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGNsZWFyRmllbGRzLFxuICBnZXRGaWVsZHMsXG4gIGlzQXZhaWxhYmxlRmllbGRzLFxuICBwb3B1bGF0ZUZpZWxkcyxcbiAgdXBkYXRlRmllbGRzU2hpcCxcbn0gZnJvbSAnLi4vdmlldy9maWVsZHNIZWxwZXInO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRHJhZ1N0YXJ0ID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgdGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2RyYWdnaW5nJyk7XG5cbiAgY29uc3QgeyBsZW5ndGgsIGRpcmVjdGlvbiwgcm93LCBjb2x1bW4gfSA9IHRhcmdldC5kYXRhc2V0O1xuICBjb25zdCBvY2N1cGllZEZpZWxkcyA9IGdldEZpZWxkcyhyb3csIGNvbHVtbiwgbGVuZ3RoLCBkaXJlY3Rpb24pO1xuXG4gIGNsZWFyRmllbGRzKG9jY3VwaWVkRmllbGRzKTtcbiAgb2NjdXBpZWRGaWVsZHMuY29yZUZpZWxkcy5mb3JFYWNoKChkaXYpID0+IGRpdi5jbGFzc0xpc3QuYWRkKCdkcmFnZ2VkRnJvbScpKTtcbn07XG5cbmNvbnN0IGNsZWFyR3VpZGVzID0gKCkgPT4ge1xuICBjb25zdCBhdmFpbGFibGVTaGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmF2YWlsYWJsZS1zaGlwJyk7XG4gIGNvbnN0IGF2YWlsYWJsZU9mZnNldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdmFpbGFibGUtb2Zmc2V0Jyk7XG4gIGNvbnN0IG5vdEF2YWlsYWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5ub3QtYXZhaWxhYmxlJyk7XG5cbiAgYXZhaWxhYmxlU2hpcC5mb3JFYWNoKChkaXYpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdhdmFpbGFibGUtc2hpcCcpKTtcbiAgYXZhaWxhYmxlT2Zmc2V0LmZvckVhY2goKGRpdikgPT4gZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ2F2YWlsYWJsZS1vZmZzZXQnKSk7XG4gIG5vdEF2YWlsYWJsZS5mb3JFYWNoKChkaXYpID0+IGRpdi5jbGFzc0xpc3QucmVtb3ZlKCdub3QtYXZhaWxhYmxlJykpO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZURyYWdFbmQgPSAoeyB0YXJnZXQgfSkgPT4ge1xuICBjb25zdCBkcmFnZ2VkRnJvbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5kcmFnZ2VkRnJvbScpO1xuXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHRhcmdldC5kYXRhc2V0O1xuICBjb25zdCBvbGRYID0gTnVtYmVyKGRyYWdnZWRGcm9tWzBdLmRhdGFzZXQucm93KTtcbiAgY29uc3Qgb2xkWSA9IE51bWJlcihkcmFnZ2VkRnJvbVswXS5kYXRhc2V0LmNvbHVtbik7XG4gIGNvbnN0IGlzU2FtZSA9IG9sZFggPT09IE51bWJlcihyb3cpICYmIG9sZFkgPT09IE51bWJlcihjb2x1bW4pO1xuXG4gIGlmIChpc1NhbWUpIHVwZGF0ZUZpZWxkc1NoaXAoZHJhZ2dlZEZyb20sICd0cnVlJyk7XG5cbiAgZHJhZ2dlZEZyb20uZm9yRWFjaCgoZGl2KSA9PiBkaXYuY2xhc3NMaXN0LnJlbW92ZSgnZHJhZ2dlZEZyb20nKSk7XG4gIHRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdkcmFnZ2luZycpO1xuICBjbGVhckd1aWRlcygpO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZURyYWdMZWF2ZSA9IChldmVudCkgPT4ge1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBjbGVhckd1aWRlcygpO1xufTtcblxuZXhwb3J0IGNvbnN0IGhhbmRsZURyYWdEcm9wID0gKGV2ZW50KSA9PiB7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIGNvbnN0IGRyYWdnZWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZHJhZ2dpbmcnKTtcbiAgY29uc3QgeyBsZW5ndGgsIGRpcmVjdGlvbiB9ID0gZHJhZ2dlZC5kYXRhc2V0O1xuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBldmVudC50YXJnZXQuZGF0YXNldDtcblxuICBjb25zdCBuZXdGaWVsZHMgPSBnZXRGaWVsZHMocm93LCBjb2x1bW4sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgY29uc3QgeyBjb3JlRmllbGRzLCBvZmZzZXRGaWVsZHMgfSA9IG5ld0ZpZWxkcztcbiAgbGV0IGFsbEF2YWlsYWJsZSA9IHRydWU7XG5cbiAgaWYgKGNvcmVGaWVsZHMubGVuZ3RoICE9PSBOdW1iZXIobGVuZ3RoKSB8fCBjb3JlRmllbGRzLmluY2x1ZGVzKG51bGwpKSByZXR1cm47XG5cbiAgYWxsQXZhaWxhYmxlID0gaXNBdmFpbGFibGVGaWVsZHMoY29yZUZpZWxkcywgb2Zmc2V0RmllbGRzKTtcblxuICBpZiAoYWxsQXZhaWxhYmxlKSB7XG4gICAgZXZlbnQudGFyZ2V0LmFwcGVuZChkcmFnZ2VkKTtcbiAgICBkcmFnZ2VkLmRhdGFzZXQucm93ID0gcm93O1xuICAgIGRyYWdnZWQuZGF0YXNldC5jb2x1bW4gPSBjb2x1bW47XG5cbiAgICBwb3B1bGF0ZUZpZWxkcyhuZXdGaWVsZHMpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgaGFuZGxlRHJhZ092ZXIgPSAoZXZlbnQpID0+IHtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc3QgZHJhZ2dlZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kcmFnZ2luZycpO1xuICBjb25zdCB7IGxlbmd0aCwgZGlyZWN0aW9uIH0gPSBkcmFnZ2VkLmRhdGFzZXQ7XG5cbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQ7XG4gIGNvbnN0IGN1cnJlbnRGaWVsZHMgPSBnZXRGaWVsZHMocm93LCBjb2x1bW4sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgY29uc3QgeyBjb3JlRmllbGRzLCBvZmZzZXRGaWVsZHMgfSA9IGN1cnJlbnRGaWVsZHM7XG5cbiAgb2Zmc2V0RmllbGRzLmZvckVhY2goKGRpdikgPT4ge1xuICAgIGlmICghZGl2KSByZXR1cm47XG4gICAgY29uc3QgeyBzaGlwIH0gPSBkaXYuZGF0YXNldDtcbiAgICBjb25zdCBzdHlsZSA9IHNoaXAgPT09ICd0cnVlJyA/ICdub3QtYXZhaWxhYmxlJyA6ICdhdmFpbGFibGUtb2Zmc2V0JztcblxuICAgIGRpdi5jbGFzc0xpc3QuYWRkKHN0eWxlKTtcbiAgfSk7XG5cbiAgaWYgKGNvcmVGaWVsZHMubGVuZ3RoICE9PSBOdW1iZXIobGVuZ3RoKSB8fCBjb3JlRmllbGRzLmluY2x1ZGVzKG51bGwpKSB7XG4gICAgY29yZUZpZWxkcy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICAgIGlmICghZGl2KSByZXR1cm47XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgnbm90LWF2YWlsYWJsZScpO1xuICAgIH0pO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvcmVGaWVsZHMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgbGV0IGNvcnJlY3RDbGFzcyA9ICdhdmFpbGFibGUtc2hpcCc7XG4gICAgY29uc3QgeyBzaGlwLCBvZmZzZXQgfSA9IGRpdi5kYXRhc2V0O1xuXG4gICAgaWYgKHNoaXAgPT09ICd0cnVlJyB8fCBvZmZzZXQgPT09ICd0cnVlJykgY29ycmVjdENsYXNzID0gJ25vdC1hdmFpbGFibGUnO1xuICAgIGRpdi5jbGFzc0xpc3QuYWRkKGNvcnJlY3RDbGFzcyk7XG4gIH0pO1xufTtcbiIsImltcG9ydCBjcmVhdGVQbGF5ZXIgZnJvbSAnLi4vbW9kdWxlcy9wbGF5ZXInO1xuaW1wb3J0IGNyZWF0ZUFpUGxheWVyIGZyb20gJy4uL21vZHVsZXMvQWkvYWlQbGF5ZXInO1xuaW1wb3J0IGNyZWF0ZUdhbWVMb29wIGZyb20gJy4uL21vZHVsZXMvZ2FtZUxvb3AnO1xuaW1wb3J0IFB1YlN1YiBmcm9tICcuLi9tb2R1bGVzL3B1YnN1Yic7XG5cbmNvbnN0IEdhbWVDb250cm9sbGVyID0gKCkgPT4ge1xuICBsZXQgY3VycmVudE5hbWVzO1xuICBsZXQgcGxheWVyMTtcbiAgbGV0IHBsYXllcjI7XG4gIGxldCBjdXJyZW50R2FtZTtcblxuICBQdWJTdWIuc3Vic2NyaWJlKCdnYW1lLXNldHVwJywgKG5hbWVzKSA9PiB7XG4gICAgY29uc3QgW25hbWVQMSwgbmFtZVAyXSA9IG5hbWVzO1xuICAgIGN1cnJlbnROYW1lcyA9IG5hbWVzO1xuXG4gICAgcGxheWVyMSA9IGNyZWF0ZVBsYXllcihuYW1lUDEpO1xuICAgIHBsYXllcjIgPSBuYW1lUDIgPyBjcmVhdGVQbGF5ZXIobmFtZVAyKSA6IGNyZWF0ZUFpUGxheWVyKCdFbmVteScpO1xuICAgIGN1cnJlbnRHYW1lID0gY3JlYXRlR2FtZUxvb3AocGxheWVyMSwgcGxheWVyMik7XG5cbiAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS1yZWFkeScsIGN1cnJlbnRHYW1lKTtcbiAgfSk7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS1zdGF0dXMnLCAocGhhc2UpID0+IHtcbiAgICBpZiAocGhhc2UgPT09ICdTdGFydCcpIHtcbiAgICAgIGN1cnJlbnRHYW1lLnNldFNoaXBzKCk7XG4gICAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS10dXJuJywgcGxheWVyMik7XG4gICAgICBjdXJyZW50R2FtZS5wbGF5Um91bmQobnVsbCk7XG4gICAgfVxuICAgIGlmIChwaGFzZSA9PT0gJ1Jlc3RhcnQnKSB7XG4gICAgICBjb25zdCBbbmFtZVAxLCBuYW1lUDJdID0gY3VycmVudE5hbWVzO1xuXG4gICAgICBwbGF5ZXIxID0gY3JlYXRlUGxheWVyKG5hbWVQMSk7XG4gICAgICBwbGF5ZXIyID0gbmFtZVAyID8gY3JlYXRlUGxheWVyKG5hbWVQMikgOiBjcmVhdGVBaVBsYXllcignRW5lbXknKTtcbiAgICAgIGN1cnJlbnRHYW1lID0gY3JlYXRlR2FtZUxvb3AocGxheWVyMSwgcGxheWVyMik7XG5cbiAgICAgIFB1YlN1Yi5wdWJsaXNoKCdnYW1lLXJvdW5kJywgMCk7XG4gICAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS1yZWFkeScsIGN1cnJlbnRHYW1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ2ZpZWxkLWNsaWNrJywgYXN5bmMgKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgY29uc3Qgc2hvdFJlc3VsdCA9IGF3YWl0IGN1cnJlbnRHYW1lLnBsYXlSb3VuZChjb29yZGluYXRlcyk7XG4gICAgaWYgKHNob3RSZXN1bHQgPT09ICdtaXNzJykgYXdhaXQgY3VycmVudEdhbWUucGxheVJvdW5kKG51bGwpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVDb250cm9sbGVyO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tICcuLi9tb2R1bGVzL3B1YnN1Yic7XG5pbXBvcnQgY3JlYXRlSHVkIGZyb20gJy4uL3ZpZXcvaHVkVUknO1xuaW1wb3J0IGNyZWF0ZVdlbGNvbWVTY3JlZW4gZnJvbSAnLi4vdmlldy93ZWxjb21lU2NyZWVuJztcbmltcG9ydCByZW5kZXJHYW1lYm9hcmQgZnJvbSAnLi4vdmlldy9nYW1lQm9hcmRVSSc7XG5cbmNvbnN0IGNsZWFuT2xkQm9hcmRzID0gKCkgPT4ge1xuICBjb25zdCBvbGRIdWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVkJyk7XG4gIGNvbnN0IG9sZEdhbWVCb2FyZFAxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWVib2FyZC5wbGF5ZXIxJyk7XG4gIGNvbnN0IG9sZEdhbWVCb2FyZFAyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmdhbWVib2FyZC5wbGF5ZXIyJyk7XG5cbiAgaWYgKG9sZEh1ZCkgb2xkSHVkLnJlbW92ZSgpO1xuICBpZiAob2xkR2FtZUJvYXJkUDEpIG9sZEdhbWVCb2FyZFAxLnJlbW92ZSgpO1xuICBpZiAob2xkR2FtZUJvYXJkUDIpIG9sZEdhbWVCb2FyZFAyLnJlbW92ZSgpO1xufTtcblxuY29uc3QgU2NyZWVuQ29udHJvbGxlciA9ICgpID0+IHtcbiAgY29uc3Qgd2VsY29tZVNjcmVlbiA9IGNyZWF0ZVdlbGNvbWVTY3JlZW4oKTtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmQod2VsY29tZVNjcmVlbik7XG5cbiAgbGV0IGN1cnJlbnRHYW1lO1xuICBsZXQgYWN0aXZlU2hpcHNQMTtcbiAgbGV0IGFjdGl2ZVNoaXBzUDI7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS1yZWFkeScsIChnYW1lKSA9PiB7XG4gICAgY2xlYW5PbGRCb2FyZHMoKTtcbiAgICBjdXJyZW50R2FtZSA9IGdhbWU7XG4gICAgYWN0aXZlU2hpcHNQMSA9IDA7XG4gICAgYWN0aXZlU2hpcHNQMiA9IDA7XG5cbiAgICBjb25zdCBodWQgPSBjcmVhdGVIdWQoKTtcbiAgICBjb25zdCBnYW1lYm9hcmQxID0gcmVuZGVyR2FtZWJvYXJkKGdhbWUucGxheWVyMSk7XG4gICAgY29uc3QgZ2FtZWJvYXJkMiA9IHJlbmRlckdhbWVib2FyZChnYW1lLnBsYXllcjIsIHRydWUpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmQoaHVkLCBnYW1lYm9hcmQxLCBnYW1lYm9hcmQyKTtcbiAgfSk7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZmllbGQtbWFyaycsIChjb29yZGluYXRlcywgbWFyaykgPT4ge1xuICAgIGNvbnN0IHsgYWN0aXZlUGxheWVyLCBwbGF5ZXIxIH0gPSBjdXJyZW50R2FtZTtcbiAgICBjb25zdCBib2FyZFRvTWFyayA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyMSA/ICdwbGF5ZXIyJyA6ICdwbGF5ZXIxJztcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBkaXYuZ2FtZWJvYXJkLiR7Ym9hcmRUb01hcmt9YCk7XG5cbiAgICBjb25zdCBbcm93LCBjb2x1bW5dID0gY29vcmRpbmF0ZXM7XG4gICAgY29uc3Qgc2VsZWN0b3JCYXNlID0gYFtkYXRhLXJvdz0nJHtyb3d9J11bZGF0YS1jb2x1bW49JyR7Y29sdW1ufSddYDtcbiAgICBjb25zdCBmaWVsZCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yQmFzZSk7XG5cbiAgICBmaWVsZC5jbGFzc0xpc3QuYWRkKG1hcmspO1xuICB9KTtcblxuICBQdWJTdWIuc3Vic2NyaWJlKCdnYW1lLXNoaXBzLWNoZWNrJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgcGxheWVyMSwgcGxheWVyMiB9ID0gY3VycmVudEdhbWU7XG4gICAgY29uc3QgY2hlY2tTaGlwc1AxID0gcGxheWVyMS5nYW1lYm9hcmQuYWN0aXZlU2hpcHMoKTtcbiAgICBjb25zdCBjaGVja1NoaXBzUDIgPSBwbGF5ZXIyLmdhbWVib2FyZC5hY3RpdmVTaGlwcygpO1xuXG4gICAgaWYgKGNoZWNrU2hpcHNQMSAhPT0gYWN0aXZlU2hpcHNQMSkge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcjEnKTtcbiAgICAgIGNvbnN0IGNvdW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1zdGF0cy1zaGlwcy1jb3VudCcpO1xuICAgICAgY291bnQudGV4dENvbnRlbnQgPSBjaGVja1NoaXBzUDE7XG4gICAgICBjb3VudC5jbGFzc0xpc3QuYWRkKCdhbGVydCcpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY291bnQuY2xhc3NMaXN0LnJlbW92ZSgnYWxlcnQnKTtcbiAgICAgIH0sIDcwMCk7XG5cbiAgICAgIGFjdGl2ZVNoaXBzUDEgPSBjaGVja1NoaXBzUDE7XG4gICAgfVxuXG4gICAgaWYgKGNoZWNrU2hpcHNQMiAhPT0gYWN0aXZlU2hpcHNQMikge1xuICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllcjInKTtcbiAgICAgIGNvbnN0IGNvdW50ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZC1zdGF0cy1zaGlwcy1jb3VudCcpO1xuICAgICAgY291bnQudGV4dENvbnRlbnQgPSBjaGVja1NoaXBzUDI7XG4gICAgICBjb3VudC5jbGFzc0xpc3QuYWRkKCdhbGVydCcpO1xuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY291bnQuY2xhc3NMaXN0LnJlbW92ZSgnYWxlcnQnKTtcbiAgICAgIH0sIDcwMCk7XG5cbiAgICAgIGFjdGl2ZVNoaXBzUDIgPSBjaGVja1NoaXBzUDI7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNjcmVlbkNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgeyBnZXRSYW5kb21Db29yZGluYXRlcyB9IGZyb20gJy4uL2Nvb3JkSGVscGVyJztcblxuY29uc3QgY2hlY2tOZXh0U2hvdCA9IChtYXJrZWRGaWVsZHMsIG5leHRNYXJrKSA9PiB7XG4gIGNvbnN0IFttYXJrWCwgbWFya1ldID0gbmV4dE1hcms7XG4gIGNvbnN0IG5leHRNYXJrU3RyID0gYCR7bWFya1h9LCR7bWFya1l9YDtcblxuICBjb25zdCBpc0luc2lkZVggPSBtYXJrWCA+PSAwICYmIG1hcmtYIDw9IDk7XG4gIGNvbnN0IGlzSW5zaWRlWSA9IG1hcmtZID49IDAgJiYgbWFya1kgPD0gOTtcbiAgY29uc3QgaXNJbnNpZGUgPSBpc0luc2lkZVggJiYgaXNJbnNpZGVZO1xuXG4gIGNvbnN0IGFscmVhZHlNYXJrZWQgPSBtYXJrZWRGaWVsZHMuaGFzKG5leHRNYXJrU3RyKTtcblxuICByZXR1cm4gIWFscmVhZHlNYXJrZWQgJiYgaXNJbnNpZGU7XG59O1xuXG5leHBvcnQgY29uc3QgZ2V0UmFuZG9tTmV4dFNob3QgPSAobWFya2VkRmllbGRzKSA9PiB7XG4gIGxldCByYW5kb21TaG90ID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgd2hpbGUgKCFjaGVja05leHRTaG90KG1hcmtlZEZpZWxkcywgcmFuZG9tU2hvdCkpIHtcbiAgICByYW5kb21TaG90ID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgfVxuICByZXR1cm4gcmFuZG9tU2hvdDtcbn07XG5cbmNvbnN0IGdldE9wcG9zaXRlRGlyZWN0aW9uID0gKGRpcmVjdGlvbikgPT4ge1xuICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSByZXR1cm4gJ2Rvd24nO1xuICBpZiAoZGlyZWN0aW9uID09PSAnbGVmdCcpIHJldHVybiAncmlnaHQnO1xuICBpZiAoZGlyZWN0aW9uID09PSAncmlnaHQnKSByZXR1cm4gJ2xlZnQnO1xuICBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHJldHVybiAndXAnO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBwb3NzaWJsZVNob3RzID0gKGNvb3JkaW5hdGVzKSA9PiAoe1xuICBkb3duOiBbY29vcmRpbmF0ZXNbMF0gLSAxLCBjb29yZGluYXRlc1sxXV0sXG4gIGxlZnQ6IFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gLSAxXSxcbiAgdXA6IFtjb29yZGluYXRlc1swXSArIDEsIGNvb3JkaW5hdGVzWzFdXSxcbiAgcmlnaHQ6IFtjb29yZGluYXRlc1swXSwgY29vcmRpbmF0ZXNbMV0gKyAxXSxcbn0pO1xuXG5leHBvcnQgY29uc3Qgc2F2ZUhpdCA9IChcbiAgbWFya2VkRmllbGRzLFxuICBmaWVsZEhpdHMsXG4gIHBvc3NpYmxlSGl0cyxcbiAgaGlnaFByb2JhYmlsaXR5U2hvdCxcbiAgc2hvdFxuKSA9PiB7XG4gIGNvbnN0IHNob3RTdHIgPSBgJHtzaG90WzBdfSwke3Nob3RbMV19YDtcbiAgY29uc3QgbmV4dFBvc3NpYmxlSGl0cyA9IHBvc3NpYmxlU2hvdHMoc2hvdCk7XG5cbiAgZmllbGRIaXRzLnNldChzaG90U3RyLCBzaG90KTtcblxuICBPYmplY3Qua2V5cyhuZXh0UG9zc2libGVIaXRzKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICBjb25zdCBuZXh0U2hvdCA9IG5leHRQb3NzaWJsZUhpdHNba2V5XTtcbiAgICBjb25zdCBuZXh0WCA9IG5leHRTaG90WzBdO1xuICAgIGNvbnN0IG5leHRZID0gbmV4dFNob3RbMV07XG4gICAgY29uc3QgbmV4dFNob3RTdHIgPSBgJHtuZXh0WH0sJHtuZXh0WX1gO1xuXG4gICAgaWYgKGNoZWNrTmV4dFNob3QobWFya2VkRmllbGRzLCBuZXh0U2hvdCkpIHtcbiAgICAgIHBvc3NpYmxlSGl0cy5wdXNoKG5leHRTaG90KTtcbiAgICAgIG1hcmtlZEZpZWxkcy5hZGQoc2hvdFN0cik7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHNob3QgaXMgYWxyZWFkeSBpbiBoaXRzLCBhZGQgdHdvIG1vcmUgdG8gaGlnaCBwb3NzaWJpbGl0eSBoaXRzXG4gICAgaWYgKGZpZWxkSGl0cy5oYXMobmV4dFNob3RTdHIpKSB7XG4gICAgICBjb25zdCBsYXN0SGl0ID0gZmllbGRIaXRzLmdldChuZXh0U2hvdFN0cik7XG4gICAgICBjb25zdCBvbmVFeHRyYSA9IHBvc3NpYmxlU2hvdHMobGFzdEhpdClba2V5XTtcblxuICAgICAgY29uc3Qgb3Bwb3NpdGVEaXJTdHIgPSBnZXRPcHBvc2l0ZURpcmVjdGlvbihrZXkpO1xuICAgICAgY29uc3Qgb3Bwb3NpdGVEaXIgPSBuZXh0UG9zc2libGVIaXRzW29wcG9zaXRlRGlyU3RyXTtcblxuICAgICAgaWYgKGNoZWNrTmV4dFNob3QobWFya2VkRmllbGRzLCBvcHBvc2l0ZURpcikpIHtcbiAgICAgICAgaGlnaFByb2JhYmlsaXR5U2hvdC5wdXNoKG9wcG9zaXRlRGlyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNoZWNrTmV4dFNob3QobWFya2VkRmllbGRzLCBvbmVFeHRyYSkpIHtcbiAgICAgICAgaGlnaFByb2JhYmlsaXR5U2hvdC51bnNoaWZ0KG9uZUV4dHJhKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNhdmVNaXNzID0gKG1hcmtlZEZpZWxkcywgc2hvdCkgPT4ge1xuICBjb25zdCBzaG90U3RyID0gYCR7c2hvdFswXX0sJHtzaG90WzFdfWA7XG4gIG1hcmtlZEZpZWxkcy5hZGQoc2hvdFN0cik7XG59O1xuXG5leHBvcnQgY29uc3Qgc2F2ZVN1bmsgPSAobWFya2VkRmllbGRzLCBmaWVsZEhpdHMsIHNob3QsIHJlc3VsdCkgPT4ge1xuICBjb25zdCBzdW5rZW5TaGlwID0gcmVzdWx0WzFdO1xuICBjb25zdCBzaG90U3RyID0gYCR7c2hvdFswXX0sJHtzaG90WzFdfWA7XG4gIGZpZWxkSGl0cy5zZXQoc2hvdFN0ciwgc2hvdCk7XG4gIG1hcmtlZEZpZWxkcy5hZGQoc2hvdFN0cik7XG5cbiAgc3Vua2VuU2hpcC5vZmZzZXQuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICBjb25zdCB7IGNvb3JkaW5hdGVzIH0gPSBmaWVsZDtcbiAgICBjb25zdCBbcm93LCBjb2x1bW5dID0gY29vcmRpbmF0ZXM7XG4gICAgY29uc3Qgb2Zmc2V0U3RyID0gYCR7cm93fSwke2NvbHVtbn1gO1xuICAgIGlmICghbWFya2VkRmllbGRzLmhhcyhvZmZzZXRTdHIpKSBtYXJrZWRGaWVsZHMuYWRkKG9mZnNldFN0cik7XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHNob3REZWxheSA9IGFzeW5jIChlbmVteUJvYXJkLCBjdXJyZW50U2hvdCkgPT5cbiAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHJlc29sdmUoZW5lbXlCb2FyZC5yZWNlaXZlQXR0YWNrKGN1cnJlbnRTaG90KSk7XG4gICAgfSwgMTIwMCk7XG4gIH0pO1xuIiwiaW1wb3J0IGNyZWF0ZUJvYXJkIGZyb20gJy4uL2JvYXJkJztcbmltcG9ydCBjcmVhdGVTaGlwU3RvcmFnZSBmcm9tICcuLi9zaGlwJztcblxuaW1wb3J0IHsgZ2V0UmFuZG9tQ29vcmRpbmF0ZXMsIGNoZWNrU2hpcENvb3JkaW5hdGVzIH0gZnJvbSAnLi4vY29vcmRIZWxwZXInO1xuaW1wb3J0IHtcbiAgc2F2ZUhpdCxcbiAgc2F2ZU1pc3MsXG4gIHNhdmVTdW5rLFxuICBzaG90RGVsYXksXG4gIGdldFJhbmRvbU5leHRTaG90LFxufSBmcm9tICcuL2FpSGVscGVycyc7XG5cbmNvbnN0IGNyZWF0ZUFpUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gY3JlYXRlQm9hcmQoKTtcbiAgY29uc3QgZmllbGRIaXRzID0gbmV3IE1hcCgpO1xuICBjb25zdCBtYXJrZWRGaWVsZHMgPSBuZXcgU2V0KCk7XG4gIGxldCBwb3NzaWJsZUhpdHMgPSBbXTtcbiAgbGV0IGhpZ2hQcm9iYWJpbGl0eVNob3QgPSBbXTtcblxuICBjb25zdCBzaGlwU3RvcmFnZSA9IGNyZWF0ZVNoaXBTdG9yYWdlKCk7XG5cbiAgY29uc3QgZ2V0TmV4dFNob3QgPSAoKSA9PiB7XG4gICAgaWYgKGhpZ2hQcm9iYWJpbGl0eVNob3QubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGhpZ2hQcm9iYWJpbGl0eVNob3QucG9wKCk7XG4gICAgfVxuICAgIGlmIChwb3NzaWJsZUhpdHMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHBvc3NpYmxlSGl0cy5zaGlmdCgpO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0UmFuZG9tTmV4dFNob3QobWFya2VkRmllbGRzKTtcbiAgfTtcblxuICBjb25zdCBzYXZlU2hvdFJlc3VsdCA9IChzaG90LCByZXN1bHQpID0+IHtcbiAgICBpZiAocmVzdWx0ID09PSAnbWlzcycpIHNhdmVNaXNzKG1hcmtlZEZpZWxkcywgc2hvdCk7XG4gICAgaWYgKHJlc3VsdCA9PT0gJ2hpdCcpIHtcbiAgICAgIHNhdmVIaXQobWFya2VkRmllbGRzLCBmaWVsZEhpdHMsIHBvc3NpYmxlSGl0cywgaGlnaFByb2JhYmlsaXR5U2hvdCwgc2hvdCk7XG4gICAgfVxuICAgIC8vIFNoaXAgc3Vua1xuICAgIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgIHNhdmVTdW5rKG1hcmtlZEZpZWxkcywgZmllbGRIaXRzLCBzaG90LCByZXN1bHQpO1xuICAgICAgcG9zc2libGVIaXRzID0gW107XG4gICAgICBoaWdoUHJvYmFiaWxpdHlTaG90ID0gW107XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwU3RvcmFnZSxcbiAgICBnYW1lYm9hcmQsXG4gICAgcGxhY2VTaGlwcygpIHtcbiAgICAgIGNvbnN0IHNoaXBzT25Cb2FyZCA9IFtdO1xuXG4gICAgICBPYmplY3Qua2V5cyhzaGlwU3RvcmFnZSkuZm9yRWFjaCgoc2hpcFR5cGUpID0+IHtcbiAgICAgICAgY29uc3Qgc2hpcCA9IHNoaXBTdG9yYWdlW3NoaXBUeXBlXTtcbiAgICAgICAgY29uc3QgeyBsZW5ndGggfSA9IHNoaXA7XG5cbiAgICAgICAgbGV0IG5ld0Nvb3JkaW5hdGVzID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICAgICAgY29uc3QgdG9DaGVjayA9IHtcbiAgICAgICAgICBjb29yZGluYXRlczogbmV3Q29vcmRpbmF0ZXMsXG4gICAgICAgICAgYm9hcmQ6IGdhbWVib2FyZC5ib2FyZCxcbiAgICAgICAgICBzaGlwTGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIH07XG5cbiAgICAgICAgd2hpbGUgKCFjaGVja1NoaXBDb29yZGluYXRlcyh0b0NoZWNrKSkge1xuICAgICAgICAgIG5ld0Nvb3JkaW5hdGVzID0gZ2V0UmFuZG9tQ29vcmRpbmF0ZXMoKTtcbiAgICAgICAgICB0b0NoZWNrLmNvb3JkaW5hdGVzID0gbmV3Q29vcmRpbmF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICBnYW1lYm9hcmQucGxhY2VTaGlwKHNoaXAsIG5ld0Nvb3JkaW5hdGVzKTtcbiAgICAgICAgcmV0dXJuIHNoaXA7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHNoaXBzT25Cb2FyZDtcbiAgICB9LFxuICAgIGFzeW5jIGF0dGFjayhlbmVteUJvYXJkKSB7XG4gICAgICBsZXQgc2hvdHMgPSAxO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNob3RzOyBpICs9IDEpIHtcbiAgICAgICAgY29uc3QgY3VycmVudFNob3QgPSBnZXROZXh0U2hvdCgpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBzaG90RGVsYXkoZW5lbXlCb2FyZCwgY3VycmVudFNob3QpO1xuICAgICAgICBzYXZlU2hvdFJlc3VsdChjdXJyZW50U2hvdCwgcmVzdWx0KTtcblxuICAgICAgICAvLyBBcnJheSA9IFNoaXAgc3Vua1xuICAgICAgICBpZiAocmVzdWx0ID09PSAnaGl0JyB8fCBBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICAgICAgICBzaG90cyArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnbWlzcyc7XG4gICAgfSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUFpUGxheWVyO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tICcuL3B1YnN1Yic7XG5cbmNvbnN0IGNyZWF0ZUJvYXJkRmllbGQgPSAoY29vcmRpbmF0ZXMpID0+IHtcbiAgbGV0IG1hcmsgPSBudWxsO1xuICBsZXQgc2hpcCA9IG51bGw7XG4gIGxldCBvZmZzZXQgPSBudWxsO1xuXG4gIHJldHVybiB7XG4gICAgY29vcmRpbmF0ZXMsXG4gICAgZ2V0IHNoaXAoKSB7XG4gICAgICByZXR1cm4gc2hpcDtcbiAgICB9LFxuICAgIHNldCBzaGlwKG5ld1NoaXApIHtcbiAgICAgIGlmIChzaGlwICE9PSBudWxsKSB0aHJvdyBuZXcgRXJyb3IoJ0ZpZWxkIE9jY3VwaWVkIScpO1xuICAgICAgc2hpcCA9IG5ld1NoaXA7XG4gICAgfSxcbiAgICBnZXQgb2Zmc2V0KCkge1xuICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICB9LFxuICAgIHNldCBvZmZzZXQodmFsdWUpIHtcbiAgICAgIG9mZnNldCA9IHZhbHVlO1xuICAgIH0sXG5cbiAgICBtYXJrRmllbGQoaXNPZmZzZXQgPSBmYWxzZSkge1xuICAgICAgaWYgKG1hcmsgIT09IG51bGwgJiYgIWlzT2Zmc2V0KSB0aHJvdyBuZXcgRXJyb3IoYEFscmVhZHkgbWFya2VkIWApO1xuXG4gICAgICBtYXJrID0gc2hpcCA/ICdoaXQnIDogJ21pc3MnO1xuICAgICAgUHViU3ViLnB1Ymxpc2goJ2ZpZWxkLW1hcmsnLCBjb29yZGluYXRlcywgbWFyayk7XG5cbiAgICAgIGlmIChzaGlwKSB7XG4gICAgICAgIHNoaXAuaGl0KCk7XG5cbiAgICAgICAgaWYgKHNoaXAuaXNTdW5rKCkpIHtcbiAgICAgICAgICBzaGlwLm9mZnNldC5mb3JFYWNoKChmaWVsZCkgPT4gZmllbGQubWFya0ZpZWxkKHRydWUpKTtcbiAgICAgICAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS1zaGlwcy1jaGVjaycpO1xuICAgICAgICAgIHJldHVybiBbJ3NoaXAgc3VuaycsIHNoaXBdO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBtYXJrO1xuICAgIH0sXG4gICAgZ2V0IG1hcmsoKSB7XG4gICAgICByZXR1cm4gbWFyaztcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQm9hcmRGaWVsZDtcbiIsImltcG9ydCBjcmVhdGVCb2FyZEZpZWxkIGZyb20gJy4vYm9hcmQtZmllbGQnO1xuaW1wb3J0IHsgZ2V0RmllbGRzIH0gZnJvbSAnLi9jb29yZEhlbHBlcic7XG5cbmNvbnN0IHNldE9mZnNldCA9IChjdXJyZW50RmllbGQsIHNoaXApID0+IHtcbiAgaWYgKCFjdXJyZW50RmllbGQpIHJldHVybjtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXBhcmFtLXJlYXNzaWduXG4gIGN1cnJlbnRGaWVsZC5vZmZzZXQgPSB0cnVlO1xuICBzaGlwLm9mZnNldC5wdXNoKGN1cnJlbnRGaWVsZCk7XG59O1xuXG5jb25zdCBwb3B1bGF0ZUZpZWxkcyA9IChib2FyZCwgbmV3U2hpcCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgY29uc3QgW3JvdywgY29sdW1uLCBpc1ZlcnRpY2FsXSA9IGNvb3JkaW5hdGVzO1xuICBjb25zdCB7IGxlbmd0aCB9ID0gbmV3U2hpcDtcbiAgY29uc3QgZHluYW1pY0RpciA9IGlzVmVydGljYWwgPyByb3cgOiBjb2x1bW47XG4gIGNvbnN0IG9uZUJlZm9yZSA9IGR5bmFtaWNEaXIgLSAxO1xuICBjb25zdCBvbmVBZnRlciA9IGR5bmFtaWNEaXIgKyBsZW5ndGg7XG5cbiAgLy8gT2Zmc2V0IGJlZm9yZSBzaGlwXG4gIGlmIChvbmVCZWZvcmUgPiAtMSkge1xuICAgIGNvbnN0IGNvb3JkVG9DaGVjayA9IGlzVmVydGljYWwgPyBbb25lQmVmb3JlLCBjb2x1bW5dIDogW3Jvdywgb25lQmVmb3JlXTtcbiAgICBjb25zdCB7IGJhc2UsIHVwLCBkb3duIH0gPSBnZXRGaWVsZHMoY29vcmRUb0NoZWNrLCBpc1ZlcnRpY2FsLCBib2FyZCk7XG5cbiAgICBzZXRPZmZzZXQoYmFzZSwgbmV3U2hpcCk7XG4gICAgc2V0T2Zmc2V0KHVwLCBuZXdTaGlwKTtcbiAgICBzZXRPZmZzZXQoZG93biwgbmV3U2hpcCk7XG4gIH1cblxuICAvLyBPZmZzZXQgYWZ0ZXIgc2hpcFxuICBpZiAob25lQWZ0ZXIgPCAxMCkge1xuICAgIGNvbnN0IGNvb3JkVG9DaGVjayA9IGlzVmVydGljYWwgPyBbb25lQWZ0ZXIsIGNvbHVtbl0gOiBbcm93LCBvbmVBZnRlcl07XG4gICAgY29uc3QgeyBiYXNlLCB1cCwgZG93biB9ID0gZ2V0RmllbGRzKGNvb3JkVG9DaGVjaywgaXNWZXJ0aWNhbCwgYm9hcmQpO1xuXG4gICAgc2V0T2Zmc2V0KGJhc2UsIG5ld1NoaXApO1xuICAgIHNldE9mZnNldCh1cCwgbmV3U2hpcCk7XG4gICAgc2V0T2Zmc2V0KGRvd24sIG5ld1NoaXApO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IGR5bmFtaWNEaXI7IGkgPCBvbmVBZnRlcjsgaSArPSAxKSB7XG4gICAgY29uc3QgY29vcmRUb0NoZWNrID0gaXNWZXJ0aWNhbCA/IFtpLCBjb2x1bW5dIDogW3JvdywgaV07XG4gICAgY29uc3QgeyBiYXNlLCB1cCwgZG93biB9ID0gZ2V0RmllbGRzKGNvb3JkVG9DaGVjaywgaXNWZXJ0aWNhbCwgYm9hcmQpO1xuXG4gICAgYmFzZS5zaGlwID0gbmV3U2hpcDtcbiAgICBzZXRPZmZzZXQodXAsIG5ld1NoaXApO1xuICAgIHNldE9mZnNldChkb3duLCBuZXdTaGlwKTtcbiAgfVxufTtcblxuY29uc3QgaW5pdEJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCByb3dzID0gMTA7XG4gIGNvbnN0IGNvbHVtbnMgPSAxMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3M7IGkgKz0gMSkge1xuICAgIGJvYXJkW2ldID0gW107XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5zOyBqICs9IDEpIHtcbiAgICAgIGJvYXJkW2ldW2pdID0gY3JlYXRlQm9hcmRGaWVsZChbaSwgal0pO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBib2FyZDtcbn07XG5cbmNvbnN0IGNyZWF0ZUJvYXJkID0gKCkgPT4ge1xuICBjb25zdCBib2FyZCA9IGluaXRCb2FyZCgpO1xuICBjb25zdCBzaGlwc09uQm9hcmQgPSBbXTtcblxuICByZXR1cm4ge1xuICAgIGJvYXJkLFxuICAgIHNoaXBzT25Cb2FyZCxcbiAgICBwbGFjZVNoaXAobmV3U2hpcCwgY29vcmRpbmF0ZXMpIHtcbiAgICAgIHBvcHVsYXRlRmllbGRzKGJvYXJkLCBuZXdTaGlwLCBjb29yZGluYXRlcyk7XG4gICAgICBzaGlwc09uQm9hcmQucHVzaChuZXdTaGlwKTtcbiAgICB9LFxuICAgIHJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZXMpIHtcbiAgICAgIGlmICghc2hpcHNPbkJvYXJkLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdObyBzaGlwcyBvbiBib2FyZCEnKTtcblxuICAgICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkaW5hdGVzO1xuICAgICAgY29uc3QgY3VycmVudEZpZWxkID0gYm9hcmRbcm93XVtjb2x1bW5dO1xuICAgICAgY29uc3QgbWFya0ZpZWxkID0gY3VycmVudEZpZWxkLm1hcmtGaWVsZCgpO1xuXG4gICAgICByZXR1cm4gbWFya0ZpZWxkO1xuICAgIH0sXG4gICAgYWN0aXZlU2hpcHMoKSB7XG4gICAgICBsZXQgbGl2aW5nU2hpcHMgPSBzaGlwc09uQm9hcmQubGVuZ3RoO1xuXG4gICAgICBzaGlwc09uQm9hcmQuZm9yRWFjaCgoc2hpcCkgPT4ge1xuICAgICAgICBsaXZpbmdTaGlwcyAtPSBzaGlwLmlzU3VuaygpID8gMSA6IDA7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGxpdmluZ1NoaXBzO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVCb2FyZDtcbiIsImV4cG9ydCBjb25zdCBnZXRSYW5kb21Db29yZGluYXRlcyA9ICgpID0+IHtcbiAgY29uc3QgcmFuZG9tUm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICBjb25zdCByYW5kb21Db2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuXG4gIHJldHVybiBbcmFuZG9tUm93LCByYW5kb21Db2x1bW4sIGlzVmVydGljYWxdO1xufTtcblxuZXhwb3J0IGNvbnN0IGdldEZpZWxkcyA9IChjb29yZGluYXRlcywgaXNWZXJ0aWNhbCwgYm9hcmQpID0+IHtcbiAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkaW5hdGVzO1xuICBjb25zdCBkeW5hbWljRGlyID0gaXNWZXJ0aWNhbCA/IE51bWJlcihjb2x1bW4pIDogTnVtYmVyKHJvdyk7XG4gIGNvbnN0IGluc2lkZUJvYXJkVXAgPSBkeW5hbWljRGlyICsgMSA8PSA5O1xuICBjb25zdCBpbnNpZGVCb2FyZERvd24gPSBkeW5hbWljRGlyIC0gMSA+PSAwO1xuXG4gIGNvbnN0IFt1cFJvdywgdXBDb2xdID0gaXNWZXJ0aWNhbCA/IFtyb3csIGNvbHVtbiArIDFdIDogW3JvdyArIDEsIGNvbHVtbl07XG4gIGNvbnN0IFtkb3duUm93LCBkb3duQ29sXSA9IGlzVmVydGljYWwgPyBbcm93LCBjb2x1bW4gLSAxXSA6IFtyb3cgLSAxLCBjb2x1bW5dO1xuXG4gIGNvbnN0IGJhc2UgPSBib2FyZFtyb3ddW2NvbHVtbl07XG4gIGNvbnN0IHVwID0gaW5zaWRlQm9hcmRVcCA/IGJvYXJkW3VwUm93XVt1cENvbF0gOiBmYWxzZTtcbiAgY29uc3QgZG93biA9IGluc2lkZUJvYXJkRG93biA/IGJvYXJkW2Rvd25Sb3ddW2Rvd25Db2xdIDogZmFsc2U7XG5cbiAgcmV0dXJuIHsgYmFzZSwgdXAsIGRvd24gfTtcbn07XG5cbmNvbnN0IGlzT2NjdXBpZWRGaWVsZCA9IChmaWVsZCkgPT4gKGZpZWxkID8gZmllbGQuc2hpcCAhPT0gbnVsbCA6IGZhbHNlKTtcblxuY29uc3QgY2hlY2tPdXRPZkJvYXJkID0gKGNvb3JkaW5hdGVzLCBzaGlwTGVuZ3RoKSA9PiB7XG4gIGNvbnN0IFtyb3csIGNvbHVtbiwgaXNWZXJ0aWNhbF0gPSBjb29yZGluYXRlcztcbiAgY29uc3QgZHluYW1pY0RpciA9IGlzVmVydGljYWwgPyBOdW1iZXIocm93KSA6IE51bWJlcihjb2x1bW4pO1xuXG4gIHJldHVybiByb3cgPiA5IHx8IGNvbHVtbiA+IDkgfHwgZHluYW1pY0RpciArIHNoaXBMZW5ndGggLSAxID4gOTtcbn07XG5cbmNvbnN0IGNoZWNrT2Zmc2V0ID0gKGNvb3JkaW5hdGVzLCBzaGlwTGVuZ3RoLCBib2FyZCkgPT4ge1xuICBjb25zdCBbcm93LCBjb2x1bW4sIGlzVmVydGljYWxdID0gY29vcmRpbmF0ZXM7XG4gIGNvbnN0IGR5bmFtaWNEaXIgPSBpc1ZlcnRpY2FsID8gTnVtYmVyKHJvdykgOiBOdW1iZXIoY29sdW1uKTtcblxuICBjb25zdCBvbmVCZWZvcmUgPSBkeW5hbWljRGlyIC0gMTtcbiAgaWYgKG9uZUJlZm9yZSA+IC0xKSB7XG4gICAgY29uc3QgY29vcmRUb0NoZWNrID0gaXNWZXJ0aWNhbCA/IFtvbmVCZWZvcmUsIGNvbHVtbl0gOiBbcm93LCBvbmVCZWZvcmVdO1xuICAgIGNvbnN0IHsgYmFzZSwgdXAsIGRvd24gfSA9IGdldEZpZWxkcyhjb29yZFRvQ2hlY2ssIGlzVmVydGljYWwsIGJvYXJkKTtcblxuICAgIGlmIChpc09jY3VwaWVkRmllbGQoYmFzZSkpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc09jY3VwaWVkRmllbGQodXApKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNPY2N1cGllZEZpZWxkKGRvd24pKSByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IG9uZUFmdGVyID0gZHluYW1pY0RpciArIHNoaXBMZW5ndGg7XG4gIGlmIChvbmVBZnRlciA8IDEwKSB7XG4gICAgY29uc3QgY29vcmRUb0NoZWNrID0gaXNWZXJ0aWNhbCA/IFtvbmVBZnRlciwgY29sdW1uXSA6IFtyb3csIG9uZUFmdGVyXTtcbiAgICBjb25zdCB7IGJhc2UsIHVwLCBkb3duIH0gPSBnZXRGaWVsZHMoY29vcmRUb0NoZWNrLCBpc1ZlcnRpY2FsLCBib2FyZCk7XG5cbiAgICBpZiAoaXNPY2N1cGllZEZpZWxkKGJhc2UpKSByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoaXNPY2N1cGllZEZpZWxkKHVwKSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzT2NjdXBpZWRGaWVsZChkb3duKSkgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5jb25zdCBjaGVja0ZpZWxkcyA9IChjb29yZGluYXRlcywgc2hpcExlbmd0aCwgYm9hcmQpID0+IHtcbiAgY29uc3QgW3JvdywgY29sdW1uLCBpc1ZlcnRpY2FsXSA9IGNvb3JkaW5hdGVzO1xuICBjb25zdCBkeW5hbWljRGlyID0gaXNWZXJ0aWNhbCA/IE51bWJlcihyb3cpIDogTnVtYmVyKGNvbHVtbik7XG5cbiAgZm9yIChsZXQgaSA9IGR5bmFtaWNEaXI7IGkgPCBkeW5hbWljRGlyICsgc2hpcExlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3QgY29vcmRUb0NoZWNrID0gaXNWZXJ0aWNhbCA/IFtpLCBjb2x1bW5dIDogW3JvdywgaV07XG4gICAgY29uc3QgeyBiYXNlLCB1cCwgZG93biB9ID0gZ2V0RmllbGRzKGNvb3JkVG9DaGVjaywgaXNWZXJ0aWNhbCwgYm9hcmQpO1xuXG4gICAgaWYgKGlzT2NjdXBpZWRGaWVsZChiYXNlKSB8fCBiYXNlLm9mZnNldCA9PT0gdHJ1ZSkgcmV0dXJuIHRydWU7XG4gICAgaWYgKGlzT2NjdXBpZWRGaWVsZCh1cCkpIHJldHVybiB0cnVlO1xuICAgIGlmIChpc09jY3VwaWVkRmllbGQoZG93bikpIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuZXhwb3J0IGNvbnN0IGNoZWNrU2hpcENvb3JkaW5hdGVzID0gKHRvQ2hlY2spID0+IHtcbiAgY29uc3QgeyBjb29yZGluYXRlcywgYm9hcmQsIHNoaXBMZW5ndGggfSA9IHRvQ2hlY2s7XG5cbiAgaWYgKGNoZWNrT3V0T2ZCb2FyZChjb29yZGluYXRlcywgc2hpcExlbmd0aCkpIHJldHVybiBmYWxzZTtcbiAgaWYgKGNoZWNrT2Zmc2V0KGNvb3JkaW5hdGVzLCBzaGlwTGVuZ3RoLCBib2FyZCkpIHJldHVybiBmYWxzZTtcbiAgaWYgKGNoZWNrRmllbGRzKGNvb3JkaW5hdGVzLCBzaGlwTGVuZ3RoLCBib2FyZCkpIHJldHVybiBmYWxzZTtcblxuICByZXR1cm4gdHJ1ZTtcbn07XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gJy4vcHVic3ViJztcblxuY29uc3QgY3JlYXRlR2FtZUxvb3AgPSAocGxheWVyMSwgcGxheWVyMikgPT4ge1xuICBsZXQgcm91bmQgPSAwO1xuXG4gIGxldCBhY3RpdmVQbGF5ZXIgPSBwbGF5ZXIyO1xuICBsZXQgb3Bwb25lbnRQbGF5ZXIgPSBwbGF5ZXIxO1xuXG4gIGNvbnN0IHN3aXRjaFR1cm5zID0gKCkgPT4ge1xuICAgIGFjdGl2ZVBsYXllciA9IGFjdGl2ZVBsYXllciA9PT0gcGxheWVyMSA/IHBsYXllcjIgOiBwbGF5ZXIxO1xuICAgIG9wcG9uZW50UGxheWVyID0gb3Bwb25lbnRQbGF5ZXIgPT09IHBsYXllcjIgPyBwbGF5ZXIxIDogcGxheWVyMjtcbiAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS10dXJuJywgYWN0aXZlUGxheWVyKTtcbiAgfTtcblxuICBjb25zdCBnYW1lT3ZlciA9ICgpID0+IHtcbiAgICBjb25zdCBhY3RpdmVTaGlwc1AxID0gcGxheWVyMS5nYW1lYm9hcmQuYWN0aXZlU2hpcHMoKTtcbiAgICBjb25zdCBhY3RpdmVTaGlwc1AyID0gcGxheWVyMi5nYW1lYm9hcmQuYWN0aXZlU2hpcHMoKTtcblxuICAgIGlmIChhY3RpdmVTaGlwc1AxIDwgMSkgcmV0dXJuIGAke3BsYXllcjIubmFtZX0gV0lOUyFgO1xuICAgIGlmIChhY3RpdmVTaGlwc1AyIDwgMSkgcmV0dXJuIGAke3BsYXllcjEubmFtZX0gV0lOUyFgO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYXllcjEsXG4gICAgcGxheWVyMixcbiAgICBnZXQgYWN0aXZlUGxheWVyKCkge1xuICAgICAgcmV0dXJuIGFjdGl2ZVBsYXllcjtcbiAgICB9LFxuICAgIHNldFNoaXBzKCkge1xuICAgICAgcGxheWVyMS5wbGFjZVNoaXBzKCk7XG4gICAgICBwbGF5ZXIyLnBsYWNlU2hpcHMoKTtcblxuICAgICAgUHViU3ViLnB1Ymxpc2goJ2dhbWUtc2hpcHMtY2hlY2snKTtcbiAgICB9LFxuICAgIGFzeW5jIHBsYXlSb3VuZChjb29yZGluYXRlcykge1xuICAgICAgY29uc3QgY3VycmVudEF0dGFjayA9IGF3YWl0IGFjdGl2ZVBsYXllci5hdHRhY2soXG4gICAgICAgIG9wcG9uZW50UGxheWVyLmdhbWVib2FyZCxcbiAgICAgICAgY29vcmRpbmF0ZXNcbiAgICAgICk7XG5cbiAgICAgIGlmIChjdXJyZW50QXR0YWNrID09PSAnbWlzcycpIHtcbiAgICAgICAgc3dpdGNoVHVybnMoKTtcbiAgICAgICAgcm91bmQgKz0gMTtcbiAgICAgICAgUHViU3ViLnB1Ymxpc2goJ2dhbWUtcm91bmQnLCByb3VuZCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChnYW1lT3ZlcigpKSB7XG4gICAgICAgIGNvbnN0IGdhbWVSZXN1bHQgPSBnYW1lT3ZlcigpO1xuICAgICAgICBQdWJTdWIucHVibGlzaCgnZ2FtZS1zdGF0dXMnLCAnR2FtZSBPdmVyJywgZ2FtZVJlc3VsdCk7XG4gICAgICAgIHJldHVybiBnYW1lUmVzdWx0O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY3VycmVudEF0dGFjaztcbiAgICB9LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlR2FtZUxvb3A7XG4iLCJpbXBvcnQgY3JlYXRlQm9hcmQgZnJvbSAnLi9ib2FyZCc7XG5pbXBvcnQgY3JlYXRlU2hpcFN0b3JhZ2UgZnJvbSAnLi9zaGlwJztcblxuY29uc3QgY3JlYXRlUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgZ2FtZWJvYXJkID0gY3JlYXRlQm9hcmQoKTtcbiAgY29uc3Qgc2hpcFN0b3JhZ2UgPSBjcmVhdGVTaGlwU3RvcmFnZSgpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZSxcbiAgICBzaGlwU3RvcmFnZSxcbiAgICBnYW1lYm9hcmQsXG4gICAgcGxhY2VTaGlwKHNoaXBUeXBlLCBjb29yZGluYXRlcykge1xuICAgICAgY29uc3QgY29tcGxldGVTaGlwID0gc2hpcFN0b3JhZ2Vbc2hpcFR5cGVdO1xuXG4gICAgICBnYW1lYm9hcmQucGxhY2VTaGlwKGNvbXBsZXRlU2hpcCwgY29vcmRpbmF0ZXMpO1xuICAgICAgcmV0dXJuIGNvbXBsZXRlU2hpcDtcbiAgICB9LFxuICAgIHBsYWNlU2hpcHMoKSB7XG4gICAgICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zaGlwJyk7XG5cbiAgICAgIHNoaXBzLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHNoaXAuY2xhc3NMaXN0WzFdO1xuICAgICAgICBjb25zdCB7IHJvdywgY29sdW1uLCBkaXJlY3Rpb24gfSA9IHNoaXAuZGF0YXNldDtcbiAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IGRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSBbTnVtYmVyKHJvdyksIE51bWJlcihjb2x1bW4pLCBpc1ZlcnRpY2FsXTtcbiAgICAgICAgXG4gICAgICAgIHNoaXAuY2xhc3NMaXN0LmFkZCgnc2hpcC1zZXQnKTtcbiAgICAgICAgdGhpcy5wbGFjZVNoaXAodHlwZSwgY29vcmRpbmF0ZXMpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBhdHRhY2soZW5lbXlCb2FyZCwgY29vcmRpbmF0ZXMpIHtcbiAgICAgIHJldHVybiBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY29vcmRpbmF0ZXMpO1xuICAgIH0sXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQbGF5ZXI7XG4iLCJjb25zdCBjcmVhdGVQdWJTdWIgPSAoKSA9PiB7XG4gIGNvbnN0IHRyYWNrZXIgPSB7XG4gICAgLy8ga2V5OiBldmVudE5hbWUsIHZhbHVlOiBbIGZ1bmNzIF1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZShldmVudE5hbWUsIGZ1bmMpIHtcbiAgICAgIGlmICh0cmFja2VyW2V2ZW50TmFtZV0pIHRyYWNrZXJbZXZlbnROYW1lXS5wdXNoKGZ1bmMpO1xuICAgICAgaWYgKCF0cmFja2VyW2V2ZW50TmFtZV0pIHRyYWNrZXJbZXZlbnROYW1lXSA9IFtmdW5jXTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdW5zdWJzY3JpYmU6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBmdW5jcyA9IHRyYWNrZXJbZXZlbnROYW1lXTtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IGZ1bmNzLmluZGV4T2YoZnVuYyk7XG4gICAgICAgICAgaWYgKGluZGV4ID4gLTEpIGZ1bmNzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG5cbiAgICBwdWJsaXNoKGV2ZW50TmFtZSwgLi4uYXJncykge1xuICAgICAgY29uc3QgZnVuY3MgPSB0cmFja2VyW2V2ZW50TmFtZV07XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShmdW5jcykpIHtcbiAgICAgICAgZnVuY3MuZm9yRWFjaCgoZnVuYykgPT4ge1xuICAgICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gIH07XG59O1xuXG5jb25zdCBQdWJTdWIgPSBjcmVhdGVQdWJTdWIoKTtcblxuZXhwb3J0IGRlZmF1bHQgUHViU3ViO1xuIiwiY29uc3QgY3JlYXRlU2hpcCA9IChsZW5ndGgsIHNoaXBUeXBlKSA9PiB7XG4gIGNvbnN0IHR5cGUgPSBzaGlwVHlwZTtcbiAgY29uc3Qgb2Zmc2V0ID0gW107XG4gIGxldCBoaXRzID0gMDtcblxuICByZXR1cm4ge1xuICAgIHR5cGUsXG4gICAgbGVuZ3RoLFxuICAgIG9mZnNldCxcbiAgICBnZXQgaGVhbHRoKCkge1xuICAgICAgcmV0dXJuIGxlbmd0aCAtIGhpdHM7XG4gICAgfSxcbiAgICBpc1N1bmsoKSB7XG4gICAgICByZXR1cm4gdGhpcy5oZWFsdGggPCAxO1xuICAgIH0sXG4gICAgaGl0KCkge1xuICAgICAgaGl0cyArPSAxO1xuICAgIH0sXG4gIH07XG59O1xuXG5jb25zdCBjcmVhdGVTaGlwU3RvcmFnZSA9ICgpID0+ICh7XG4gIEFpcmNyYWZ0Q2FycmllcjogY3JlYXRlU2hpcCg1LCAnQWlyY3JhZnRDYXJyaWVyJyksXG4gIEJhdHRsZXNoaXA6IGNyZWF0ZVNoaXAoNCwgJ0JhdHRsZXNoaXAnKSxcbiAgQ3J1aXNlcjogY3JlYXRlU2hpcCgzLCAnQ3J1aXNlcicpLFxuICBEZXN0cm95ZXIxOiBjcmVhdGVTaGlwKDIsICdEZXN0cm95ZXIxJyksXG4gIERlc3Ryb3llcjI6IGNyZWF0ZVNoaXAoMiwgJ0Rlc3Ryb3llcjInKSxcbiAgU3VibWFyaW5lMTogY3JlYXRlU2hpcCgxLCAnU3VibWFyaW5lMScpLFxuICBTdWJtYXJpbmUyOiBjcmVhdGVTaGlwKDEsICdTdWJtYXJpbmUyJyksXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlU2hpcFN0b3JhZ2U7XG4iLCJjb25zdCBjcmVhdGVTaGlwc0xlZnQgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnYm9hcmQtc3RhdHMtc2hpcHMnKTtcblxuICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICB0ZXh0LmNsYXNzTGlzdC5hZGQoJ2JvYXJkLXN0YXRzLXNoaXBzLXRleHQnKTtcbiAgdGV4dC50ZXh0Q29udGVudCA9ICdSZW1haW5pbmcgc2hpcHM6ICc7XG5cbiAgY29uc3QgY291bnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIGNvdW50LmNsYXNzTGlzdC5hZGQoJ2JvYXJkLXN0YXRzLXNoaXBzLWNvdW50Jyk7XG4gIGNvdW50LnRleHRDb250ZW50ID0gMDtcblxuICBjb250YWluZXIuYXBwZW5kKHRleHQsIGNvdW50KTtcblxuICByZXR1cm4gY29udGFpbmVyO1xufTtcblxuY29uc3QgY3JlYXRlU3RhdHNVSSA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IHN0YXRzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHN0YXRzLmNsYXNzTGlzdC5hZGQoJ2JvYXJkLXN0YXRzJyk7XG5cbiAgY29uc3QgbmFtZVRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgbmFtZVRhZy5jbGFzc0xpc3QuYWRkKCdib2FyZC1zdGF0cy1uYW1lJyk7XG4gIG5hbWVUYWcudGV4dENvbnRlbnQgPSBuYW1lO1xuXG4gIGNvbnN0IHNoaXBzTGVmdCA9IGNyZWF0ZVNoaXBzTGVmdCgpO1xuXG4gIHN0YXRzLmFwcGVuZChuYW1lVGFnLCBzaGlwc0xlZnQpO1xuXG4gIHJldHVybiBzdGF0cztcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVN0YXRzVUk7XG4iLCJpbXBvcnQgUHViU3ViIGZyb20gJy4uL21vZHVsZXMvcHVic3ViJztcbmltcG9ydCB7XG4gIGhhbmRsZURyYWdEcm9wLFxuICBoYW5kbGVEcmFnT3ZlcixcbiAgaGFuZGxlRHJhZ0xlYXZlLFxufSBmcm9tICcuLi9jb250cm9sbGVyL2RyYWctYW5kLWRyb3AnO1xuXG5pbXBvcnQgdmlkZW9GaWxlIGZyb20gJy4vYXNzZXRzL2JhY2stdmlkZW8ubXA0JztcblxuY29uc3QgY3JlYXRlVmlkZW9CYWNrZ3JvdW5kID0gKCkgPT4ge1xuICBjb25zdCB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gIHZpZGVvLmNsYXNzTGlzdC5hZGQoJ3ZpZGVvLWNvbnRhaW5lcicpO1xuXG4gIHZpZGVvLmF1dG9wbGF5ID0gdHJ1ZTtcbiAgdmlkZW8ubG9vcCA9IHRydWU7XG4gIHZpZGVvLnNyYyA9IHZpZGVvRmlsZTtcbiAgdmlkZW8udHlwZSA9ICd2aWRlby9tcDQnO1xuXG4gIHJldHVybiB2aWRlbztcbn07XG5cbmNvbnN0IGhhbmRsZUNsaWNrRmllbGQgPSAoZXZlbnQpID0+IHtcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gZXZlbnQudGFyZ2V0LmRhdGFzZXQ7XG4gIFB1YlN1Yi5wdWJsaXNoKCdmaWVsZC1jbGljaycsIFtyb3csIGNvbHVtbl0pO1xufTtcblxuY29uc3QgY3JlYXRlRmllbGRVSSA9IChmaWVsZCkgPT4ge1xuICBjb25zdCBmaWVsZEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBjb25zdCBbcm93LCBjb2x1bW5dID0gZmllbGQuY29vcmRpbmF0ZXM7XG5cbiAgZmllbGRCdXR0b24uY2xhc3NMaXN0LmFkZCgnYm9hcmQtZmllbGQnKTtcbiAgZmllbGRCdXR0b24uZGF0YXNldC5jb2x1bW4gPSBjb2x1bW47XG4gIGZpZWxkQnV0dG9uLmRhdGFzZXQucm93ID0gcm93O1xuICBmaWVsZEJ1dHRvbi5kYXRhc2V0LnNoaXAgPSBmYWxzZTtcblxuICByZXR1cm4gZmllbGRCdXR0b247XG59O1xuXG5jb25zdCByZW5kZXJCb2FyZCA9IChib2FyZCwgaXNFbmVteSkgPT4ge1xuICBjb25zdCBib2FyZFVJID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGJvYXJkVUkuY2xhc3NMaXN0LmFkZCgnYm9hcmQnKTtcblxuICBib2FyZFVJLmFwcGVuZChjcmVhdGVWaWRlb0JhY2tncm91bmQoKSk7XG5cbiAgYm9hcmQuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgcm93LmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBjb25zdCBmaWVsZEJ1dHRvbiA9IGNyZWF0ZUZpZWxkVUkoZmllbGQpO1xuICAgICAgXG4gICAgICBpZiAoaXNFbmVteSkge1xuICAgICAgICBmaWVsZEJ1dHRvbi5vbmNsaWNrID0gaGFuZGxlQ2xpY2tGaWVsZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZpZWxkQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgaGFuZGxlRHJhZ092ZXIpO1xuICAgICAgICBmaWVsZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkcmFnbGVhdmUnLCBoYW5kbGVEcmFnTGVhdmUpO1xuICAgICAgICBmaWVsZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgaGFuZGxlRHJhZ0Ryb3ApO1xuICAgICAgfVxuXG4gICAgICBib2FyZFVJLmFwcGVuZChmaWVsZEJ1dHRvbik7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBib2FyZFVJO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgcmVuZGVyQm9hcmQ7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuZXhwb3J0IGNvbnN0IGdldEZpZWxkcyA9ICguLi5hcmdzKSA9PiB7XG4gIGNvbnN0IFtyb3csIGNvbHVtbiwgbGVuZ3RoLCBkaXJlY3Rpb24sIGNvbnRhaW5lciA9IGRvY3VtZW50XSA9IGFyZ3M7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCc7XG5cbiAgY29uc3Qgcm93TnVtID0gTnVtYmVyKHJvdyk7XG4gIGNvbnN0IGNvbHVtbk51bSA9IE51bWJlcihjb2x1bW4pO1xuICBjb25zdCBsZW5ndGhOdW0gPSBOdW1iZXIobGVuZ3RoKTtcblxuICBjb25zdCBkeW5hbWljRGlyID0gaXNWZXJ0aWNhbCA/IHJvd051bSA6IGNvbHVtbk51bTtcbiAgY29uc3Qgc2hpcEVuZCA9IGR5bmFtaWNEaXIgKyBsZW5ndGhOdW0gLSAxO1xuXG4gIGNvbnN0IGNvcmVGaWVsZHMgPSBbXTtcbiAgY29uc3Qgb2Zmc2V0RmllbGRzID0gW107XG5cbiAgY29uc3QgZ2V0RmllbGQgPSAocm93RGlyLCBjb2x1bW5EaXIpID0+IHtcbiAgICBjb25zdCBzZWxlY3RvckJhc2UgPSBgW2RhdGEtcm93PScke3Jvd0Rpcn0nXVtkYXRhLWNvbHVtbj0nJHtjb2x1bW5EaXJ9J11gO1xuICAgIHJldHVybiBjb250YWluZXIucXVlcnlTZWxlY3RvcihzZWxlY3RvckJhc2UpO1xuICB9O1xuXG4gIGNvbnN0IGdldFNldCA9IChiYXNlUm93LCBiYXNlQ29sdW1uKSA9PiAoe1xuICAgIGJhc2U6IGdldEZpZWxkKGJhc2VSb3csIGJhc2VDb2x1bW4pLFxuICAgIG9uZVVwOiBpc1ZlcnRpY2FsXG4gICAgICA/IGdldEZpZWxkKGJhc2VSb3csIGJhc2VDb2x1bW4gKyAxKVxuICAgICAgOiBnZXRGaWVsZChiYXNlUm93ICsgMSwgYmFzZUNvbHVtbiksXG4gICAgb25lRG93bjogaXNWZXJ0aWNhbFxuICAgICAgPyBnZXRGaWVsZChiYXNlUm93LCBiYXNlQ29sdW1uIC0gMSlcbiAgICAgIDogZ2V0RmllbGQoYmFzZVJvdyAtIDEsIGJhc2VDb2x1bW4pLFxuICB9KTtcblxuICBpZiAoZHluYW1pY0RpciAtIDEgPiAtMSkge1xuICAgIGNvbnN0IHNldCA9IGlzVmVydGljYWxcbiAgICAgID8gZ2V0U2V0KHJvd051bSAtIDEsIGNvbHVtbk51bSlcbiAgICAgIDogZ2V0U2V0KHJvd051bSwgY29sdW1uTnVtIC0gMSk7XG5cbiAgICBvZmZzZXRGaWVsZHMucHVzaChzZXQuYmFzZSwgc2V0Lm9uZVVwLCBzZXQub25lRG93bik7XG4gIH1cblxuICBpZiAoc2hpcEVuZCArIDEgPCAxMCkge1xuICAgIGNvbnN0IHNldCA9IGlzVmVydGljYWxcbiAgICAgID8gZ2V0U2V0KHNoaXBFbmQgKyAxLCBjb2x1bW5OdW0pXG4gICAgICA6IGdldFNldChyb3dOdW0sIHNoaXBFbmQgKyAxKTtcblxuICAgIG9mZnNldEZpZWxkcy5wdXNoKHNldC5iYXNlLCBzZXQub25lVXAsIHNldC5vbmVEb3duKTtcbiAgfVxuXG4gIGZvciAobGV0IGkgPSBkeW5hbWljRGlyOyBpIDw9IHNoaXBFbmQ7IGkgKz0gMSkge1xuICAgIGNvbnN0IHNldCA9IGlzVmVydGljYWwgPyBnZXRTZXQoaSwgY29sdW1uTnVtKSA6IGdldFNldChyb3dOdW0sIGkpO1xuXG4gICAgY29yZUZpZWxkcy5wdXNoKHNldC5iYXNlKTtcbiAgICBvZmZzZXRGaWVsZHMucHVzaChzZXQub25lVXAsIHNldC5vbmVEb3duKTtcbiAgfVxuXG4gIHJldHVybiB7IGNvcmVGaWVsZHMsIG9mZnNldEZpZWxkcyB9O1xufTtcblxuZXhwb3J0IGNvbnN0IGlzQXZhaWxhYmxlRmllbGRzID0gKGNvcmVGaWVsZHMsIG9mZnNldEZpZWxkcykgPT4ge1xuICBsZXQgYXZhaWxhYmxlID0gdHJ1ZTtcblxuICBjb3JlRmllbGRzLmZvckVhY2goKGRpdikgPT4ge1xuICAgIGlmIChkaXYuZGF0YXNldC5zaGlwID09PSAndHJ1ZScpIGF2YWlsYWJsZSA9IGZhbHNlO1xuICB9KTtcblxuICBvZmZzZXRGaWVsZHMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgaWYgKCFkaXYpIHJldHVybjtcbiAgICBpZiAoZGl2LmRhdGFzZXQuc2hpcCA9PT0gJ3RydWUnKSBhdmFpbGFibGUgPSBmYWxzZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGF2YWlsYWJsZTtcbn07XG5cbmV4cG9ydCBjb25zdCBnZXRSYW5kb21FbXB0eUZpZWxkcyA9IChuZXdTaGlwLCBib2FyZFVJKSA9PiB7XG4gIGNvbnN0IHsgbGVuZ3RoLCBkaXJlY3Rpb24gfSA9IG5ld1NoaXAuZGF0YXNldDtcbiAgbGV0IG5ld1JvdztcbiAgbGV0IG5ld0NvbHVtbjtcbiAgbGV0IG5ld0ZpZWxkcztcbiAgbGV0IGtlZXBHb2luZyA9IHRydWU7XG5cbiAgd2hpbGUgKGtlZXBHb2luZykge1xuICAgIG5ld1JvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICBuZXdDb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG5cbiAgICB3aGlsZSAobmV3Um93ICsgKGxlbmd0aCAtIDEpID4gOSB8fCBuZXdDb2x1bW4gKyAobGVuZ3RoIC0gMSkgPiA5KSB7XG4gICAgICBuZXdSb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBuZXdDb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgfVxuXG4gICAgbmV3RmllbGRzID0gZ2V0RmllbGRzKG5ld1JvdywgbmV3Q29sdW1uLCBsZW5ndGgsIGRpcmVjdGlvbiwgYm9hcmRVSSk7XG4gICAgY29uc3QgeyBjb3JlRmllbGRzLCBvZmZzZXRGaWVsZHMgfSA9IG5ld0ZpZWxkcztcblxuICAgIGlmIChjb3JlRmllbGRzLmxlbmd0aCA9PT0gTnVtYmVyKGxlbmd0aCkgJiYgIWNvcmVGaWVsZHMuaW5jbHVkZXMobnVsbCkpIHtcbiAgICAgIGtlZXBHb2luZyA9ICFpc0F2YWlsYWJsZUZpZWxkcyhjb3JlRmllbGRzLCBvZmZzZXRGaWVsZHMpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IGZpZWxkczogbmV3RmllbGRzLCByb3c6IG5ld1JvdywgY29sdW1uOiBuZXdDb2x1bW4gfTtcbn07XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVGaWVsZHNTaGlwID0gKGNvcmVGaWVsZHMsIG1hcmspID0+IHtcbiAgY29yZUZpZWxkcy5mb3JFYWNoKChkaXYpID0+IHtcbiAgICBkaXYuZGF0YXNldC5zaGlwID0gbWFyaztcbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlRmllbGRzT2Zmc2V0ID0gKG9mZnNldEZpZWxkcywgbWFyaykgPT4ge1xuICBvZmZzZXRGaWVsZHMuZm9yRWFjaCgoZGl2KSA9PiB7XG4gICAgaWYgKCFkaXYpIHJldHVybjtcbiAgICBkaXYuZGF0YXNldC5vZmZzZXQgPSBtYXJrO1xuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCBjbGVhckZpZWxkcyA9IChmaWVsZHNUb0NsZWFyKSA9PiB7XG4gIGNvbnN0IHsgY29yZUZpZWxkcywgb2Zmc2V0RmllbGRzIH0gPSBmaWVsZHNUb0NsZWFyO1xuXG4gIHVwZGF0ZUZpZWxkc1NoaXAoY29yZUZpZWxkcywgJ2ZhbHNlJyk7XG4gIHVwZGF0ZUZpZWxkc09mZnNldChvZmZzZXRGaWVsZHMsICdmYWxzZScpO1xufTtcblxuZXhwb3J0IGNvbnN0IHBvcHVsYXRlRmllbGRzID0gKGZpZWxkc1RvUG9wdWxhdGUpID0+IHtcbiAgY29uc3QgeyBjb3JlRmllbGRzLCBvZmZzZXRGaWVsZHMgfSA9IGZpZWxkc1RvUG9wdWxhdGU7XG5cbiAgdXBkYXRlRmllbGRzU2hpcChjb3JlRmllbGRzLCAndHJ1ZScpO1xuICB1cGRhdGVGaWVsZHNPZmZzZXQob2Zmc2V0RmllbGRzLCAndHJ1ZScpO1xufTtcbiIsImltcG9ydCAnLi9zdHlsZS9nYW1lYm9hcmQuY3NzJztcblxuaW1wb3J0IFB1YlN1YiBmcm9tICcuLi9tb2R1bGVzL3B1YnN1Yic7XG5pbXBvcnQgcmVuZGVyQm9hcmQgZnJvbSAnLi9ib2FyZFVJJztcbmltcG9ydCByZW5kZXJTaGlwcyBmcm9tICcuL3NoaXBVSSc7XG5pbXBvcnQgY3JlYXRlU3RhdHNVSSBmcm9tICcuL2JvYXJkU3RhdHNVSSc7XG5cbmNvbnN0IGNyZWF0ZUdhbWVib2FyZFVJID0gKGlzRW5lbXkpID0+IHtcbiAgY29uc3QgcGxheWVyQ2xhc3MgPSBpc0VuZW15ID8gJ3BsYXllcjInIDogJ3BsYXllcjEnO1xuXG4gIGNvbnN0IGdhbWVib2FyZFVJID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGdhbWVib2FyZFVJLmNsYXNzTGlzdC5hZGQoJ2dhbWVib2FyZCcpO1xuICBnYW1lYm9hcmRVSS5jbGFzc0xpc3QuYWRkKHBsYXllckNsYXNzKTtcblxuICByZXR1cm4gZ2FtZWJvYXJkVUk7XG59O1xuXG5jb25zdCByZW5kZXJHYW1lYm9hcmQgPSAocGxheWVyLCBpc0VuZW15ID0gZmFsc2UpID0+IHtcbiAgY29uc3QgeyBuYW1lLCBzaGlwU3RvcmFnZSwgZ2FtZWJvYXJkIH0gPSBwbGF5ZXI7XG4gIGNvbnN0IHsgYm9hcmQgfSA9IGdhbWVib2FyZDtcblxuICBjb25zdCBnYW1lYm9hcmRVSSA9IGNyZWF0ZUdhbWVib2FyZFVJKGlzRW5lbXkpO1xuICBjb25zdCBib2FyZFVJID0gcmVuZGVyQm9hcmQoYm9hcmQsIGlzRW5lbXkpO1xuICBjb25zdCBzdGF0cyA9IGNyZWF0ZVN0YXRzVUkobmFtZSk7XG5cbiAgZ2FtZWJvYXJkVUkuYXBwZW5kKGJvYXJkVUksIHN0YXRzKTtcblxuICBpZiAoaXNFbmVteSkge1xuICAgIGdhbWVib2FyZFVJLmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGVkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmVuZGVyU2hpcHMoc2hpcFN0b3JhZ2UsIGJvYXJkVUkpO1xuICB9XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS10dXJuJywgKGFjdGl2ZVBsYXllcikgPT4ge1xuICAgIGlmIChhY3RpdmVQbGF5ZXIgPT09IHBsYXllcikge1xuICAgICAgZ2FtZWJvYXJkVUkuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2FtZWJvYXJkVUkuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZWQnKTtcbiAgICB9XG4gIH0pO1xuXG4gIFB1YlN1Yi5zdWJzY3JpYmUoJ2dhbWUtc3RhdHVzJywgKHBoYXNlKSA9PiB7XG4gICAgaWYgKHBoYXNlID09PSAnR2FtZSBPdmVyJykge1xuICAgICAgZ2FtZWJvYXJkVUkuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBnYW1lYm9hcmRVSTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlbmRlckdhbWVib2FyZDtcbiIsImltcG9ydCBQdWJTdWIgZnJvbSAnLi4vbW9kdWxlcy9wdWJzdWInO1xuaW1wb3J0ICcuL3N0eWxlL2h1ZC5jc3MnO1xuXG5jb25zdCBzd2l0Y2hIdWRJbmZvID0gKCkgPT4ge1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVkLW1hbnVhbCcpLmNsYXNzTGlzdC50b2dnbGUoJ2hpZGUnKTtcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmh1ZC1zdGFnZS1jb250YWluZXInKS5jbGFzc0xpc3QudG9nZ2xlKCdoaWRlJyk7XG5cbiAgY29uc3QgaXNDZWxlYnJhdGluZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jZWxlYnJhdGlvbicpO1xuICBpZiAoaXNDZWxlYnJhdGluZykgaXNDZWxlYnJhdGluZy5jbGFzc0xpc3QucmVtb3ZlKCdjZWxlYnJhdGlvbicpO1xufTtcblxuY29uc3QgY3JhdGVTdGFydEJ1dHRvbiA9ICgpID0+IHtcbiAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGxldCBzdGFnZSA9ICdTdGFydCc7XG5cbiAgYnV0dG9uLnRleHRDb250ZW50ID0gc3RhZ2U7XG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzdGFydEJ0bicpO1xuICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uU3R5bGUxJyk7XG4gIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBidXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIFB1YlN1Yi5wdWJsaXNoKCdnYW1lLXN0YXR1cycsIHN0YWdlKTtcbiAgICBpZiAoc3RhZ2UgPT09ICdTdGFydCcpIHtcbiAgICAgIHN0YWdlID0gJ1Jlc3RhcnQnO1xuICAgICAgc3dpdGNoSHVkSW5mbygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFnZSA9ICdTdGFydCc7XG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBidXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9LCA2MDApO1xuICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHN0YWdlO1xuICB9KTtcblxuICByZXR1cm4gYnV0dG9uO1xufTtcblxuY29uc3QgY3JlYXRlUm91bmRVSSA9ICgpID0+IHtcbiAgY29uc3Qgcm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gIHJvdW5kLmNsYXNzTGlzdC5hZGQoJ2h1ZC1yb3VuZCcpO1xuICByb3VuZC50ZXh0Q29udGVudCA9IGBSb3VuZDogMGA7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS1yb3VuZCcsIChjdXJyZW50Um91bmQpID0+IHtcbiAgICByb3VuZC50ZXh0Q29udGVudCA9IGBSb3VuZDogJHtjdXJyZW50Um91bmR9YDtcbiAgfSk7XG5cbiAgcmV0dXJuIHJvdW5kO1xufTtcblxuY29uc3QgY3JlYXRlU3RhZ2VVSSA9ICgpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdodWQtc3RhZ2UtY29udGFpbmVyJyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoaWRlJyk7XG5cbiAgY29uc3QgY3VycmVudFN0YWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgY3VycmVudFN0YWdlLmNsYXNzTGlzdC5hZGQoJ2h1ZC1zdGFnZS10ZXh0Jyk7XG4gIGN1cnJlbnRTdGFnZS50ZXh0Q29udGVudCA9ICdTZXR1cCBTaGlwcyc7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS10dXJuJywgKHBsYXllcikgPT4ge1xuICAgIGN1cnJlbnRTdGFnZS50ZXh0Q29udGVudCA9IGAke3BsYXllci5uYW1lfSdzIHR1cm4hYDtcbiAgfSk7XG5cbiAgUHViU3ViLnN1YnNjcmliZSgnZ2FtZS1zdGF0dXMnLCAocGhhc2UsIHJlc3VsdCkgPT4ge1xuICAgIGlmIChwaGFzZSA9PT0gJ0dhbWUgT3ZlcicpIHtcbiAgICAgIGN1cnJlbnRTdGFnZS5jbGFzc0xpc3QuYWRkKCdjZWxlYnJhdGlvbicpO1xuICAgICAgY3VycmVudFN0YWdlLnRleHRDb250ZW50ID0gcmVzdWx0LnRvVXBwZXJDYXNlKCk7XG4gICAgfVxuICB9KTtcblxuICBjb250YWluZXIuYXBwZW5kKGN1cnJlbnRTdGFnZSk7XG4gIHJldHVybiBjb250YWluZXI7XG59O1xuXG5jb25zdCBjcmVhdGVNYW51YWwgPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaHVkLW1hbnVhbCcpO1xuXG4gIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgdGl0bGUudGV4dENvbnRlbnQgPSAnT1JHQU5JWkUgWU9VUiBTSElQUyc7XG5cbiAgY29uc3Qgcm90YXRlSGludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgcm90YXRlSGludC50ZXh0Q29udGVudCA9ICdDbGljayB0byByb3RhdGUnO1xuXG4gIGNvbnN0IGRyYWdIaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICBkcmFnSGludC50ZXh0Q29udGVudCA9ICdEcmFnIHRvIG1vdmUnO1xuXG4gIGNvbnRhaW5lci5hcHBlbmQodGl0bGUsIHJvdGF0ZUhpbnQsIGRyYWdIaW50KTtcblxuICByZXR1cm4gY29udGFpbmVyO1xufTtcblxuY29uc3QgY3JhdGVIdWQgPSAoKSA9PiB7XG4gIGNvbnN0IGh1ZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBodWQuY2xhc3NMaXN0LmFkZCgnaHVkJyk7XG5cbiAgY29uc3Qgc3RhcnRCdXR0b24gPSBjcmF0ZVN0YXJ0QnV0dG9uKCk7XG4gIGNvbnN0IGdhbWVTdGFnZSA9IGNyZWF0ZVN0YWdlVUkoKTtcbiAgY29uc3QgbWFudWFsID0gY3JlYXRlTWFudWFsKCk7XG4gIGNvbnN0IHJvdW5kID0gY3JlYXRlUm91bmRVSSgpO1xuXG4gIGh1ZC5hcHBlbmQoc3RhcnRCdXR0b24sIG1hbnVhbCwgZ2FtZVN0YWdlLCByb3VuZCk7XG5cbiAgcmV0dXJuIGh1ZDtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyYXRlSHVkO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cblxuaW1wb3J0IHsgaGFuZGxlRHJhZ1N0YXJ0LCBoYW5kbGVEcmFnRW5kIH0gZnJvbSAnLi4vY29udHJvbGxlci9kcmFnLWFuZC1kcm9wJztcbmltcG9ydCB7XG4gIGNsZWFyRmllbGRzLFxuICBnZXRGaWVsZHMsXG4gIGdldFJhbmRvbUVtcHR5RmllbGRzLFxuICBwb3B1bGF0ZUZpZWxkcyxcbiAgaXNBdmFpbGFibGVGaWVsZHMsXG4gIHVwZGF0ZUZpZWxkc1NoaXAsXG59IGZyb20gJy4vZmllbGRzSGVscGVyJztcblxuY29uc3Qgbm9Sb3RhdGVBbmltYXRpb24gPSAoZGl2KSA9PiB7XG4gIGRpdi5jbGFzc0xpc3QuYWRkKCduby1yb3RhdGUnKTtcbiAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZGl2LmNsYXNzTGlzdC5yZW1vdmUoJ25vLXJvdGF0ZScpO1xuICB9LCA3MDApO1xufTtcblxuY29uc3QgaGFuZGxlQ2xpY2tTaGlwUm90YXRlID0gKHsgdGFyZ2V0IH0pID0+IHtcbiAgY29uc3QgeyBkaXJlY3Rpb24sIHJvdywgY29sdW1uLCBsZW5ndGggfSA9IHRhcmdldC5kYXRhc2V0O1xuICBjb25zdCBpc1ZlcnRpY2FsID0gZGlyZWN0aW9uID09PSAndmVydGljYWwnO1xuXG4gIGNvbnN0IG5ld0RpciA9IGlzVmVydGljYWwgPyAnaG9yaXpvbnRhbCcgOiAndmVydGljYWwnO1xuICBjb25zdCBuZXdGaWVsZHMgPSBnZXRGaWVsZHMocm93LCBjb2x1bW4sIGxlbmd0aCwgbmV3RGlyKTtcbiAgY29uc3QgbmV3RmllbGRzQ29yZSA9IG5ld0ZpZWxkcy5jb3JlRmllbGRzO1xuICBjb25zdCBuZXdGaWVsZHNPZmZzZXQgPSBuZXdGaWVsZHMub2Zmc2V0RmllbGRzO1xuXG4gIGNvbnN0IGN1cnJlbnRGaWVsZHMgPSBnZXRGaWVsZHMocm93LCBjb2x1bW4sIGxlbmd0aCwgZGlyZWN0aW9uKTtcbiAgY29uc3QgY3VycmVudEZpZWxkc0NvcmUgPSBjdXJyZW50RmllbGRzLmNvcmVGaWVsZHM7XG5cbiAgbGV0IGFsbEF2YWlsYWJsZSA9IHRydWU7XG5cbiAgaWYgKG5ld0ZpZWxkc0NvcmUubGVuZ3RoICE9PSBOdW1iZXIobGVuZ3RoKSB8fCBuZXdGaWVsZHNDb3JlLmluY2x1ZGVzKG51bGwpKSB7XG4gICAgbm9Sb3RhdGVBbmltYXRpb24odGFyZ2V0KTtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBSZW1vdmUgc2hpcCBmcm9tIGN1cnJlbnQgZmllbGRzIHRvIG5vdCBtZXNzIHdpdGggdGhlIGNoZWNrXG4gIHVwZGF0ZUZpZWxkc1NoaXAoY3VycmVudEZpZWxkc0NvcmUsICdmYWxzZScpO1xuICBhbGxBdmFpbGFibGUgPSBpc0F2YWlsYWJsZUZpZWxkcyhuZXdGaWVsZHNDb3JlLCBuZXdGaWVsZHNPZmZzZXQpO1xuXG4gIGlmICghYWxsQXZhaWxhYmxlKSB7XG4gICAgdXBkYXRlRmllbGRzU2hpcChjdXJyZW50RmllbGRzQ29yZSwgJ3RydWUnKTtcbiAgICBub1JvdGF0ZUFuaW1hdGlvbih0YXJnZXQpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNsZWFyRmllbGRzKGN1cnJlbnRGaWVsZHMpO1xuICBwb3B1bGF0ZUZpZWxkcyhuZXdGaWVsZHMpO1xuICB0YXJnZXQuZGF0YXNldC5kaXJlY3Rpb24gPSBuZXdEaXI7XG59O1xuXG5jb25zdCByZW5kZXJTaGlwID0gKHsgbGVuZ3RoLCB0eXBlIH0pID0+IHtcbiAgY29uc3Qgc2hpcENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb25zdCBkaXIgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcblxuICBzaGlwQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NoaXAnKTtcbiAgc2hpcENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKGAke3R5cGV9YCk7XG4gIHNoaXBDb250YWluZXIuZGF0YXNldC5sZW5ndGggPSBsZW5ndGg7XG4gIHNoaXBDb250YWluZXIuZGF0YXNldC5kaXJlY3Rpb24gPSBkaXI7XG4gIHNoaXBDb250YWluZXIuZGF0YXNldC5yb3cgPSBudWxsO1xuICBzaGlwQ29udGFpbmVyLmRhdGFzZXQuY29sdW1uID0gbnVsbDtcblxuICBzaGlwQ29udGFpbmVyLmRyYWdnYWJsZSA9IHRydWU7XG4gIHNoaXBDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgaGFuZGxlRHJhZ1N0YXJ0KTtcbiAgc2hpcENvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW5kJywgaGFuZGxlRHJhZ0VuZCk7XG4gIHNoaXBDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVDbGlja1NoaXBSb3RhdGUpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBjb25zdCBzaGlwQmxvY2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzaGlwQmxvY2suY2xhc3NMaXN0LmFkZCgnc2hpcC1ibG9jaycpO1xuICAgIHNoaXBDb250YWluZXIuYXBwZW5kKHNoaXBCbG9jayk7XG4gIH1cblxuICByZXR1cm4gc2hpcENvbnRhaW5lcjtcbn07XG5cbmNvbnN0IHJlbmRlclNoaXBzID0gKHNoaXBTdG9yYWdlLCBib2FyZFVJKSA9PiB7XG4gIE9iamVjdC5rZXlzKHNoaXBTdG9yYWdlKS5mb3JFYWNoKChzaGlwVHlwZSkgPT4ge1xuICAgIGNvbnN0IG5ld1NoaXAgPSByZW5kZXJTaGlwKHNoaXBTdG9yYWdlW3NoaXBUeXBlXSk7XG4gICAgY29uc3QgeyBmaWVsZHMsIHJvdywgY29sdW1uIH0gPSBnZXRSYW5kb21FbXB0eUZpZWxkcyhuZXdTaGlwLCBib2FyZFVJKTtcblxuICAgIG5ld1NoaXAuZGF0YXNldC5yb3cgPSByb3c7XG4gICAgbmV3U2hpcC5kYXRhc2V0LmNvbHVtbiA9IGNvbHVtbjtcblxuICAgIGNvbnN0IGJhc2VGaWVsZCA9IGZpZWxkcy5jb3JlRmllbGRzLmZpbmQoXG4gICAgICAoeyBkYXRhc2V0IH0pID0+XG4gICAgICAgIE51bWJlcihkYXRhc2V0LnJvdykgPT09IHJvdyAmJiBOdW1iZXIoZGF0YXNldC5jb2x1bW4pID09PSBjb2x1bW5cbiAgICApO1xuXG4gICAgYmFzZUZpZWxkLmFwcGVuZChuZXdTaGlwKTtcbiAgICBwb3B1bGF0ZUZpZWxkcyhmaWVsZHMpO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHJlbmRlclNoaXBzO1xuIiwiaW1wb3J0IFB1YlN1YiBmcm9tICcuLi9tb2R1bGVzL3B1YnN1Yic7XG5pbXBvcnQgJy4vc3R5bGUvd2VsY29tZS5jc3MnO1xuXG5jb25zdCBzdWJtaXROYW1lcyA9ICgpID0+IHtcbiAgY29uc3QgaW5wdXRQMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGlucHV0W2RhdGEtcGxheWVyPSdQbGF5ZXIgMSddYCk7XG4gIGNvbnN0IGlucHV0UDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBpbnB1dFtkYXRhLXBsYXllcj0nUGxheWVyIDInXWApO1xuXG4gIGNvbnN0IG5hbWUxID0gaW5wdXRQMS52YWx1ZSB8fCAnUGxheWVyIDEnO1xuICBjb25zdCBuYW1lMiA9IGlucHV0UDIgPyBpbnB1dFAyLnZhbHVlIHx8ICdQbGF5ZXIyJyA6IGZhbHNlO1xuXG4gIFB1YlN1Yi5wdWJsaXNoKCdnYW1lLXNldHVwJywgW25hbWUxLCBuYW1lMl0pO1xuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VsY29tZS1jb250YWluZXInKS5yZW1vdmUoKTtcbn07XG5cbmNvbnN0IGhhbmRsZUtleVByZXNzRW50ZXIgPSAoeyBrZXkgfSkgPT4ge1xuICBpZiAoa2V5ID09PSAnRW50ZXInKSB7XG4gICAgc3VibWl0TmFtZXMoKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIGhhbmRsZUtleVByZXNzRW50ZXIpO1xuICB9XG59O1xuXG4vLyBTZWxlY3QgTmFtZVxuY29uc3QgY3JlYXRlTmFtZUlucHV0ID0gKHBsYXllcikgPT4ge1xuICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3dlbGNvbWUtbmFtZS1jb250YWluZXInKTtcblxuICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gIGxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywgJ25hbWUnKTtcbiAgbGFiZWwudGV4dENvbnRlbnQgPSBwbGF5ZXI7XG5cbiAgY29uc3QgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICBpbnB1dC5jbGFzc0xpc3QuYWRkKCd3ZWxjb21lLW5hbWUtaW5wdXQnKTtcbiAgaW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgaW5wdXQubmFtZSA9ICduYW1lJztcbiAgaW5wdXQuYXV0b2NvbXBsZXRlID0gZmFsc2U7XG4gIGlucHV0LnBsYWNlaG9sZGVyID0gJ05BTUUnO1xuICBpbnB1dC5kYXRhc2V0LnBsYXllciA9IHBsYXllcjtcblxuICBsYWJlbC5hcHBlbmQoaW5wdXQpO1xuICBjb250YWluZXIuYXBwZW5kKGxhYmVsKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbmNvbnN0IGNyZWF0ZVN0YXJ0QnV0dG9uID0gKCkgPT4ge1xuICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3dlbGNvbWUtc3RhcnQtYnV0dG9uJyk7XG4gIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidXR0b25TdHlsZTEnKTtcbiAgYnV0dG9uLnRleHRDb250ZW50ID0gJ1NUQVJUJztcblxuICByZXR1cm4gYnV0dG9uO1xufTtcblxuY29uc3QgY3JlYXRlTmFtZVNlbGVjdCA9ICh0d29QbGF5ZXJzID0gZmFsc2UpID0+IHtcbiAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd3ZWxjb21lLW5hbWUtc2VsZWN0Jyk7XG5cbiAgY29uc3QgbmFtZVAxID0gY3JlYXRlTmFtZUlucHV0KCdQbGF5ZXIgMScpO1xuICBjb250YWluZXIuYXBwZW5kKG5hbWVQMSk7XG5cbiAgbGV0IG5hbWVQMiA9IGZhbHNlO1xuICBpZiAodHdvUGxheWVycykge1xuICAgIG5hbWVQMiA9IGNyZWF0ZU5hbWVJbnB1dCgnUGxheWVyIDInKTtcbiAgICBjb250YWluZXIuYXBwZW5kKG5hbWVQMik7XG4gIH1cblxuICBjb25zdCBzdGFydEJ1dHRvbiA9IGNyZWF0ZVN0YXJ0QnV0dG9uKCk7XG4gIHN0YXJ0QnV0dG9uLm9uY2xpY2sgPSBzdWJtaXROYW1lcztcbiAgY29udGFpbmVyLmFwcGVuZChzdGFydEJ1dHRvbik7XG5cbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5cHJlc3MnLCBoYW5kbGVLZXlQcmVzc0VudGVyKTtcblxuICByZXR1cm4gY29udGFpbmVyO1xufTtcblxuY29uc3QgY3JlYXRlTW9kZUJ1dHRvbiA9IChjb250ZW50KSA9PiB7XG4gIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICBidXR0b24uY2xhc3NMaXN0LmFkZCgnd2VsY29tZS1tb2RlLWJ0bicpO1xuICBidXR0b24uY2xhc3NMaXN0LmFkZCgnYnV0dG9uU3R5bGUxJyk7XG4gIGJ1dHRvbi50ZXh0Q29udGVudCA9IGNvbnRlbnQ7XG5cbiAgcmV0dXJuIGJ1dHRvbjtcbn07XG5cbmNvbnN0IGNyZWF0ZU1vZGVTZWxlY3QgPSAoKSA9PiB7XG4gIC8vIFBsYXllciB2cyBQbGF5ZXIgfHwgUGxheWVyIHZzIENvbXB1dGVyXG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnd2VsY29tZS1tb2RlJyk7XG5cbiAgY29uc3QgcHZlID0gY3JlYXRlTW9kZUJ1dHRvbignUGxheWVyIFZTIENvbXB1dGVyJyk7XG4gIHB2ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICBjb250YWluZXIucmVwbGFjZVdpdGgoY3JlYXRlTmFtZVNlbGVjdCgpKTtcbiAgfSk7XG5cbiAgY29uc3QgcHZwID0gY3JlYXRlTW9kZUJ1dHRvbignUGxheWVyIFZTIFBsYXllcicpO1xuICAvLyBUd28gcGxheWVycyB1cGRhdGVcbiAgcHZwLmRpc2FibGVkID0gdHJ1ZTtcbiAgcHZwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgIGNvbnRhaW5lci5yZXBsYWNlV2l0aChjcmVhdGVOYW1lU2VsZWN0KHRydWUpKTtcbiAgfSk7XG5cbiAgY29udGFpbmVyLmFwcGVuZChwdmUsIHB2cCk7XG5cbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbmNvbnN0IGNyZWF0ZVdlbGNvbWVTY3JlZW4gPSAoKSA9PiB7XG4gIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnd2VsY29tZS1jb250YWluZXInKTtcblxuICAvLyBUaXRsZVxuICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gxJyk7XG4gIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3dlbGNvbWUtdGl0bGUnKTtcbiAgdGl0bGUudGV4dENvbnRlbnQgPSAnQkFUVExFU0hJUCc7XG5cbiAgY29uc3QgbW9kZSA9IGNyZWF0ZU1vZGVTZWxlY3QoKTtcblxuICBjb250YWluZXIuYXBwZW5kKHRpdGxlLCBtb2RlKTtcbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVdlbGNvbWVTY3JlZW47XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cblxuLyogRG9jdW1lbnRcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gUHJldmVudCBhZGp1c3RtZW50cyBvZiBmb250IHNpemUgYWZ0ZXIgb3JpZW50YXRpb24gY2hhbmdlcyBpbiBpT1MuXG4gKi9cblxuaHRtbCB7XG4gIGxpbmUtaGVpZ2h0OiAxLjE1OyAvKiAxICovXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xufVxuXG4vKiBTZWN0aW9uc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuYm9keSB7XG4gIG1hcmdpbjogMDtcbn1cblxuLyoqXG4gKiBSZW5kZXIgdGhlIFxcYG1haW5cXGAgZWxlbWVudCBjb25zaXN0ZW50bHkgaW4gSUUuXG4gKi9cblxubWFpbiB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGZvbnQgc2l6ZSBhbmQgbWFyZ2luIG9uIFxcYGgxXFxgIGVsZW1lbnRzIHdpdGhpbiBcXGBzZWN0aW9uXFxgIGFuZFxuICogXFxgYXJ0aWNsZVxcYCBjb250ZXh0cyBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBTYWZhcmkuXG4gKi9cblxuaDEge1xuICBmb250LXNpemU6IDJlbTtcbiAgbWFyZ2luOiAwLjY3ZW0gMDtcbn1cblxuLyogR3JvdXBpbmcgY29udGVudFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBBZGQgdGhlIGNvcnJlY3QgYm94IHNpemluZyBpbiBGaXJlZm94LlxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXG4gKi9cblxuaHIge1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDsgLyogMSAqL1xuICBoZWlnaHQ6IDA7IC8qIDEgKi9cbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5wcmUge1xuICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7IC8qIDEgKi9cbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cbn1cblxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBncmF5IGJhY2tncm91bmQgb24gYWN0aXZlIGxpbmtzIGluIElFIDEwLlxuICovXG5cbmEge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuLyoqXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxuICogMi4gQWRkIHRoZSBjb3JyZWN0IHRleHQgZGVjb3JhdGlvbiBpbiBDaHJvbWUsIEVkZ2UsIElFLCBPcGVyYSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5hYmJyW3RpdGxlXSB7XG4gIGJvcmRlci1ib3R0b206IG5vbmU7IC8qIDEgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmUgZG90dGVkOyAvKiAyICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IGZvbnQgd2VpZ2h0IGluIENocm9tZSwgRWRnZSwgYW5kIFNhZmFyaS5cbiAqL1xuXG5iLFxuc3Ryb25nIHtcbiAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcbn1cblxuLyoqXG4gKiAxLiBDb3JyZWN0IHRoZSBpbmhlcml0YW5jZSBhbmQgc2NhbGluZyBvZiBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICogMi4gQ29ycmVjdCB0aGUgb2RkIFxcYGVtXFxgIGZvbnQgc2l6aW5nIGluIGFsbCBicm93c2Vycy5cbiAqL1xuXG5jb2RlLFxua2JkLFxuc2FtcCB7XG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBmb250IHNpemUgaW4gYWxsIGJyb3dzZXJzLlxuICovXG5cbnNtYWxsIHtcbiAgZm9udC1zaXplOiA4MCU7XG59XG5cbi8qKlxuICogUHJldmVudCBcXGBzdWJcXGAgYW5kIFxcYHN1cFxcYCBlbGVtZW50cyBmcm9tIGFmZmVjdGluZyB0aGUgbGluZSBoZWlnaHQgaW5cbiAqIGFsbCBicm93c2Vycy5cbiAqL1xuXG5zdWIsXG5zdXAge1xuICBmb250LXNpemU6IDc1JTtcbiAgbGluZS1oZWlnaHQ6IDA7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgdmVydGljYWwtYWxpZ246IGJhc2VsaW5lO1xufVxuXG5zdWIge1xuICBib3R0b206IC0wLjI1ZW07XG59XG5cbnN1cCB7XG4gIHRvcDogLTAuNWVtO1xufVxuXG4vKiBFbWJlZGRlZCBjb250ZW50XG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgYm9yZGVyIG9uIGltYWdlcyBpbnNpZGUgbGlua3MgaW4gSUUgMTAuXG4gKi9cblxuaW1nIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xufVxuXG4vKiBGb3Jtc1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cbiAqIDIuIFJlbW92ZSB0aGUgbWFyZ2luIGluIEZpcmVmb3ggYW5kIFNhZmFyaS5cbiAqL1xuXG5idXR0b24sXG5pbnB1dCxcbm9wdGdyb3VwLFxuc2VsZWN0LFxudGV4dGFyZWEge1xuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xuICBmb250LXNpemU6IDEwMCU7IC8qIDEgKi9cbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cbiAgbWFyZ2luOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogU2hvdyB0aGUgb3ZlcmZsb3cgaW4gSUUuXG4gKiAxLiBTaG93IHRoZSBvdmVyZmxvdyBpbiBFZGdlLlxuICovXG5cbmJ1dHRvbixcbmlucHV0IHsgLyogMSAqL1xuICBvdmVyZmxvdzogdmlzaWJsZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGluaGVyaXRhbmNlIG9mIHRleHQgdHJhbnNmb3JtIGluIEVkZ2UsIEZpcmVmb3gsIGFuZCBJRS5cbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cbiAqL1xuXG5idXR0b24sXG5zZWxlY3QgeyAvKiAxICovXG4gIHRleHQtdHJhbnNmb3JtOiBub25lO1xufVxuXG4vKipcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKi9cblxuYnV0dG9uLFxuW3R5cGU9XCJidXR0b25cIl0sXG5bdHlwZT1cInJlc2V0XCJdLFxuW3R5cGU9XCJzdWJtaXRcIl0ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGlubmVyIGJvcmRlciBhbmQgcGFkZGluZyBpbiBGaXJlZm94LlxuICovXG5cbmJ1dHRvbjo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwiYnV0dG9uXCJdOjotbW96LWZvY3VzLWlubmVyLFxuW3R5cGU9XCJyZXNldFwiXTo6LW1vei1mb2N1cy1pbm5lcixcblt0eXBlPVwic3VibWl0XCJdOjotbW96LWZvY3VzLWlubmVyIHtcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xuICBwYWRkaW5nOiAwO1xufVxuXG4vKipcbiAqIFJlc3RvcmUgdGhlIGZvY3VzIHN0eWxlcyB1bnNldCBieSB0aGUgcHJldmlvdXMgcnVsZS5cbiAqL1xuXG5idXR0b246LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cImJ1dHRvblwiXTotbW96LWZvY3VzcmluZyxcblt0eXBlPVwicmVzZXRcIl06LW1vei1mb2N1c3JpbmcsXG5bdHlwZT1cInN1Ym1pdFwiXTotbW96LWZvY3VzcmluZyB7XG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcbn1cblxuLyoqXG4gKiBDb3JyZWN0IHRoZSBwYWRkaW5nIGluIEZpcmVmb3guXG4gKi9cblxuZmllbGRzZXQge1xuICBwYWRkaW5nOiAwLjM1ZW0gMC43NWVtIDAuNjI1ZW07XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cbiAqIDIuIENvcnJlY3QgdGhlIGNvbG9yIGluaGVyaXRhbmNlIGZyb20gXFxgZmllbGRzZXRcXGAgZWxlbWVudHMgaW4gSUUuXG4gKiAzLiBSZW1vdmUgdGhlIHBhZGRpbmcgc28gZGV2ZWxvcGVycyBhcmUgbm90IGNhdWdodCBvdXQgd2hlbiB0aGV5IHplcm8gb3V0XG4gKiAgICBcXGBmaWVsZHNldFxcYCBlbGVtZW50cyBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxubGVnZW5kIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xuICBkaXNwbGF5OiB0YWJsZTsgLyogMSAqL1xuICBtYXgtd2lkdGg6IDEwMCU7IC8qIDEgKi9cbiAgcGFkZGluZzogMDsgLyogMyAqL1xuICB3aGl0ZS1zcGFjZTogbm9ybWFsOyAvKiAxICovXG59XG5cbi8qKlxuICogQWRkIHRoZSBjb3JyZWN0IHZlcnRpY2FsIGFsaWdubWVudCBpbiBDaHJvbWUsIEZpcmVmb3gsIGFuZCBPcGVyYS5cbiAqL1xuXG5wcm9ncmVzcyB7XG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgdGhlIGRlZmF1bHQgdmVydGljYWwgc2Nyb2xsYmFyIGluIElFIDEwKy5cbiAqL1xuXG50ZXh0YXJlYSB7XG4gIG92ZXJmbG93OiBhdXRvO1xufVxuXG4vKipcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxuICogMi4gUmVtb3ZlIHRoZSBwYWRkaW5nIGluIElFIDEwLlxuICovXG5cblt0eXBlPVwiY2hlY2tib3hcIl0sXG5bdHlwZT1cInJhZGlvXCJdIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDsgLyogMSAqL1xuICBwYWRkaW5nOiAwOyAvKiAyICovXG59XG5cbi8qKlxuICogQ29ycmVjdCB0aGUgY3Vyc29yIHN0eWxlIG9mIGluY3JlbWVudCBhbmQgZGVjcmVtZW50IGJ1dHRvbnMgaW4gQ2hyb21lLlxuICovXG5cblt0eXBlPVwibnVtYmVyXCJdOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuW3R5cGU9XCJudW1iZXJcIl06Oi13ZWJraXQtb3V0ZXItc3Bpbi1idXR0b24ge1xuICBoZWlnaHQ6IGF1dG87XG59XG5cbi8qKlxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXG4gKiAyLiBDb3JyZWN0IHRoZSBvdXRsaW5lIHN0eWxlIGluIFNhZmFyaS5cbiAqL1xuXG5bdHlwZT1cInNlYXJjaFwiXSB7XG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXG4gIG91dGxpbmUtb2Zmc2V0OiAtMnB4OyAvKiAyICovXG59XG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpbm5lciBwYWRkaW5nIGluIENocm9tZSBhbmQgU2FmYXJpIG9uIG1hY09TLlxuICovXG5cblt0eXBlPVwic2VhcmNoXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xufVxuXG4vKipcbiAqIDEuIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIFxcYGluaGVyaXRcXGAgaW4gU2FmYXJpLlxuICovXG5cbjo6LXdlYmtpdC1maWxlLXVwbG9hZC1idXR0b24ge1xuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xuICBmb250OiBpbmhlcml0OyAvKiAyICovXG59XG5cbi8qIEludGVyYWN0aXZlXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG4vKlxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gRWRnZSwgSUUgMTArLCBhbmQgRmlyZWZveC5cbiAqL1xuXG5kZXRhaWxzIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbi8qXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBhbGwgYnJvd3NlcnMuXG4gKi9cblxuc3VtbWFyeSB7XG4gIGRpc3BsYXk6IGxpc3QtaXRlbTtcbn1cblxuLyogTWlzY1xuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuLyoqXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXG4gKi9cblxudGVtcGxhdGUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG4vKipcbiAqIEFkZCB0aGUgY29ycmVjdCBkaXNwbGF5IGluIElFIDEwLlxuICovXG5cbltoaWRkZW5dIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vbm9kZV9tb2R1bGVzL25vcm1hbGl6ZS5jc3Mvbm9ybWFsaXplLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSwyRUFBMkU7O0FBRTNFOytFQUMrRTs7QUFFL0U7OztFQUdFOztBQUVGO0VBQ0UsaUJBQWlCLEVBQUUsTUFBTTtFQUN6Qiw4QkFBOEIsRUFBRSxNQUFNO0FBQ3hDOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxTQUFTO0FBQ1g7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLGNBQWM7RUFDZCxnQkFBZ0I7QUFDbEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7RUFDRSx1QkFBdUIsRUFBRSxNQUFNO0VBQy9CLFNBQVMsRUFBRSxNQUFNO0VBQ2pCLGlCQUFpQixFQUFFLE1BQU07QUFDM0I7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsaUNBQWlDLEVBQUUsTUFBTTtFQUN6QyxjQUFjLEVBQUUsTUFBTTtBQUN4Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsNkJBQTZCO0FBQy9COztBQUVBOzs7RUFHRTs7QUFFRjtFQUNFLG1CQUFtQixFQUFFLE1BQU07RUFDM0IsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxpQ0FBaUMsRUFBRSxNQUFNO0FBQzNDOztBQUVBOztFQUVFOztBQUVGOztFQUVFLG1CQUFtQjtBQUNyQjs7QUFFQTs7O0VBR0U7O0FBRUY7OztFQUdFLGlDQUFpQyxFQUFFLE1BQU07RUFDekMsY0FBYyxFQUFFLE1BQU07QUFDeEI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxjQUFjO0VBQ2QsY0FBYztFQUNkLGtCQUFrQjtFQUNsQix3QkFBd0I7QUFDMUI7O0FBRUE7RUFDRSxlQUFlO0FBQ2pCOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBOytFQUMrRTs7QUFFL0U7O0VBRUU7O0FBRUY7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7K0VBQytFOztBQUUvRTs7O0VBR0U7O0FBRUY7Ozs7O0VBS0Usb0JBQW9CLEVBQUUsTUFBTTtFQUM1QixlQUFlLEVBQUUsTUFBTTtFQUN2QixpQkFBaUIsRUFBRSxNQUFNO0VBQ3pCLFNBQVMsRUFBRSxNQUFNO0FBQ25COztBQUVBOzs7RUFHRTs7QUFFRjtRQUNRLE1BQU07RUFDWixpQkFBaUI7QUFDbkI7O0FBRUE7OztFQUdFOztBQUVGO1NBQ1MsTUFBTTtFQUNiLG9CQUFvQjtBQUN0Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLDBCQUEwQjtBQUM1Qjs7QUFFQTs7RUFFRTs7QUFFRjs7OztFQUlFLGtCQUFrQjtFQUNsQixVQUFVO0FBQ1o7O0FBRUE7O0VBRUU7O0FBRUY7Ozs7RUFJRSw4QkFBOEI7QUFDaEM7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSw4QkFBOEI7QUFDaEM7O0FBRUE7Ozs7O0VBS0U7O0FBRUY7RUFDRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGNBQWMsRUFBRSxNQUFNO0VBQ3RCLGVBQWUsRUFBRSxNQUFNO0VBQ3ZCLFVBQVUsRUFBRSxNQUFNO0VBQ2xCLG1CQUFtQixFQUFFLE1BQU07QUFDN0I7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSxjQUFjO0FBQ2hCOztBQUVBOzs7RUFHRTs7QUFFRjs7RUFFRSxzQkFBc0IsRUFBRSxNQUFNO0VBQzlCLFVBQVUsRUFBRSxNQUFNO0FBQ3BCOztBQUVBOztFQUVFOztBQUVGOztFQUVFLFlBQVk7QUFDZDs7QUFFQTs7O0VBR0U7O0FBRUY7RUFDRSw2QkFBNkIsRUFBRSxNQUFNO0VBQ3JDLG9CQUFvQixFQUFFLE1BQU07QUFDOUI7O0FBRUE7O0VBRUU7O0FBRUY7RUFDRSx3QkFBd0I7QUFDMUI7O0FBRUE7OztFQUdFOztBQUVGO0VBQ0UsMEJBQTBCLEVBQUUsTUFBTTtFQUNsQyxhQUFhLEVBQUUsTUFBTTtBQUN2Qjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsY0FBYztBQUNoQjs7QUFFQTs7RUFFRTs7QUFFRjtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTsrRUFDK0U7O0FBRS9FOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmOztBQUVBOztFQUVFOztBQUVGO0VBQ0UsYUFBYTtBQUNmXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qISBub3JtYWxpemUuY3NzIHY4LjAuMSB8IE1JVCBMaWNlbnNlIHwgZ2l0aHViLmNvbS9uZWNvbGFzL25vcm1hbGl6ZS5jc3MgKi9cXG5cXG4vKiBEb2N1bWVudFxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgbGluZSBoZWlnaHQgaW4gYWxsIGJyb3dzZXJzLlxcbiAqIDIuIFByZXZlbnQgYWRqdXN0bWVudHMgb2YgZm9udCBzaXplIGFmdGVyIG9yaWVudGF0aW9uIGNoYW5nZXMgaW4gaU9TLlxcbiAqL1xcblxcbmh0bWwge1xcbiAgbGluZS1oZWlnaHQ6IDEuMTU7IC8qIDEgKi9cXG4gIC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogMTAwJTsgLyogMiAqL1xcbn1cXG5cXG4vKiBTZWN0aW9uc1xcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBtYXJnaW4gaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmJvZHkge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4vKipcXG4gKiBSZW5kZXIgdGhlIGBtYWluYCBlbGVtZW50IGNvbnNpc3RlbnRseSBpbiBJRS5cXG4gKi9cXG5cXG5tYWluIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4vKipcXG4gKiBDb3JyZWN0IHRoZSBmb250IHNpemUgYW5kIG1hcmdpbiBvbiBgaDFgIGVsZW1lbnRzIHdpdGhpbiBgc2VjdGlvbmAgYW5kXFxuICogYGFydGljbGVgIGNvbnRleHRzIGluIENocm9tZSwgRmlyZWZveCwgYW5kIFNhZmFyaS5cXG4gKi9cXG5cXG5oMSB7XFxuICBmb250LXNpemU6IDJlbTtcXG4gIG1hcmdpbjogMC42N2VtIDA7XFxufVxcblxcbi8qIEdyb3VwaW5nIGNvbnRlbnRcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIEZpcmVmb3guXFxuICogMi4gU2hvdyB0aGUgb3ZlcmZsb3cgaW4gRWRnZSBhbmQgSUUuXFxuICovXFxuXFxuaHIge1xcbiAgYm94LXNpemluZzogY29udGVudC1ib3g7IC8qIDEgKi9cXG4gIGhlaWdodDogMDsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7IC8qIDIgKi9cXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5oZXJpdGFuY2UgYW5kIHNjYWxpbmcgb2YgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBDb3JyZWN0IHRoZSBvZGQgYGVtYCBmb250IHNpemluZyBpbiBhbGwgYnJvd3NlcnMuXFxuICovXFxuXFxucHJlIHtcXG4gIGZvbnQtZmFtaWx5OiBtb25vc3BhY2UsIG1vbm9zcGFjZTsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxZW07IC8qIDIgKi9cXG59XFxuXFxuLyogVGV4dC1sZXZlbCBzZW1hbnRpY3NcXG4gICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgZ3JheSBiYWNrZ3JvdW5kIG9uIGFjdGl2ZSBsaW5rcyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5hIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4vKipcXG4gKiAxLiBSZW1vdmUgdGhlIGJvdHRvbSBib3JkZXIgaW4gQ2hyb21lIDU3LVxcbiAqIDIuIEFkZCB0aGUgY29ycmVjdCB0ZXh0IGRlY29yYXRpb24gaW4gQ2hyb21lLCBFZGdlLCBJRSwgT3BlcmEsIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYWJiclt0aXRsZV0ge1xcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTsgLyogMSAqL1xcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7IC8qIDIgKi9cXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lIGRvdHRlZDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCB3ZWlnaHQgaW4gQ2hyb21lLCBFZGdlLCBhbmQgU2FmYXJpLlxcbiAqL1xcblxcbmIsXFxuc3Ryb25nIHtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkZXI7XFxufVxcblxcbi8qKlxcbiAqIDEuIENvcnJlY3QgdGhlIGluaGVyaXRhbmNlIGFuZCBzY2FsaW5nIG9mIGZvbnQgc2l6ZSBpbiBhbGwgYnJvd3NlcnMuXFxuICogMi4gQ29ycmVjdCB0aGUgb2RkIGBlbWAgZm9udCBzaXppbmcgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmNvZGUsXFxua2JkLFxcbnNhbXAge1xcbiAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSwgbW9ub3NwYWNlOyAvKiAxICovXFxuICBmb250LXNpemU6IDFlbTsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZm9udCBzaXplIGluIGFsbCBicm93c2Vycy5cXG4gKi9cXG5cXG5zbWFsbCB7XFxuICBmb250LXNpemU6IDgwJTtcXG59XFxuXFxuLyoqXFxuICogUHJldmVudCBgc3ViYCBhbmQgYHN1cGAgZWxlbWVudHMgZnJvbSBhZmZlY3RpbmcgdGhlIGxpbmUgaGVpZ2h0IGluXFxuICogYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1YixcXG5zdXAge1xcbiAgZm9udC1zaXplOiA3NSU7XFxuICBsaW5lLWhlaWdodDogMDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuc3ViIHtcXG4gIGJvdHRvbTogLTAuMjVlbTtcXG59XFxuXFxuc3VwIHtcXG4gIHRvcDogLTAuNWVtO1xcbn1cXG5cXG4vKiBFbWJlZGRlZCBjb250ZW50XFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGJvcmRlciBvbiBpbWFnZXMgaW5zaWRlIGxpbmtzIGluIElFIDEwLlxcbiAqL1xcblxcbmltZyB7XFxuICBib3JkZXItc3R5bGU6IG5vbmU7XFxufVxcblxcbi8qIEZvcm1zXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiAxLiBDaGFuZ2UgdGhlIGZvbnQgc3R5bGVzIGluIGFsbCBicm93c2Vycy5cXG4gKiAyLiBSZW1vdmUgdGhlIG1hcmdpbiBpbiBGaXJlZm94IGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0LFxcbm9wdGdyb3VwLFxcbnNlbGVjdCxcXG50ZXh0YXJlYSB7XFxuICBmb250LWZhbWlseTogaW5oZXJpdDsgLyogMSAqL1xcbiAgZm9udC1zaXplOiAxMDAlOyAvKiAxICovXFxuICBsaW5lLWhlaWdodDogMS4xNTsgLyogMSAqL1xcbiAgbWFyZ2luOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIFNob3cgdGhlIG92ZXJmbG93IGluIElFLlxcbiAqIDEuIFNob3cgdGhlIG92ZXJmbG93IGluIEVkZ2UuXFxuICovXFxuXFxuYnV0dG9uLFxcbmlucHV0IHsgLyogMSAqL1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRWRnZSwgRmlyZWZveCwgYW5kIElFLlxcbiAqIDEuIFJlbW92ZSB0aGUgaW5oZXJpdGFuY2Ugb2YgdGV4dCB0cmFuc2Zvcm0gaW4gRmlyZWZveC5cXG4gKi9cXG5cXG5idXR0b24sXFxuc2VsZWN0IHsgLyogMSAqL1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGluYWJpbGl0eSB0byBzdHlsZSBjbGlja2FibGUgdHlwZXMgaW4gaU9TIGFuZCBTYWZhcmkuXFxuICovXFxuXFxuYnV0dG9uLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXSxcXG5bdHlwZT1cXFwicmVzZXRcXFwiXSxcXG5bdHlwZT1cXFwic3VibWl0XFxcIl0ge1xcbiAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcbi8qKlxcbiAqIFJlbW92ZSB0aGUgaW5uZXIgYm9yZGVyIGFuZCBwYWRkaW5nIGluIEZpcmVmb3guXFxuICovXFxuXFxuYnV0dG9uOjotbW96LWZvY3VzLWlubmVyLFxcblt0eXBlPVxcXCJidXR0b25cXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwicmVzZXRcXFwiXTo6LW1vei1mb2N1cy1pbm5lcixcXG5bdHlwZT1cXFwic3VibWl0XFxcIl06Oi1tb3otZm9jdXMtaW5uZXIge1xcbiAgYm9yZGVyLXN0eWxlOiBub25lO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLyoqXFxuICogUmVzdG9yZSB0aGUgZm9jdXMgc3R5bGVzIHVuc2V0IGJ5IHRoZSBwcmV2aW91cyBydWxlLlxcbiAqL1xcblxcbmJ1dHRvbjotbW96LWZvY3VzcmluZyxcXG5bdHlwZT1cXFwiYnV0dG9uXFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInJlc2V0XFxcIl06LW1vei1mb2N1c3JpbmcsXFxuW3R5cGU9XFxcInN1Ym1pdFxcXCJdOi1tb3otZm9jdXNyaW5nIHtcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgQnV0dG9uVGV4dDtcXG59XFxuXFxuLyoqXFxuICogQ29ycmVjdCB0aGUgcGFkZGluZyBpbiBGaXJlZm94LlxcbiAqL1xcblxcbmZpZWxkc2V0IHtcXG4gIHBhZGRpbmc6IDAuMzVlbSAwLjc1ZW0gMC42MjVlbTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgdGV4dCB3cmFwcGluZyBpbiBFZGdlIGFuZCBJRS5cXG4gKiAyLiBDb3JyZWN0IHRoZSBjb2xvciBpbmhlcml0YW5jZSBmcm9tIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gSUUuXFxuICogMy4gUmVtb3ZlIHRoZSBwYWRkaW5nIHNvIGRldmVsb3BlcnMgYXJlIG5vdCBjYXVnaHQgb3V0IHdoZW4gdGhleSB6ZXJvIG91dFxcbiAqICAgIGBmaWVsZHNldGAgZWxlbWVudHMgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbmxlZ2VuZCB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBjb2xvcjogaW5oZXJpdDsgLyogMiAqL1xcbiAgZGlzcGxheTogdGFibGU7IC8qIDEgKi9cXG4gIG1heC13aWR0aDogMTAwJTsgLyogMSAqL1xcbiAgcGFkZGluZzogMDsgLyogMyAqL1xcbiAgd2hpdGUtc3BhY2U6IG5vcm1hbDsgLyogMSAqL1xcbn1cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgdmVydGljYWwgYWxpZ25tZW50IGluIENocm9tZSwgRmlyZWZveCwgYW5kIE9wZXJhLlxcbiAqL1xcblxcbnByb2dyZXNzIHtcXG4gIHZlcnRpY2FsLWFsaWduOiBiYXNlbGluZTtcXG59XFxuXFxuLyoqXFxuICogUmVtb3ZlIHRoZSBkZWZhdWx0IHZlcnRpY2FsIHNjcm9sbGJhciBpbiBJRSAxMCsuXFxuICovXFxuXFxudGV4dGFyZWEge1xcbiAgb3ZlcmZsb3c6IGF1dG87XFxufVxcblxcbi8qKlxcbiAqIDEuIEFkZCB0aGUgY29ycmVjdCBib3ggc2l6aW5nIGluIElFIDEwLlxcbiAqIDIuIFJlbW92ZSB0aGUgcGFkZGluZyBpbiBJRSAxMC5cXG4gKi9cXG5cXG5bdHlwZT1cXFwiY2hlY2tib3hcXFwiXSxcXG5bdHlwZT1cXFwicmFkaW9cXFwiXSB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94OyAvKiAxICovXFxuICBwYWRkaW5nOiAwOyAvKiAyICovXFxufVxcblxcbi8qKlxcbiAqIENvcnJlY3QgdGhlIGN1cnNvciBzdHlsZSBvZiBpbmNyZW1lbnQgYW5kIGRlY3JlbWVudCBidXR0b25zIGluIENocm9tZS5cXG4gKi9cXG5cXG5bdHlwZT1cXFwibnVtYmVyXFxcIl06Oi13ZWJraXQtaW5uZXItc3Bpbi1idXR0b24sXFxuW3R5cGU9XFxcIm51bWJlclxcXCJdOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcXG4gIGhlaWdodDogYXV0bztcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgb2RkIGFwcGVhcmFuY2UgaW4gQ2hyb21lIGFuZCBTYWZhcmkuXFxuICogMi4gQ29ycmVjdCB0aGUgb3V0bGluZSBzdHlsZSBpbiBTYWZhcmkuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogdGV4dGZpZWxkOyAvKiAxICovXFxuICBvdXRsaW5lLW9mZnNldDogLTJweDsgLyogMiAqL1xcbn1cXG5cXG4vKipcXG4gKiBSZW1vdmUgdGhlIGlubmVyIHBhZGRpbmcgaW4gQ2hyb21lIGFuZCBTYWZhcmkgb24gbWFjT1MuXFxuICovXFxuXFxuW3R5cGU9XFxcInNlYXJjaFxcXCJdOjotd2Via2l0LXNlYXJjaC1kZWNvcmF0aW9uIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogMS4gQ29ycmVjdCB0aGUgaW5hYmlsaXR5IHRvIHN0eWxlIGNsaWNrYWJsZSB0eXBlcyBpbiBpT1MgYW5kIFNhZmFyaS5cXG4gKiAyLiBDaGFuZ2UgZm9udCBwcm9wZXJ0aWVzIHRvIGBpbmhlcml0YCBpbiBTYWZhcmkuXFxuICovXFxuXFxuOjotd2Via2l0LWZpbGUtdXBsb2FkLWJ1dHRvbiB7XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjsgLyogMSAqL1xcbiAgZm9udDogaW5oZXJpdDsgLyogMiAqL1xcbn1cXG5cXG4vKiBJbnRlcmFjdGl2ZVxcbiAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXFxuXFxuLypcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBFZGdlLCBJRSAxMCssIGFuZCBGaXJlZm94LlxcbiAqL1xcblxcbmRldGFpbHMge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi8qXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gYWxsIGJyb3dzZXJzLlxcbiAqL1xcblxcbnN1bW1hcnkge1xcbiAgZGlzcGxheTogbGlzdC1pdGVtO1xcbn1cXG5cXG4vKiBNaXNjXFxuICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cXG5cXG4vKipcXG4gKiBBZGQgdGhlIGNvcnJlY3QgZGlzcGxheSBpbiBJRSAxMCsuXFxuICovXFxuXFxudGVtcGxhdGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLyoqXFxuICogQWRkIHRoZSBjb3JyZWN0IGRpc3BsYXkgaW4gSUUgMTAuXFxuICovXFxuXFxuW2hpZGRlbl0ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuYnV0dG9uU3R5bGUxIHtcbiAgYXBwZWFyYW5jZTogYnV0dG9uO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjc0NjU5O1xuICBib3JkZXI6IHNvbGlkIHRyYW5zcGFyZW50O1xuICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICBib3JkZXItd2lkdGg6IDAgMCA0cHg7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGNvbG9yOiAjZmZmZmZmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgZm9udC1mYW1pbHk6IGRpbi1yb3VuZCwgc2Fucy1zZXJpZjtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LXdlaWdodDogNzAwO1xuICBsZXR0ZXItc3BhY2luZzogMC44cHg7XG4gIGxpbmUtaGVpZ2h0OiAyMHB4O1xuICBtYXJnaW46IDA7XG4gIG91dGxpbmU6IG5vbmU7XG4gIG92ZXJmbG93OiB2aXNpYmxlO1xuICBwYWRkaW5nOiAxM3B4IDE2cHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtcbiAgdHJhbnNpdGlvbjogZmlsdGVyIDAuMnM7XG4gIHVzZXItc2VsZWN0OiBub25lO1xuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiA0cmVtO1xuXG4gIGZvbnQtZmFtaWx5OiAnU3BlY2lhbC1FbGl0ZSc7XG4gIGZvbnQtc2l6ZTogMS4ycmVtO1xufVxuXG4uYnV0dG9uU3R5bGUxOmFmdGVyIHtcbiAgYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzNhNjc4MjtcbiAgYm9yZGVyOiBzb2xpZCB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgYm9yZGVyLXdpZHRoOiAwIDAgNHB4O1xuICBib3R0b206IC00cHg7XG4gIGNvbnRlbnQ6ICcnO1xuICBsZWZ0OiAwO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG4gIHotaW5kZXg6IC0xO1xufVxuXG4uYnV0dG9uU3R5bGUxOm1haW4sXG4uYnV0dG9uU3R5bGUxOmZvY3VzIHtcbiAgdXNlci1zZWxlY3Q6IGF1dG87XG59XG5cbi5idXR0b25TdHlsZTE6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICBmaWx0ZXI6IGJyaWdodG5lc3MoMS4xKTtcbiAgLXdlYmtpdC1maWx0ZXI6IGJyaWdodG5lc3MoMS4xKTtcbn1cblxuLmJ1dHRvblN0eWxlMTpkaXNhYmxlZCB7XG4gIGN1cnNvcjogYXV0bztcbiAgYm9yZGVyLXdpZHRoOiA0cHggMCAwO1xuICBiYWNrZ3JvdW5kOiBub25lO1xufVxuXG4uYnV0dG9uU3R5bGUxOmRpc2FibGVkOjphZnRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMzYTY3ODI0YTtcbn1cblxuLmJ1dHRvblN0eWxlMTphY3RpdmUge1xuICBib3JkZXItd2lkdGg6IDRweCAwIDA7XG4gIGJhY2tncm91bmQ6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy92aWV3L3N0eWxlL2J1dHRvbi5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLHlCQUF5QjtFQUN6QixtQkFBbUI7RUFDbkIscUJBQXFCO0VBQ3JCLHNCQUFzQjtFQUN0QixjQUFjO0VBQ2QsZUFBZTtFQUNmLHFCQUFxQjtFQUNyQixrQ0FBa0M7RUFDbEMsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQixxQkFBcUI7RUFDckIsaUJBQWlCO0VBQ2pCLFNBQVM7RUFDVCxhQUFhO0VBQ2IsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixrQkFBa0I7RUFDbEIseUJBQXlCO0VBQ3pCLDBCQUEwQjtFQUMxQix3QkFBd0I7RUFDeEIsdUJBQXVCO0VBQ3ZCLGlCQUFpQjtFQUNqQix5QkFBeUI7RUFDekIsc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsWUFBWTs7RUFFWiw0QkFBNEI7RUFDNUIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsNEJBQTRCO0VBQzVCLHlCQUF5QjtFQUN6Qix5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixZQUFZO0VBQ1osV0FBVztFQUNYLE9BQU87RUFDUCxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLE1BQU07RUFDTixXQUFXO0FBQ2I7O0FBRUE7O0VBRUUsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLCtCQUErQjtBQUNqQzs7QUFFQTtFQUNFLFlBQVk7RUFDWixxQkFBcUI7RUFDckIsZ0JBQWdCO0FBQ2xCOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCOztBQUVBO0VBQ0UscUJBQXFCO0VBQ3JCLGdCQUFnQjtBQUNsQlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuYnV0dG9uU3R5bGUxIHtcXG4gIGFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyNzQ2NTk7XFxuICBib3JkZXI6IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcXG4gIGJvcmRlci13aWR0aDogMCAwIDRweDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGZvbnQtZmFtaWx5OiBkaW4tcm91bmQsIHNhbnMtc2VyaWY7XFxuICBmb250LXNpemU6IDE1cHg7XFxuICBmb250LXdlaWdodDogNzAwO1xcbiAgbGV0dGVyLXNwYWNpbmc6IDAuOHB4O1xcbiAgbGluZS1oZWlnaHQ6IDIwcHg7XFxuICBtYXJnaW46IDA7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICBwYWRkaW5nOiAxM3B4IDE2cHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbiAgdG91Y2gtYWN0aW9uOiBtYW5pcHVsYXRpb247XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7XFxuICB0cmFuc2l0aW9uOiBmaWx0ZXIgMC4ycztcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXG4gIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDRyZW07XFxuXFxuICBmb250LWZhbWlseTogJ1NwZWNpYWwtRWxpdGUnO1xcbiAgZm9udC1zaXplOiAxLjJyZW07XFxufVxcblxcbi5idXR0b25TdHlsZTE6YWZ0ZXIge1xcbiAgYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMzYTY3ODI7XFxuICBib3JkZXI6IHNvbGlkIHRyYW5zcGFyZW50O1xcbiAgYm9yZGVyLXJhZGl1czogMTZweDtcXG4gIGJvcmRlci13aWR0aDogMCAwIDRweDtcXG4gIGJvdHRvbTogLTRweDtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgbGVmdDogMDtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHJpZ2h0OiAwO1xcbiAgdG9wOiAwO1xcbiAgei1pbmRleDogLTE7XFxufVxcblxcbi5idXR0b25TdHlsZTE6bWFpbixcXG4uYnV0dG9uU3R5bGUxOmZvY3VzIHtcXG4gIHVzZXItc2VsZWN0OiBhdXRvO1xcbn1cXG5cXG4uYnV0dG9uU3R5bGUxOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcXG4gIGZpbHRlcjogYnJpZ2h0bmVzcygxLjEpO1xcbiAgLXdlYmtpdC1maWx0ZXI6IGJyaWdodG5lc3MoMS4xKTtcXG59XFxuXFxuLmJ1dHRvblN0eWxlMTpkaXNhYmxlZCB7XFxuICBjdXJzb3I6IGF1dG87XFxuICBib3JkZXItd2lkdGg6IDRweCAwIDA7XFxuICBiYWNrZ3JvdW5kOiBub25lO1xcbn1cXG5cXG4uYnV0dG9uU3R5bGUxOmRpc2FibGVkOjphZnRlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2E2NzgyNGE7XFxufVxcblxcbi5idXR0b25TdHlsZTE6YWN0aXZlIHtcXG4gIGJvcmRlci13aWR0aDogNHB4IDAgMDtcXG4gIGJhY2tncm91bmQ6IG5vbmU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2ljb25zOC1tdWx0aXBseS0xMDAucG5nXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL291dHB1dC1vbmxpbmVnaWZ0b29scy5naWZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuZ2FtZWJvYXJkIHtcbiAgd2lkdGg6IG1heC1jb250ZW50O1xuICBoZWlnaHQ6IDM4MHB4O1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcblxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgcGFkZGluZzogMC45cmVtO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBiYWNrZ3JvdW5kOiAjMzI0ODVlO1xuXG4gIHRyYW5zaXRpb246XG4gICAgb3BhY2l0eSAxcyBlYXNlLFxuICAgIGZpbHRlciAxcyBlYXNlO1xufVxuXG4uZGlzYWJsZWQge1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgb3BhY2l0eTogMC42O1xuICBmaWx0ZXI6IGdyYXlzY2FsZSg3MCUpO1xufVxuXG4vKiogQk9BUkQgKi9cblxuLmJvYXJkIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB6LWluZGV4OiAyO1xuXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxMCUpO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMCwgMTAlKTtcblxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2RiMWZmO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuXG4gIGhlaWdodDogMzE1cHg7XG4gIHBhZGRpbmc6IDAuOXJlbTtcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XG59XG5cbi8qIFNUQVRTICovXG5cbi5ib2FyZC1zdGF0cyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgd2lkdGg6IDEwMCU7XG5cbiAgZm9udC1zaXplOiAxcmVtO1xuICBjb2xvcjogI2NiZjBmZjtcbiAgZm9udC1mYW1pbHk6ICdTcGVjaWFsLUVsaXRlJztcbn1cblxuLmJvYXJkLXN0YXRzID4gcCB7XG4gIG1hcmdpbjogMDtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xufVxuXG4uYm9hcmQtc3RhdHMtc2hpcHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDAuNHJlbTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmJvYXJkLXN0YXRzLXNoaXBzID4gcCB7XG4gIG1hcmdpbjogMDtcbn1cblxuLmJvYXJkLXN0YXRzLXNoaXBzLXRleHQge1xuICBmb250LXNpemU6IDAuOHJlbTtcbn1cblxuLmJvYXJkLXN0YXRzLXNoaXBzLWNvdW50IHtcbiAgZm9udC1zaXplOiAxLjVyZW07XG4gIGZvbnQtZmFtaWx5OiAnSG9tZW1hZGUtQXBwbGUnO1xufVxuXG4uYm9hcmQtc3RhdHMtbmFtZSB7XG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xufVxuXG4vKiBTSElQICovXG5cbi5zaGlwIHtcbiAgY3Vyc29yOiBncmFiO1xuICB6LWluZGV4OiAxMDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiBtaW4tY29udGVudDtcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2QwZTVmMjtcblxuICBib3JkZXItcmFkaXVzOiAxcmVtIDFyZW0gMC41cmVtIDAuNXJlbTtcbn1cblxuLyogLmJvYXJkLXNoaXBzIHtcbiAgZ3JpZC1jb2x1bW46IDE7XG4gIGdyaWQtcm93OiAxO1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAgZ2FwOiAwLjI1cmVtO1xuICB3aWR0aDogMzAwcHg7XG5cbiAgaGVpZ2h0OiA4MCU7XG4gIHRyYW5zaXRpb246IHJvdGF0ZSAxcyBlYXNlO1xufSAqL1xuXG5kaXZbZGF0YS1kaXJlY3Rpb249J2hvcml6b250YWwnXSB7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG59XG5cbi5zaGlwW2RhdGEtZGlyZWN0aW9uPSdob3Jpem9udGFsJ10ge1xuICBib3JkZXItcmFkaXVzOiAxcmVtIDAuNXJlbSAwLjVyZW0gMXJlbTtcbn1cblxuLnNoaXAtYmxvY2sge1xuICBhc3BlY3QtcmF0aW86IDEvMTtcblxuICBoZWlnaHQ6IDMwcHg7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDM7XG59XG5cbi5uby1yb3RhdGUge1xuICBhbmltYXRpb246IHRpbHQtc2hha2luZyAwLjM1cyAzO1xufVxuXG4uc2hpcC1zZXQge1xuICB6LWluZGV4OiAtMTtcbn1cblxuLyogQkFDS0dST1VORCAqL1xuLnZpZGVvLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuXG4gIHotaW5kZXg6IC0xMDtcbiAgb2JqZWN0LWZpdDogY292ZXI7XG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcblxuICBmaWx0ZXI6IGdyYXlzY2FsZSgyMCUpO1xufVxuXG4vKiogRklFTEQgKi9cbi5ib2FyZC1maWVsZCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm9yZGVyOiAwLjFweCBzb2xpZCAjZmZmZmZmNGQ7XG4gIHdpZHRoOiAzMHB4O1xuICBoZWlnaHQ6IDMwcHg7XG4gIHBhZGRpbmc6IDA7XG5cbiAgb3ZlcmZsb3c6IHZpc2libGU7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xufVxuXG4ubWlzcyB7XG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgke19fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX199KTtcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgYmFja2dyb3VuZC1zaXplOiA3MCU7XG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbiAgYW5pbWF0aW9uOiBtYXJrRmllbGQgMXMgMTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5cbi5oaXQge1xuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8xX19ffSk7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtc2l6ZTogNzAlO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gIGFuaW1hdGlvbjogbWFya0ZpZWxkIDFzIDE7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4uYXZhaWxhYmxlLXNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNzcsIDEyOCwgMSk7XG59XG5cbi5hdmFpbGFibGUtb2Zmc2V0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgxNjgsIDI1MSwgNDQsIDAuNCk7XG59XG5cbi5ub3QtYXZhaWxhYmxlLFxuLm5vdC1hdmFpbGFibGUgPiAqIHtcbiAgei1pbmRleDogMTA7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjU1LCAwLCAwLCAwLjgzKTtcbn1cblxuLmRyYWdnaW5nIHtcbiAgY3Vyc29yOiBncmFiYmluZyAhaW1wb3J0YW50O1xufVxuXG4vKiogUGxheWVyIDEgKi9cbi5nYW1lYm9hcmQucGxheWVyMSB7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW4tcmV2ZXJzZTtcbiAgZ3JpZC1yb3c6IDM7XG59XG5cbi8qKiBQbGF5ZXIgMiAqL1xuXG4uZ2FtZWJvYXJkLnBsYXllcjIge1xuICBncmlkLXJvdzogMTtcbn1cblxuLnBsYXllcjIgPiAuYm9hcmQgPiAuYm9hcmQtZmllbGQge1xuICBjdXJzb3I6IGNyb3NzaGFpcjtcbn1cblxuLnBsYXllcjIgPiAuYm9hcmQgPiAuYm9hcmQtZmllbGQ6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMmQ4Y2NjO1xufVxuXG4ucGxheWVyMiA+IC5ib2FyZCA+IC5ib2FyZC1maWVsZC5oaXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYWJiZGM4O1xuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xufVxuXG5Aa2V5ZnJhbWVzIG1hcmtGaWVsZCB7XG4gIDAlIHtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDExMCU7XG4gIH1cbiAgNTAlIHtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDQwJTtcbiAgfVxuICAxMDAlIHtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDcwJTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIHRpbHQtc2hha2luZyB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAyNSUge1xuICAgIHRyYW5zZm9ybTogcm90YXRlKDVkZWcpO1xuICB9XG4gIDUwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gIH1cbiAgNzUlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgtNWRlZyk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gIH1cbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3ZpZXcvc3R5bGUvZ2FtZWJvYXJkLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhOztFQUViLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsOEJBQThCOztFQUU5QixxQkFBcUI7RUFDckIsbUJBQW1COztFQUVuQixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLG1CQUFtQjs7RUFFbkI7O2tCQUVnQjtBQUNsQjs7QUFFQTtFQUNFLG9CQUFvQjtFQUNwQixZQUFZO0VBQ1osc0JBQXNCO0FBQ3hCOztBQUVBLFdBQVc7O0FBRVg7RUFDRSxrQkFBa0I7RUFDbEIsVUFBVTs7RUFFVixhQUFhO0VBQ2Isc0NBQXNDO0VBQ3RDLG1DQUFtQzs7RUFFbkMseUJBQXlCO0VBQ3pCLG1CQUFtQjs7RUFFbkIsYUFBYTtFQUNiLGVBQWU7RUFDZixpQkFBaUI7QUFDbkI7O0FBRUEsVUFBVTs7QUFFVjtFQUNFLGFBQWE7RUFDYiw4QkFBOEI7RUFDOUIsV0FBVzs7RUFFWCxlQUFlO0VBQ2YsY0FBYztFQUNkLDRCQUE0QjtBQUM5Qjs7QUFFQTtFQUNFLFNBQVM7RUFDVCxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsV0FBVztFQUNYLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxpQkFBaUI7QUFDbkI7O0FBRUEsU0FBUzs7QUFFVDtFQUNFLFlBQVk7RUFDWixXQUFXO0VBQ1gsa0JBQWtCOztFQUVsQixhQUFhO0VBQ2Isa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixzQkFBc0I7RUFDdEIseUJBQXlCOztFQUV6QixzQ0FBc0M7QUFDeEM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7R0FhRzs7QUFFSDtFQUNFLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLHNDQUFzQztBQUN4Qzs7QUFFQTtFQUNFLGlCQUFpQjs7RUFFakIsWUFBWTtFQUNaLG9CQUFvQjtFQUNwQixrQkFBa0I7RUFDbEIsVUFBVTtBQUNaOztBQUVBO0VBQ0UsK0JBQStCO0FBQ2pDOztBQUVBO0VBQ0UsV0FBVztBQUNiOztBQUVBLGVBQWU7QUFDZjtFQUNFLGtCQUFrQjs7RUFFbEIsV0FBVztFQUNYLFlBQVk7O0VBRVosWUFBWTtFQUNaLGlCQUFpQjtFQUNqQixxQkFBcUI7O0VBRXJCLHNCQUFzQjtBQUN4Qjs7QUFFQSxXQUFXO0FBQ1g7RUFDRSxrQkFBa0I7RUFDbEIsNkJBQTZCO0VBQzdCLFdBQVc7RUFDWCxZQUFZO0VBQ1osVUFBVTs7RUFFVixpQkFBaUI7RUFDakIsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UseURBQTBEO0VBQzFELDRCQUE0QjtFQUM1QixvQkFBb0I7RUFDcEIsMkJBQTJCO0VBQzNCLHlCQUF5QjtFQUN6QixvQkFBb0I7QUFDdEI7O0FBRUE7RUFDRSx5REFBNEQ7RUFDNUQsNEJBQTRCO0VBQzVCLG9CQUFvQjtFQUNwQiwyQkFBMkI7RUFDM0IseUJBQXlCO0VBQ3pCLG9CQUFvQjtBQUN0Qjs7QUFFQTtFQUNFLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLHlDQUF5QztBQUMzQzs7QUFFQTs7RUFFRSxXQUFXO0VBQ1gsdUNBQXVDO0FBQ3pDOztBQUVBO0VBQ0UsMkJBQTJCO0FBQzdCOztBQUVBLGNBQWM7QUFDZDtFQUNFLDhCQUE4QjtFQUM5QixXQUFXO0FBQ2I7O0FBRUEsY0FBYzs7QUFFZDtFQUNFLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRTtJQUNFLHFCQUFxQjtFQUN2QjtFQUNBO0lBQ0Usb0JBQW9CO0VBQ3RCO0VBQ0E7SUFDRSxvQkFBb0I7RUFDdEI7QUFDRjs7QUFFQTtFQUNFO0lBQ0UsdUJBQXVCO0VBQ3pCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7RUFDQTtJQUNFLHVCQUF1QjtFQUN6QjtFQUNBO0lBQ0Usd0JBQXdCO0VBQzFCO0VBQ0E7SUFDRSx1QkFBdUI7RUFDekI7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuZ2FtZWJvYXJkIHtcXG4gIHdpZHRoOiBtYXgtY29udGVudDtcXG4gIGhlaWdodDogMzgwcHg7XFxuXFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG5cXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuXFxuICBwYWRkaW5nOiAwLjlyZW07XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYmFja2dyb3VuZDogIzMyNDg1ZTtcXG5cXG4gIHRyYW5zaXRpb246XFxuICAgIG9wYWNpdHkgMXMgZWFzZSxcXG4gICAgZmlsdGVyIDFzIGVhc2U7XFxufVxcblxcbi5kaXNhYmxlZCB7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIG9wYWNpdHk6IDAuNjtcXG4gIGZpbHRlcjogZ3JheXNjYWxlKDcwJSk7XFxufVxcblxcbi8qKiBCT0FSRCAqL1xcblxcbi5ib2FyZCB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB6LWluZGV4OiAyO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxMCUpO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMTAsIDEwJSk7XFxuXFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjM2RiMWZmO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG5cXG4gIGhlaWdodDogMzE1cHg7XFxuICBwYWRkaW5nOiAwLjlyZW07XFxuICBhc3BlY3QtcmF0aW86IDEvMTtcXG59XFxuXFxuLyogU1RBVFMgKi9cXG5cXG4uYm9hcmQtc3RhdHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIHdpZHRoOiAxMDAlO1xcblxcbiAgZm9udC1zaXplOiAxcmVtO1xcbiAgY29sb3I6ICNjYmYwZmY7XFxuICBmb250LWZhbWlseTogJ1NwZWNpYWwtRWxpdGUnO1xcbn1cXG5cXG4uYm9hcmQtc3RhdHMgPiBwIHtcXG4gIG1hcmdpbjogMDtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG59XFxuXFxuLmJvYXJkLXN0YXRzLXNoaXBzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDAuNHJlbTtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxufVxcblxcbi5ib2FyZC1zdGF0cy1zaGlwcyA+IHAge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4uYm9hcmQtc3RhdHMtc2hpcHMtdGV4dCB7XFxuICBmb250LXNpemU6IDAuOHJlbTtcXG59XFxuXFxuLmJvYXJkLXN0YXRzLXNoaXBzLWNvdW50IHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgZm9udC1mYW1pbHk6ICdIb21lbWFkZS1BcHBsZSc7XFxufVxcblxcbi5ib2FyZC1zdGF0cy1uYW1lIHtcXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xcbn1cXG5cXG4vKiBTSElQICovXFxuXFxuLnNoaXAge1xcbiAgY3Vyc29yOiBncmFiO1xcbiAgei1pbmRleDogMTA7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuXFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgd2lkdGg6IG1pbi1jb250ZW50O1xcbiAgaGVpZ2h0OiBtaW4tY29udGVudDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDBlNWYyO1xcblxcbiAgYm9yZGVyLXJhZGl1czogMXJlbSAxcmVtIDAuNXJlbSAwLjVyZW07XFxufVxcblxcbi8qIC5ib2FyZC1zaGlwcyB7XFxuICBncmlkLWNvbHVtbjogMTtcXG4gIGdyaWQtcm93OiAxO1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgZ2FwOiAwLjI1cmVtO1xcbiAgd2lkdGg6IDMwMHB4O1xcblxcbiAgaGVpZ2h0OiA4MCU7XFxuICB0cmFuc2l0aW9uOiByb3RhdGUgMXMgZWFzZTtcXG59ICovXFxuXFxuZGl2W2RhdGEtZGlyZWN0aW9uPSdob3Jpem9udGFsJ10ge1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG59XFxuXFxuLnNoaXBbZGF0YS1kaXJlY3Rpb249J2hvcml6b250YWwnXSB7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtIDAuNXJlbSAwLjVyZW0gMXJlbTtcXG59XFxuXFxuLnNoaXAtYmxvY2sge1xcbiAgYXNwZWN0LXJhdGlvOiAxLzE7XFxuXFxuICBoZWlnaHQ6IDMwcHg7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHotaW5kZXg6IDM7XFxufVxcblxcbi5uby1yb3RhdGUge1xcbiAgYW5pbWF0aW9uOiB0aWx0LXNoYWtpbmcgMC4zNXMgMztcXG59XFxuXFxuLnNoaXAtc2V0IHtcXG4gIHotaW5kZXg6IC0xO1xcbn1cXG5cXG4vKiBCQUNLR1JPVU5EICovXFxuLnZpZGVvLWNvbnRhaW5lciB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTAwJTtcXG5cXG4gIHotaW5kZXg6IC0xMDtcXG4gIG9iamVjdC1maXQ6IGNvdmVyO1xcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xcblxcbiAgZmlsdGVyOiBncmF5c2NhbGUoMjAlKTtcXG59XFxuXFxuLyoqIEZJRUxEICovXFxuLmJvYXJkLWZpZWxkIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJvcmRlcjogMC4xcHggc29saWQgI2ZmZmZmZjRkO1xcbiAgd2lkdGg6IDMwcHg7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICBwYWRkaW5nOiAwO1xcblxcbiAgb3ZlcmZsb3c6IHZpc2libGU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLm1pc3Mge1xcbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi9hc3NldHMvaWNvbnM4LW11bHRpcGx5LTEwMC5wbmcnKTtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDcwJTtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gIGFuaW1hdGlvbjogbWFya0ZpZWxkIDFzIDE7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJy4uL2Fzc2V0cy9vdXRwdXQtb25saW5lZ2lmdG9vbHMuZ2lmJyk7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1zaXplOiA3MCU7XFxuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XFxuICBhbmltYXRpb246IG1hcmtGaWVsZCAxcyAxO1xcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XFxufVxcblxcbi5hdmFpbGFibGUtc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoNzcsIDEyOCwgMSk7XFxufVxcblxcbi5hdmFpbGFibGUtb2Zmc2V0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMTY4LCAyNTEsIDQ0LCAwLjQpO1xcbn1cXG5cXG4ubm90LWF2YWlsYWJsZSxcXG4ubm90LWF2YWlsYWJsZSA+ICoge1xcbiAgei1pbmRleDogMTA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC44Myk7XFxufVxcblxcbi5kcmFnZ2luZyB7XFxuICBjdXJzb3I6IGdyYWJiaW5nICFpbXBvcnRhbnQ7XFxufVxcblxcbi8qKiBQbGF5ZXIgMSAqL1xcbi5nYW1lYm9hcmQucGxheWVyMSB7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XFxuICBncmlkLXJvdzogMztcXG59XFxuXFxuLyoqIFBsYXllciAyICovXFxuXFxuLmdhbWVib2FyZC5wbGF5ZXIyIHtcXG4gIGdyaWQtcm93OiAxO1xcbn1cXG5cXG4ucGxheWVyMiA+IC5ib2FyZCA+IC5ib2FyZC1maWVsZCB7XFxuICBjdXJzb3I6IGNyb3NzaGFpcjtcXG59XFxuXFxuLnBsYXllcjIgPiAuYm9hcmQgPiAuYm9hcmQtZmllbGQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzJkOGNjYztcXG59XFxuXFxuLnBsYXllcjIgPiAuYm9hcmQgPiAuYm9hcmQtZmllbGQuaGl0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNhYmJkYzg7XFxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIG1hcmtGaWVsZCB7XFxuICAwJSB7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogMTEwJTtcXG4gIH1cXG4gIDUwJSB7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogNDAlO1xcbiAgfVxcbiAgMTAwJSB7XFxuICAgIGJhY2tncm91bmQtc2l6ZTogNzAlO1xcbiAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIHRpbHQtc2hha2luZyB7XFxuICAwJSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xcbiAgfVxcbiAgMjUlIHtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoNWRlZyk7XFxuICB9XFxuICA1MCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC01ZGVnKTtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAuaHVkIHtcbiAgZ3JpZC1yb3c6IDI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDIwJSA2MCUgMjAlO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG5cbiAgd2lkdGg6IDc1cmVtO1xuICBtaW4td2lkdGg6IDYwcmVtO1xuICBoZWlnaHQ6IDEwMCU7XG5cbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDEuNXJlbSk7XG4gIGJvcmRlcjogIzMyNDg1ZTZlIDAuMnJlbSBzb2xpZDtcblxuICBmb250LWZhbWlseTogJ1NwZWNpYWwtRWxpdGUnO1xuICBjb2xvcjogI2RmZjZmZjtcbn1cblxuLmh1ZC1zdGFnZS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICBoZWlnaHQ6IDkwJTtcbiAgd2lkdGg6IDk1JTtcblxuICBib3JkZXItcmFkaXVzOiAwLjNyZW07XG4gIGJvcmRlcjogIzMyNDg1ZTZlIDAuMnJlbSBzb2xpZDtcbiAgYm9yZGVyLXRvcDogbm9uZTtcbiAgYm9yZGVyLWJvdHRvbTogbm9uZTtcblxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDMwMG1zIGVhc2U7XG59XG5cbi5odWQtc3RhZ2UtdGV4dCB7XG4gIGZvbnQtc2l6ZTogMnJlbTtcbiAgbWFyZ2luOiAwO1xufVxuXG4uaHVkLW1hbnVhbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICBoZWlnaHQ6IDEwMCU7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMzAwbXMgZWFzZTtcbn1cblxuLmh1ZC1tYW51YWwgPiBoMyxcbi5odWQtbWFudWFsID4gcCB7XG4gIG1hcmdpbjogMDtcbn1cblxuLmh1ZC1tYW51YWwgPiBoMyB7XG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xufVxuXG4uaHVkLXJvdW5kIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICBtYXJnaW46IDA7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xufVxuXG4uc2hpcHMtbGVmdCB7XG4gIG1hcmdpbjogMDtcbn1cblxuLnN0YXJ0QnRuIHtcbiAgZ3JpZC1yb3c6IDE7XG4gIGdyaWQtY29sdW1uOiAxO1xuICB3aWR0aDogMTByZW07XG59XG5cbi5oaWRlIHtcbiAgb3BhY2l0eTogMDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy92aWV3L3N0eWxlL2h1ZC5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSxXQUFXO0VBQ1gsa0JBQWtCOztFQUVsQixhQUFhO0VBQ2Isa0NBQWtDO0VBQ2xDLG1CQUFtQjtFQUNuQixxQkFBcUI7O0VBRXJCLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsWUFBWTs7RUFFWixtQkFBbUI7RUFDbkIsNENBQTRDO0VBQzVDLDhCQUE4Qjs7RUFFOUIsNEJBQTRCO0VBQzVCLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHVCQUF1Qjs7RUFFdkIsV0FBVztFQUNYLFVBQVU7O0VBRVYscUJBQXFCO0VBQ3JCLDhCQUE4QjtFQUM5QixnQkFBZ0I7RUFDaEIsbUJBQW1COztFQUVuQiw4QkFBOEI7QUFDaEM7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsU0FBUztBQUNYOztBQUVBO0VBQ0UsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsa0JBQWtCOztFQUVsQixZQUFZO0VBQ1osNkJBQTZCOztFQUU3Qiw4QkFBOEI7QUFDaEM7O0FBRUE7O0VBRUUsU0FBUztBQUNYOztBQUVBO0VBQ0Usb0JBQW9CO0FBQ3RCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjs7RUFFbkIsU0FBUztFQUNULGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLFNBQVM7QUFDWDs7QUFFQTtFQUNFLFdBQVc7RUFDWCxjQUFjO0VBQ2QsWUFBWTtBQUNkOztBQUVBO0VBQ0UsVUFBVTtFQUNWLG9CQUFvQjtBQUN0QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaHVkIHtcXG4gIGdyaWQtcm93OiAyO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcblxcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMjAlIDYwJSAyMCU7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcbiAgd2lkdGg6IDc1cmVtO1xcbiAgbWluLXdpZHRoOiA2MHJlbTtcXG4gIGhlaWdodDogMTAwJTtcXG5cXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBiYWNrZHJvcC1maWx0ZXI6IHNhdHVyYXRlKDE4MCUpIGJsdXIoMS41cmVtKTtcXG4gIGJvcmRlcjogIzMyNDg1ZTZlIDAuMnJlbSBzb2xpZDtcXG5cXG4gIGZvbnQtZmFtaWx5OiAnU3BlY2lhbC1FbGl0ZSc7XFxuICBjb2xvcjogI2RmZjZmZjtcXG59XFxuXFxuLmh1ZC1zdGFnZS1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG5cXG4gIGhlaWdodDogOTAlO1xcbiAgd2lkdGg6IDk1JTtcXG5cXG4gIGJvcmRlci1yYWRpdXM6IDAuM3JlbTtcXG4gIGJvcmRlcjogIzMyNDg1ZTZlIDAuMnJlbSBzb2xpZDtcXG4gIGJvcmRlci10b3A6IG5vbmU7XFxuICBib3JkZXItYm90dG9tOiBub25lO1xcblxcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAzMDBtcyBlYXNlO1xcbn1cXG5cXG4uaHVkLXN0YWdlLXRleHQge1xcbiAgZm9udC1zaXplOiAycmVtO1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4uaHVkLW1hbnVhbCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICBoZWlnaHQ6IDEwMCU7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWV2ZW5seTtcXG5cXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMzAwbXMgZWFzZTtcXG59XFxuXFxuLmh1ZC1tYW51YWwgPiBoMyxcXG4uaHVkLW1hbnVhbCA+IHAge1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4uaHVkLW1hbnVhbCA+IGgzIHtcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbn1cXG5cXG4uaHVkLXJvdW5kIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcblxcbiAgbWFyZ2luOiAwO1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxufVxcblxcbi5zaGlwcy1sZWZ0IHtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLnN0YXJ0QnRuIHtcXG4gIGdyaWQtcm93OiAxO1xcbiAgZ3JpZC1jb2x1bW46IDE7XFxuICB3aWR0aDogMTByZW07XFxufVxcblxcbi5oaWRlIHtcXG4gIG9wYWNpdHk6IDA7XFxuICBwb2ludGVyLWV2ZW50czogbm9uZTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9hc3NldHMvZm9udHMvU3BlY2lhbF9FbGl0ZS9TcGVjaWFsRWxpdGUtUmVndWxhci50dGZcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMV9fXyA9IG5ldyBVUkwoXCIuLi9hc3NldHMvZm9udHMvU3RhcmRvc19TdGVuY2lsL1N0YXJkb3NTdGVuY2lsLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzJfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2ZvbnRzL1N0YXJkb3NfU3RlbmNpbC9TdGFyZG9zU3RlbmNpbC1Cb2xkLnR0ZlwiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8zX19fID0gbmV3IFVSTChcIi4uL2Fzc2V0cy9mb250cy9Ib21lbWFkZV9BcHBsZS9Ib21lbWFkZUFwcGxlLVJlZ3VsYXIudHRmXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzRfX18gPSBuZXcgVVJMKFwiLi4vYXNzZXRzL2JhY2tncm91bmQtMS5qcGdcIiwgaW1wb3J0Lm1ldGEudXJsKTtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzFfX18pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzJfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8yX19fKTtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8zX19fID0gX19fQ1NTX0xPQURFUl9HRVRfVVJMX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfM19fXyk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfNF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGBAZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6ICdTcGVjaWFsLUVsaXRlJztcbiAgc3JjOiB1cmwoJHtfX19DU1NfTE9BREVSX1VSTF9SRVBMQUNFTUVOVF8wX19ffSlcbiAgICBmb3JtYXQoJ3RydWV0eXBlJyk7XG59XG5cbkBmb250LWZhY2Uge1xuICBmb250LWZhbWlseTogJ1N0YXJkb3MtU3RlbmNpbCc7XG4gIHNyYzogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMV9fX30pXG4gICAgZm9ybWF0KCd0cnVldHlwZScpO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6ICdTdGFyZG9zLVN0ZW5jaWwtQm9sZCc7XG4gIHNyYzogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMl9fX30pXG4gICAgZm9ybWF0KCd0cnVldHlwZScpO1xufVxuXG5AZm9udC1mYWNlIHtcbiAgZm9udC1mYW1pbHk6ICdIb21lbWFkZS1BcHBsZSc7XG4gIHNyYzogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfM19fX30pXG4gICAgZm9ybWF0KCd0cnVldHlwZScpO1xufVxuXG5odG1sIHtcbiAgZm9udC1mYW1pbHk6IEhlbHZldGljYTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbn1cblxuYm9keSB7XG4gIGhlaWdodDogMTAwdmg7XG5cbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiA0NSUgMTAlIDQ1JTtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIGdhcDogMC4yNXJlbTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1pdGVtczogY2VudGVyO1xuICBtYXJnaW46IGF1dG87XG5cbiAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCR7X19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfNF9fX30pO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG59XG5cbi5hbGVydCB7XG4gIGFuaW1hdGlvbjogYWxlcnQtdGV4dCAxIDFzO1xufVxuXG4uY2VsZWJyYXRpb24ge1xuICBhbmltYXRpb246IGNlbGVicmF0aW9uLXRleHQgaW5maW5pdGUgMXM7XG59XG5cbkBrZXlmcmFtZXMgY2VsZWJyYXRpb24tdGV4dCB7XG4gIDAlIHtcbiAgICBmb250LXNpemU6IDMuNXJlbTtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgICBjb2xvcjogb3JhbmdlO1xuICB9XG4gIDI1JSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoM2RlZyk7XG4gIH1cblxuICA1MCUge1xuICAgIGZvbnQtc2l6ZTogMnJlbTtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgICBjb2xvcjogeWVsbG93O1xuICB9XG4gIDc1JSB7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoLTNkZWcpO1xuICB9XG5cbiAgMTAwJSB7XG4gICAgZm9udC1zaXplOiAzLjVyZW07XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gICAgY29sb3I6IG9yYW5nZTtcbiAgfVxufVxuXG5Aa2V5ZnJhbWVzIGFsZXJ0LXRleHQge1xuICAwJSB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gIH1cblxuICA1MCUge1xuICAgIGNvbG9yOiByZWQ7XG4gICAgZm9udC1zaXplOiAyLjVyZW07XG4gIH1cblxuICAxMDAlIHtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvdmlldy9zdHlsZS9yb290LmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLDRCQUE0QjtFQUM1QjtzQkFDb0I7QUFDdEI7O0FBRUE7RUFDRSw4QkFBOEI7RUFDOUI7c0JBQ29CO0FBQ3RCOztBQUVBO0VBQ0UsbUNBQW1DO0VBQ25DO3NCQUNvQjtBQUN0Qjs7QUFFQTtFQUNFLDZCQUE2QjtFQUM3QjtzQkFDb0I7QUFDdEI7O0FBRUE7RUFDRSxzQkFBc0I7RUFDdEIseUJBQXlCO0FBQzNCOztBQUVBO0VBQ0UsYUFBYTs7RUFFYixhQUFhO0VBQ2IsK0JBQStCO0VBQy9CLDBCQUEwQjtFQUMxQixZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixZQUFZOztFQUVaLHlEQUFtRDtFQUNuRCwyQkFBMkI7RUFDM0IsNEJBQTRCO0VBQzVCLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLDBCQUEwQjtBQUM1Qjs7QUFFQTtFQUNFLHVDQUF1QztBQUN6Qzs7QUFFQTtFQUNFO0lBQ0UsaUJBQWlCO0lBQ2pCLHVCQUF1QjtJQUN2QixhQUFhO0VBQ2Y7RUFDQTtJQUNFLHVCQUF1QjtFQUN6Qjs7RUFFQTtJQUNFLGVBQWU7SUFDZix1QkFBdUI7SUFDdkIsYUFBYTtFQUNmO0VBQ0E7SUFDRSx3QkFBd0I7RUFDMUI7O0VBRUE7SUFDRSxpQkFBaUI7SUFDakIsdUJBQXVCO0lBQ3ZCLGFBQWE7RUFDZjtBQUNGOztBQUVBO0VBQ0U7SUFDRSxpQkFBaUI7RUFDbkI7O0VBRUE7SUFDRSxVQUFVO0lBQ1YsaUJBQWlCO0VBQ25COztFQUVBO0lBQ0UsaUJBQWlCO0VBQ25CO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ1NwZWNpYWwtRWxpdGUnO1xcbiAgc3JjOiB1cmwoJy4uL2Fzc2V0cy9mb250cy9TcGVjaWFsX0VsaXRlL1NwZWNpYWxFbGl0ZS1SZWd1bGFyLnR0ZicpXFxuICAgIGZvcm1hdCgndHJ1ZXR5cGUnKTtcXG59XFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ1N0YXJkb3MtU3RlbmNpbCc7XFxuICBzcmM6IHVybCgnLi4vYXNzZXRzL2ZvbnRzL1N0YXJkb3NfU3RlbmNpbC9TdGFyZG9zU3RlbmNpbC1SZWd1bGFyLnR0ZicpXFxuICAgIGZvcm1hdCgndHJ1ZXR5cGUnKTtcXG59XFxuXFxuQGZvbnQtZmFjZSB7XFxuICBmb250LWZhbWlseTogJ1N0YXJkb3MtU3RlbmNpbC1Cb2xkJztcXG4gIHNyYzogdXJsKCcuLi9hc3NldHMvZm9udHMvU3RhcmRvc19TdGVuY2lsL1N0YXJkb3NTdGVuY2lsLUJvbGQudHRmJylcXG4gICAgZm9ybWF0KCd0cnVldHlwZScpO1xcbn1cXG5cXG5AZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiAnSG9tZW1hZGUtQXBwbGUnO1xcbiAgc3JjOiB1cmwoJy4uL2Fzc2V0cy9mb250cy9Ib21lbWFkZV9BcHBsZS9Ib21lbWFkZUFwcGxlLVJlZ3VsYXIudHRmJylcXG4gICAgZm9ybWF0KCd0cnVldHlwZScpO1xcbn1cXG5cXG5odG1sIHtcXG4gIGZvbnQtZmFtaWx5OiBIZWx2ZXRpY2E7XFxuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xcbn1cXG5cXG5ib2R5IHtcXG4gIGhlaWdodDogMTAwdmg7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiA0NSUgMTAlIDQ1JTtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xcbiAgZ2FwOiAwLjI1cmVtO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG4gIG1hcmdpbjogYXV0bztcXG5cXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vYXNzZXRzL2JhY2tncm91bmQtMS5qcGcnKTtcXG4gIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuICBiYWNrZ3JvdW5kLXNpemU6IGNvdmVyO1xcbn1cXG5cXG4uYWxlcnQge1xcbiAgYW5pbWF0aW9uOiBhbGVydC10ZXh0IDEgMXM7XFxufVxcblxcbi5jZWxlYnJhdGlvbiB7XFxuICBhbmltYXRpb246IGNlbGVicmF0aW9uLXRleHQgaW5maW5pdGUgMXM7XFxufVxcblxcbkBrZXlmcmFtZXMgY2VsZWJyYXRpb24tdGV4dCB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogMy41cmVtO1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gICAgY29sb3I6IG9yYW5nZTtcXG4gIH1cXG4gIDI1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKDNkZWcpO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgZm9udC1zaXplOiAycmVtO1xcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcXG4gICAgY29sb3I6IHllbGxvdztcXG4gIH1cXG4gIDc1JSB7XFxuICAgIHRyYW5zZm9ybTogcm90YXRlKC0zZGVnKTtcXG4gIH1cXG5cXG4gIDEwMCUge1xcbiAgICBmb250LXNpemU6IDMuNXJlbTtcXG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XFxuICAgIGNvbG9yOiBvcmFuZ2U7XFxuICB9XFxufVxcblxcbkBrZXlmcmFtZXMgYWxlcnQtdGV4dCB7XFxuICAwJSB7XFxuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgfVxcblxcbiAgNTAlIHtcXG4gICAgY29sb3I6IHJlZDtcXG4gICAgZm9udC1zaXplOiAyLjVyZW07XFxuICB9XFxuXFxuICAxMDAlIHtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLndlbGNvbWUtY29udGFpbmVyIHtcbiAgei1pbmRleDogNTA7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcblxuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IDJmciAyZnIgMWZyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24tY29udGVudDogY2VudGVyO1xuXG4gIG1heC13aWR0aDogNDVyZW07XG4gIG1heC1oZWlnaHQ6IDUwcmVtO1xuICBtaW4td2lkdGg6IDQwcmVtO1xuICBtaW4taGVpZ2h0OiA0MHJlbTtcblxuICBiYWNrZ3JvdW5kOiAjZmZmZmZmM2Q7XG4gIGJhY2tkcm9wLWZpbHRlcjogc2F0dXJhdGUoMTgwJSkgYmx1cigxLjVyZW0pO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3JkZXI6ICMzMjQ4NWU2ZSAwLjJyZW0gc29saWQ7XG5cbiAgZm9udC1mYW1pbHk6ICdTcGVjaWFsLUVsaXRlJztcbn1cblxuLndlbGNvbWUtdGl0bGUge1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcblxuICBmb250LXNpemU6IDQuNXJlbTtcbiAgZm9udC1mYW1pbHk6ICdTdGFyZG9zLVN0ZW5jaWwtQm9sZCc7XG4gIGNvbG9yOiAjY2JmMGZmO1xuXG4gIG1hcmdpbjogMDtcbn1cblxuLndlbGNvbWUtbW9kZSB7XG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xuXG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xuXG4gIHdpZHRoOiAyMHJlbTtcbn1cblxuLyogTmFtZSBTZWxlY3QgKi9cblxuLndlbGNvbWUtbmFtZS1zZWxlY3Qge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXJvdzogMiAvIDQ7XG4gIGdyaWQtdGVtcGxhdGUtcm93czogcmVwZWF0KDMsIDFmcik7XG59XG5cbi53ZWxjb21lLW5hbWUtY29udGFpbmVyIHtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbn1cblxuLndlbGNvbWUtbmFtZS1jb250YWluZXIgPiBsYWJlbCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4ud2VsY29tZS1uYW1lLWlucHV0IHtcbiAgd2lkdGg6IGF1dG87XG4gIHBhZGRpbmc6IDAuNTVyZW0gMC41cmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIGJvcmRlci1ib3R0b206ICM2NTY1NjU2MyAxcHggc29saWQ7XG4gIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi53ZWxjb21lLW5hbWUtaW5wdXQ6Zm9jdXMtdmlzaWJsZSB7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG4gIG91dGxpbmU6ICM2NTY1NjUgMXB4IHNvbGlkO1xuICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMDYpIDBweCAycHggNHB4IDBweCBpbnNldDtcbn1cblxuLndlbGNvbWUtc3RhcnQtYnV0dG9uIHtcbiAgZ3JpZC1yb3c6IDM7XG4gIHdpZHRoOiAxNXJlbTtcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy92aWV3L3N0eWxlL3dlbGNvbWUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsV0FBVztFQUNYLGtCQUFrQjs7RUFFbEIsYUFBYTtFQUNiLCtCQUErQjtFQUMvQix1QkFBdUI7RUFDdkIscUJBQXFCOztFQUVyQixnQkFBZ0I7RUFDaEIsaUJBQWlCO0VBQ2pCLGdCQUFnQjtFQUNoQixpQkFBaUI7O0VBRWpCLHFCQUFxQjtFQUNyQiw0Q0FBNEM7RUFDNUMsbUJBQW1CO0VBQ25CLDhCQUE4Qjs7RUFFOUIsNEJBQTRCO0FBQzlCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGtCQUFrQjs7RUFFbEIsaUJBQWlCO0VBQ2pCLG1DQUFtQztFQUNuQyxjQUFjOztFQUVkLFNBQVM7QUFDWDs7QUFFQTtFQUNFLG9CQUFvQjs7RUFFcEIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0Qiw2QkFBNkI7O0VBRTdCLFlBQVk7QUFDZDs7QUFFQSxnQkFBZ0I7O0FBRWhCO0VBQ0UsYUFBYTtFQUNiLGVBQWU7RUFDZixrQ0FBa0M7QUFDcEM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLGFBQWE7RUFDYixzQkFBc0I7QUFDeEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLFdBQVc7QUFDYjs7QUFFQTtFQUNFLFdBQVc7RUFDWCx1QkFBdUI7RUFDdkIsWUFBWTtFQUNaLGtDQUFrQztFQUNsQyw2QkFBNkI7RUFDN0Isc0JBQXNCOztFQUV0QixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0Usc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQixxREFBcUQ7QUFDdkQ7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsWUFBWTtFQUNaLG9CQUFvQjtBQUN0QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIud2VsY29tZS1jb250YWluZXIge1xcbiAgei1pbmRleDogNTA7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuXFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAyZnIgMmZyIDFmcjtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgYWxpZ24tY29udGVudDogY2VudGVyO1xcblxcbiAgbWF4LXdpZHRoOiA0NXJlbTtcXG4gIG1heC1oZWlnaHQ6IDUwcmVtO1xcbiAgbWluLXdpZHRoOiA0MHJlbTtcXG4gIG1pbi1oZWlnaHQ6IDQwcmVtO1xcblxcbiAgYmFja2dyb3VuZDogI2ZmZmZmZjNkO1xcbiAgYmFja2Ryb3AtZmlsdGVyOiBzYXR1cmF0ZSgxODAlKSBibHVyKDEuNXJlbSk7XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiAjMzI0ODVlNmUgMC4ycmVtIHNvbGlkO1xcblxcbiAgZm9udC1mYW1pbHk6ICdTcGVjaWFsLUVsaXRlJztcXG59XFxuXFxuLndlbGNvbWUtdGl0bGUge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcblxcbiAgZm9udC1zaXplOiA0LjVyZW07XFxuICBmb250LWZhbWlseTogJ1N0YXJkb3MtU3RlbmNpbC1Cb2xkJztcXG4gIGNvbG9yOiAjY2JmMGZmO1xcblxcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4ud2VsY29tZS1tb2RlIHtcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcblxcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG5cXG4gIHdpZHRoOiAyMHJlbTtcXG59XFxuXFxuLyogTmFtZSBTZWxlY3QgKi9cXG5cXG4ud2VsY29tZS1uYW1lLXNlbGVjdCB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC1yb3c6IDIgLyA0O1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiByZXBlYXQoMywgMWZyKTtcXG59XFxuXFxuLndlbGNvbWUtbmFtZS1jb250YWluZXIge1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG59XFxuXFxuLndlbGNvbWUtbmFtZS1jb250YWluZXIgPiBsYWJlbCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBnYXA6IDAuNXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4ud2VsY29tZS1uYW1lLWlucHV0IHtcXG4gIHdpZHRoOiBhdXRvO1xcbiAgcGFkZGluZzogMC41NXJlbSAwLjVyZW07XFxuICBib3JkZXI6IG5vbmU7XFxuICBib3JkZXItYm90dG9tOiAjNjU2NTY1NjMgMXB4IHNvbGlkO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcblxcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi53ZWxjb21lLW5hbWUtaW5wdXQ6Zm9jdXMtdmlzaWJsZSB7XFxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xcbiAgb3V0bGluZTogIzY1NjU2NSAxcHggc29saWQ7XFxuICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMDYpIDBweCAycHggNHB4IDBweCBpbnNldDtcXG59XFxuXFxuLndlbGNvbWUtc3RhcnQtYnV0dG9uIHtcXG4gIGdyaWQtcm93OiAzO1xcbiAgd2lkdGg6IDE1cmVtO1xcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL25vcm1hbGl6ZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbm9ybWFsaXplLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9idXR0b24uY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9idXR0b24uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWVib2FyZC5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2dhbWVib2FyZC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaHVkLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaHVkLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9yb290LmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcm9vdC5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vd2VsY29tZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3dlbGNvbWUuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjO1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHtcblx0XHRcdHZhciBpID0gc2NyaXB0cy5sZW5ndGggLSAxO1xuXHRcdFx0d2hpbGUgKGkgPiAtMSAmJiAhc2NyaXB0VXJsKSBzY3JpcHRVcmwgPSBzY3JpcHRzW2ktLV0uc3JjO1xuXHRcdH1cblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCAnbm9ybWFsaXplLmNzcyc7XG5pbXBvcnQgJy4vdmlldy9zdHlsZS9yb290LmNzcyc7XG5pbXBvcnQgJy4vdmlldy9zdHlsZS9idXR0b24uY3NzJztcblxuaW1wb3J0IEdhbWVDb250cm9sbGVyIGZyb20gJy4vY29udHJvbGxlci9nYW1lQ29udHJvbGxlcic7XG5pbXBvcnQgU2NyZWVuQ29udHJvbGxlciBmcm9tICcuL2NvbnRyb2xsZXIvc2NyZWVuQ29udHJvbGxlcic7XG5cblNjcmVlbkNvbnRyb2xsZXIoKTtcbkdhbWVDb250cm9sbGVyKCk7XG4iXSwibmFtZXMiOlsiY2xlYXJGaWVsZHMiLCJnZXRGaWVsZHMiLCJpc0F2YWlsYWJsZUZpZWxkcyIsInBvcHVsYXRlRmllbGRzIiwidXBkYXRlRmllbGRzU2hpcCIsImhhbmRsZURyYWdTdGFydCIsInRhcmdldCIsImNsYXNzTGlzdCIsImFkZCIsImxlbmd0aCIsImRpcmVjdGlvbiIsInJvdyIsImNvbHVtbiIsImRhdGFzZXQiLCJvY2N1cGllZEZpZWxkcyIsImNvcmVGaWVsZHMiLCJmb3JFYWNoIiwiZGl2IiwiY2xlYXJHdWlkZXMiLCJhdmFpbGFibGVTaGlwIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYXZhaWxhYmxlT2Zmc2V0Iiwibm90QXZhaWxhYmxlIiwicmVtb3ZlIiwiaGFuZGxlRHJhZ0VuZCIsImRyYWdnZWRGcm9tIiwib2xkWCIsIk51bWJlciIsIm9sZFkiLCJpc1NhbWUiLCJoYW5kbGVEcmFnTGVhdmUiLCJldmVudCIsInByZXZlbnREZWZhdWx0IiwiaGFuZGxlRHJhZ0Ryb3AiLCJkcmFnZ2VkIiwicXVlcnlTZWxlY3RvciIsIm5ld0ZpZWxkcyIsIm9mZnNldEZpZWxkcyIsImFsbEF2YWlsYWJsZSIsImluY2x1ZGVzIiwiYXBwZW5kIiwiaGFuZGxlRHJhZ092ZXIiLCJjdXJyZW50RmllbGRzIiwic2hpcCIsInN0eWxlIiwiY29ycmVjdENsYXNzIiwib2Zmc2V0IiwiY3JlYXRlUGxheWVyIiwiY3JlYXRlQWlQbGF5ZXIiLCJjcmVhdGVHYW1lTG9vcCIsIlB1YlN1YiIsIkdhbWVDb250cm9sbGVyIiwiY3VycmVudE5hbWVzIiwicGxheWVyMSIsInBsYXllcjIiLCJjdXJyZW50R2FtZSIsInN1YnNjcmliZSIsIm5hbWVzIiwibmFtZVAxIiwibmFtZVAyIiwicHVibGlzaCIsInBoYXNlIiwic2V0U2hpcHMiLCJwbGF5Um91bmQiLCJjb29yZGluYXRlcyIsInNob3RSZXN1bHQiLCJjcmVhdGVIdWQiLCJjcmVhdGVXZWxjb21lU2NyZWVuIiwicmVuZGVyR2FtZWJvYXJkIiwiY2xlYW5PbGRCb2FyZHMiLCJvbGRIdWQiLCJvbGRHYW1lQm9hcmRQMSIsIm9sZEdhbWVCb2FyZFAyIiwiU2NyZWVuQ29udHJvbGxlciIsIndlbGNvbWVTY3JlZW4iLCJib2R5IiwiYWN0aXZlU2hpcHNQMSIsImFjdGl2ZVNoaXBzUDIiLCJnYW1lIiwiaHVkIiwiZ2FtZWJvYXJkMSIsImdhbWVib2FyZDIiLCJtYXJrIiwiYWN0aXZlUGxheWVyIiwiYm9hcmRUb01hcmsiLCJjb250YWluZXIiLCJzZWxlY3RvckJhc2UiLCJmaWVsZCIsImNoZWNrU2hpcHNQMSIsImdhbWVib2FyZCIsImFjdGl2ZVNoaXBzIiwiY2hlY2tTaGlwc1AyIiwiY291bnQiLCJ0ZXh0Q29udGVudCIsInNldFRpbWVvdXQiLCJnZXRSYW5kb21Db29yZGluYXRlcyIsImNoZWNrTmV4dFNob3QiLCJtYXJrZWRGaWVsZHMiLCJuZXh0TWFyayIsIm1hcmtYIiwibWFya1kiLCJuZXh0TWFya1N0ciIsImlzSW5zaWRlWCIsImlzSW5zaWRlWSIsImlzSW5zaWRlIiwiYWxyZWFkeU1hcmtlZCIsImhhcyIsImdldFJhbmRvbU5leHRTaG90IiwicmFuZG9tU2hvdCIsImdldE9wcG9zaXRlRGlyZWN0aW9uIiwicG9zc2libGVTaG90cyIsImRvd24iLCJsZWZ0IiwidXAiLCJyaWdodCIsInNhdmVIaXQiLCJmaWVsZEhpdHMiLCJwb3NzaWJsZUhpdHMiLCJoaWdoUHJvYmFiaWxpdHlTaG90Iiwic2hvdCIsInNob3RTdHIiLCJuZXh0UG9zc2libGVIaXRzIiwic2V0IiwiT2JqZWN0Iiwia2V5cyIsImtleSIsIm5leHRTaG90IiwibmV4dFgiLCJuZXh0WSIsIm5leHRTaG90U3RyIiwicHVzaCIsImxhc3RIaXQiLCJnZXQiLCJvbmVFeHRyYSIsIm9wcG9zaXRlRGlyU3RyIiwib3Bwb3NpdGVEaXIiLCJ1bnNoaWZ0Iiwic2F2ZU1pc3MiLCJzYXZlU3VuayIsInJlc3VsdCIsInN1bmtlblNoaXAiLCJvZmZzZXRTdHIiLCJzaG90RGVsYXkiLCJlbmVteUJvYXJkIiwiY3VycmVudFNob3QiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlY2VpdmVBdHRhY2siLCJjcmVhdGVCb2FyZCIsImNyZWF0ZVNoaXBTdG9yYWdlIiwiY2hlY2tTaGlwQ29vcmRpbmF0ZXMiLCJuYW1lIiwiTWFwIiwiU2V0Iiwic2hpcFN0b3JhZ2UiLCJnZXROZXh0U2hvdCIsInBvcCIsInNoaWZ0Iiwic2F2ZVNob3RSZXN1bHQiLCJBcnJheSIsImlzQXJyYXkiLCJwbGFjZVNoaXBzIiwic2hpcHNPbkJvYXJkIiwic2hpcFR5cGUiLCJuZXdDb29yZGluYXRlcyIsInRvQ2hlY2siLCJib2FyZCIsInNoaXBMZW5ndGgiLCJwbGFjZVNoaXAiLCJhdHRhY2siLCJzaG90cyIsImkiLCJjcmVhdGVCb2FyZEZpZWxkIiwibmV3U2hpcCIsIkVycm9yIiwidmFsdWUiLCJtYXJrRmllbGQiLCJpc09mZnNldCIsImhpdCIsImlzU3VuayIsInNldE9mZnNldCIsImN1cnJlbnRGaWVsZCIsImlzVmVydGljYWwiLCJkeW5hbWljRGlyIiwib25lQmVmb3JlIiwib25lQWZ0ZXIiLCJjb29yZFRvQ2hlY2siLCJiYXNlIiwiaW5pdEJvYXJkIiwicm93cyIsImNvbHVtbnMiLCJqIiwibGl2aW5nU2hpcHMiLCJyYW5kb21Sb3ciLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJyYW5kb21Db2x1bW4iLCJpbnNpZGVCb2FyZFVwIiwiaW5zaWRlQm9hcmREb3duIiwidXBSb3ciLCJ1cENvbCIsImRvd25Sb3ciLCJkb3duQ29sIiwiaXNPY2N1cGllZEZpZWxkIiwiY2hlY2tPdXRPZkJvYXJkIiwiY2hlY2tPZmZzZXQiLCJjaGVja0ZpZWxkcyIsInJvdW5kIiwib3Bwb25lbnRQbGF5ZXIiLCJzd2l0Y2hUdXJucyIsImdhbWVPdmVyIiwiY3VycmVudEF0dGFjayIsImdhbWVSZXN1bHQiLCJjb21wbGV0ZVNoaXAiLCJzaGlwcyIsInR5cGUiLCJjcmVhdGVQdWJTdWIiLCJ0cmFja2VyIiwiZXZlbnROYW1lIiwiZnVuYyIsInVuc3Vic2NyaWJlIiwiZnVuY3MiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJhcmdzIiwiY3JlYXRlU2hpcCIsImhpdHMiLCJoZWFsdGgiLCJBaXJjcmFmdENhcnJpZXIiLCJCYXR0bGVzaGlwIiwiQ3J1aXNlciIsIkRlc3Ryb3llcjEiLCJEZXN0cm95ZXIyIiwiU3VibWFyaW5lMSIsIlN1Ym1hcmluZTIiLCJjcmVhdGVTaGlwc0xlZnQiLCJjcmVhdGVFbGVtZW50IiwidGV4dCIsImNyZWF0ZVN0YXRzVUkiLCJzdGF0cyIsIm5hbWVUYWciLCJzaGlwc0xlZnQiLCJ2aWRlb0ZpbGUiLCJjcmVhdGVWaWRlb0JhY2tncm91bmQiLCJ2aWRlbyIsImF1dG9wbGF5IiwibG9vcCIsInNyYyIsImhhbmRsZUNsaWNrRmllbGQiLCJjcmVhdGVGaWVsZFVJIiwiZmllbGRCdXR0b24iLCJyZW5kZXJCb2FyZCIsImlzRW5lbXkiLCJib2FyZFVJIiwib25jbGljayIsImFkZEV2ZW50TGlzdGVuZXIiLCJyb3dOdW0iLCJjb2x1bW5OdW0iLCJsZW5ndGhOdW0iLCJzaGlwRW5kIiwiZ2V0RmllbGQiLCJyb3dEaXIiLCJjb2x1bW5EaXIiLCJnZXRTZXQiLCJiYXNlUm93IiwiYmFzZUNvbHVtbiIsIm9uZVVwIiwib25lRG93biIsImF2YWlsYWJsZSIsImdldFJhbmRvbUVtcHR5RmllbGRzIiwibmV3Um93IiwibmV3Q29sdW1uIiwia2VlcEdvaW5nIiwiZmllbGRzIiwidXBkYXRlRmllbGRzT2Zmc2V0IiwiZmllbGRzVG9DbGVhciIsImZpZWxkc1RvUG9wdWxhdGUiLCJyZW5kZXJTaGlwcyIsImNyZWF0ZUdhbWVib2FyZFVJIiwicGxheWVyQ2xhc3MiLCJnYW1lYm9hcmRVSSIsInBsYXllciIsInN3aXRjaEh1ZEluZm8iLCJ0b2dnbGUiLCJpc0NlbGVicmF0aW5nIiwiY3JhdGVTdGFydEJ1dHRvbiIsImJ1dHRvbiIsInN0YWdlIiwiZGlzYWJsZWQiLCJjcmVhdGVSb3VuZFVJIiwiY3VycmVudFJvdW5kIiwiY3JlYXRlU3RhZ2VVSSIsImN1cnJlbnRTdGFnZSIsInRvVXBwZXJDYXNlIiwiY3JlYXRlTWFudWFsIiwidGl0bGUiLCJyb3RhdGVIaW50IiwiZHJhZ0hpbnQiLCJjcmF0ZUh1ZCIsInN0YXJ0QnV0dG9uIiwiZ2FtZVN0YWdlIiwibWFudWFsIiwibm9Sb3RhdGVBbmltYXRpb24iLCJoYW5kbGVDbGlja1NoaXBSb3RhdGUiLCJuZXdEaXIiLCJuZXdGaWVsZHNDb3JlIiwibmV3RmllbGRzT2Zmc2V0IiwiY3VycmVudEZpZWxkc0NvcmUiLCJyZW5kZXJTaGlwIiwic2hpcENvbnRhaW5lciIsImRpciIsImRyYWdnYWJsZSIsInNoaXBCbG9jayIsImJhc2VGaWVsZCIsImZpbmQiLCJzdWJtaXROYW1lcyIsImlucHV0UDEiLCJpbnB1dFAyIiwibmFtZTEiLCJuYW1lMiIsImhhbmRsZUtleVByZXNzRW50ZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY3JlYXRlTmFtZUlucHV0IiwibGFiZWwiLCJzZXRBdHRyaWJ1dGUiLCJpbnB1dCIsImF1dG9jb21wbGV0ZSIsInBsYWNlaG9sZGVyIiwiY3JlYXRlU3RhcnRCdXR0b24iLCJjcmVhdGVOYW1lU2VsZWN0IiwidHdvUGxheWVycyIsImNyZWF0ZU1vZGVCdXR0b24iLCJjb250ZW50IiwiY3JlYXRlTW9kZVNlbGVjdCIsInB2ZSIsInJlcGxhY2VXaXRoIiwicHZwIiwibW9kZSJdLCJzb3VyY2VSb290IjoiIn0=