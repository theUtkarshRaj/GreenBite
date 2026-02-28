import os
import google.generativeai as genai
import json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.0-flash-lite')

async def get_swap_suggestions(detected_items: list[str]) -> list[dict]:
    if not detected_items:
        return []
    
    items_str = ", ".join(detected_items)
    prompt = f"""
    You are a sustainable food expert.
    The user is eating the following food items: {items_str}.
    Suggest 1-3 direct food swaps that have a lower carbon footprint but are similar in taste or category.
    Calculate roughly how much CO2 (in kg) would be saved per serving.
    
    Return the response ONLY as a JSON array of objects with the following schema:
    [
      {{"original_item": "...", "swap_item": "...", "co2_saved": float, "reasoning": "..."}}
    ]
    Do not include markdown blocks or other text.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
            
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Gemini API Error: {e}")
        # Fallback offline swaps
        return [
            {
                "original_item": detected_items[0],
                "swap_item": "Plant-based alternative",
                "co2_saved": 0.5,
                "reasoning": "Plant-based items generally have a lower footprint."
            }
        ]
