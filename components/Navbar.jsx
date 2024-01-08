import { withExpoSnack } from 'nativewind';
import {  Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)

const Navbar = () => {

  return(
    <StyledView className="sticky bg-stone-900 top-0 items-center justify-between p-2 px-5 pt-8">
        <Text style={{
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
      }}>
          To Do List
        </Text>
    </StyledView>
  )
}

export default withExpoSnack(Navbar);
