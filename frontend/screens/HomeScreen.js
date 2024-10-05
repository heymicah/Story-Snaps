import React, {useState, useEffect} from "react";
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

  // Whimsical text for no stories
  const whimsicalText = "Once upon a time in a land of dreams...";
  
  // State for typing effect
  const [displayedText, setDisplayedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const typingSpeed = 100; // Typing speed in milliseconds
  const deletionSpeed = 40; // Deletion speed in milliseconds

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < whimsicalText.length) {
        setDisplayedText((prev) => prev + whimsicalText[index]);
        index++;
      } else {
        clearInterval(typingInterval); // Stop the interval when done
      }
    }, typingSpeed);

    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Change cursor visibility every 500ms

    // Cleanup intervals on unmount
    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []); // Run only on mount

    // Deleting effect after 10 seconds
    useEffect(() => {
      const deletionTimeout = setTimeout(() => {
        let index = displayedText.length;
  
        const deletionInterval = setInterval(() => {
          if (index > 0) {
            setDisplayedText((prev) => prev.slice(0, -1));
            index--;
          } else {
            clearInterval(deletionInterval);
            // Restart the typing effect
            setTimeout(() => {
              startTyping();
            }, 500); // Delay before restarting the typing
          }
        }, deletionSpeed);
      }, 10000); // Start deleting after 10 seconds
  
      // Cleanup deletion timeout
      return () => {
        clearTimeout(deletionTimeout);
      };
    }, [displayedText]); // Runs when displayedText changes

    const startTyping = () => {
      let index = 0;
      const typingInterval = setInterval(() => {
        if (index < whimsicalText.length) {
          setDisplayedText((prev) => prev + whimsicalText[index]);
          index++;
        } else {
          clearInterval(typingInterval); // Stop typing when done
        }
      }, typingSpeed);
    };


  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 40,
          top: "7.5%",
          fontFamily: "San Francisco",
          fontWeight: "bold",
          color: "#080C0C",
          letterSpacing: 1,
          // textTransform: "uppercase",
        }}
      >
        Story Snaps
      </Text>
      <Text style={styles.whimsicalText}>
          {displayedText}
          {cursorVisible && <Text style={styles.cursor}>|</Text>}
        </Text>

      {/* Add Button in the Bottom-Right Corner */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Camera")}
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
    backgroundColor: "#F0E6EF",
  },
  addBtn: {
    position: "absolute",
    bottom: "4%", // Distance from the bottom of the screen
    right: "7.5%", // Distance from the right side of the screen
    justifyContent: "center", // Center the "+" inside the button
    alignItems: "center", // Center the "+" inside the button
    backgroundColor: "#3FA7D6",
    padding: 8,
    borderRadius: 20,

    // iOS Shadow Properties
    shadowColor: "#080C0C",
    shadowOffset: { width: 5, height: 5 }, // Add height to the shadow
    shadowOpacity: 0.8,
    shadowRadius: 5, // Controls the blur radius of the shadow

    // Android Shadow (Elevation)
    ...Platform.select({
      android: {
        elevation: 8, // Adds shadow on Android
      },
    }),
  },
  addBtnText: {
    fontSize: 25, // Make "+" larger
    color: "#080C0C",
    fontFamily: "San Francisco",
  },
});

export default HomeScreen;
