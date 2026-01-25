import os
import io
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
if not HF_API_TOKEN:
    raise ValueError("HF_API_TOKEN not found in environment variables")

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

# ---------- Hugging Face helpers ----------

BLIP_URL = "https://router.huggingface.co/hf-inference/models/Salesforce/blip-image-captioning-large"
MISTRAL_URL = "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2"

HEADERS = {
    "Authorization": f"Bearer {HF_API_TOKEN}"
}


def analyze_image(image_bytes: bytes) -> str:
    response = requests.post(BLIP_URL, headers=HEADERS, data=image_bytes)
    if response.status_code != 200:
        raise Exception(response.text)
    return response.json()[0]["generated_text"]


def generate_recipe_text(ingredients_text: str, preference: str) -> str:
    prompt = f"""
You are a creative chef.

Detected ingredients:
{ingredients_text}

User preference:
{preference}

Generate a recipe with:
1. Catchy title
2. Ingredients list
3. Step-by-step instructions
"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 400,
            "temperature": 0.7
        }
    }

    response = requests.post(MISTRAL_URL, headers=HEADERS, json=payload)
    if response.status_code != 200:
        raise Exception(response.text)

    return response.json()[0]["generated_text"]


# ---------- API Routes ----------

@app.post("/api/generate-recipe")
async def generate_recipe(
    preference: str = Form("any"),
    images: list[UploadFile] = File(...)
):
    if not images:
        raise HTTPException(status_code=400, detail="No images were uploaded.")

    try:
        captions = []

        for img_file in images:
            if not img_file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="One of the files is not an image.")

            image_bytes = await img_file.read()
            caption = analyze_image(image_bytes)
            captions.append(caption)

        ingredients_text = ", ".join(captions)
        recipe = generate_recipe_text(ingredients_text, preference)

        return {"recipe": recipe}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}