import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      showToast('INVALID EMAIL');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    fetch('http://192.168.100.15/tasksApp/login.php', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
    .then(async data => {
      setLoading(false);
      if (data.success) {

        await AsyncStorage.setItem('@user_id', data.user.id.toString());
        await AsyncStorage.setItem('@user_email', data.user.email);

        navigation.navigate('HomeScreen', { user: data.user }); 
      } else {
        showToast('Failed to login: ' + data.message); 
      }
    })
    .catch(err => {
      setLoading(false);
      showToast('Server connection error: ' + err.message);  
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://d12y7sg0iam4lc.cloudfront.net/s/img/marketing/top-task-management/task-management-software.png' }}
        style={styles.image}
      />
      <Text style={styles.title}>Task Management Software</Text>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.inputField}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

  
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.inputField}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#46be9f" style={{ marginTop: 10 }} />}

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signupText}>Don't have an account? Create one</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    marginTop: 50, 
    backgroundColor: '#f9f9f9', 
    flex: 1 
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    marginBottom: 15,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#46be9f',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    color: '#46be9f',
    textAlign: 'start',
    paddingHorizontal: 15,
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 14,
  },
});
