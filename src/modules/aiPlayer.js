// const markedFields = new Set();
// const possibleHits = [];
// const getRandomCoordinates = () => [5, 5];
// const possibleShots = (coordinates) => [coordinates[0] + 1, coordinates[1]];

// const aiAttack = (enemyBoard, markedFields, possibleHits) => {
//   let currentShot = possibleHits.length
//     ? possibleHits.shift()
//     : getRandomCoordinates();

//   if (!possibleHits.length) {
//     while (markedFields.has(`${currentShot[0]},${currentShot[1]}`)) {
//       currentShot = getRandomCoordinates();
//     }
//   }

//   console.log(possibleHits);
//   const result = enemyBoard.receiveAttack(currentShot);
//   // offsets

//   if (result === 'miss') {
//     const missedShotStr = `${currentShot[0]},${currentShot[1]}`;
//     markedFields.add(missedShotStr);
//   }

//   if (result === 'hit') {
//     const nextPossibleHits = Object.values(possibleShots(currentShot));

//     nextPossibleHits.forEach((possibleHit) => {
//       const nextX = possibleHit[0];
//       const nextY = possibleHit[1];
//       const nextPossibleHitStr = `${nextX},${nextY}`;

//       if (
//         nextX < 9 &&
//         nextY < 9 &&
//         nextX >= 0 &&
//         nextY >= 0 &&
//         !markedFields.has(nextPossibleHitStr)
//       ) {
//         possibleHits.push(possibleHit);
//         markedFields.add(currentShot);
//       }
//     });
//   }

//   return result;
// };
