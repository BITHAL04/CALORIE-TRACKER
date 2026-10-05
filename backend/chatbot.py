import os
import re
import httpx
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatQueryInput(BaseModel):
    user_id: Optional[str] = "guest"
    message: str
    history: Optional[List[ChatMessage]] = []

class GenericQuestionCategory(BaseModel):
    category: str
    icon: str
    questions: List[str]

class ChatQueryResponse(BaseModel):
    reply: str
    suggested_questions: List[str]
    category: Optional[str] = "General"

GENERIC_QUESTIONS_DATA: List[Dict[str, Any]] = [
    {
        "category": "Workouts & Calories",
        "icon": "🏋️",
        "questions": [
            "How accurate is the Calorie Predictor in nexaFit?",
            "How many calories do I burn during a 30-minute HIIT workout?",
            "What is the best workout split for building lean muscle?",
            "Should I do cardio before or after weight lifting?"
        ]
    },
    {
        "category": "Nutrition & Meal Planning",
        "icon": "🥗",
        "questions": [
            "How does nexaFit generate personalized meal plans?",
            "What are some high-protein vegetarian meals for muscle recovery?",
            "How do I calculate my daily protein and macro targets?",
            "Can I customize meal plans for gluten or lactose intolerance?"
        ]
    },
    {
        "category": "Hydration & Recovery",
        "icon": "💧",
        "questions": [
            "How much water should I drink daily when exercising?",
            "What should I eat before and after a high-intensity workout?",
            "How does sleep affect muscle recovery and weight loss?"
        ]
    },
    {
        "category": "nexaFit Platform Help",
        "icon": "⚙️",
        "questions": [
            "How do I update my profile with my height, weight, and goals?",
            "Where can I find community discussions in the nexaFit Forum?",
            "Is my health and personal fitness data kept secure?"
        ]
    }
]

# Knowledge base for fast offline responses & domain fallbacks
KNOWLEDGE_BASE = {
    "accuracy": {
        "match": [r"accuracy", r"accurate", r"how accurate"],
        "reply": "🎯 **nexaFit Calorie Predictor Accuracy**\n\nOur Machine Learning calorie prediction model achieves **85–90% accuracy** by taking into account key physiological parameters:\n- Heart Rate (bpm)\n- Exercise Duration (mins)\n- Body Temperature (°C)\n- Age, Gender, Height & Weight\n\n💡 *Tip: Make sure your profile details are up to date for maximum precision!*",
        "suggestions": [
            "How many calories do I burn during a 30-minute HIIT workout?",
            "How do I update my profile with my height, weight, and goals?",
            "What is the best workout split for building lean muscle?"
        ]
    },
    "hiit": {
        "match": [r"hiit", r"30-minute", r"30 min", r"calories burned"],
        "reply": "🔥 **HIIT Calorie Burn Guide**\n\nDuring a intense **30-minute HIIT workout**, an average adult burns approximately **250 to 450 calories**, depending on:\n- Body weight & muscle mass\n- Workout intensity & heart rate\n- Resting metabolic rate\n\n✨ *Bonus:* HIIT creates an **EPOC (Afterburn effect)**, continuing to burn extra calories for up to 24 hours after your workout!",
        "suggestions": [
            "What should I eat before and after a high-intensity workout?",
            "How accurate is the Calorie Predictor in nexaFit?",
            "How much water should I drink daily when exercising?"
        ]
    },
    "protein": {
        "match": [r"protein", r"vegetarian", r"high-protein", r"macro"],
        "reply": "🥗 **High-Protein Vegetarian Meal Ideas**\n\n1. **Greek Yogurt Parfait:** Cottage cheese or Greek yogurt with chia seeds & almonds (~25g protein)\n2. **Lentil & Tofu Curry:** Tofu sauteed with spiced lentils & spinach (~30g protein)\n3. **Chickpea & Quinoa Bowl:** Edamame, roasted chickpeas, quinoa & tahini (~24g protein)\n4. **Seitan / Paneer Stir-Fry:** Tossed with broccoli, bell peppers & hemp seeds (~35g protein)\n\n💡 *Use our **Meal Planner** to automatically filter for Vegetarian or High-Protein options!*",
        "suggestions": [
            "How does nexaFit generate personalized meal plans?",
            "How do I calculate my daily protein and macro targets?",
            "Can I customize meal plans for gluten or lactose intolerance?"
        ]
    },
    "meal_plan": {
        "match": [r"meal plan", r"generate", r"dietary restriction", r"gluten", r"lactose"],
        "reply": "🍽️ **nexaFit AI Meal Planner**\n\nOur Meal Planner utilizes the Spoonacular nutrition database to craft customized weekly meal schedules:\n- **Custom Diets:** Vegetarian, Vegan, Ketogenic, Paleo, Pescetarian\n- **Intolerance Filters:** Gluten-free, Dairy-free, Peanut-free, Soy-free, etc.\n- **Calorie Targets:** Set your target daily intake to match your weight goals.\n\nVisit the **Meal Planner** tab in the main navigation menu to generate your custom week plan!",
        "suggestions": [
            "Can I customize meal plans for gluten or lactose intolerance?",
            "How do I calculate my daily protein and macro targets?",
            "What are some high-protein vegetarian meals for muscle recovery?"
        ]
    },
    "profile": {
        "match": [r"profile", r"height", r"weight", r"update", r"goals"],
        "reply": "👤 **Managing Your nexaFit Profile**\n\nTo update your physical parameters and dietary preferences:\n1. Click on **Profile** in the top navigation bar.\n2. Enter your updated Age, Gender, Height, and Weight.\n3. Save your preferences for preferred diet and intolerances.\n\nYour profile data automatically syncs with the **Calorie Predictor** and **Meal Planner** for effortless tracking!",
        "suggestions": [
            "How accurate is the Calorie Predictor in nexaFit?",
            "Where can I find community discussions in the nexaFit Forum?",
            "Is my health and personal fitness data kept secure?"
        ]
    },
    "cardio_lifting": {
        "match": [r"cardio before or after", r"weight lifting", r"workout split", r"muscle"],
        "reply": "🏋️‍♂️ **Cardio vs Weight Lifting Order**\n\n- **For Building Muscle & Strength:** Do **Weight Lifting FIRST**, followed by cardio. This ensures maximum glycogen energy for heavy lifts.\n- **For Cardiovascular Endurance:** Do **Cardio FIRST**.\n- **For General Fat Loss:** Either order works, but doing weights first optimizes fat oxidation during cardio.\n\n💪 *Recommended Split:* 4-day Upper/Lower or 3-day Push/Pull/Legs for maximum recovery!",
        "suggestions": [
            "What is the best workout split for building lean muscle?",
            "How many calories do I burn during a 30-minute HIIT workout?",
            "What should I eat before and after a high-intensity workout?"
        ]
    },
    "water": {
        "match": [r"water", r"hydration", r"drink daily", r"fluid"],
        "reply": "💧 **Daily Hydration Guidelines**\n\n- **Baseline:** ~3 to 3.5 Liters for men, ~2.5 to 3 Liters for women.\n- **During Exercise:** Add **500ml – 750ml per hour** of intense sweating.\n- **Electrolytes:** If training >60 minutes, add a pinch of salt or electrolyte drink to prevent fatigue.\n\n✨ *Pro Tip:* Check your hydration levels by urine color — aim for pale lemonade yellow!",
        "suggestions": [
            "What should I eat before and after a high-intensity workout?",
            "How does sleep affect muscle recovery and weight loss?",
            "How many calories do I burn during a 30-minute HIIT workout?"
        ]
    },
    "sleep": {
        "match": [r"sleep", r"recovery", r"rest", r"fatigue"],
        "reply": "😴 **Sleep & Muscle Recovery**\n\nSleep is your body's ultimate performance enhancer:\n- **Growth Hormone Release:** 70% of human growth hormone (HGH) is released during deep REM sleep.\n- **Fat Loss:** Sleep deprivation raises Cortisol (stress hormone) and Ghrelin (hunger hormone), leading to cravings.\n- **Target:** Aim for **7–9 hours** of quality sleep every night.",
        "suggestions": [
            "What should I eat before and after a high-intensity workout?",
            "How much water should I drink daily when exercising?",
            "What is the best workout split for building lean muscle?"
        ]
    }
}

async def in_gemini_api(prompt: str, history: List[ChatMessage]) -> Optional[str]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        contents = []
        # Add system context
        contents.append({
            "role": "user",
            "parts": [{"text": "You are nexaBot, an expert AI health, fitness, and nutrition assistant for the nexaFit platform. Provide helpful, encouraging, concise, and structured answers using markdown formatting (bullet points, bold text). Keep responses under 200 words."}]
        })
        contents.append({
            "role": "model",
            "parts": [{"text": "Understood! I am nexaBot, your friendly AI fitness, nutrition, and nexaFit platform assistant. How can I empower your fitness journey today?"}]
        })

        for msg in history[-6:]: # Keep last 6 messages
            contents.append({
                "role": "user" if msg.role == "user" else "model",
                "parts": [{"text": msg.content}]
            })

        contents.append({
            "role": "user",
            "parts": [{"text": prompt}]
        })

        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json={"contents": contents})
            if resp.status_code == 200:
                data = resp.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
    except Exception as e:
        print(f"Gemini API Exception: {e}")
    return None

@router.get("/generic-questions", response_model=List[GenericQuestionCategory])
async def get_generic_questions():
    """Return categorized generic suggested questions for the AI Chatbot."""
    return GENERIC_QUESTIONS_DATA

@router.post("/query", response_model=ChatQueryResponse)
async def query_chatbot(input_data: ChatQueryInput):
    user_msg = input_data.message.strip()
    if not user_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # 1. Try Gemini API if key is configured
    ai_reply = await in_gemini_api(user_msg, input_data.history or [])
    if ai_reply:
        return ChatQueryResponse(
            reply=ai_reply,
            suggested_questions=[
                "How accurate is the Calorie Predictor in nexaFit?",
                "What are some high-protein vegetarian meals for muscle recovery?",
                "How do I calculate my daily protein and macro targets?"
            ],
            category="AI Assistant"
        )

    # 2. Rule-based / Knowledge Base lookup for fast, accurate response
    msg_lower = user_msg.lower()
    for key, item in KNOWLEDGE_BASE.items():
        for pattern in item["match"]:
            if re.search(pattern, msg_lower):
                return ChatQueryResponse(
                    reply=item["reply"],
                    suggested_questions=item["suggestions"],
                    category=key.title()
                )

    # 3. Default smart fitness fallback
    default_reply = (
        f"🤖 **nexaBot Fitness Assistant**\n\n"
        f"Thanks for reaching out! Regarding **\"{user_msg}\"**:\n\n"
        f"For optimal fitness results, remember that consistency in **nutrition**, **regular exercise**, and **proper recovery** is key.\n\n"
        f"🌟 **Explore nexaFit Features:**\n"
        f"• **Calorie Tracker:** Predict workout calories using heart rate & duration.\n"
        f"• **Meal Planner:** Discover customized recipes based on your diet preferences.\n"
        f"• **Forum:** Connect with fellow fitness enthusiasts and ask questions!\n\n"
        f"Feel free to select one of the suggested questions below!"
    )

    default_suggestions = [
        "How accurate is the Calorie Predictor in nexaFit?",
        "How does nexaFit generate personalized meal plans?",
        "What are some high-protein vegetarian meals for muscle recovery?",
        "How do I update my profile with my height, weight, and goals?"
    ]

    return ChatQueryResponse(
        reply=default_reply,
        suggested_questions=default_suggestions,
        category="General"
    )
