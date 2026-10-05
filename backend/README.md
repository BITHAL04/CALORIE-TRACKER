# nexaFit Backend

Welcome to the **nexaFit Backend** repository! This project powers the backend for *nexaFit*, a nutrition and wellness platform. The backend is built using **FastAPI** and provides features like post-workout calorie prediction, meal planning, and a community forum for user engagement.

---

## Features

1. **Post-Workout Burnt Calorie Prediction**
    - Uses a pre-trained **XGBoost model** to predict calories burnt based on user input.
    - Inputs include gender, age, height, weight, workout duration, heart rate, and body temperature.
2. **Meal Planning**
    - Integrates with the **Spoonacular API** to generate weekly meal plans.
    - Supports dietary preferences, calorie limits, and intolerance filtering.
3. **Forum**
    - Allows users to create posts, comment on discussions, and engage with the community.
    - Features tagging, pagination, and comment tracking for meaningful discussions.

---

## Tech Stack

- **Backend Framework**: FastAPI
- **Database**: MongoDB Atlas
- **Machine Learning Model**: XGBoost
- **Containerization**: Docker

---

## Project Structure

```plaintext
.
├── .dockerignore          # Files ignored by Docker
├── .env                   # Environment variables (not included in repo)
├── .gitignore             # Git ignore rules
├── calorie_predictor.json # Trained XGBoost model
├── database.py            # MongoDB configurations and database operations
├── Dockerfile             # Docker build instructions
├── forum.py               # Forum feature routes and logic
├── LICENSE                # MIT license
├── main.py                # FastAPI entry point
├── ml_predictor.py        # Calorie prediction logic (ML integration)
├── models.py              # Pydantic models for validation and serialization
├── README.Docker.md       # Docker-specific instructions
├── README.md              # Main README file (this document)
├── requirements.txt       # Python dependencies
└── std_scaler.bin         # Pre-fitted scaler for input normalization
```

---

## Installation

### Prerequisites

- Python 3.9+
- Docker (optional for containerization)
- MongoDB Atlas account
- Spoonacular API key

## API Endpoints

### **Calorie Prediction**

- **POST** `/predict-calories`
    - Input: User workout details (e.g., gender, age, height).
    - Output: Predicted calories burnt.


### **Meal Planning**

- **POST** `/meal-plan`
    - Input: Dietary preferences and calorie limits.
    - Output: Weekly meal plan with detailed recipes.


### **User Profile**

- **POST** `/user/profile`
    - Create a new user profile.
- **GET** `/user/profile/{user_id}`
    - Retrieve user profile details.
- **PUT** `/user/profile/{user_id}`
    - Update an existing user profile.


### **Forum**

- **GET** `/forum/posts`
    - Fetch paginated forum posts (with optional tag filtering).
- **POST** `/forum/posts`
    - Create a new forum post.
- **PUT** `/forum/posts/{post_id}`
    - Update an existing post.
- **DELETE** `/forum/posts/{post_id}`
    - Delete a post along with its comments.

---
