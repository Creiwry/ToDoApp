import * as React from 'react';
import { FLOWER1, FLOWER2, FLOWER3, FLOWER4, FLOWER5, FLOWER6, FLOWER7, FLOWER8, FLOWERCENTER, flowerImages } from '../assets/images';
import { useState, useEffect } from 'react';
import { useFonts, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import flowers from '../logic/setFlowers';

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
      const updatedTasks = [task, ...tasks];
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
      setFlowerPaths(flowers(score))
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
          setFlowerPaths(flowers(newScore))
          return newScore
        })
      } else {
        updatedTasks[index].done = !updatedTasks[index].done
        setScore((prevScore) => {
          const newScore = prevScore - 1
          setFlowerPaths(flowers(newScore))
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
      <ScrollView horizontal={true} style={styles.imageContainer}>
        {flowerPaths.slice(0).reverse().map((flower, index) => (
            <Image key={index} source={flowerImages[flower.name][flower.routeNum]} style={styles.image}/>
        ))}
      </ScrollView>
          <ScrollView style={styles.tasksView}>
            <Text style={styles.taskHeading}>
            Tasks:
            </Text>
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
          </ScrollView>
        </View>
        <TextInput 
          value={task.text}
          onChangeText={(text) => setTask({text: text, done: false})}
          onSubmitEditing={saveTask}
          style={styles.textInput}
          placeholder='Type here to add task!'>
        </TextInput>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#a9e190",
    padding: 10,
    flexDirection: 'column',
  },
    imageContainer: {
    flexGrow: 1,
    maxHeight: 85,
    flexDirection: 'row',
    marginHorizontal: 10,
    overflow: 'scroll',
  },
    image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  tasksView: {
    flexGrow: 15,
    marginLeft: 10,
  },
  taskHeading: {
    fontSize: 30,
    fontFamily: "Montserrat_800ExtraBold",
  },
  textInput: {
    backgroundColor: "#a9e190",
    fontSize: 20,
    height: 70,
    borderWidth: 2,
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
    width: 20,
    height: 20,
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
    fontSize: 20,
    textAlign: 'center',
    flex: 9,
  },
  normalTask: {
    fontSize: 20,
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
    backgroundColor: "#8C86AA",
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
