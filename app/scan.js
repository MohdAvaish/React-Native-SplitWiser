import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
// --- YEH HAI ASLI FIX ---
// Humein FileSystem aur EncodingType dono ko alag se import karna hai
import { EncodingType, readAsStringAsync } from 'expo-file-system';

const API_KEY = Constants.expoConfig.extra.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImage(photo.uri);
      } catch (e) {
        Alert.alert("Error", "Failed to capture image.");
      }
    }
  };

  const handleUsePhoto = async () => {
    setLoading(true);
    try {
      // --- YEH BHI FIX HAI ---
      // Ab hum 'readAsStringAsync' ko seedha istemaal kar sakte hain
      const base64 = await readAsStringAsync(image, {
        encoding: EncodingType.Base64,
      });

      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
      const prompt = "You are a smart bill reader. Read this receipt image and extract only the list of items and their prices. Return the result *only* as a JSON array, like this: [{\"item\": \"Item Name\", \"price\": 120}, {\"item\": \"Another Item\", \"price\": 50}]. Do not add any other text before or after the JSON array.";

      const imagePart = {
        inlineData: {
          data: base64,
          mimeType: "image/jpeg",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      console.log("AI Response:", text);
      Alert.alert("AI Result (Check Console)", text);

    } catch (e) {
      console.error("AI Error:", e);
      Alert.alert("AI Error", "Failed to process the image.");
    } finally {
      setLoading(false);
      setImage(null);
      router.back();
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Scan Bill</Text>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.placeholderText}>Camera permission is required.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Processing Bill...</Text>
        <ActivityIndicator size="large" color="#0052CC" />
      </SafeAreaView>
    );
  }

  if (image) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Is this correct?</Text>
        <View style={styles.cameraContainer}>
          <Image source={{ uri: image }} style={styles.camera} />
        </View>

        <Pressable onPress={handleUsePhoto} style={styles.useButton}>
          <Text style={styles.backButtonText}>Use this Photo</Text>
        </Pressable>
        <Pressable onPress={() => setImage(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Retake</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scan Bill</Text>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.captureButtonContainer}>
            <Pressable style={styles.captureButton} onPress={takePicture} />
          </View>
        </CameraView>
      </View>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </Pressable>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#ddd',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#DC3545',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  captureButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderWidth: 5,
    borderColor: '#0052CC',
  },
  useButton: {
    backgroundColor: '#28A745',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
});