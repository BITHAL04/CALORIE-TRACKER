from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import datetime
from bson import ObjectId

load_dotenv()

class DatabaseManager:
    def __init__(self):
        mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
        db_name = os.getenv('DATABASE_NAME', 'nexafit')
        self.client = AsyncIOMotorClient(mongo_uri)
        self.db = self.client[db_name]
        
        # Collections
        self.calorie_predictions = self.db.calorie_predictions
        self.meal_plans = self.db.meal_plans
        self.user_profiles = self.db.user_profiles 

        self.forum_posts = self.db.forum_posts
        self.forum_comments = self.db.forum_comments


    async def log_calorie_prediction(self, prediction_data):
        return await self.calorie_predictions.insert_one(prediction_data)

    async def log_meal_plan(self, meal_plan_data):
        return await self.meal_plans.insert_one(meal_plan_data)

    async def get_user_predictions(self, user_id):
        predictions = await self.calorie_predictions.find({"user_id": user_id}).to_list(length=100)
        
        for pred in predictions:
            pred["_id"] = str(pred["_id"])

        return predictions


    async def get_user_meal_plans(self, user_id):
        meal_plans = await self.meal_plans.find({"user_id": user_id}).to_list(length=None)
        
        for plan in meal_plans:
            plan['_id'] = str(plan['_id'])
        
        return meal_plans

    async def create_user_profile(self, profile_data):
        # Set created_at and updated_at timestamps
        profile_data["created_at"] = datetime.datetime.utcnow()
        profile_data["updated_at"] = datetime.datetime.utcnow()
        return await self.user_profiles.insert_one(profile_data)

    async def get_user_profile(self, user_id):
        profile = await self.user_profiles.find_one({"user_id": user_id})
        if profile:
            profile["_id"] = str(profile["_id"])
        return profile

    async def update_user_profile(self, user_id, update_data):
        update_data["updated_at"] = datetime.datetime.utcnow()
        
        result = await self.user_profiles.update_one(
            {"user_id": user_id},
            {"$set": update_data}
        )
        
        return result.modified_count > 0

    async def create_forum_post(self, post_data):
        post_data["created_at"] = datetime.datetime.utcnow()
        post_data["updated_at"] = datetime.datetime.utcnow()
        post_data["comment_count"] = 0
        
        # Check for duplicate title (within last 24 hours by same user)
        one_day_ago = datetime.datetime.utcnow() - datetime.timedelta(days=1)
        duplicate = await self.forum_posts.find_one({
            "user_id": post_data["user_id"],
            "title": post_data["title"],
            "created_at": {"$gte": one_day_ago}
        })
        
        if duplicate:
            return None
            
        result = await self.forum_posts.insert_one(post_data)
        return result.inserted_id

    async def get_forum_posts(self, skip=0, limit=10, tag=None):
        query = {}
        if tag:
            query["tags"] = tag
            
        total = await self.forum_posts.count_documents(query)
        cursor = self.forum_posts.find(query).sort("created_at", -1).skip(skip).limit(limit)
        posts = await cursor.to_list(length=limit)
        
        for post in posts:
            post["_id"] = str(post["_id"])
            
        return posts, total

    async def get_forum_post(self, post_id):
        try:
            post = await self.forum_posts.find_one({"_id": ObjectId(post_id)})
            if post:
                post["_id"] = str(post["_id"])
            return post
        except:
            return None

    async def update_forum_post(self, post_id, user_id, update_data):
        update_data["updated_at"] = datetime.datetime.utcnow()
        
        try:
            result = await self.forum_posts.update_one(
                {"_id": ObjectId(post_id), "user_id": user_id},
                {"$set": update_data}
            )
            return result.modified_count > 0
        except:
            return False

    async def delete_forum_post(self, post_id, user_id):
        try:
            result = await self.forum_posts.delete_one(
                {"_id": ObjectId(post_id), "user_id": user_id}
            )
            
            if result.deleted_count > 0:
                # Also delete associated comments
                await self.forum_comments.delete_many({"post_id": post_id})
                return True
            return False
        except:
            return False

    async def create_forum_comment(self, comment_data):
        comment_data["created_at"] = datetime.datetime.utcnow()
        comment_data["updated_at"] = datetime.datetime.utcnow()
        
        result = await self.forum_comments.insert_one(comment_data)
        
        # Increment comment count on post
        await self.forum_posts.update_one(
            {"_id": ObjectId(comment_data["post_id"])},
            {"$inc": {"comment_count": 1}}
        )
        
        return str(result.inserted_id)

    async def get_forum_comments(self, post_id, skip=0, limit=20):
        query = {"post_id": post_id}
        
        total = await self.forum_comments.count_documents(query)
        cursor = self.forum_comments.find(query).sort("created_at", 1).skip(skip).limit(limit)
        comments = await cursor.to_list(length=limit)
        
        for comment in comments:
            comment["_id"] = str(comment["_id"])
            
        return comments, total

    async def delete_forum_comment(self, comment_id, user_id):
        try:
            # Find the comment first to get the post_id
            comment = await self.forum_comments.find_one({"_id": ObjectId(comment_id), "user_id": user_id})
            
            if not comment:
                return False
                
            post_id = comment["post_id"]
            
            # Delete the comment
            result = await self.forum_comments.delete_one(
                {"_id": ObjectId(comment_id), "user_id": user_id}
            )
            
            if result.deleted_count > 0:
                # Decrement comment count on post
                await self.forum_posts.update_one(
                    {"_id": ObjectId(post_id)},
                    {"$inc": {"comment_count": -1}}
                )
                return True
            return False
        except:
            return False