import React, { useState, useEffect } from "react";
import { getAllStories, createNewStory } from "../api/StorageApi";
import eventEmitter from '../eventEmitter';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Image,
  Dimensions,
  ScrollView, // Ensure ScrollView is imported
} from "react-native";
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
} from '@expo-google-fonts/baloo-2';

const { width: screenWidth } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
  });

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  
    const storageUpdateListener = () => {
      loadStories();
    };
  
    const storyUpdateListener = (updatedStory) => {
      setStories(prevStories => 
        prevStories.map(story => 
          story.id === updatedStory.id ? updatedStory : story
        )
      );
    };
  
    eventEmitter.on('storageUpdated', storageUpdateListener);
    eventEmitter.on('storyUpdated', storyUpdateListener);
  
    return () => {
      eventEmitter.off('storageUpdated', storageUpdateListener);
      eventEmitter.off('storyUpdated', storyUpdateListener);
    };
  }, []);

  const loadStories = async () => {
    try {
      const loadedStories = await getAllStories();
      setStories(loadedStories);
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewStory = async () => {
    try {
      const newStory = await createNewStory();
      setStories((prevStories) => [...prevStories, newStory]);
      navigation.navigate("Story", { storyObj: newStory });
      loadStories();
    } catch (error) {
      console.error("Error creating new story:", error);
    }
  };

  const renderStoryPreview = (story) => {
    return (
      <TouchableOpacity
        key={story.id}
        style={styles.storyItem}
        onPress={() => navigation.navigate("Story", { storyObj: story })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={
              story.pages.length > 0
                ? { uri: story.pages[0].imagePath }
                : require("../assets/placeholder.png")
            } // adjust to reference the image in the story object instead of placeholder
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

  if (loading) {
    return <Text>Loading stories...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -100], // Adjust the output range as needed
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.headerText}>Story Snaps</Text>
      </Animated.View>
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {stories.length > 0 ? (
          stories.map((story) => renderStoryPreview(story))
        ) : (
          <Text>Create a Story to get started!</Text>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.addBtn} onPress={handleNewStory}>
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
    paddingTop: 40, // Adjust this value based on device's status bar height
    paddingBottom: 0,
    alignItems: "center",
    position: "absolute", // Make it absolute for the header to overlay the scroll
    top: 0, // Align to the top of the screen
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
  },
  scrollView: {
    flex: 1,
    marginTop: 100, // Add margin top to account for the header height
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
    fontFamily: "Baloo2_600SemiBold",
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
    fontFamily: "San Francisco",
  },
});

export default HomeScreen;
