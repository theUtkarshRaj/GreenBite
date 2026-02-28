import os
import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel
import logging

logger = logging.getLogger(__name__)

# Natural language prompts work much better with CLIP than bare words
FOOD_LABELS = [
    "a photo of samosa, fried triangular pastry",
    "a photo of biryani, spiced rice with meat",
    "a photo of butter chicken, orange creamy curry",
    "a photo of paneer tikka, grilled cottage cheese",
    "a photo of dosa, thin crispy crepe",
    "a photo of idli, white steamed rice cakes",
    "a photo of chole bhature, chickpea curry with fried bread",
    "a photo of naan, flatbread",
    "a photo of dal makhani, dark lentil curry",
    "a photo of pav bhaji, vegetable mash with bread rolls",
    "a photo of vada pav, potato dumpling sandwich",
    "a photo of roti chapati, round flatbread",
    "a photo of plain white rice on a plate",
    "a photo of green salad with vegetables",
    "a photo of pizza with cheese and toppings",
    "a photo of burger with bun and patty",
    "a photo of fried chicken pieces",
    "a photo of egg curry in spicy sauce",
    "a photo of fish curry with coconut",
    "a photo of vegetable curry",
]

# Readable names mapped to CLIP labels
LABEL_TO_NAME = {
    "a photo of samosa, fried triangular pastry": "samosa",
    "a photo of biryani, spiced rice with meat": "biryani",
    "a photo of butter chicken, orange creamy curry": "butter chicken",
    "a photo of paneer tikka, grilled cottage cheese": "paneer tikka",
    "a photo of dosa, thin crispy crepe": "dosa",
    "a photo of idli, white steamed rice cakes": "idli",
    "a photo of chole bhature, chickpea curry with fried bread": "chole bhature",
    "a photo of naan, flatbread": "naan",
    "a photo of dal makhani, dark lentil curry": "dal makhani",
    "a photo of pav bhaji, vegetable mash with bread rolls": "pav bhaji",
    "a photo of vada pav, potato dumpling sandwich": "vada pav",
    "a photo of roti chapati, round flatbread": "roti",
    "a photo of plain white rice on a plate": "rice",
    "a photo of green salad with vegetables": "salad",
    "a photo of pizza with cheese and toppings": "pizza",
    "a photo of burger with bun and patty": "burger",
    "a photo of fried chicken pieces": "fried chicken",
    "a photo of egg curry in spicy sauce": "egg curry",
    "a photo of fish curry with coconut": "fish curry",
    "a photo of vegetable curry": "vegetable curry",
}


class CLIPService:
    _instance = None

    def __init__(self):
        model_id = "openai/clip-vit-base-patch32"
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Loading CLIP model on {self.device}...")
        self.model = CLIPModel.from_pretrained(model_id).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_id)
        logger.info("CLIP model loaded.")

    async def detect_food(self, image: Image.Image) -> list[str]:
        # Resize image to improve accuracy
        image = image.resize((224, 224))

        inputs = self.processor(
            text=FOOD_LABELS,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1)[0]

        # Log top predictions for debugging
        top_probs, top_indices = probs.topk(5)
        for p, i in zip(top_probs, top_indices):
            label = FOOD_LABELS[i.item()]
            logger.info(f"  [{p.item():.3f}] {label}")

        # Return items above a reasonable threshold
        detected = []
        threshold = 0.05  # Lower threshold to catch more items
        for prob, idx in zip(top_probs[:3], top_indices[:3]):
            if prob.item() > threshold:
                label = FOOD_LABELS[idx.item()]
                detected.append(LABEL_TO_NAME[label])

        if not detected:
            # Fallback: return top prediction regardless of threshold
            top_label = FOOD_LABELS[top_indices[0].item()]
            detected.append(LABEL_TO_NAME[top_label])

        return detected


# Singleton
clip_service = CLIPService()
