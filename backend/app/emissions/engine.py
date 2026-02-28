import os
import pandas as pd

class EmissionsEngine:
    def __init__(self):
        # Hardcoded heuristic table for common Indian foods and others (kg CO2 per serving)
        self.heuristics = {
            "samosa": 0.3,
            "biryani": 2.5,
            "butter chicken": 3.8,
            "paneer tikka": 1.2,
            "dosa": 0.4,
            "idli": 0.3,
            "chole bhature": 0.6,
            "nan": 0.2,
            "dal makhani": 0.8,
            "roti": 0.1,
            "rice": 0.5,
            "salad": 0.2,
            "burger": 3.0,
            "pizza": 2.2
        }
        
        # Load local OWID database fallback
        self.owid_data = {}
        csv_path = os.getenv("OWID_CSV_PATH", "app/emissions/owid.csv")
        try:
            if os.path.exists(csv_path):
                df = pd.read_csv(csv_path)
                # Ensure the csv has at least 'food_item' and 'co2_emission' columns
                self.owid_data = dict(zip(df['food_item'].str.lower(), df['co2_emission']))
        except Exception as e:
            print(f"Failed to load OWID CSV: {e}")

    async def get_emissions(self, items: list[str]) -> float:
        total_co2 = 0.0
        for item in items:
            item_lower = item.lower()
            
            # Tier 1: Open Food Facts API (Mocked due to rate limits/reliability without keys)
            # Typically would use: `requests.get(f"https://world.openfoodfacts.org/cgi/search.pl?...&json=1")`
            
            # Tier 2: OWID Carbon Database
            if item_lower in self.owid_data:
                total_co2 += self.owid_data[item_lower]
                continue
                
            # Tier 3: Hardcoded Heuristics
            if item_lower in self.heuristics:
                total_co2 += self.heuristics[item_lower]
                continue
                
            # Fallback average
            total_co2 += 0.5
            
        return total_co2

emissions_engine = EmissionsEngine()
