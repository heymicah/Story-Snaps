import * as FileSystem from "expo-file-system";

const saveImage = async (base64Image, filename) => {
  const fileUri = `${FileSystem.documentDirectory}SS_Images/${filename}`;
  try {
    await FileSystem.writeAsStringAsync(fileUri, base64Image, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log(`Image saved: ${filename}`);
    return fileUri;
  } catch (error) {
    console.error("Error saving image:", error);
    return null;
  }
};

const saveStoryWithImages = async (story) => {
  // Ensure the Images directory exists
  const imagesDir = `${FileSystem.documentDirectory}SS_Images/`;
  await FileSystem.makeDirectoryAsync(imagesDir, { intermediates: true });

  // Save page images
  const updatedPages = await Promise.all(
    story.pages.map(async (page, index) => {
      const imagePath = await saveImage(
        page.image,
        `${story.id}_page${index + 1}.jpg`
      );
      return { ...page, imagePath };
    })
  );

  // Update story object with file paths instead of base64 data
  const updatedStory = {
    ...story,
    pages: updatedPages,
  };

  return updatedStory;
};

export const saveAllStories = async (stories) => {
  const updatedStories = await Promise.all(stories.map(saveStoryWithImages));

  // Save updated JSON structure
  const jsonString = JSON.stringify(updatedStories);
  const jsonUri = `${FileSystem.documentDirectory}stories.json`;
  await FileSystem.writeAsStringAsync(jsonUri, jsonString);

  console.log("All stories and images saved");
};

export const getAllStories = () => {
  const stories = [
    {
      id: "1",
      title: "Story 1",
      isFinished: false,
      pages: [
        {
          pageNum: 1,
          text: "Story 1 Page 1 text",
          imagePath: "../assets/placeholder.jpg",
        },
        {
          pageNum: 2,
          text: "Story 2 Page 2 text",
          imagePath: "../assets/placeholder.jpg",
        },
      ],
    },
    {
      id: "2",
      title: "Story 2",
      isFinished: false,
      pages: [
        {
          pageNum: 1,
          text: "Story 2 Page 1 text",
          imagePath: "../assets/placeholder.jpg",
        },
        {
          pageNum: 2,
          text: "Story 2 Page 2 text",
          imagePath: "../assets/placeholder.jpg",
        },
      ],
    },
  ];
  return stories;
};
