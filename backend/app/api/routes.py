from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
import io
from app.models.api_models import DetectionResponse, LeaderboardEntry, TrendData
from app.services.clip_service import clip_service
from app.services.gemini_service import get_swap_suggestions
from app.emissions.engine import emissions_engine
from app.utils.metaphors import get_carbon_metaphor
from typing import List

router = APIRouter()

# Temporary in-memory stores for leaderboard and trends
users_co2_saved = {"user_1": {"name": "Aarav", "saved": 24.5}, "user_2": {"name": "Diya", "saved": 18.2}}
trend_data_store = [
    TrendData(date="2023-10-01", co2_emitted=4.2),
    TrendData(date="2023-10-02", co2_emitted=3.5),
    TrendData(date="2023-10-03", co2_emitted=5.1),
    TrendData(date="2023-10-04", co2_emitted=2.8),
    TrendData(date="2023-10-05", co2_emitted=3.0),
    TrendData(date="2023-10-06", co2_emitted=2.5),
    TrendData(date="2023-10-07", co2_emitted=1.8),
]

@router.post("/detect", response_model=DetectionResponse)
async def detect_food_item(image: UploadFile = File(...)):
    try:
        contents = await image.read()
        pil_image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # 1. Zero-shot CLIP detection
    detected_items = await clip_service.detect_food(pil_image)
    if not detected_items:
        detected_items = ["Unknown Food"]

    # 2. Emissions Calculation
    total_co2 = await emissions_engine.get_emissions(detected_items)

    # 3. Metaphor Generation
    metaphor = get_carbon_metaphor(total_co2)

    # 4. Swap LLM Suggestion
    swaps = await get_swap_suggestions(detected_items)

    return DetectionResponse(
        detected_items=detected_items,
        total_co2=round(total_co2, 2),
        metaphor=metaphor,
        swaps=swaps,
        leaderboard_rank=5  # Mocked rank
    )

@router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard():
    board = []
    for uid, data in users_co2_saved.items():
        board.append(LeaderboardEntry(user_id=uid, user_name=data["name"], total_co2_saved=data["saved"]))
    
    # Sort by descending
    board.sort(key=lambda x: x.total_co2_saved, reverse=True)
    for idx, entry in enumerate(board):
        entry.rank = idx + 1
        
    return board

@router.get("/trend/{user_id}", response_model=List[TrendData])
async def get_trend_data(user_id: str):
    # In a real app, filter by user
    return trend_data_store
