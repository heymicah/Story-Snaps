export const generateStory = async (
  base64Image,
  endStory,
  prevStories = ""
) => {
  try {
    const response = await fetch("http://localhost:5000/generate", {
      method: "POST",
      body: JSON.stringify({
        image: base64Image,
        previous_stories: prevStories,
        end_story: endStory,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => res.json());
    return response;
  } catch (err) {
    console.log(err);
  }
};
