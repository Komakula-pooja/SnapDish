import os
import requests
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

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

# Change these lines in your code:

# CORRECT URLs for the Free Serverless API
API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large"
MISTRAL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3"

HEADERS = {
    "Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"
}


def caption_image(image_bytes: bytes):
    response = requests.post(
        API_URL,
        headers=HEADERS,
        data=image_bytes,
        timeout=60
    )

    if response.status_code != 200:
        raise Exception(response.text)

    return response.json()[0]["generated_text"]


def generate_recipe_text(ingredients_text: str, preference: str) -> str:
    # Mistral expects instructions inside [INST] tags
    prompt = f"""[INST]
You are a creative chef.
Detected ingredients: {ingredients_text}
User preference: {preference}

Generate a recipe with:
1. Catchy title
2. Ingredients list
3. Step-by-step instructions
[/INST]"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,  # Increased length for full recipes
            "temperature": 0.7,
            "return_full_text": False # Prevents the model from repeating the prompt
        }
    }

    response = requests.post(MISTRAL_URL, headers=HEADERS, json=payload, timeout=60)
    
    if response.status_code != 200:
        # Better error logging to see exactly what HF says
        raise Exception(f"HF Error {response.status_code}: {response.text}")

    result = response.json()

    if isinstance(result, list):
        return result[0]["generated_text"]
    elif isinstance(result, dict) and "generated_text" in result:
        return result["generated_text"]
    else:
        raise Exception(f"Unexpected HF response: {result}")



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
            caption = caption_image(image_bytes)
            captions.append(caption)

        ingredients_text = ", ".join(captions)
        recipe = generate_recipe_text(ingredients_text, preference)

        return {"recipe": recipe}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}