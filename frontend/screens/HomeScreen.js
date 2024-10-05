import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/dev";

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Story Snaps</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/placeholder.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.storyTitle}>Title 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/placeholder.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.storyTitle}>Title 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/placeholder.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.storyTitle}>Title 3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.storyItem}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../assets/placeholder.jpg")}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.storyTitle}>Title 4</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: "#F0E6EF",
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#3FA7D6",
    paddingTop: 50, // Adjust this value based on your device's status bar height
    paddingBottom: 15,
    alignItems: "center",
  },
  headerText: {
    fontSize: 40,
    color: "#080C0C",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  storyItem: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#59CD90",
    borderRadius: 10,
    shadowColor: "#080C0C",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
  imageContainer: {
    width: screenWidth - 40,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  storyTitle: {
    fontSize: 25,
    fontFamily: "Roboto_400Regular",
    color: "#080C0C",
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3FA7D6",
    padding: 12,
    borderRadius: 20,
    opacity: 0.8,
    shadowColor: "#080C0C",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    ...Platform.select({
      android: {
        elevation: 8,
      },
    }),
  },
  addBtnText: {
    fontSize: 18,
    color: "#080C0C",
  },
});

export default HomeScreen;
