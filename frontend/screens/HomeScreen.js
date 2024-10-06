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

  if (loading) {
    return <Text>Loading stories...</Text>;
  }
    const scrollViewMarginTop = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 0], // Start with 100 and reduce to 0
      extrapolate: "clamp",
    });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        decelerationRate="fast" // Add this line to smooth scrolling
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Story Snaps</Text>
          <Image
              style={styles.logo}
              source={require("../assets/logo.png")}
          />
        </View>
        

        {stories.length > 0 ? (
          stories.map((story) => renderStoryPreview(story))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.noStoriesText}>Create a Story to get started!</Text>
          </View>
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
  headerText: {
    fontSize: 40,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
  },
  scrollView: {
    flex: 1,
    marginTop: 50,
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
    backgroundColor: "#EE819E",
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
    backgroundColor: "#FF7847",
    padding: 12,
    borderRadius: 20,
    opacity: 1,
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
  emptyStateContainer: {
    justifyContent: "center",
    // alignItems: "center",
  },
  noStoriesText: {
    position: "absolute",
    marginTop: 300,
    paddingLeft: 90,
  },
  logo: {
    width: 60, // Set to a fixed width
    height: 60, // Set to a fixed height
    resizeMode: "contain",
    marginLeft: 10, // Optional: Add spacing between title and logo
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Centers the items vertically
    justifyContent: "space-between", // Adjust spacing between title and logo
    paddingHorizontal: 10, // Add horizontal padding if needed
    marginBottom: 20, // Space below header
  },
  
});

export default HomeScreen;
