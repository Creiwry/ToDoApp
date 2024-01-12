import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Pressable, KeyboardAvoidingView, ScrollView, PanResponder, ActivityIndicator, Keyboard } from 'react-native';
import flowerDisplay from '../logic/setFlowers';
import {flowerImages} from '../assets/images';
import { styles } from '../style';
import Animated, { Easing, useSharedValue, withDecay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

AsyncStorage.removeItem('flower')
const ToDoList = () => {
  const [task, setTask] = useState({text: '', done: false});
  const [tasks, setTasks] = useState([])
  const [flower, setFlower] = useState({color:'sakura', petalNum: 0})
  const [currencyFlowerColor, setCurrencyFlowerColor] = useState('sakuraBlue')
  const [flowerCount, setFlowerCount] = useState(0)
  const [score, setScore] = useState(0);
  const [initialDataLoadComplete, setInitialDataLoadComplete] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scaleDown = useSharedValue(1);


  useEffect(() => {
    const loadFonts = async () => {
      await loadData();
    }
    loadFonts();
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow',
      () => setIsInputFocused(true)
    )
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide',
      () => setIsInputFocused(false)
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, []);

  useEffect(()=>{
    setScore(flower.petalNum)
  },[flower])

  useEffect(() => {
    if(initialDataLoadComplete){
      console.log('updateCurrencyFlowerColor method before animation')
      updateCurrencyFlowerColor()
    }
  }, [currencyFlowerColor])

  const startAnimation = async (updatedFlower) => {
          console.log('animation method')
    return new Promise((resolve) => {

          console.log('currency flower color ', currencyFlowerColor)
      setFlower({color: flower.color, petalNum: 5})
      translateX.value = withSpring(234)
      translateY.value = withSpring(-41, {
      })
      scaleDown.value = withTiming(0.45, {
        duration: 2000,
        easing: Easing.out(Easing.quad),
      })
      setTimeout(() =>{
        translateX.value = 0 
        translateY.value = 0
        scaleDown.value = withTiming(1, {
          duration: 100,
          easing: Easing.inOut(Easing.quad),
          callback: () => {
          }
        })
      }, 2000)
      setTimeout(() => {
        setFlower(updatedFlower)
        resolve()
      }, 1500)
    })
  }

  const updateCurrencyFlowerColor = async () => {
    try {
      await AsyncStorage.setItem('currencyFlowerColor', JSON.stringify(currencyFlowerColor));
    } catch (error) {
      console.log('error: ', error)
    }
  }

  const loadData = async () => {
    try {
      const fetchedTasks = await AsyncStorage.getItem('tasks');
      if (fetchedTasks) {
        setTasks(JSON.parse(fetchedTasks));
      }

      const fetchedFlowerCount = await AsyncStorage.getItem('flowerCount')
      if (fetchedFlowerCount) {
        setFlowerCount(parseInt(fetchedFlowerCount, 10));
      }

      const fetchedFlower = await AsyncStorage.getItem('flower')
      if (fetchedFlower) {
        setFlower(JSON.parse(fetchedFlower))
      }

      const fetchedCurrencyFlowerColor = await AsyncStorage.getItem('currencyFlowerColor');
      if (fetchedCurrencyFlowerColor) {
        setCurrencyFlowerColor(JSON.parse(fetchedCurrencyFlowerColor));
      }
    } catch (error) {
      console.error('Error fetching tasks: ', error)
    } finally {
      setInitialDataLoadComplete(true)
    }
  };

  const panResponder = (task) => {
    let dx = 0;

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        dx = gestureState.dx;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (dx > 65) {
          handleDeleteTask(task);
        }
      },
    });
  };

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

  const handleDeleteTask = async (taskToDelete) => {
    try {
      const updatedTasks = []
      tasks.forEach((task) => {
        if (task!==taskToDelete) {
          updatedTasks.push(task)
        }
      })
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks)
    } catch (error) {
      console.error(error);
    }
  }

  const toggleDone = async (index) => {
    try {
      let updatedTasks = [...tasks]
      let updatedFlowerCount = flowerCount
      let updatedFlower = flower
      if (!updatedTasks[index].done){
        updatedTasks[index].done = !updatedTasks[index].done
        if(score === 4) {
          updatedFlowerCount += 1
          updatedTasks = updatedTasks.filter((task) => {
            if (!task.done) {
              return true 
            } else {
              return false
            }
          })
          setTimeout(() => {
            setCurrencyFlowerColor(flower.color)
          }, 1000)
          updatedFlower = flowerDisplay(flower, 0)
        } else {
          updatedFlower = flowerDisplay(flower, (score + 1))
        }
      } else {
        updatedTasks[index].done = !updatedTasks[index].done
        if (score === 0) {
          updatedFlowerCount -= 1
          updatedFlower = flowerDisplay(flower, 4)
        } else {
          updatedFlower = flowerDisplay(flower, (score - 1))
        }
      }
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      await AsyncStorage.setItem('flower', JSON.stringify(updatedFlower))
      await AsyncStorage.setItem('flowerCount', JSON.stringify(updatedFlowerCount))
      setTasks(updatedTasks);
      if (updatedFlower.petalNum === 0) {
        await startAnimation(updatedFlower).then( result => {
          setFlower(updatedFlower)
          setFlowerCount(updatedFlowerCount)
        })
      } else {
        setFlower(updatedFlower)
        setFlowerCount(updatedFlowerCount)
      }
    } catch (error) {
      console.error("failed to update: ", error )
    }
  };

  return(
    <View 
      style={styles.screen}
    >
      <View style={[styles.topContainer,  isInputFocused ? {display: 'none'} : {display: 'flex'}]}>
        <Animated.View style={
          [
            styles.imageContainer,
            {
              transform: [{translateX: translateX}],
            }
          ]}>
          <Animated.View style={{transform: [{translateY: translateY}]}}>
          <Animated.View style={{transform: [{scale: scaleDown}]}}>
            <Image source={flowerImages[flower.color][flower.petalNum]} style={[styles.image]}/>
            </Animated.View>
          </Animated.View>
        </Animated.View>
        <View style={styles.currencyAndButtonContainer}>
          <View style={styles.flowerCountContainer}>
            <Text style={styles.currencyText}>
              {flowerCount}
            </Text>
            <Image source={flowerImages[currencyFlowerColor][5]} style={styles.currencyImage}/>
          </View>
          <Pressable 
            style={styles.button}
            onPress={handleClear}>
            <Text
            style={styles.buttonText}>
              Clear
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={{flex: 7}}>
        <ScrollView style={styles.tasksView}>
          {tasks.map((t, index) => (
            <View {...panResponder(t).panHandlers} key={index} style={styles.taskContainer}>
              <TouchableOpacity
                key={index}
                style={styles.checkboxContainer}
                onPress={() => toggleDone(index)}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      backgroundColor: t.done ? '#54428e' : '#a9e190',
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

export default ToDoList;
