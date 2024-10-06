import * as FileSystem from "expo-file-system";
import eventEmitter from '../eventEmitter';

const generateUniqueId = (stories) => {
  const existingIds = new Set(stories.map((story) => parseInt(story.id)));
  let newId = 1;
  while (existingIds.has(newId)) {
    newId++;
  }
  return newId.toString();
};

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
      console.log("No existing stories found or invalid file. Starting fresh.");
    }

    const newId = generateUniqueId(stories);
    const newStory = {
      id: newId,
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

export const setStoryEnding = async (storyId) => {
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

    // Update the isEnding field
    stories[storyIndex].isFinished = true;

    // Save the updated stories
    await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(stories));

    console.log("Story ending set successfully");
    return stories[storyIndex];
  } catch (error) {
    console.error("Error setting story ending:", error);
    throw error;
  } finally {
    eventEmitter.emit('storageUpdated');
  }
};

export const deleteStory = async (storyId) => {
  try {
    // Define the JSON file path
    const jsonUri = `${FileSystem.documentDirectory}stories.json`;

    // Read and parse the current stories
    const jsonString = await FileSystem.readAsStringAsync(jsonUri);
    let stories = JSON.parse(jsonString);

    // Find the index of the story to delete
    const storyIndex = stories.findIndex((story) => story.id === storyId);

    if (storyIndex !== -1) {
      // Remove the story from the list
      stories.splice(storyIndex, 1);

      // Save the updated stories back to the JSON file
      await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(stories));

      console.log("Story deleted successfully");
      return { success: true, message: "Story deleted successfully" };
    } else {
      console.log("Story not found");
      return { success: false, message: "Story not found" };
    }
  } catch (error) {
    console.error("Error deleting story:", error);
    return {
      success: false,
      message: `Error deleting story: ${error.message}`,
    };
  } finally {
    eventEmitter.emit('storageUpdated');
  }
};
