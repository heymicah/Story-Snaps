import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
  TextInput,
  useWindowDimensions,
} from "react-native";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/dev";
import PagerView from "react-native-pager-view";

const StoryScreen = ({ navigation }) => {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });
  const [title, setTitle] = useState("Untitled");
  const [isEditing, setIsEditing] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const handleTitleSubmit = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
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
        <TouchableOpacity
          onPress={handleEditPress}
          style={styles.editIconContainer}
        >
          <Image
            style={styles.editIcon}
            source={require("../assets/edit-icon.png")}
          />
        </TouchableOpacity>
      </View>

      {/* Add Button in the Bottom-Right Corner */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("Camera")}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>
      <PagerView style={styles.scrollView} initialPage={0}>
        <View style={styles.page} key="1">
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require("../assets/placeholder.jpg")}
            />
          </View>
          <Text style={styles.pageText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
            accusamus quas obcaecati illum minima dolore blanditiis in, amet,
            pariatur eius perspiciatis ipsa exercitationem? Assumenda blanditiis
            rerum dicta tenetur facere eos, quo voluptatum, facilis dolorum
            praesentium, exercitationem incidunt debitis ab omnis atque sunt
            porro commodi voluptatibus sit voluptates tempore maxime! Suscipit
            corrupti, porro cum sit perspiciatis eum tempora facere accusantium
            officiis error. Suscipit, nemo aliquid, recusandae aliquam,
            similique ab tenetur a inventore impedit numquam delectus magni
            excepturi odio necessitatibus asperiores neque nisi! Nesciunt in
            veritatis atque similique temporibus consectetur tempore culpa
            repudiandae aspernatur asperiores, quam reprehenderit natus fugit
            molestiae assumenda adipisci.
          </Text>
        </View>
        <View style={styles.page} key="2">
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require("../assets/placeholder.jpg")}
            />
          </View>
          <Text style={styles.pageText}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
            odit praesentium voluptate vel animi optio voluptatum beatae aliquam
            deleniti? Itaque velit quos non placeat explicabo corporis ad
            laudantium repellat vel, veniam, cupiditate aliquam tempora iure.
            Obcaecati debitis distinctio deleniti eos esse nobis eveniet
            similique harum magnam modi vel sint, officia illum voluptatum
            perferendis. Fugiat blanditiis odit qui nostrum id voluptates nihil
            itaque quod impedit cupiditate. Quos aperiam voluptates id maxime
            corporis modi odio veritatis quaerat? Nostrum similique
            exercitationem asperiores distinctio. Officia ad quo neque suscipit
            excepturi labore recusandae earum ab saepe consequuntur, vitae nulla
            vel perspiciatis velit reiciendis, repudiandae eos nisi non
            provident beatae repellendus totam corrupti. Cupiditate, enim. Quo,
            autem libero aperiam incidunt ab repellat corrupti rem amet nam
            laborum suscipit, officiis sint qui ad velit neque? Ad consectetur
            numquam deleniti repudiandae! Distinctio enim ab illo quidem quam
            voluptatibus repellat, earum soluta possimus corporis veritatis
            pariatur harum similique dolorem eum autem nostrum placeat nisi
            optio accusantium impedit, sequi ipsum architecto cumque. Ex,
            aperiam iure! Quod optio nemo magni iure ab animi veniam autem
            excepturi sit sint, cupiditate tempore. Voluptatum accusamus dolores
            perferendis, voluptates, dicta animi assumenda repellat esse natus
            quibusdam adipisci magni consequuntur sunt suscipit blanditiis sequi
            atque deleniti?
          </Text>
        </View>
      </PagerView>
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
    marginTop: 50,
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
    marginTop: 50,
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
  scrollView: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
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
  },
});

export default StoryScreen;
