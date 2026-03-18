import os
import requests
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in environment variables")

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

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json"
}

def compress_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert("RGB")
    image.thumbnail((512, 512))
    buffer = io.BytesIO()
    image.save(buffer, format="JPEG", quality=70)
    return buffer.getvalue()

def generate_recipe_from_images(image_bytes_list: list, preference: str) -> str:
    content = []

    for image_bytes in image_bytes_list:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{b64}"}
        })

    content.append({
        "type": "text",
        "text": f"""You are a professional chef. Look at the food/ingredients in the image(s) and generate a complete recipe.
Dietary preference: {preference}

Provide:
1. Recipe Title
2. Ingredients (with quantities)
3. Step-by-step Instructions
4. Estimated cooking time - always write times in a human-friendly format like "preparation time - 1 hour 30 minutes" or "preparation time - 45 minutes", never as a range like "15-20 minutes", always pick a single specific value"""
    })

    payload = {
        "model": "meta-llama/llama-4-scout-17b-16e-instruct", 
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 1024,
        "temperature": 0.7
    }

    response = requests.post(GROQ_URL, headers=HEADERS, json=payload, timeout=60)

    print("Status:", response.status_code)
    print("Response preview:", response.text[:300])

    if response.status_code == 200:
        return response.json()["choices"][0]["message"]["content"]

    raise Exception(f"Groq API failed: {response.status_code} - {response.text[:300]}")


@app.post("/api/generate-recipe")
async def generate_recipe(
    preference: str = Form("any"),
    images: list[UploadFile] = File(...)
):
    if not images:
        raise HTTPException(status_code=400, detail="No images were uploaded.")

    try:
        compressed_images = []
        for img_file in images:
            if not img_file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="One of the files is not an image.")
            compressed_images.append(compress_image(await img_file.read()))

        recipe = generate_recipe_from_images(compressed_images, preference)
        return {"recipe": recipe}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.get("/")
def read_root():
    return {"status": "SnapDish backend is running!"}