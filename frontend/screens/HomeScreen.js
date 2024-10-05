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
      {/* Move the "Story Snaps" text above the button */}
      <Text style={styles.headerText}>Story Snaps</Text>

      {/* Center the Button and move it higher on the screen */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Story")}
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
    justifyContent: "center", // Center the content vertically
    backgroundColor: "#F0E6EF",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Roboto_700Bold",
    color: "#080C0C",
    position: "absolute",
    top: "45%", // Move the text higher than the button
  },
  addBtn: {
    position: "absolute",
    top: "60%", // Adjust this value to position the button lower than the text
    alignSelf: "center", // Center horizontally
    justifyContent: "center", // Center the text inside the button
    alignItems: "center", // Center the text inside the button
    backgroundColor: "#3FA7D6",
    padding: 8,
    borderRadius: 20,

    // iOS Shadow Properties
    shadowColor: "#080C0C",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    // Android Shadow (Elevation)
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
  addBtnText: {
    fontSize: 25,
    color: "#080C0C",
    fontFamily: "Roboto_700Bold",
  },
});

export default HomeScreen;
