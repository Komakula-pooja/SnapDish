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

# 1. Use the "Base" version of BLIP (More reliable on free tier than Large)
API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base"

MISTRAL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta"

HEADERS = {
    "Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"
}


def caption_image(image_bytes: bytes):
    response = requests.post(API_URL, headers=HEADERS, data=image_bytes)
    if response.status_code != 200:
        # This will print the actual error to your terminal if it fails
        print(f"Caption Error: {response.text}") 
        raise Exception(f"Captioning failed: {response.status_code}")
    return response.json()[0]["generated_text"]

def generate_recipe_text(ingredients_text: str, preference: str) -> str:
    # Zephyr uses <|system|>, <|user|>, and <|assistant|> tags
    prompt = f"""<|system|>
You are a helpful chef. Generate a recipe based on the user's ingredients.
</s>
<|user|>
I have these ingredients: {ingredients_text}
My preference is: {preference}

Please provide:
1. A Title
2. Ingredients List
3. Instructions
</s>
<|assistant|>"""

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.7,
            "return_full_text": False
        }
    }

    response = requests.post(MISTRAL_URL, headers=HEADERS, json=payload)
    if response.status_code != 200:
        print(f"Recipe Error: {response.text}")
        raise Exception(f"Recipe generation failed: {response.status_code}")
    
    result = response.json()
    return result[0]["generated_text"]



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