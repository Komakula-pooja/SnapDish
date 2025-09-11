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
        images: list[UploadFile] = File(...)
):
    if not images:
        raise HTTPException(status_code=400, detail="No images were uploaded.")

    try:

        prompt_parts = [
            f"""
            You are a creative chef. Based on the ingredients in these images and the user's preference for '{preference}' food, 
            generate a recipe. The recipe should include:
            1. A catchy title.
            2. A list of ingredients.
            3. Step-by-step instructions.
            Format the response clearly.
            """
        ]

        for img_file in images:
            if not img_file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="One of the files is not an image.")

            image_content = await img_file.read()
            pil_image = Image.open(io.BytesIO(image_content))
            prompt_parts.append(pil_image)

        response = model.generate_content(prompt_parts)
        return {"recipe": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}