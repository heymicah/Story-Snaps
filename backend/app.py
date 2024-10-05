import os
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import (
    GenerationConfig,
    GenerativeModel,
    Image
)

# Set up the Google Application Credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./serviceAccountKey.json"

# Path to your media file (image)
media_file_path = "IMG_3218.jpg"  # Update this with your image file path

# Initialize the AI Platform with your project ID and region
project_id = "storysnaps"
region = "us-central1"

# Model ID for Vertex AI
MODEL_ID = "gemini-1.0-pro-vision"  # Changed to vision model

# Initialize Vertex AI
vertexai.init(project=project_id, location=region)

def generate_story_from_media(media_file):
    """Function to send media data (image) to a Vertex AI model and get predictions."""

    # Load the image using vertexai.Image
    image = Image.load_from_file(media_file)

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
    prompt = """Look at this image and create a short story based on what you see. 
    Be descriptive and creative."""

    # Send request to the model
    try:
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

# Call the function with media file path
if __name__ == "__main__":
    generate_story_from_media(media_file_path)