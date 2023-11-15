import { getRandomCoordinates } from '../coordinates';

const checkNextShot = (markedFields, nextMark) => {
  const [markX, markY] = nextMark;
  const nextMarkStr = `${markX},${markY}`;

  const isInsideX = markX >= 0 && markX <= 9;
  const isInsideY = markY >= 0 && markY <= 9;
  const isInside = isInsideX && isInsideY;

  const alreadyMarked = markedFields.has(nextMarkStr);

  return !alreadyMarked && isInside;
};

export const getRandomNextShot = (markedFields) => {
  let randomShot = getRandomCoordinates();
  while (!checkNextShot(markedFields, randomShot)) {
    randomShot = getRandomCoordinates();
  }
  return randomShot;
};

const getOppositeDirection = (direction) => {
  if (direction === 'up') return 'down';
  if (direction === 'left') return 'right';
  if (direction === 'right') return 'left';
  if (direction === 'down') return 'up';
  return false;
};

const possibleShots = (coordinates) => ({
  down: [coordinates[0] - 1, coordinates[1]],
  left: [coordinates[0], coordinates[1] - 1],
  up: [coordinates[0] + 1, coordinates[1]],
  right: [coordinates[0], coordinates[1] + 1],
});

export const saveHit = (
  markedFields,
  fieldHits,
  possibleHits,
  highProbabilityShot,
  shot
) => {
  const shotStr = `${shot[0]},${shot[1]}`;
  const nextPossibleHits = possibleShots(shot);

  fieldHits.set(shotStr, shot);

  Object.keys(nextPossibleHits).forEach((key) => {
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

export const saveMiss = (markedFields, shot) => {
  const shotStr = `${shot[0]},${shot[1]}`;
  markedFields.add(shotStr);
};

export const saveSunk = (markedFields, fieldHits, shot, result) => {
  const sunkenShip = result[1];
  const shotStr = `${shot[0]},${shot[1]}`;
  fieldHits.set(shotStr, shot);
  markedFields.add(shotStr);

  sunkenShip.offset.forEach((field) => {
    const { coordinates } = field;
    const [row, column] = coordinates;
    const offsetStr = `${row},${column}`;
    if (!markedFields.has(offsetStr)) markedFields.add(offsetStr);
  });
};

export const shotDelay = async (enemyBoard, currentShot) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(enemyBoard.receiveAttack(currentShot));
    }, 1200);
  });