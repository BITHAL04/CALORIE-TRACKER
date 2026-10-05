# 🏋️‍♂️ AI-Powered Nutrition & Calorie Tracker Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg)](https://vitejs.dev/)

A complete, modern health, nutrition, and workout tracking application powered by Machine Learning and AI. It features an **AI Fitness Chatbot** with categorized generic question suggestions, a **Post-Workout Calorie Predictor** built with XGBoost, an **AI Meal Planner** powered by Spoonacular, a **Community Forum**, and full **User Profile** management.

---

## 🔥 Features

### 🤖 1. AI Fitness & Nutrition Chatbot
- **Categorized Generic Question Chips**: Click-to-ask suggestions across:
  - 🏋️ **Workouts & Calories**: HIIT burn estimates, accuracy info, workout splits, cardio vs lifting order.
  - 🥗 **Nutrition & Meal Planning**: High-protein vegetarian meals, macro calculations, gluten/lactose dietary customization.
  - 💧 **Hydration & Recovery**: Daily fluid guidelines, pre/post workout meals, sleep & HGH recovery.
  - ⚙️ **Platform Help**: Profile management, community forum, and security.
- **Dual AI Engine**: Seamless integration with **Gemini AI API** when configured, with fallback to an intelligent domain knowledge engine.
- **Interactive Floating UI**: Glassmorphic card design, typing animation, markdown support, timestamping, and follow-up suggestion chips.

### 📊 2. Post-Workout Calorie Predictor
- Predicts calories burned during workouts with **85–90% accuracy** using a pre-trained **XGBoost Regressor** model.
- Evaluates key physiological parameters: Heart Rate, Workout Duration, Body Temperature, Age, Gender, Height, and Weight.

### 🍽️ 3. AI Meal Planner
- Generates customized weekly meal plans tailored to specific calorie limits, diet types (Vegetarian, Vegan, Keto, Paleo, etc.), and food intolerances.
- Fetches detailed recipe instructions and nutritional breakdowns via Spoonacular API.

### 💬 4. Community Forum
- Interactive discussion hub to post fitness tips, ask questions, tag topics, and comment on peer posts.
- Features paginated feeds, tag filtering, and real-time comment counters.

### 👤 5. User Profiles & Authentication
- Secure user authentication managed by **Clerk**.
- Customizable user profiles that automatically feed into Calorie Predictions and Meal Planning logic.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS, Shadcn UI primitives, Framer Motion
- **Authentication**: Clerk React SDK
- **Icons**: Lucide React
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.9+)
- **ML Engine**: XGBoost Regressor, Scikit-Learn (StandardScaler)
- **Database**: MongoDB Atlas (Async Motor client)
- **External APIs**: Gemini AI API, Spoonacular API

---

## 📁 Repository Structure

```plaintext
CALORIE-TRACKER/
├── backend/
│   ├── main.py                # FastAPI entry point & API route router
│   ├── chatbot.py             # AI Chatbot router & generic question engine
│   ├── database.py            # MongoDB AsyncIOMotor manager
│   ├── ml_predictor.py        # XGBoost calorie prediction logic
│   ├── models.py              # Pydantic data schemas
│   ├── forum.py               # Community forum endpoints
│   ├── calorie_predictor.json # Pre-trained XGBoost ML model
│   ├── std_scaler.bin         # Scaler weights for feature normalization
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── chatbot/        # AIChatbot component & generic chips UI
│   │   │   ├── layouts/        # AppLayout, HomeLayout, InfoPageLayout
│   │   │   ├── calorie-page/   # Calorie tracker forms & results
│   │   │   ├── meal-planner/   # Meal plan input & recipe cards
│   │   │   └── forum/          # Forum posts, comments, & modals
│   │   ├── pages/              # Home, HelpCenter, CaloriePredictor, MealPlanner, Profile, Forum
│   │   ├── utils/              # chatbotApi.ts, forumApi.ts, mealPlanOptions.ts
│   │   └── App.tsx             # Main router & Clerk Provider
│   ├── package.json            # Node.js dependencies
│   └── vite.config.ts          # Vite build configuration
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Localhost Quickstart Guide

### Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.9+

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/BITHAL04/CALORIE-TRACKER.git
cd CALORIE-TRACKER
```

---

### Step 2: Start the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Environment Variables (optional `.env` file in `backend/`):
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DATABASE_NAME=calorie_tracker
   SPOONACULAR_API_KEY=your_spoonacular_key
   GEMINI_API_KEY=your_gemini_key
   ```

4. Start the FastAPI development server:
   ```bash
   python -m uvicorn main:app --reload --port 8000
   ```
   *The backend server will run at:* **`http://localhost:8000`** *(Interactive API Docs at `http://localhost:8000/docs`)*

---

### Step 3: Start the Frontend Server

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run at:* **`http://localhost:8080`**

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/chatbot/query` | Query AI assistant for answers & suggestions |
| `GET` | `/chatbot/generic-questions` | Fetch categorized generic question chips |
| `POST` | `/predict-calories` | Predict workout burnt calories via ML model |
| `POST` | `/meal-plan` | Generate weekly meal plans filtered by diet & limit |
| `GET/POST` | `/user/profile` | Manage user profiles |
| `GET/POST` | `/forum/posts` | Retrieve and create community forum posts |

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
