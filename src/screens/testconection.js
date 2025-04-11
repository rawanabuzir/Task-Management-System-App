

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Finish React Native project', content: 'Complete the main components and styling.', completed: false },
    { id: '2', title: 'Read a book', content: 'Read chapters 1 to 5 of the book.', completed: true },
    { id: '3', title: 'Go for a walk', content: 'Walk in the park for 30 minutes.', completed: false },
  ]);
  
  const [newTask, setNewTask] = useState('');
  const [newContent, setNewContent] = useState('');

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addNewTask = () => {
    if (newTask.trim() === '' || newContent.trim() === '') {
      Alert.alert('Error', 'Task name and content cannot be empty');
      return;
    }
    const newTaskObject = {
      id: (tasks.length + 1).toString(),
      title: newTask,
      content: newContent,
      completed: false,
    };
    setTasks([...tasks, newTaskObject]);
    setNewTask('');
    setNewContent('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => navigation.navigate('TaskDetails', {
              taskId: item.id,
              taskTitle: item.title,
              taskContent: item.content,
              taskCompleted: item.completed,
              updateTaskList: (updatedTask) => {
                setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
              }
            })}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskContent}>{item.content}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Add a new task title"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TextInput
        style={styles.input}
        placeholder="Add a new task content"
        value={newContent}
        onChangeText={setNewContent}
      />
      <TouchableOpacity style={styles.button} onPress={addNewTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,  
     

  },
  taskItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskContent: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#46be9f',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
