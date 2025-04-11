import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const handleSignUp = () => {
    if (!validateEmail(email)) {
      showToast('Invalid Email');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match');
      return;
    }

    setLoading(true);

   
    fetch('http://192.168.100.15/tasksApp/signup.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => res.json()) 
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigation.navigate('Login');
        } else {
          showToast('Sign-up failed: ' + data.message);
        }
      })
      .catch((err) => {
        setLoading(false);
        showToast('Server connection error: ' + err.message);
      });
  };

  return (
    <View style={styles.container}>
   
      <Image
        source={{
          uri: 'https://d12y7sg0iam4lc.cloudfront.net/s/img/marketing/top-task-management/task-management-software.png',
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Sign Up</Text>

    
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.inputField}
        />
      </View>

     
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
          secureTextEntry
          style={styles.inputField}
        />
      </View>

     
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={22} color="#888" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.inputField}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#46be9f" style={{ marginTop: 10 }} />}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signupText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50, backgroundColor: '#f9f9f9', flex: 1 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontWeight: 'bold', color: '#333' },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 20,
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
  icon: { marginRight: 8 },
  inputField: { flex: 1, fontSize: 16 },
  button: {
    backgroundColor: '#46be9f',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupText: { color: '#46be9f', textAlign: 'start', paddingHorizontal: 15, marginTop: 20, fontWeight: 'bold', fontSize: 14 },
});
