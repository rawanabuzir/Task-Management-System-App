import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TaskDetailsScreen({ route, navigation }) {
  const { taskId, taskTitle, taskContent, taskCompleted } = route.params;

  const [taskNameState, setTaskNameState] = useState(taskTitle);
  const [taskContentState, setTaskContentState] = useState(taskContent);
  const [completedState, setCompletedState] = useState(taskCompleted);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Task ID: ", taskId);
    console.log("Initial Task Name: ", taskTitle);
    console.log("Initial Task Content: ", taskContent);
    console.log("Initial Task Completed: ", taskCompleted);
  }, [taskId, taskTitle, taskContent, taskCompleted]);

  const handleSave = async () => {
    if (!taskNameState || taskNameState.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);

    const updateData = JSON.stringify({
      t_id: taskId,
      t_title: taskNameState,
      t_containt: taskContentState,
      is_active: completedState ? 1 : 0,
      user_id: await AsyncStorage.getItem('@user_id'),
    });

    console.log("Sending update data:", updateData);

    try {
      const response = await fetch(`http://192.168.100.15/tasksApp/update_task.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateData,
      });

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response text:", responseText); // Log the raw response

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        Alert.alert('Error updating task', errorMessage);
        setLoading(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Response data:", data);
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        Alert.alert('Error', 'Failed to parse server response.');
        setLoading(false);
        return;
      }

      if (data.success) {
        Alert.alert('Success', 'Task updated successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Error updating task', data.message || 'Failed to update task.');
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert('Error', 'Failed to update task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? I Hope It IS Done :)',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setLoading(true);
            setError(null);
            try {
              const userId = await AsyncStorage.getItem('@user_id');
              if (!userId) {
                Alert.alert('Error', 'User not logged in.');
                setLoading(false);
                return;
              }

              const response = await fetch(`http://192.168.100.15/tasksApp/delete_task.php?t_id=${taskId}&user_id=${userId}`, {
                method: 'DELETE',
              });

              const responseText = await response.text();
              console.log("Delete Response:", responseText);

              if (!response.ok) {
                let errorMessage = `HTTP request error! status: ${response.status}`;
                try {
                  const errorData = JSON.parse(responseText);
                  errorMessage = errorData.message || errorMessage;
                } catch (e) {
                  console.error("Error parsing delete error response:", e);
                }
                Alert.alert('Error deleting task', errorMessage);
                setLoading(false);
                return;
              }

              let data;
              try {
                data = JSON.parse(responseText);
                console.log("Delete Response Data:", data);
              } catch (e) {
                console.error("Error parsing delete JSON response:", e);
                Alert.alert('Error', 'Failed to parse server response for deletion.');
                setLoading(false);
                return;
              }

              if (data.success) {
                Alert.alert('Success', 'Task deleted successfully!');
                navigation.goBack();
              } else {
                Alert.alert('Error deleting task', data.message || 'Failed to delete task.');
              }
            } catch (error) {
              console.error("Delete Fetch Error:", error);
              Alert.alert('Error', 'Failed to delete task: ' + error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleCompletion = async () => {
    setLoading(true);
    setError(null);
    const newCompletedState = !completedState;

    try {
      const userId = await AsyncStorage.getItem('@user_id');
      if (!userId) {
        Alert.alert('Error', 'User not logged in.');
        setLoading(false);
        return;
      }

      const updateData = JSON.stringify({
        t_id: taskId,
        is_active: newCompletedState ? 1 : 0,
        user_id: userId,
      });

      console.log("Sending completion update data:", updateData);

      const response = await fetch(`http://192.168.100.15/tasksApp/update_task.php`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: updateData,
      });

      const responseText = await response.text();
      console.log("Completion Response:", responseText);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Error parsing completion error response:", e);
        }
        Alert.alert('Error updating task status', errorMessage);
        setLoading(false);
        return;
      }

      let data;
      try {
        data = JSON.parse(responseText);
        console.log("Completion Response Data:", data);
      } catch (e) {
        console.error("Error parsing completion JSON response:", e);
        Alert.alert('Error', 'Failed to parse server response for completion.');
        setLoading(false);
        return;
      }

      if (data.success) {
        setCompletedState(newCompletedState);
        Alert.alert('Success', `Task marked as ${newCompletedState ? 'completed' : 'incomplete'}!`);
      } else {
        Alert.alert('Error updating task status', data.message || 'Failed to update task status.');
      }
    } catch (error) {
      console.error("Completion Fetch Error:", error);
      Alert.alert('Error', 'Failed to update task status: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>

      <TextInput
        style={styles.input}
        value={taskNameState}
        onChangeText={setTaskNameState}
        placeholder="Enter task title"
      />

      <TextInput
        style={styles.input}
        value={taskContentState}
        onChangeText={setTaskContentState}
        placeholder="Enter task content"
        multiline
      />



  <TouchableOpacity style={styles.button} onPress={handleSave}>
    <Text style={styles.buttonText}>Save</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.button} onPress={handleDelete}>
    <Text style={styles.buttonText}>Delete Task</Text>
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
    marginBottom: 40,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#46be9f',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
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
    fontSize: 16,
    color: 'red',
  },
});