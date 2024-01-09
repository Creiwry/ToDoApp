import * as React from 'react';
import { FLOWER1, FLOWER2, FLOWER3, FLOWER4, FLOWER5, FLOWER6, FLOWER7, FLOWER8, FLOWERCENTER } from '../assets/images';
import { useState, useEffect } from 'react';
import { useFonts, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView } from 'react-native';

const flowerImages = [
  FLOWERCENTER,
  FLOWER1,
  FLOWER2,
  FLOWER3,
  FLOWER4,
  FLOWER5,
  FLOWER6,
  FLOWER7,
  FLOWER8,
];

const ToDoList = () => {
  const [task, setTask] = useState({text: '', done: false});
  const [tasks, setTasks] = useState([]);
  const [lastDate, setLastdate] = useState(null);
  const [score, setScore] = useState(0);
  const [flowerPaths, setFlowerPaths] = useState([]);

  let [fontsLoaded] = useFonts({
    Montserrat_800ExtraBold,
  });

  const saveTask = async () => {
    try {
      const updatedTasks = [...tasks, task];
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setTask({text: '', done: false});
    } catch (error) {
      console.error('Error saving task: ', error)
    }
  };

  const saveOldData = async (oldScore, oldDate) => {
    try {
      const pastScores = await AsyncStorage.getItem('pastScores')
      let newPastScores =[]
      if (pastScores){
        newPastScores = [...JSON.parse(pastScores), {date: oldDate, score: oldScore}]
      } else {
        newPastScores = [{date: oldDate, score: oldScore}]
      }
      await AsyncStorage.setItem('pastScores', JSON.stringify(newPastScores))
      await AsyncStorage.setItem('score', '0')
      const currentDate = new Date().toLocaleDateString();
      await AsyncStorage.setItem('date', currentDate)
    } catch (error) {
      console.error(error)
    }
  }

  const flowerPathLogic = (score) => {
    const completeFlowers = Math.floor(score / 8);
    const remainder = score % (flowerImages.length - 1);

    let flowerRoutes = [];

    for (let i = 0; i < completeFlowers; i++) {
      flowerRoutes.push(8);
    }

    if (remainder !== 0) {
      flowerRoutes.push(remainder);
    }

    if (flowerRoutes.length === 0) {
      return [0];
    }
    console.log(flowerRoutes)
    return flowerRoutes;
  }

  const loadData = async () => {
    try {
      let storedDate = await AsyncStorage.getItem('date')
      const currentDate = new Date().toLocaleDateString();

      if (currentDate !== storedDate) {
        saveOldData(storedScore, storedDate)
      }

      const storedScore = await AsyncStorage.getItem('score')
      storedDate = await AsyncStorage.getItem('date')

      if (storedScore && storedDate) {
        setScore(parseInt(storedScore, 10));
        setLastdate(storedDate);
      }

      const fetchedTasks = await AsyncStorage.getItem('tasks');

      if (fetchedTasks) {
        setTasks(JSON.parse(fetchedTasks));
      }
    } catch (error) {
      console.error('Error fetching tasks: ', error)
    }
  };

  useEffect(() => {
    const loadFonts = async () => {
      await AsyncStorage.setItem('score', score.toString());
      await loadData();
      setFlowerPaths(flowerPathLogic(score))
    }
    loadFonts();
  }, []);

  if(!fontsLoaded) {
    return null;
  }

  const handleClear = async () => {
    try {
      const updatedTasks = []
      tasks.forEach((task) => {
        if (!task.done) {
          updatedTasks.push(task)
        }
      })
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks)
    } catch (error) {
      console.error("failed to update: ", error)
    }
  }

  const toggleDone = async (index) => {
    try {
      const updatedTasks = [...tasks]
      if (!updatedTasks[index].done){
        updatedTasks[index].done = !updatedTasks[index].done
        setScore((prevScore) => {
          const newScore = prevScore + 1
          setFlowerPaths(flowerPathLogic(newScore))
          return newScore
        })
      } else {
        updatedTasks[index].done = !updatedTasks[index].done
        setScore((prevScore) => {
          const newScore = prevScore - 1
          setFlowerPaths(flowerPathLogic(newScore))
          return newScore
        })
      }
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error("failed to update: ", error )
    }
  };

  return(
    <View 
      style={styles.screen}
    >
      <View style={{flex: 1}}>
        <Pressable 
          style={styles.button}
          onPress={handleClear}>
          <Text
          style={styles.buttonText}>
            Clear Tasks
          </Text>
          </Pressable>
        {/* <Pressable  */}
        {/*   style={styles.button} */}
        {/*   onPress={()=>setScore(0)}> */}
        {/*   <Text */}
        {/*   style={styles.buttonText}> */}
        {/*     Clear Score  */}
        {/*   </Text> */}
        {/*   </Pressable> */}
      </View>
    <View style={{flex: 5}}>
      <View style={styles.imageContainer}>
        {flowerPaths.map((number, index) => (
            <Image key={index} source={flowerImages[number]} style={styles.image}/>
        ))}
      </View>
      {tasks.map((t, index) => (
        <View key={index} style={styles.taskContainer}>
          <TouchableOpacity
            key={index}
            style={styles.checkboxContainer}
            onPress={() => toggleDone(index)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: t.done ? '#54428e' : 'white',
                  borderColor: t.done ? '#54428e' : 'black',
                },
              ]}
            >
              {task.done && (
                <Text style={styles.checkIcon}>{'\u2713'}</Text>
              )}
            </View>
          </TouchableOpacity>
          <Text style={t.done ? styles.completedTask : styles.normalTask}>{t.text}</Text>
        </View>
      ))}
        </View>
        <TextInput 
          value={task.text}
          onChangeText={(text) => setTask({text: text, done: false})}
          onSubmitEditing={saveTask}
          style={styles.textInput}
          placeholderTextColor='white'
          placeholder='Type here to add task!'>
        </TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
    padding: 10,
    flexDirection: 'column',
  },
    imageContainer: {
    flexDirection: 'row',
  },
    image: {
    width: 100,
    height: 100,
    margin: 10,
    resizeMode: 'cover',
  },
  textInput: {
    backgroundColor: "black",
    color: 'white',
    fontSize: 20,
    height: 70,
    borderWidth: 2,
    borderColor: '#54428e',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 'auto',
    marginBottom:10,
  },
  taskContainer: {
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  checkboxContainer: {
    flex: 1,
  },
   checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: 'white',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#54428e',
    fontSize: 30,
    textAlign: 'center',
    flex: 9,
  },
  normalTask: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center',
    flex: 9,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginHorizontal: 8 ,
    borderWidth: 2,
    borderColor: '#c5076c',
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
})
export default ToDoList;
