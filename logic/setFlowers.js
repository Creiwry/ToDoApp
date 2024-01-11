const flowerNames = [
  'sakura',
  'sakuraRed',
  'sakuraPurple',
  'sakuraPeach',
  'sakuraOrange',
  'sakuraGreen',
  'sakuraBlue'
]

const flowerDisplay = (flower, score) => {
  let currentFlower = {
    color: flower.color,
    petalNum: score,
  }

  if(score === 0) {
    currentFlower.color = flowerNames[(Math.floor(Math.random() * flowerNames.length))]
  }
  
  console.log('return: ', currentFlower)
  return currentFlower
}
export default flowerDisplay;
