// just homme screen for now
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/dev";

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          top: "7.5%",
          fontFamily: "Roboto_700Bold",
          color: "#080C0C",
        }}
      >
        Story Snaps
      </Text>

      {/* Add Button in the Bottom-Right Corner */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.addBtnText}>New Story</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F0E6EF",
  },
  addBtn: {
    position: "absolute",
    bottom: "4%", // Distance from the bottom of the screen
    right: "7.5%", // Distance from the right side of the screen
    justifyContent: "center", // Center the "+" inside the button
    alignItems: "center", // Center the "+" inside the button
    backgroundColor: "#3FA7D6",
    padding: 8,
    borderRadius: 20,

    // iOS Shadow Properties
    shadowColor: "#080C0C",
    shadowOffset: { width: 5, height: 5 }, // Add height to the shadow
    shadowOpacity: 0.8,
    shadowRadius: 5, // Controls the blur radius of the shadow

    // Android Shadow (Elevation)
    ...Platform.select({
      android: {
        elevation: 8, // Adds shadow on Android
      },
    }),
  },
  addBtnText: {
    fontSize: 25, // Make "+" larger
    color: "#080C0C",
    fontFamily: "Roboto_700Bold",
  },
});

export default HomeScreen;
