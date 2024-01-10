import { atomWithStorage } from 'jotai/utils'

// const appData = atomWithStorage({
//   tasks: [],
//   score: 0,
//   flowerCount: 0,
//   flowerCurrencyColor: 'sakura', 
//   currentFlower: {
//     color: 'sakura',
//     petalNum: 0
//   }
// })

const tasks = atomWithStorage([])
const score = atomWithStorage(0)
const flowerCount = atomWithStorage(0)
const flowerCurrencyColor = atomWithStorage('sakura')
const currentFlower = {
  color: 'sakura',
  petalNum: 0,
}
export default { tasks, score, flowerCount, flowerCurrencyColor, currentFlower} 
