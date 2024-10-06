import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Switch,
  ActivityIndicator
} from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/dev";
import { generateStory } from "../api/VisionApi";
import { addPageToStory, setStoryEnding } from "../api/StorageApi";
import * as ScreenOrientation from "expo-screen-orientation";

const GenerateScreen = ({ route, navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const { photo } = route.params;
  const { storyObj } = route.params;

  const [text, setText] = useState("");
  const [isEnding, setIsEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOnce, setGeneratedOnce] = useState(false);
  const [endedStory, setEndedStory] = useState(false);

  async function lockToLandscape() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }

  const handleGenerateStory = async () => {
    setIsLoading(true);
    let prevStories = "";
    storyObj.pages.forEach((page) => {
      prevStories += "\n" + page.text;
    });
    try {
      const result = await generateStory(photo, isEnding, prevStories);
      if (result && result.story) {
        setText(result.story);
        if (!generatedOnce) setGeneratedOnce(true);
      } else {
        console.error("Unexpected response format:", result);
        setText("Failed to generate story. Please try again.");
      }
    } catch (error) {
      console.error("Error generating story:", error);
      setText(
        "An error occurred while generating the story. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
    setEndedStory(isEnding);
  };

  const handleSavePage = async () => {
    try {
      const newPage = { text: text, image: photo };
      const updatedStoryObj = await addPageToStory(storyObj.id, newPage);
      if (endedStory) {
        setStoryEnding(storyObj.id);
      }
      navigation.navigate("Story", { storyObj: updatedStoryObj });
    } catch (error) {
      console.error("Error saving page:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  };

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#3FA7D6" />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{ uri: `data:image/jpeg;base64,${photo}` }} // Set base64-encoded image
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageText}>{text}</Text>
      </ScrollView>
      <View style={styles.nestedView}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              lockToLandscape();
              navigation.navigate("Camera", { storyObj: storyObj });
            }}
          >
            <Text style={styles.buttonText}>Retake Picture</Text>
          </TouchableOpacity>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>End Story:</Text>
            <Switch
              value={isEnding}
              onValueChange={setIsEnding}
              trackColor={{ false: "#3FA7D6", true: "#E75A7C" }}
              thumbColor="#F0E6EF"
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGenerateStory}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading
                ? "Generating..."
                : generatedOnce
                ? "Regenerate"
                : "Generate"}
            </Text>
          </TouchableOpacity>
          {generatedOnce && (
            <TouchableOpacity
              style={styles.button}
              onPress={handleSavePage} // should also save the story to local storage
            >
              <Text style={styles.buttonText}>Save Story</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {isLoading && <LoadingOverlay />}
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
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#3FA7D6",
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 30,
    fontFamily: "Roboto_700Bold",
    color: "#080C0C",
    textAlign: "center",
    marginTop: "12%",
  },
  titleInput: {
    fontSize: 30,
    fontFamily: "Roboto_700Bold",
    color: "#080C0C",
    borderBottomWidth: 1,
    borderBottomColor: "#080C0C",
    marginTop: 50,
    textAlign: "center",
    minWidth: 200,
  },
  editIconContainer: {
    marginLeft: 10,
    padding: 5,
    marginTop: "12%",
  },
  editIcon: {
    width: 30,
    height: 30,
  },
  addBtn: {
    backgroundColor: "#3FA7D6",
    borderRadius: 15,
    zIndex: 1,
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#080C0C",
    flex: 1,
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
    fontSize: 20,
    color: "#080C0C",
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 56,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9, // Adjust this ratio based on your image's aspect ratio
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
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    margin: 10,
    color: "#080C0C",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  buttonView: {
    display: "flex",
    flexDirection: "row",
  },
  nestedView: {
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#3FA7D6",
    borderRadius: 15,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    shadowColor: "#080C0C",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#080C0C",
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    marginLeft: "7%",
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: "Roboto_400Regular",
    marginRight: 10,
    color: "#080C0C",
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default GenerateScreen;
