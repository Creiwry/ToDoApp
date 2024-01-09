const flowerNames = [
  'sakura',
  'sakuraRed',
  'sakuraPurple',
  'sakuraPeach',
  'sakuraOrange',
  'sakuraGreen',
  'sakuraBlue'
]

const flowers = (score) => {
  let completeFlowers = Math.floor(score / 5);
  let allFlowerTypesNum = Math.floor(completeFlowers / flowerNames.length - 1);
  let remainingCompleteFlowers = completeFlowers % (flowerNames.length - 1);
  const remainder = score % (5);
  const flowers = []

  for (let i = 0; i < allFlowerTypesNum; i++) {
    for (let j = 0; j < flowerNames.length; j++) {
      flowers.push({
        name: flowerNames[j],
        routeNum: 5,
      })
    }
  }
  for (let i = 0; i < remainingCompleteFlowers; i++) {
    flowers.push({
      name: flowerNames[i],
      routeNum: 5,
    })
  }

  flowers.push({
    name: flowerNames[remainingCompleteFlowers % flowerNames.length],
    routeNum: remainder,
  })
  return flowers
}
export default flowers;
