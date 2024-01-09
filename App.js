import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { withExpoSnack } from 'nativewind';
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

import Navbar from './components/Navbar';
import ToDoList from './screens/ToDoList';
import MyFlowers from './screens/MyFlowers';

const App = () => {
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
        <Stack.Screen name="MyFlowers" component={MyFlowers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withExpoSnack(App);
