import os
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")
genai.configure(api_key=api_key)

app = FastAPI()

origins = [
    "http://localhost:5173", 
    "https://snap-dish-ai.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


model = genai.GenerativeModel('gemini-2.0-flash')


@app.post("/api/generate-recipe")
async def generate_recipe(
        preference: str = Form("any"),  
        image: UploadFile = File(...)   
):
    """
    This endpoint receives an image and a dietary preference,
    then uses Gemini to generate a recipe.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        image_content = await image.read()

        pil_image = Image.open(io.BytesIO(image_content))

        prompt = f"""
        You are a creative chef. Based on the ingredients in this image and the user's preference for '{preference}' food, 
        generate a recipe. The recipe should include:
        1. A catchy title.
        2. A list of ingredients.
        3. Step-by-step instructions.
        Format the response clearly.
        """

        response = model.generate_content([prompt, pil_image])

        return {"recipe": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}
