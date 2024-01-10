import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { withExpoSnack } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

import Navbar from './components/Navbar';
import ToDoList from './screens/ToDoList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import flowers from './logic/setFlowers';

const App = () => {
  const [displayFlowers, setDisplayFlowers] = React.useState([])
  const [loading, setLoading] = React.useState(true);

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
      console.log(displayFlowers)
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

  React.useEffect(()=>{
    mockAsyncStorage();
    loadData();
  },[setLoading]);

  return (
    <NavigationContainer>
      <Navbar />
      <Stack.Navigator 
        initialRouteName='ToDoList'
        screenOptions={{
            headerShown: false
          }}
      >
        <Stack.Screen name="ToDoList" component={ToDoList} />
        {/* <Stack.Screen name="MyFlowers" component={MyFlowers} myFlowers={displayFlowers} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withExpoSnack(App);
