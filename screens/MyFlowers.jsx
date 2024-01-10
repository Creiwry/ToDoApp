import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useMemo, useRef, useState } from "react"
import { View, Text, StyleSheet, Image, Animated, PanResponder, ActivityIndicator } from "react-native"
import flowers from "../logic/setFlowers"
import { flowerImages } from "../assets/images"

const usePanHandlers = (displayFlowers) => {
  const panValues = displayFlowers.map(() => new Animated.ValueXY());

  const getPanResponder = (index) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        Animated.event([null, { dx: panValues[index].x, dy: panValues[index].y }], {
          useNativeDriver: false,
        })(_, gestureState);
      },
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(panValues[index], {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    });

  const panResponders = useMemo(() => displayFlowers.map((_, index) => getPanResponder(index)), [
    displayFlowers,
  ]);

  return { panValues, panResponders };
};

const MyFlowers = () => {
  const [displayFlowers, setDisplayFlowers] = useState([])
  const [loading, setLoading] = useState(true);
  const { panValues, panResponders } = usePanHandlers(displayFlowers);

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
    } finally {
      setLoading(false);
      console.log('finished loading')

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
  },[setLoading]);

  if(loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" />
    )
  }


  return(
    <View style={styles.screen}>
      <Text style={styles.flowersHeading}>
        This month:
      </Text>
      <View style={styles.flowersContainer}>
        {console.log("loading: ", loading)}
        {console.log(panValues)}
        {displayFlowers.map((flower, index) => (
          <Animated.View
            key={index}
          style={{
              transform: [{translateX: panValues[index].x}, {translateY: panValues[index].y}]
            }}
            {...panResponders[index].panHandlers}
          >
            <Image source={flowerImages[flower.name][5]} style={styles.image} />
          </Animated.View>
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
