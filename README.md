# nexaFit Monorepo

Welcome to the **nexaFit Monorepo**, a unified repository for both the backend and frontend components of the nexaFit platform. nexaFit is a comprehensive nutrition and wellness platform that offers calorie prediction, meal planning, community forums, and now an **LLM-powered chatbot assistant** to guide users in utilizing the platform effectively.

---

## Features

### Backend Features

1. **Post-Workout Burnt Calorie Prediction**
    - Uses a trained **XGBoost model** to predict calories burnt based on user input.
    - Inputs include gender, age, height, weight, workout duration, heart rate, and body temperature.
2. **Meal Planning**
    - Integrates with the **Spoonacular API** to generate weekly meal plans.
    - Supports dietary preferences, calorie limits, and intolerance filtering.
3. **Forum**
    - Allows users to create posts, comment on discussions, and engage with the community.
    - Features tagging, pagination, and comment tracking for meaningful discussions.
4. **User Management**
    - Handles user profile creation, updates, and retrieval.
5. **Chatbot Assistant**
    - Powered by an LLM (Large Language Model) to assist users in navigating the platform.
    - Provides guidance on calorie prediction inputs, meal planning options, forum usage, and more.

---

### Frontend Features

1. **User Dashboard**
    - Displays daily caloric intake, nutritional data, and suggested meal plans.
    - Visualizes calorie predictions using charts.
2. **Authentication**
    - User registration and login powered by **Clerk**.
3. **Meal Planning**
    - Fetches weekly meal plans from the backend.
4. **Forum**
    - Enables users to participate in discussions, share motivation, and engage with the community.
5. **Chatbot Integration**
    - Frontend interface for interacting with the LLM-powered assistant.
6. **Responsive Design**
    - Optimized for mobile and desktop views.

---

## Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: MongoDB Atlas
- **Machine Learning Model**: XGBoost
- **Containerization**: Docker
- **LLM Integration**: OpenAI GPT or similar language model


### Frontend

- **Framework**: React
- **Styling**: TailwindCSS
- **Deployment**: Vercel
- **HTTP Client**: Axios
- **Authentication**: Clerk

---

## Monorepo Directory Structure

```plaintext
.
├── backend/                  # Backend directory
│   ├── .dockerignore         # Files ignored by Docker
│   ├── .env                  # Environment variables (not included in repo)
│   ├── .gitignore            # Git ignore rules
│   ├── Dockerfile            # Docker build instructions
│   ├── LICENSE               # License file
│   ├── main.py               # FastAPI entry point
│   ├── README.Docker.md      # Docker-specific instructions
│   ├── README.md             # Backend documentation
│   ├── render.yaml           # Render deployment blueprint file
│   ├── requirements.txt      # Python dependencies
│   ├── database/             # Database management files
│   │   └── database.py       # MongoDB database manager
│   ├── ml/                   # Machine learning-related files
│   │   ├── calorie_predictor.json  # Trained XGBoost model
│   │   ├── ml_predictor.py         # Prediction endpoint handler
│   │   └── std_scaler.bin          # Fitted StandardScaler for normalization
│   ├── routes/               # API route handlers
│   │   ├── calorie_prediction.py  # Calorie prediction routes
│   │   ├── chat_assistant.py       # Chatbot assistant routes
│   │   ├── forum.py                # Forum routes
│   │   ├── meal_planning.py        # Meal planning routes
│   │   └── user_profile.py         # User profile routes
│   └── validation/           # Validation models using Pydantic
│       └── models.py         # Pydantic validation models for API requests/responses
├── frontend/                 # Frontend directory
│   ├── public/               # Static assets (e.g., images, favicon)
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page-level components (e.g., Dashboard, Forum)
│   │   ├── styles/           # TailwindCSS configuration files
│   │   └── App.js            # Main React application entry point
│   ├── .env                  # Environment variables (not included in repo)
│   ├── package.json          # Project metadata and dependencies
│   └── tailwind.config.js    # TailwindCSS configuration file
└── README.md                 # Monorepo documentation (this file)
```

---

## Installation

### Prerequisites

- Python 3.9+
- Node.js (v16+)
- Docker (optional for containerization)
- MongoDB Atlas account (for backend database)
- Spoonacular API key (for meal planning)
- OpenAI API key or equivalent (for LLM chatbot assistant)

---

### Quick local run (no API keys needed)

All external services are optional. Without keys: no `MONGODB_URI` → in-memory database (reset on restart), no `SPOONACULAR_API_KEY` → built-in sample recipes, no `VITE_CLERK_PUBLISHABLE_KEY` → local username-only sign-in, no `ANTHROPIC_API_KEY` → the chat assistant answers from 50 built-in diet Q&As (with a key in `backend/.env`, it uses Claude).

```bash
cd backend && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt
.venv/Scripts/python -m uvicorn main:app --port 8001
cd frontend && npm install && npm run dev   # frontend/.env: VITE_API_URL=http://127.0.0.1:8001
```

### Backend Setup

1. Navigate to the `backend` directory:

```bash
cd backend/
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the `backend` directory with the following keys:

```env
MONGODB_URI=&lt;your_mongodb_uri&gt;
DATABASE_NAME=&lt;your_database_name&gt;
SPOONACULAR_API_KEY=&lt;your_spoonacular_api_key&gt;
CALORIE_MODEL_PATH=ml/calorie_predictor.json
OPENAI_API_KEY=&lt;your_openai_api_key&gt;
```

4. Run the application:

```bash
uvicorn main:app --reload
```

5. Access the API documentation at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

1. Navigate to the `frontend` directory:

```bash
cd frontend/
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the `frontend` directory with the following keys:

```bash
REACT_APP_API_URL=&lt;your-backend-api-url&gt;
REACT_APP_CLERK_FRONTEND_API=&lt;your-clerk-frontend-api-key&gt;
REACT_APP_OPENAI_API_KEY=&lt;your-openai-api-key&gt;
```

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

6. Run production build locally:

```bash
npm start
```


---

## Running with Docker

### Backend

1. Navigate to the `backend` directory:

```bash
cd backend/
```

2. Build the Docker image:

```bash
docker build -t nexafit-backend .
```

3. Run the container:

```bash
docker run --env-file .env -p 8000:8000 nexafit-backend 
```

4. Access the API at `http://127.0.0.1:8000`.

---

## Deployment

### Backend Deployment

The backend can be deployed on platforms like Render.com using `render.yaml` or any cloud provider supporting Docker containers.

### Frontend Deployment

The frontend is optimized for deployment on Vercel or Netlify.

To deploy on Vercel:

1. Push changes to your GitHub repository.
2. Link your repository to Vercel.
3. Configure environment variables in Vercel settings.
4. Deploy!

---

## Contributing

We welcome contributions! To contribute:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature"`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or support, please contact [ezahpizza](https://github.com/ezahpizza).
