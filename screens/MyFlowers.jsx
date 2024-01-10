import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useMemo, useRef, useState } from "react"
import { View, Text, StyleSheet, Image, Animated, PanResponder, ActivityIndicator } from "react-native"
import flowers from "../logic/setFlowers"
import { flowerImages } from "../assets/images"

const usePanHandlers = (displayFlowers) => {
  const panValues = displayFlowers.map(() => new Animated.ValueXY());

  const handlePanResponderMove = (index, _, gestureState) => {
    console.log('PanResponderMove', index, gestureState.dx, gestureState.dy);
    panValues[index].setValue({ x: gestureState.dx, y: gestureState.dy });
  };

  const getPanResponder = (index) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: handlePanResponderMove.bind(null, index),
      onPanResponderRelease: (_, gestureState) => {
        console.log('Release');
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

const MyFlowers = ({myFlowers}) => {
  console.log('my flowers: ' ,myFlowers)
  const [loading, setLoading] = useState(true);
  const { panValues, panResponders } = usePanHandlers(myFlowers);

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
        {myFlowers.map((flower, index) => (
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
  },

})

export default MyFlowers
