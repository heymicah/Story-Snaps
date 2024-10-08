import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Baloo2_400Regular,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
} from "@expo-google-fonts/baloo-2";
import PagerView from "react-native-pager-view";
import { updateStoryTitle, deleteStory } from "../api/StorageApi";
import eventEmitter from "../eventEmitter";

const whimsicalLines = [
  "Once upon a time in a land of dreams...",
  "A curious little rabbit hopped through the meadow...",
  "Stars danced in the sky like twinkling candies...",
  "The wind whispered secrets of enchanted dreams...",
  "Adventures awaited beyond every rainbow's end...",
];

const TypingText = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 5000;

  useEffect(() => {
    const currentLine = whimsicalLines[currentLineIndex];

    if (!isDeleting) {
      if (displayedText.length < currentLine.length) {
        const timer = setTimeout(() => {
          setDisplayedText(currentLine.slice(0, displayedText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        const pauseTimer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(pauseTimer);
      }
    } else {
      if (displayedText.length > 0) {
        const timer = setTimeout(() => {
          setDisplayedText(currentLine.slice(0, displayedText.length - 1));
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        setIsDeleting(false);
        setCurrentLineIndex(
          (prevIndex) => (prevIndex + 1) % whimsicalLines.length
        );
      }
    }
  }, [displayedText, isDeleting, currentLineIndex]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <View style={styles.typingTextContainer}>
      <Text style={styles.pageText}>
        {displayedText}
        {cursorVisible ? "|" : ""}
      </Text>
    </View>
  );
};

const StoryScreen = ({ route, navigation }) => {
  let [fontsLoaded] = useFonts({
    Baloo2_400Regular,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
  });
  const { storyObj } = route.params;
  const isNewStory = !storyObj || storyObj.pages.length === 0;
  const [title, setTitle] = useState(storyObj.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleTitleSubmit = async () => {
    try {
      const updatedStory = await updateStoryTitle(storyObj.id, title);
      eventEmitter.emit("storyUpdated", updatedStory);
    } catch (error) {
      console.error("Error updating story title:", error);
    }
    setIsEditing(false);
  };

  const handleDeletePress = async () => {
    await deleteStory(storyObj.id);
    navigation.navigate("Home");
  };

  const renderStoryView = (page, index) => {
    return (
      <View style={styles.page} key={index + 1}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{ uri: page.imagePath }} // Set base64-encoded image
            defaultSource={require("../assets/placeholder.png")}
          />
        </View>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.pageText}>{page.text}</Text>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={styles.titleWrapper}>
          {isEditing ? (
            <TextInput
              style={styles.titleInput}
              value={title}
              onChangeText={handleTitleChange}
              onSubmitEditing={handleTitleSubmit}
              autoFocus
            />
          ) : (
            <Text style={styles.titleText}>{title}</Text>
          )}
        </View>
        {!isEditing && (
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handleEditPress}
              style={styles.iconButton}
            >
              <Image
                style={styles.icon}
                source={require("../assets/edit-icon.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeletePress}
              style={styles.iconButton}
            >
              <Image
                style={styles.icon}
                source={require("../assets/trash.png")}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!storyObj.isFinished && (
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate("Camera", { storyObj: storyObj })}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Back to Home Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Home")}
      >
        {/* <Text style={styles.backBtnText}>Return Home</Text> */}
        <Image style={styles.home} source={require("../assets/home.png")} />
      </TouchableOpacity>

      {isNewStory ? (
        <View style={styles.emptyStateContainer}>
          <TypingText />
          <Text></Text>
          <Text style={styles.pageText}>
            Press the "+" button to add to your story!
          </Text>
        </View>
      ) : (
        <PagerView style={styles.pagerView} initialPage={0}>
          {storyObj.pages.map((page, index) => renderStoryView(page, index))}
        </PagerView>
      )}
    </View>
  );
};

// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0E6EF",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#99D6AC",
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust this value based on your needs
    paddingBottom: 10,
  },
  titleWrapper: {
    flex: 1,
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
    textAlign: "center",
  },
  titleInput: {
    fontSize: 30,
    fontFamily: "Baloo2_700Bold",
    color: "#080C0C",
    borderBottomWidth: 1,
    borderBottomColor: "#080C0C",
    textAlign: "center",
    minWidth: 200,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  home: {
    width: 42,
    height: 42,
  },
  addBtn: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#FF7847",
    borderRadius: 30,
    width: 60,
    height: 60,
    zIndex: 1,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 50,
    color: "#080C0C",
    fontFamily: "Baloo2_700Bold",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 72,
  },
  backBtn: {
    position: "absolute",
    bottom: 30, // Adjust this value if needed
    left: 26,
    backgroundColor: "#3FA7D6",
    borderRadius: 30,
    padding: 10,
    zIndex: 1,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
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
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    backgroundColor: "#F0E6EF",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 4 / 3, // Adjust this ratio based on your image's aspect ratio
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pageText: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: "Baloo2_400Regular",
    margin: 10,
    color: "#080C0C",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flex: 0.5,
    paddingTop: 200,
  },
  typingTextContainer: {
    height: 100,
  },
});

export default StoryScreen;
