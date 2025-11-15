import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../firebaseConfig';

function useAuth() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsReady(true);
    });
    return () => unsubscribe();
  }, []);

  return { user, isReady };
}

export default function RootLayout() {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const isAuthScreen = segments[0] === 'login';

    if (!user && !isAuthScreen) {
      router.replace('/login');
    } else if (user && isAuthScreen) {
      router.replace('/');
    }
  }, [isReady, user, segments, router]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="scan" />
    </Stack>
  );
}