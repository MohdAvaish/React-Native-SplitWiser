import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created! Please login.');
      setIsLogin(true);
    } catch (error) {
      console.error(error);
      Alert.alert('Sign Up Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill both fields.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      Alert.alert('Sign In Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <>
          <Pressable 
            style={styles.button} 
            onPress={isLogin ? handleSignIn : handleSignUp}
          >
            <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
          </Pressable>
          
          <Pressable 
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 55,
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0052CC',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  toggleButton: {
    marginTop: 25,
    alignItems: 'center',
  },
  toggleText: {
    color: '#0052CC',
    fontSize: 16,
    fontWeight: '600',
  },
});