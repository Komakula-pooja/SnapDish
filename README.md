# SnapDish 📸🍲

**Turn your leftovers into a masterpiece. SnapDish is an AI-powered recipe generator that creates unique, delicious recipes from a simple photo of your ingredients.**

---

## ✨ Features

SnapDish is a full-stack application designed to showcase a modern, animation-rich frontend and a powerful AI backend.

* **AI-Powered Recipe Generation:** Leverages the Google Gemini 2.0 flash model to analyze ingredients from an image and generate a complete recipe, including title, ingredient list, and step-by-step instructions.
* **Multimodal Input:** Accepts both an image of ingredients and optional text-based dietary preferences (e.g., "vegetarian," "gluten-free").
* **Stunning Animated Landing Page:** A fully responsive, single-page design built with GSAP (GreenSock Animation Platform) to create an engaging user experience.
    * **Interactive Hero Section:** A dynamic grid of images that subtly react to the user's mouse movement.
    * **Immersive Scroll Section:** A horizontal "storytelling" section powered by ScrollTrigger that reveals the app's process.
    * **Dynamic "Benefits" Showcase:** A pinned, full-screen section where features morph into one another on scroll.
* **Polished User Interface:** The entire application, from the homepage to the playground, is built with a consistent dark theme, "glassmorphism" effects, and glowing accents for a premium feel.
* **Interactive Playground:** A clean, two-column interface where users can upload an image, add preferences, and receive their custom recipe in a beautifully formatted, scrollable card.

---

## 🛠️ Tech Stack

This project is built with a modern, full-stack technology set.

#### **Frontend**

* **Framework:** [React](https://reactjs.org/) (with Vite)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/)
* **Routing:** [React Router](https://reactrouter.com/)
* **API Communication:** [Axios](https://axios-http.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

#### **Backend**

* **Framework:** [FastAPI](https://fastapi.tiangolo.com/)
* **Server:** [Uvicorn](https://www.uvicorn.org/)
* **Image Handling:** [Pillow](https://python-pillow.org/)

#### **AI Services**

* **Model:** [Google Gemini 2.0 Flash API](https://ai.google.dev/)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js and npm installed
* Python 3.7+ and pip installed
* A Google Gemini API Key (you can get one for free from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Komakula-pooja/SnapDish.git](https://github.com/Komakula-pooja/SnapDish.git)
    cd SnapDish
    ```

2.  **Setup the Backend:**
    * Navigate to the backend folder:
        ```bash
        cd backend
        ```
    * Create and activate a virtual environment:
        ```bash
        python -m venv venv
        # On Windows:
        venv\Scripts\activate
        # On macOS/Linux:
        source venv/bin/activate
        ```
    * Install the required Python packages:
        ```bash
        pip install -r requirements.txt
        ```
    * Create a `.env` file in the `backend` folder and add your API key:
        ```
        GOOGLE_API_KEY=YOUR_API_KEY_HERE
        ```
    * Run the backend server:
        ```bash
        uvicorn main:app --reload
        ```
        The backend will be running at `http://127.0.0.1:8000`.

3.  **Setup the Frontend:**
    * Open a **new terminal** and navigate to the frontend folder:
        ```bash
        cd frontend
        ```
    * Install the required npm packages:
        ```bash
        npm install
        ```
    * Run the frontend development server:
        ```bash
        npm run dev
        ```
        The frontend will be running at `http://localhost:5173` (or a similar port).

---

