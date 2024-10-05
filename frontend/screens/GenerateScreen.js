import React, { useState } from "react";
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
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/dev";
import {generateStory} from '../api/VisionApi';

const GenerateScreen = ({ route, navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  const { photo } = route.params;

  const [text, setText] = useState("");


  

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

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setText(generateStory(photo, false))}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>

      {/* Back to Home Button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.backBtnText}>Return Home</Text>
      </TouchableOpacity>

      
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
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#3FA7D6",
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
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
    lineHeight: 56,
  },
  backBtn: {
    position: "absolute",
    bottom: 35, // Adjust this value if needed
    left: 30,
    backgroundColor: "#3FA7D6",
    borderRadius: 10,
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
  backBtnText: {
    fontSize: 16,
    color: "#080C0C",
    fontFamily: "Roboto_700Bold",
    textAlign: "center",
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
});

export default GenerateScreen;
