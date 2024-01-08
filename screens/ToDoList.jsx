import * as React from 'react';
import { useState, useEffect } from 'react';
import { useFonts, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Pressable } from 'react-native';


const ToDoList = () => {
  const [task, setTask] = React.useState({text: '', done: false});
  const [tasks, setTasks] = useState([]);

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

  const fetchTasks = async () => {
    try {
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
      await fetchTasks();
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
      updatedTasks[index].done = !updatedTasks[index].done
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
        <View
          style={styles.headingContainer}
        >
          <Text
            style={styles.headingText}
          >
              I need to...
          </Text>
        </View>
        <View 
      style={{
          flex: 4,
        }}>
        <Pressable 
          style={styles.button}
          onPress={handleClear}>
          <Text
          style={styles.buttonText}>
            Clear Completed Tasks
          </Text>
          </Pressable>
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
                  backgroundColor: t.done ? 'green' : 'white',
                  borderColor: t.done ? 'green' : 'black',
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
        <View
          style={{
              flex: 1,
            }}
        >
          <TextInput 
            value={task.text}
            onChangeText={(text) => setTask({text: text, done: false})}
            style={styles.textInput}
            placeholder='Type here to add task!'>
          </TextInput>
        <Pressable 
          style={styles.button}
          onPress={saveTask}>
          <Text
          style={styles.buttonText}>
            Add New Task
          </Text>
          </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#632768",
    padding: 10,
    flexDirection: 'column',
  },
  headingText: {
    color: 'white',
    fontSize: 50,
    fontFamily: 'Montserrat_800ExtraBold',
    paddingHorizontal: 9,
    textDecorationLine: 'underline',
    marginHorizontal: 'auto'
  },
  headingContainer: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginVertical: 8 ,
    backgroundColor: 'black',
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  taskContainer: {
    padding: 15,
    backgroundColor:'#fff',
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
    fontSize: 30,
    flex: 9,
  },
  normalTask: {
    fontSize: 30,
    flex: 9,
  },
  textInput: {
    backgroundColor: "#daa6dd",
    height: 60,
    borderWidth: 4,
    borderColor: '#461c4a',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginHorizontal: 'auto'
  },
})
export default ToDoList;
