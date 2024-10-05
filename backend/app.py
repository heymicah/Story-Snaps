import os
import base64
from io import BytesIO
from PIL import Image as PILImage
from flask import Flask, jsonify, request
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    Image
)

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
        prompt = f"""Look at this image and create a short story for kids based on what you see. 
        Be descriptive and creative.
        The story should be a continuation of the following story but do not end the story
        and leave room for expansion.
        
        {f"Here are the previous portions of the story. The story you generate should be a continuation of this: {previous_stories}" if previous_stories else ""}
        """
    else:
        prompt = f"""Look at this image and create a short story for kids based on what you see. 
        Be descriptive and creative.
        The story should be a continuation of the following story and you should have an
        ending. 

        {f"Here are the previous portions of the story. The story you generate should be a continuation of this: {previous_stories}" if previous_stories else ""}
        """

    # Send request to the model
    try:
        # Load the image
        image_stream = BytesIO(image_data)
        pil_image = PILImage.open(image_stream)
        image_stream.seek(0)

        # Formatting the image to load
        image = Image.load_from_pil(pil_image)
        response = model.generate_content(
            [prompt, image],
            generation_config=generation_config
        )
        # Print the model's generated output
        print(f"\nGenerated Output:\n{response.text}")
        return response.text
    except Exception as e:
        print(f"Error during content generation: {str(e)}")
        return None

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/generate', methods=['POST'])
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