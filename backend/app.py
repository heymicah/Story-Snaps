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


app = Flask(__name__)

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

    # Create the prompt
    if(not end_story):
        prompt = f"""Look at this image and create a short story for kids based on what is in the image.
        Try not to deviate too much from what is in the image. 
        Be descriptive and creative. Do not provide an ending to the story, instead and leave room for the story to continue to develop.
        Make sure that the story can continue in several different ways, similar to a choose your adventure book but in third-person.
        Additionally, make sure that the story is kid-friendly and doesn't use any complex vocabularly.
        Lastly, try to limit your response to roughly one paragraph.
        
        {f"Here are the previous portions of the story. The story you generate should be a continuation of this: {previous_stories}" if previous_stories else ""}
        """
    else:
        prompt = f"""Look at this image and create a short story for kids based on what is in the image.
        Try not to deviate too much from what is in the image. 
        Be descriptive and creative. Additionally, make sure that the story is kid-friendly and doesn't use any complex vocabularly.
        Lastly, try to limit your response to roughly one paragraph. You should provide a solid, satisfying ending to the story.

        {f"Here are the previous portions of the story. The story you generate should be a continuation of this: {previous_stories}" if previous_stories else ""}
        """

    # Send request to the model
    try:
        # Load the image
        image_part = Part.from_data(image_data, mime_type="image/jpeg")

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