import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as MediaLibrary from 'expo-media-library'; // Import MediaLibrary
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function App() {
  const navigation = useNavigation(); // Get navigation object
  const { facing, setFacing } = useState < CameraType > "back";
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // Create a ref for the camera
  const [base64Image, setBase64Image] = useState(null);
  // const [cameraRef, setCameraRef] = useState(null);

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

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const takePicture = async () => {
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
      navigation.navigate("Generate", { photo: base64});
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
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
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
