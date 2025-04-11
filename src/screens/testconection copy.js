import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('@user_id');
      if (!userId) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }
      const response = await fetch(`http://192.168.100.15/tasksApp/get_tasks.php?user_id=${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks.map(task => ({ ...task, checked: task.is_completed === 1 })));
      } else {
        setError(data.message || 'Failed to fetch tasks.');
      }
    } catch (e) {
      setError('Error fetching tasks: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxToggle = (taskId) => {
    setTasks(tasks.map(task =>
      task.t_id === taskId ? { ...task, checked: !task.checked } : task
    ));
  };

  const addNewTask = async () => {
    if (newTask.trim() === '' || newContent.trim() === '') {
      Alert.alert('Error', 'Task title and content cannot be empty');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('@user_id');
      if (!userId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      const response = await fetch('http://192.168.100.15/tasksApp/add_task.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_title: newTask,
          t_content: newContent,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error adding task', errorData.message || `HTTP error! status: ${response.status}`);
        return;
      }

      const data = await response.json();
      if (data.success) {
        setNewTask('');
        setNewContent('');
        fetchTasks();
        Alert.alert('Success', 'Task added successfully!');
      } else {
        Alert.alert('Error adding task', data.message || 'Failed to add task.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add task: ' + error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task List</Text>

      {loading ? (
        <Text style={styles.loading}>Loading tasks...</Text>
      ) : error ? (
        <Text style={styles.error}>🌸 Hello Add a Task✏️📄</Text>

      ) : tasks.length === 0 ? (
        <Text style={styles.noTasks}>No tasks yet</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.t_id ? item.t_id.toString() : Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
               <CheckBox
                checked={item.checked}
                onPress={() => handleCheckboxToggle(item.t_id, !item.checked)} // تغيير الحالة عند الضغط
                containerStyle={styles.checkboxContainer}
                checkedColor="#46be9f" 
                uncheckedColor="#46be9f" 
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('TaskDetails', {
                  taskId: item.t_id,
                  taskTitle: item.t_title,
                  taskContent: item.t_containt,
                  taskCompleted: item.is_completed,
                  updateTaskList: (updatedTask) => {
                    setTasks(tasks.map(task => task.t_id === updatedTask.t_id ? updatedTask : task));
                  }
                })}
                style={styles.taskButton}
              >
                <Text
                  style={[
                    styles.taskTitle,
                    item.checked && styles.taskTitleCompleted,
                  ]}
                >
                  {item.t_title}
                </Text>
                <Text
                  style={[
                    styles.taskSubtitle,
                    item.checked && styles.taskSubtitleCompleted, // تطبيق نمط إضافي للمحتوى
                  ]}
                >
                  {item.t_containt}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

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
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    marginRight: 10,
  },
  taskButton: {
    flex: 1,
    paddingVertical: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: 'black', // اللون الأصلي للنص
  },
  taskTitleCompleted: {
    color: '#black', // لون النص عند تحديد Checkbox
    textDecorationLine: 'line-through', // إضافة خط يتوسط النص (اختياري)
    textDecorationStyle: 'solid',
  },
  taskSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  taskSubtitleCompleted: {
    color: 'bbb', // لون النص عند تحديد Checkbox  
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 20,
    color: 'black',
  },
  noTasks: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#555',
  },
});