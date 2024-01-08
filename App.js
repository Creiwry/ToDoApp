import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/native-stack';
import { withExpoSnack } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledStatusBar = styled(StatusBar)

const Stack = createStackNavigator();

import Calendar from './screens/Calendar';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Calendar" component={Calendar} />
      <StyledView className="flex-1 h-vh bg-slate-900 content-center">
        <StyledText className="text-white m-auto p-3 click:scale-110 text-center bg-rose-900">ToDo App</StyledText>
        <StyledStatusBar className="bg-slate-800" />
      </StyledView>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default withExpoSnack(App);
