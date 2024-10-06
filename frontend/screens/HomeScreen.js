import React, { useState, useEffect, useRef } from "react"; // Add useRef to the imports
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
  const scrollY = useRef(new Animated.Value(0)).current; // Initialize scrollY here

  useEffect(() => {
    loadStories();

    const storageUpdateListener = () => {
      loadStories();
    };

    const storyUpdateListener = (updatedStory) => {
      setStories((prevStories) =>
        prevStories.map((story) =>
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
            }
            defaultSource={require("../assets/placeholder.png")}
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, -100],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.headerText}>Story Snaps</Text>
      </Animated.View>
      <Animated.ScrollView // Change to Animated.ScrollView
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
      </Animated.ScrollView>
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
    paddingTop: 40,
    paddingBottom: 0,
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
  },
  scrollView: {
    flex: 1,
    marginTop: 100,
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
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "#3FA7D6",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    opacity: 0.95
  },
  storyTitle: {
    fontSize: 20,
    fontFamily: "Baloo2_600SemiBold",
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
    fontFamily: "Baloo2_600SemiBold",
    color: "#080C0C",
  },
});

export default HomeScreen;
