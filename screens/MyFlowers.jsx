import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import flowers from "../logic/setFlowers"
import { flowerImages } from "../assets/images"

const MyFlowers = () => {
  const [displayFlowers, setDisplayFlowers] = useState([])
  const [flower, setFlower] = useState({date: '', color: ''})
  const [oldScores, setOldScores] = useState([])

  const loadData = async () => {
    try {
      let storedScores = await AsyncStorage.getItem('pastScores')
      storedScores = JSON.parse(storedScores)
      console.log(storedScores)
      let incomingFlowers = []
      storedScores.map((score) => {
        let flowersToAdd = flowers(score.score)
        flowersToAdd.forEach((flower)=>{
          if(flower.routeNum === 5) {
            incomingFlowers.push(flower)
          }
        })
      })
      setDisplayFlowers(incomingFlowers)
    } catch (error) {
      console.error('Error fetching tasks: ', error)
    }
  };

  const mockScores = [
    { score: 10, date: '1/3/2024' },
    { score: 7, date: '1/4/2024' },
    { score: 20, date: '1/5/2024' },
  ];

  const mockAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem('pastScores', JSON.stringify(mockScores));
      console.log('Mock data stored successfully');
    } catch (error) {
      console.error('Error storing mock data: ', error);
    }
  };

  useEffect(()=>{
    mockAsyncStorage();
    loadData();
  },[]);


  return(
    <View style={styles.screen}>
      <Text style={styles.flowersHeading}>
        This month:
      </Text>
      <View style={styles.flowersContainer}>
        {displayFlowers.map((flower, index) => (
        <Image key={index} source={flowerImages[flower.name][5]} style={styles.image} />

        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#a9e190",
    padding: 30,
  },
  flowersHeading: {
    fontSize: 30,
    fontFamily: "Montserrat_800ExtraBold",
  },
  flowersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
    image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },

})

export default MyFlowers
