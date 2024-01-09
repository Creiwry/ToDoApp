import { withExpoSnack } from 'nativewind';
import {  Pressable, Text, View } from 'react-native';
import { styled } from 'nativewind';
import { useNavigation } from '@react-navigation/native';

const StyledView = styled(View)

const Navbar = () => {
  const navigation = useNavigation();

  return(
    <StyledView className="sticky bg-stone-900 top-0 flex-row items-center justify-between p-2 px-5 pt-8">
      <Pressable
        onPress={() => navigation.navigate('ToDoList')}
      >
        <Text style={{
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
      }}>
          To Do List
        </Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('MyFlowers')}
      >
        <Text style={{
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
      }}>
          My Flowers
        </Text>
      </Pressable>
    </StyledView>
  )
}

export default withExpoSnack(Navbar);
