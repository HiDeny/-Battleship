import { checkNextShot, possibleShots } from '../coordinates';

export const getOppositeDirection = (direction) => {
  if (direction === 'up') return 'down';
  if (direction === 'left') return 'right';
  if (direction === 'right') return 'left';
  if (direction === 'down') return 'up';
  return false;
};

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

export const saveSunk = (markedFields, fieldHits, shot) => {
  const shotStr = `${shot[0]},${shot[1]}`;
  fieldHits.set(shotStr, shot);
  markedFields.add(shotStr);

  fieldHits.forEach((position) => {
    const offsetFields = possibleShots(position);

    Object.values(offsetFields).forEach((offset) => {
      const offsetStr = `${offset[0]},${offset[1]}`;
      if (!markedFields.has(offsetStr)) markedFields.add(offsetStr);
    });
  });
};

export const shotDelay = async (enemyBoard, currentShot) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(enemyBoard.receiveAttack(currentShot));
    }, 1200);
  });
