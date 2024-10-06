import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  const navigation = useNavigation(); // Get navigation object
  const { facing, setFacing } = useState < CameraType > "back";
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // Create a ref for the camera
  const [base64Image, setBase64Image] = useState(null);
  async function lockToLandscape() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }
  useEffect(() => {
    lockToLandscape();
    return () => {
      ScreenOrientation.unlockAsync(); // Unlock when component unmounts
    };
  }, []);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    // still need to force picture to be in landscape mode
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync(); // Capture the photo

      // Define the directory and file path
      const directory = `${FileSystem.documentDirectory}photos/`;
      const filePath = `${directory}${Date.now()}.jpg`; // Use current timestamp as filename

      // // Ensure the directory exists
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

      // // Move the photo to the specified directory
      await FileSystem.moveAsync({
        from: photo.uri,
        to: filePath,
      });

      // alert(`Photo saved to ${filePath}`);

      // // Read the image file and encode it as Base64
      const base64 = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setBase64Image(base64);
      // // console.log('Base64 Image:', base64);
      navigation.navigate("Generate", { photo: base64 });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}></Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    right: 30,
    top: "50%",
    transform: [{ translateY: -35 }], // Half of the button height to center it vertically
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.5,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000", // Changed to black for better visibility on white background
  },
});
