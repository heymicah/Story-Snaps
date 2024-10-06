import * as FileSystem from "expo-file-system";
import eventEmitter from '../eventEmitter';

const saveImage = async (base64Image, filename) => {
  const dirUri = `${FileSystem.documentDirectory}SS_Images/`;
  const fileUri = `${dirUri}${filename}`;

  try {
    // Check if directory exists, create it if it doesn't
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists) {
      console.log("SS_Images directory doesn't exist, creating...");
      await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true });
    }

    // Now write the file
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
  eventEmitter.emit('storageUpdated');
  console.log("All stories and images saved");
};

export const addPageToStory = async (storyId, newPage) => {
  try {
    // Read the current stories
    const jsonUri = `${FileSystem.documentDirectory}stories.json`;
    const jsonString = await FileSystem.readAsStringAsync(jsonUri);
    let stories = JSON.parse(jsonString);

    // Find the story to update
    const storyIndex = stories.findIndex((story) => story.id === storyId);
    if (storyIndex === -1) {
      throw new Error("Story not found");
    }

    // Save the new image
    const imageUri = await saveImage(
      newPage.image,
      `${storyId}_page${stories[storyIndex].pages.length + 1}.jpg`
    );

    // Add the new page to the story
    const updatedPage = {
      text: newPage.text,
      imagePath: imageUri,
    };
    stories[storyIndex].pages.push(updatedPage);

    // Save the updated stories
    await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(stories));

    console.log("Page added successfully");
    return stories[storyIndex];
  } catch (error) {
    console.error("Error adding page to story:", error);
    throw error;
  } finally {
    eventEmitter.emit('storageUpdated');
  }
};

export const updateStoryTitle = async (storyId, newTitle) => {
  try {
    // Read the current stories
    const jsonUri = `${FileSystem.documentDirectory}stories.json`;
    const jsonString = await FileSystem.readAsStringAsync(jsonUri);
    let stories = JSON.parse(jsonString);

    // Find the story to update
    const storyIndex = stories.findIndex((story) => story.id === storyId);
    if (storyIndex === -1) {
      throw new Error("Story not found");
    }

    // Update the title
    stories[storyIndex].title = newTitle;

    // Save the updated stories
    await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(stories));

    console.log("Story title updated successfully");
    return stories[storyIndex];
  } catch (error) {
    console.error("Error updating story title:", error);
    throw error;
  } finally {
    eventEmitter.emit('storageUpdated');
  }
};

export const createNewStory = async () => {
  try {
    const jsonUri = `${FileSystem.documentDirectory}stories.json`;
    let stories = [];

    // Try to read existing stories, if any
    try {
      const jsonString = await FileSystem.readAsStringAsync(jsonUri);
      stories = JSON.parse(jsonString);
    } catch (error) {
      // If file doesn't exist or is invalid, we'll start with an empty array
      console.log("No existing stories found or invalid file. Starting fresh.");
    }

    const newIndex = stories.length + 1; // Use length + 1 to start IDs at 1
    const newStory = {
      id: newIndex.toString(), // Convert to string to match your existing format
      title: "New Story",
      isFinished: false,
      pages: [],
    };

    // Add the new story to the array
    stories.push(newStory);

    // Save the updated stories array
    const updatedJsonString = JSON.stringify(stories);
    await FileSystem.writeAsStringAsync(jsonUri, updatedJsonString);

    console.log("New story created successfully");
    return newStory;
  } catch (error) {
    console.error("Error creating new story:", error);
    throw error;
  } finally {
    eventEmitter.emit('storageUpdated');
  }
};

// export const getAllStories = () => {
//   const stories = [
//     {
//       id: "1",
//       title: "Story 1",
//       isFinished: false,
//       pages: [
//         {
//           text: "Story 1 Page 1 text",
//           imagePath: "../assets/placeholder.jpg",
//         },
//         {
//           text: "Story 2 Page 2 text",
//           imagePath: "../assets/placeholder.jpg",
//         },
//       ],
//     },
//     {
//       id: "2",
//       title: "Story 2",
//       isFinished: false,
//       pages: [
//         {
//           text: "Story 2 Page 1 text",
//           imagePath: "../assets/placeholder.jpg",
//         },
//         {
//           text: "Story 2 Page 2 text",
//           imagePath: "../assets/placeholder.jpg",
//         },
//       ],
//     },
//   ];
//   return stories;
// };

export const getAllStories = async () => {
  try {
    const jsonUri = `${FileSystem.documentDirectory}stories.json`;
    const fileInfo = await FileSystem.getInfoAsync(jsonUri);

    if (!fileInfo.exists) {
      console.log("stories.json does not exist yet");
      return [];
    }

    const jsonString = await FileSystem.readAsStringAsync(jsonUri);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error getting all stories:", error);
    return [];
  }
};
