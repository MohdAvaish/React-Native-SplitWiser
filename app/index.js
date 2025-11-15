import { Link, useRouter } from 'expo-router'; // Link ko import kiya
import { signOut } from 'firebase/auth';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebaseConfig';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>No groups found. Add a new bill to get started!</Text>

      {/* --- YEH NAYA BUTTON HAI --- */}
      <Link href="/scan" asChild>
        <Pressable style={styles.scanButton}>
          <Text style={styles.scanButtonText}>Scan New Bill</Text>
        </Pressable>
      </Link>
      {/* --------------------------- */}

    </SafeAreaView>
  );
}

// --- STYLES BHI UPDATE KIYE HAIN ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 100,
  },
  scanButton: {
    backgroundColor: '#0052CC',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute', // Button ko neeche fix kiya
    bottom: 40,
    left: 20,
    right: 20,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});