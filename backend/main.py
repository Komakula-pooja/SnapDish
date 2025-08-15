import os
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")
genai.configure(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for simplicity. For production, restrict this to your frontend's URL.
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize the Gemini Pro Vision model
model = genai.GenerativeModel('gemini-2.0-flash')


@app.post("/api/generate-recipe")
async def generate_recipe(
        preference: str = Form("any"),  # Get dietary preference from the form
        image: UploadFile = File(...)   # Get the uploaded image file
):
    """
    This endpoint receives an image and a dietary preference,
    then uses Gemini to generate a recipe.
    """
    # Check if the uploaded file is an image
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image content into memory
        image_content = await image.read()

        # Convert the image content to a PIL Image object
        pil_image = Image.open(io.BytesIO(image_content))

        # The prompt for the Gemini model
        prompt = f"""
        You are a creative chef. Based on the ingredients in this image and the user's preference for '{preference}' food, 
        generate a recipe. The recipe should include:
        1. A catchy title.
        2. A list of ingredients.
        3. Step-by-step instructions.
        Format the response clearly.
        """

        # Generate content using the model
        response = model.generate_content([prompt, pil_image])

        # Return the generated text as a JSON response
        return {"recipe": response.text}

    except Exception as e:
        # Handle potential errors during API call
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# A simple root endpoint to confirm the server is running
@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}
