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
MODEL_ID = "gemini-1.0-pro-vision"  # Changed to vision model

# Initialize Vertex AI
vertexai.init(project=project_id, location=region)

previous_stories = ""
end_story = False

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
    print(previous_stories)
    # Create the prompt
    if(end_story):
        if(previous_stories):
            prompt = f"""
            You are a creative storyteller for children aged 6-8. Conclude an existing story based on the final image provided and the following context:

            Previous story: {previous_stories}

            Guidelines:
            - Write 75-125 words that wrap up the story with a satisfying ending.
            - Incorporate elements from the final image into the conclusion.
            - Maintain consistency with existing story elements and characters.
            - Resolve the main conflict or challenge introduced in the story.
            - Naturally weave in one age-appropriate fact related to math, science, or history that fits the context. Do not state the fact separately at the end.
            - Use the characters' actions or dialogue to explain or demonstrate the fact within the story.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and mildly educational.
            - Provide a clear ending that ties up loose ends.
            - Avoid inappropriate content, complex language, or scary themes.

            Now, conclude the story based on the final image and these guidelines.
            """
        else:
            prompt = """
            You are a creative storyteller for children aged 6-8. Create a complete short story based on the single image provided. Guidelines:

            - Write a 100-150 word story with a clear beginning, middle, and end.
            - Describe and incorporate key elements from the image into your story.
            - Introduce characters, set up a scenario, and provide a satisfying conclusion.
            - Naturally weave in one age-appropriate fact related to math, science, or history that fits the context. Do not state the fact separately at the end.
            - Use the characters' actions or dialogue to explain or demonstrate the fact within the story.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and mildly educational.
            - Ensure the story has a complete arc with a resolution.
            - Avoid inappropriate content, complex language, or scary themes.

            Now, create a complete short story based on the image and these guidelines.
            """
    else:
        if(previous_stories):
            prompt = f"""
            You are a creative storyteller for children aged 6-8. Continue an existing story based on the new image provided and the following context:

            Previous story: {previous_stories}

            Guidelines:
            - Write 75-100 words that naturally continue the existing story.
            - Incorporate elements from the new image seamlessly into the narrative.
            - Maintain consistency with existing story elements and characters.
            - Naturally weave in one age-appropriate fact related to math, science, or history that fits the context. Do not state the fact separately at the end.
            - Use the characters' actions or dialogue to explain or demonstrate the fact within the story.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and mildly educational.
            - Leave room for future continuation of the story.
            - Avoid inappropriate content, complex language, or scary themes.

            Now, continue the story based on the new image and these guidelines.
            """
        else:
            prompt = """
            You are a creative storyteller for children aged 6-8. Create an engaging opening chapter for a new story based on the image provided. Guidelines:

            - Write 75-100 words.
            - Describe and incorporate key elements from the image into your story.
            - Introduce main characters and set up an interesting scenario.
            - Naturally weave in one age-appropriate fact related to math, science, or history that fits the context. Do not state the fact separately at the end.
            - Use the characters' actions or dialogue to explain or demonstrate the fact within the story.
            - Use language and vocabulary suitable for 6-8 year olds.
            - Keep the tone positive, engaging, and mildly educational.
            - Leave room for future continuation of the story.
            - Avoid inappropriate content, complex language, or scary themes.

            Now, create the opening chapter of the story based on the image and these guidelines.
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

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/generate', methods=["POST"])
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