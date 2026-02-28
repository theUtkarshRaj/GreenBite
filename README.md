# GreenBite 🌱

**AI Carbon Footprint Tracker for College Canteens**

GreenBite helps students track and reduce the carbon footprint of their meals using zero-shot AI food detection and LLM-powered sustainable swap suggestions.

---

## 🏗️ Architecture

- **Frontend**: React + Vite + TypeScript, Tailwind CSS, Recharts for trends, React Webcam for capture.
- **Backend**: FastAPI, asynchronous architecture, Motor (async MongoDB).
- **AI Stack**:
  - Open-Source HuggingFace `openai/clip-vit-base-patch32` for zero-shot food classification.
  - Gemini 1.5 Flash (Free tier) for generating intelligent, context-aware sustainable swaps.
  - Custom emissions calculation engine with OWID carbon data fallback and heuristics.

## 🚀 Features

- **Snap & Detect**: Take a photo of your meal to instantly detect its components.
- **Carbon Score & Metaphor**: Get your emission score along with relatable metaphors (e.g., equivalent smartphone charges).
- **Smart Swaps**: LLM-driven suggestions for greener alternatives (like swapping beef for chicken or dairy for plant-based).
- **Hostel Leaderboard**: Compete with peers to save the most CO₂.
- **Weekly Trends**: Visualize your carbon footprint over the week.
- **Offline Fallbacks**: Graceful fallback emissions and swaps if external APIs are unavailable.

---

## 🛠️ Quick Start (1-Command Deploy)

This project is fully dockerized and requires **NO PAID APIs**. 

### Prerequisites
- Docker & Docker Compose
- A free Gemini API Key (from Google AI Studio)

### 1. Configure Environments

1. Copy `.env.example` to `.env` (Optional, as fallbacks exist)
2. Copy `backend/example.env` to `backend/.env`
3. Copy `frontend/example.env` to `frontend/.env`

In `backend/.env`, paste your Gemini Key:
```env
GEMINI_API_KEY=your_actual_gemini_key_here
```

### 2. Run the Stack

Execute the following command from the root `greenbite` folder:
```bash
docker-compose up --build
```

- **Frontend (UI)**: [http://localhost:8080](http://localhost:8080)
- **Backend API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

*(Note: The first run will download the HuggingFace CLIP model weights (~600MB) directly into the backend Docker image)*

---

## 👨‍💻 Local Development (Without Docker)

If you prefer to run the apps directly on your host machine:

### Backend
```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
cp example.env .env
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp example.env .env
npm run dev
```
Access at `http://localhost:5173`.

---

## 📂 Project Structure

```
greenbite/
├── backend/
│   ├── app/
│   │   ├── api/routes.py         # Endpoints for detecting, leaderboards, trends
│   │   ├── emissions/engine.py   # Carbon data and OWID heuristics
│   │   ├── models/api_models.py  # Pydantic data schemas
│   │   ├── services/clip.py      # HuggingFace Vision Inference
│   │   ├── services/gemini.py    # LLM Swap generation
│   │   ├── utils/metaphors.py    # Carbon score metaphors
│   │   └── main.py               # FastAPI App
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/api.ts       # Axios client
│   │   ├── App.tsx               # Main Dashboard
│   │   └── main.tsx              # React Entry
│   ├── Dockerfile
│   ├── tailwind.config.js
│   └── vite.config.ts
└── docker-compose.yml
```

## 🔮 Future Improvements

- Add barcode scanning via Open Food Facts API
- Add User Authentication (JWT)
- Integrate a full relational DB (Postgres) for historical meal logging
- Improve zero-shot detection with a fine-tuned LoRA model for specific Indian Canteen Foods.
