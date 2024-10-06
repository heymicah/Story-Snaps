import React from "react";
import { getAllStories } from "../api/StorageApi";
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
  Baloo2_400Regular,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
} from '@expo-google-fonts/baloo-2';


const { width: screenWidth } = Dimensions.get("window");
const stories = getAllStories();

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
  });

  const renderStoryPreview = (story) => {
    return (
      <TouchableOpacity
        key={story.id}
        style={styles.storyItem}
        onPress={() => navigation.navigate("Story", { storyObj: story })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/placeholder.png")} // Adjust to reference the image in the story object instead of placeholder
            defaultSource={require("../assets/placeholder.png")}
            style={styles.image}
          />
          {/* Rounded container for the text */}
          <View style={styles.textContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Story Snaps</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {stories.map((story) => renderStoryPreview(story))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Story", { storyObj: {} })}
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
    fontFamily: "Baloo2_700Bold",
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
    position: "relative", // Needed for absolute positioning of text
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute", // To overlay the text container on the image
    bottom: 10, // Adjust this value to control vertical placement
    left: 10, // Adjust this value to control horizontal placement
    backgroundColor: "#3FA7D6", // Solid color for the rounded container
    paddingHorizontal: 15, // Add horizontal padding inside the container
    paddingVertical: 5, // Add vertical padding inside the container
    borderRadius: 20, // Rounded corners for the container
  },
  storyTitle: {
    fontSize: 20,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C", // Story # text color
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
    fontFamily: "Baloo2_600SemiBold",
    color: "#080C0C",
  },
});

export default HomeScreen;
