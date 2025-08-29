import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
// 1. Import the new modular functions from the auth library
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

// 2. Get the auth instance outside of the component
const auth = getAuth();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    // 3. Use the new modular function, passing 'auth' as the first argument
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        console.log(
          'User account created & signed in!',
          userCredentials.user.email,
        );
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'That email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!');
        } else {
          Alert.alert('Error', error.message);
        }
      });
  };

  const handleLogin = (email, password) => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    console.log('Attempting to log in with email:', email);

    // 4. Use the new modular function for signing in as well
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        console.log('Login successful for user:', userCredential.user.uid);
      })
      .catch(error => {
        console.error('Login failed! Error code:', error.code);
        console.error('Error message:', error.message);
        Alert.alert('Login Failed', 'Please check your email and password.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Expense Tracker Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* 5. Fix: Pass the email and password from state to the handler */}
      <Pressable
        style={styles.button}
        onPress={() => handleLogin(email, password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable
        style={[styles.button, styles.buttonOutline]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonOutlineText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333', // Darker text for better readability
  },
  input: {
    borderWidth: 1,
    borderRadius: 8, // Slightly more rounded corners
    borderColor: '#ccc', // Lighter border color
    color: 'black',
    padding: 15, // A bit more padding
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: 'green',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
