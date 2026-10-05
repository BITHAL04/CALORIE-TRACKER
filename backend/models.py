from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Annotated, Any
from bson import ObjectId
import datetime
from pydantic_core import core_schema

# Make sure the PyObjectId class handles serialization properly
class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ]),
        ])

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(str(v)):
            raise ValueError("Invalid ObjectId")
        return str(v)

class CaloriePredictionInput(BaseModel):
    user_id: str
    gender: int  # 0 for male, 1 for female
    age: float
    height: float
    weight: float
    duration: float
    heart_rate: float
    body_temp: float

class CaloriePredictionResult(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    input_data: CaloriePredictionInput
    predicted_calories: float
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True, 
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class MealPlanRequest(BaseModel):
    diet_type: Optional[str] = None
    max_calories: Optional[int] = None
    intolerances: Optional[List[str]] = None
    meal_type: Optional[str] = None

class MealPlanResult(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    request_data: MealPlanRequest
    recipes: List[dict]
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True, 
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )

class UserProfile(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    gender: int 
    age: float
    height: float
    weight: float
    intolerances: Optional[List[str]] = None
    meal_type: Optional[str] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class ForumPost(BaseModel):
    id: Annotated[str, PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    user_id: str
    title: str = Field(..., min_length=3, max_length=100)
    content: str = Field(..., min_length=10, max_length=5000)
    tags: List[str] = Field(default_factory=list)
    comment_count: int = Field(default=0)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class ForumPostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=100)
    content: Optional[str] = Field(None, min_length=10, max_length=5000)
    tags: Optional[List[str]] = None
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class ForumComment(BaseModel):
    id: Annotated[str, PyObjectId] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    post_id: str
    user_id: str
    content: str = Field(..., min_length=1, max_length=1000)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class ForumCommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int
    model_config = ConfigDict(arbitrary_types_allowed=True)