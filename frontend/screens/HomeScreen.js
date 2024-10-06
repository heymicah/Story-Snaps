import React, { useRef } from "react";
import { getAllStories } from "../api/StorageApi";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Image,
  Dimensions,
  ScrollView,
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

  const scrollY = useRef(new Animated.Value(0)).current;

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
          <View style={styles.textContainer}>
            <Text style={styles.storyTitle}>{story.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

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
      <AnimatedScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic" // Automatically adjust the insets
      >
        {stories.map((story) => renderStoryPreview(story))}
      </AnimatedScrollView>
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
    backgroundColor: "rgba(63, 167, 214, 0.9)", // Use a semi-transparent background
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: "center",
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
  },
  scrollView: {
    flex: 1,
    marginTop: 100, // Adjust margin to make room for the header
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
