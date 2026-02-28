from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="GreenBite API",
    description="AI Carbon Footprint Tracker Backend",
    version="1.0.0"
)

# CORS
origins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
