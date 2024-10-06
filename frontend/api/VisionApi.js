export const generateStory = async (
  base64Image,
  endStory,
  prevStories = ""
) => {
  try {
    console.log("Sending request with data:", {
      endStory,
      prevStories: prevStories.substring(0, 100),
    });

    const response = await fetch(
      "https://1528-128-227-1-15.ngrok-free.app/generate",
      {
        method: "POST",
        body: JSON.stringify({
          image: base64Image,
          previous_stories: prevStories,
          end_story: endStory,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const data = await response.json();
    console.log("Response data:", data);
    return data;
  } catch (err) {
    console.error("Error in generateStory:", err);
    throw err;
  }
};
