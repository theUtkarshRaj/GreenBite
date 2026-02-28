from pydantic import BaseModel, Field
from typing import List, Optional

class SwapSuggestion(BaseModel):
    original_item: str
    swap_item: str
    co2_saved: float
    reasoning: str

class DetectionResponse(BaseModel):
    detected_items: List[str]
    total_co2: float
    metaphor: str
    swaps: List[SwapSuggestion]
    leaderboard_rank: Optional[int] = None

class LeaderboardEntry(BaseModel):
    user_id: str
    user_name: str
    total_co2_saved: float
    rank: Optional[int] = None

class TrendData(BaseModel):
    date: str
    co2_emitted: float
