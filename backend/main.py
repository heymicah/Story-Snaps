import os
import base64
from io import BytesIO
from flask import Flask, jsonify, request
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    Part
)
from vertexai.vision_models import Image as VertexImage
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
# Set up the Google Application Credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./serviceAccountKey.json"

# Initialize the AI Platform with your project ID and region
project_id = "storysnaps"
region = "us-central1"

# Model ID for Vertex AI
MODEL_ID = "gemini-1.5-flash-002"  # Changed to vision model

# Initialize Vertex AI
vertexai.init(project=project_id, location=region)

previous_stories = ""
end_story = False
prompt = ""

def generate_story_from_media(image_data, previous_stories, end_story):
    """Function to send media data (image) to a Vertex AI model and get predictions."""

    # Initialize the model
    model = GenerativeModel(MODEL_ID)

    # Configure generation parameters
    generation_config = GenerationConfig(
        temperature=0.9,
        top_p=1.0,
        top_k=32,
        candidate_count=1,
        max_output_tokens=2048,
    )
    # Create the prompt
    if(end_story):
        if(previous_stories): # conclude existing story
            prompt = f"""
            You are a creative storyteller for children aged 6-8. Conclude an existing story based on the following information:

            Previous story context: {previous_stories}

            Guidelines:
            - Write 75-125 words that wrap up the story with a satisfying ending.
            - Incorporate elements from the final image into the conclusion.
            - Ensure that you incorporate every important element of the new image into the story.
            - Maintain consistency with existing story elements and characters.
            - Resolve the main conflict or challenge introduced in the story.
            - Use ONLY characters, settings, and objects visible in the image provided and in the previous story context.
            - Do not introduce any elements not present in the image
            - Ensure that all grammar and spelling is correct
            - The story must revolve around these specific elements.
            - Seamlessly incorporate one age-appropriate fact related to math, science, or history into the story's plot or dialogue. The fact should be something that is commonly taught to children.
            - Avoid using any specific measurements or technical details unless they are common knowledge or used for math.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and subtly educational.
            - Avoid inappropriate content, complex language, or scary themes.
            - Ensure that the fact is actually accurate
            - Provide a clear ending that ties up any loose ends


            Now, conclude the story based on these guidelines.
            """
        else: # one complete short story
            prompt = """
            You are a creative storyteller for children aged 6-8. Create a short, engaging, and complete story based on the image provided.
            - Write between 125-175 words.
            - Use ONLY characters, settings, and objects visible in the image provided.
            - Do not introduce any elements not present in the image
            - Ensure that all grammar and spelling is correct
            - The story must revolve around these specific elements.
            - Seamlessly incorporate one age-appropriate fact related to math, science, or history into the story's plot or dialogue. The fact should be something that is commonly taught to children.
            - Avoid using any specific measurements or technical details unless they are common knowledge or used for math.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and subtly educational.
            - Avoid inappropriate content, complex language, or scary themes.
            - Ensure that the fact is actually accurate

            Now, create a complete short story that closely matches what you see in the images while subtly incorporating an educational fact."
            """
    else:
        if(previous_stories): # continue an existing story
            prompt = f"""
            You are a creative storyteller for children aged 6-8. Continue an existing story based on attached image and the following information:

            Previous story context: {previous_stories}

            Guidelines:
            - Write 75-100 words that naturally continue the existing story.
            - Maintain consistency with existing story elements and characters.
            - Incorporate elements from the new image seamlessly into the narrative.
            - Ensure that you incorporate important element of the new image into the story.
            - Do not introduce any elements not present in the image or previous story context
            - Ensure that all grammar and spelling is correct
            - The story must revolve around these specific elements.
            - Seamlessly incorporate one age-appropriate fact related to math, science, or history into the story's plot or dialogue. The fact should be something that is commonly taught to children.
            - Avoid using any specific measurements or technical details unless they are common knowledge or used for math.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and subtly educational.
            - Avoid inappropriate content, complex language, or scary themes.
            - Make sure that there is room for further development of the story.

            Now, continue the story based on these guidelines.
            """
        else: # start a story
            prompt = """
            You are a creative storyteller for children aged 6-8. Create the start of a story based on the image provided.
            - Write 75-100 words that start a new story.
            - Use ONLY characters, settings, and objects visible in the image provided.
            - Do not introduce any elements not present in the image
            - Ensure that all grammar and spelling is correct
            - The story must revolve around these specific elements.
            - Seamlessly incorporate one age-appropriate fact related to math, science, or history into the story's plot or dialogue. The fact should be something that is commonly taught to children.
            - Avoid using any specific measurements or technical details unless they are common knowledge or used for math.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and subtly educational.
            - Avoid inappropriate content, complex language, or scary themes.
            - Make sure that there is room for further development of the story.
            - Ensure that the fact is actually accurate
            - Introduce main characters and set up an interesting scenario

            Now, write the opening of a story based on the guidelines above and image provided.
            """

    # Send request to the model
    try:
        # Load the image
        print(prompt)

        image_part = Part.from_data(image_data, mime_type="image/jpeg")
        image_part = Part.from_data(image_data, mime_type="image/jpeg")

        # Generate content with both the prompt and the image
        # Generate content with both the prompt and the image
        response = model.generate_content(
            [prompt, image_part],
            generation_config=generation_config
        )
        
        
        print(f"\nGenerated Output:\n{response.text}")
        return response.text
    except Exception as e:
        print(f"Error during content generation: {str(e)}")
        return None

@app.route('/generate', methods=["POST"])
def generate():
    # Load data
    data = request.get_json()
    previous_stories = data.get("previous_stories")
    end_story = data.get("end_story")

    # Load image
    image_base64 = data.get('image')
    if not image_base64:
        return jsonify({'error': 'No image data provided.'}), 400
    
    # Decode the base64-encoded image
    try:
        image_data = base64.b64decode(image_base64)
    except Exception as e:
        return jsonify({'error': f'Invalid image data. {str(e)}'}), 400

    story = generate_story_from_media(image_data, previous_stories, end_story)

    response_data = {
        'story': story 
    }
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(debug=True)