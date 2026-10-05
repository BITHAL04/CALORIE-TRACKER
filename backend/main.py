import os
import httpx
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import CaloriePredictionInput, CaloriePredictionResult, MealPlanRequest, MealPlanResult, UserProfile
from ml_predictor import CaloriePredictor
from database import DatabaseManager
from forum import router as forum_router
from chatbot import router as chatbot_router

load_dotenv()

app = FastAPI(  title="nexaFit",
                description="A complete nutrition and lifestyle support platform.",
                version="1.2.0",)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(forum_router)
app.include_router(chatbot_router)

# Initialize ML Predictor and Database
model_path = os.getenv('CALORIE_MODEL_PATH', os.path.join(os.path.dirname(__file__), 'calorie_predictor.json'))
ml_predictor = CaloriePredictor(model_path)
db_manager = DatabaseManager()

# -------------------------------------------------------------------
async def generate_meal_plan(diet: str = None, calories: int = None, intolerances: list = None):
    api_key = os.getenv("SPOONACULAR_API_KEY")
    url = "https://api.spoonacular.com/mealplanner/generate"

    params = {
        "apiKey": api_key,
        "timeFrame": "week"
    }

    if diet:
        params["diet"] = diet
    if calories:
        params["targetCalories"] = calories
    if intolerances:
        params["intolerances"] = ",".join(intolerances)

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        print(f"Meal plan GET URL: {response.url}")
        response.raise_for_status()
        return response.json()

# -------------------------------------------------------------------
async def fetch_recipe_details(recipe_ids: list):
    api_key = os.getenv("SPOONACULAR_API_KEY")
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(
                f"https://api.spoonacular.com/recipes/{recipe_id}/information",
                params={"apiKey": api_key}
            ) for recipe_id in recipe_ids
        ]
        responses = await asyncio.gather(*tasks)
        return [
            r.json() for r in responses if r.status_code == 200
        ]

# -------------------------------------------------------------------
@app.post("/predict-calories")
async def predict_calories(input_data: CaloriePredictionInput):
    try:
        # Check if we need to get profile data
        if not all([
            input_data.gender is not None,
            input_data.age is not None,
            input_data.height is not None,
            input_data.weight is not None
        ]):
            # Get user profile to fill in missing data
            profile = await db_manager.get_user_profile(input_data.user_id)
            if profile:
                input_data.gender = input_data.gender if input_data.gender is not None else profile.get("gender")
                input_data.age = input_data.age if input_data.age is not None else profile.get("age")
                input_data.height = input_data.height if input_data.height is not None else profile.get("height")
                input_data.weight = input_data.weight if input_data.weight is not None else profile.get("weight")
        
        features = [
            input_data.gender,
            input_data.age,
            input_data.height,
            input_data.weight,
            input_data.duration,
            input_data.heart_rate,
            input_data.body_temp
        ]

        predicted_calories = ml_predictor.predict(features)

        prediction_entry = {
            "user_id": input_data.user_id,
            "input_data": input_data.model_dump(),
            "predicted_calories": predicted_calories
        }

        result = await db_manager.log_calorie_prediction(prediction_entry)
        
        # Convert ObjectId to string before returning
        prediction_entry["_id"] = str(result.inserted_id)
        
        return CaloriePredictionResult(**prediction_entry)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# -------------------------------------------------------------------
@app.post("/meal-plan")
async def create_meal_plan(request: MealPlanRequest, user_id: str):
    try:
        # Get user profile to supplement request data
        profile = await db_manager.get_user_profile(user_id)
        
        # Use profile data if available and not specified in request
        if profile:
            if request.diet_type is None and profile.get("meal_type"):
                request.diet_type = profile.get("meal_type")
                
            if request.intolerances is None and profile.get("intolerances"):
                request.intolerances = profile.get("intolerances")
        
        # Generate plan
        meal_plan = await generate_meal_plan(
            diet=request.diet_type,
            calories=request.max_calories,
            intolerances=request.intolerances
        )

        if not meal_plan.get("week"):
            raise HTTPException(status_code=404, detail="No meals found. Try relaxing your filters.")

        # Get all recipe IDs
        recipe_ids = [
            meal["id"]
            for day in meal_plan["week"].values()
            for meal in day.get("meals", [])
        ]

        # Fetch all recipe details in parallel
        detailed_recipes = await fetch_recipe_details(recipe_ids)

        # Prepare and log
        meal_plan_entry = {
            "user_id": user_id,
            "request_data": request.model_dump(),
            "recipes": detailed_recipes
        }

        result = await db_manager.log_meal_plan(meal_plan_entry)
        
        # Convert ObjectId to string
        meal_plan_entry["_id"] = str(result.inserted_id)
        
        return MealPlanResult(**meal_plan_entry)

    except httpx.RequestError as e:
        print(f"Spoonacular API Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Spoonacular API error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# -------------------------------------------------------------------
@app.post("/user/profile")
async def create_user_profile(profile: UserProfile):
    try:
        # Check if profile already exists
        existing_profile = await db_manager.get_user_profile(profile.user_id)
        if existing_profile:
            raise HTTPException(status_code=400, detail="Profile already exists for this user")
        
        # Create new profile
        profile_data = profile.model_dump(by_alias=True)
        await db_manager.create_user_profile(profile_data)
        return {"message": "Profile created successfully"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
@app.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    try:
        profile = await db_manager.get_user_profile(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        return profile
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
@app.put("/user/profile/{user_id}")
async def update_user_profile(user_id: str, profile_update: UserProfile):
    try:
        # Check if profile exists
        existing_profile = await db_manager.get_user_profile(user_id)
        if not existing_profile:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        # Update profile
        update_data = profile_update.model_dump(exclude={"id", "user_id", "created_at"}, 
                                                exclude_unset=True, by_alias=True)
        
        success = await db_manager.update_user_profile(user_id, update_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update profile")
        
        return {"message": "Profile updated successfully"}
    
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------------------------------------------------
@app.get("/user/predictions/{user_id}")
async def get_user_predictions(user_id: str):
    return await db_manager.get_user_predictions(user_id)

@app.get("/user/meals/{user_id}")
async def get_user_meal_plans(user_id: str):
    return await db_manager.get_user_meal_plans(user_id)