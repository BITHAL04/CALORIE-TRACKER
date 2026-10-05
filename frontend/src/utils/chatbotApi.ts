import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: string;
  suggestedQuestions?: string[];
}

export interface GenericQuestionCategory {
  category: string;
  icon: string;
  questions: string[];
}

export interface ChatQueryResponse {
  reply: string;
  suggested_questions: string[];
  category?: string;
}

export const FALLBACK_GENERIC_QUESTIONS: GenericQuestionCategory[] = [
  {
    category: "Workouts & Calories",
    icon: "🏋️",
    questions: [
      "How accurate is the Calorie Predictor in nexaFit?",
      "How many calories do I burn during a 30-minute HIIT workout?",
      "What is the best workout split for building lean muscle?",
      "Should I do cardio before or after weight lifting?"
    ]
  },
  {
    category: "Nutrition & Meal Planning",
    icon: "🥗",
    questions: [
      "How does nexaFit generate personalized meal plans?",
      "What are some high-protein vegetarian meals for muscle recovery?",
      "How do I calculate my daily protein and macro targets?",
      "Can I customize meal plans for gluten or lactose intolerance?"
    ]
  },
  {
    category: "Hydration & Recovery",
    icon: "💧",
    questions: [
      "How much water should I drink daily when exercising?",
      "What should I eat before and after a high-intensity workout?",
      "How does sleep affect muscle recovery and weight loss?"
    ]
  },
  {
    category: "nexaFit Platform Help",
    icon: "⚙️",
    questions: [
      "How do I update my profile with my height, weight, and goals?",
      "Where can I find community discussions in the nexaFit Forum?",
      "Is my health and personal fitness data kept secure?"
    ]
  }
];

export async function fetchGenericQuestions(): Promise<GenericQuestionCategory[]> {
  try {
    const response = await axios.get<GenericQuestionCategory[]>(`${API_URL}/chatbot/generic-questions`, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.warn("Backend chatbot API unreachable, using fallback generic questions:", error);
    return FALLBACK_GENERIC_QUESTIONS;
  }
}

export async function sendChatQuery(
  message: string,
  history: ChatMessage[],
  userId: string = 'guest'
): Promise<ChatQueryResponse> {
  try {
    const formattedHistory = history.slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await axios.post<ChatQueryResponse>(
      `${API_URL}/chatbot/query`,
      {
        user_id: userId,
        message,
        history: formattedHistory
      },
      { timeout: 8000 }
    );
    return response.data;
  } catch (error) {
    console.warn("Backend chat query failed, using intelligent client-side fallback:", error);
    
    // Client-side fallback matching if backend is not running
    const lower = message.toLowerCase();

    if (lower.includes("accurate") || lower.includes("accuracy") || lower.includes("calorie predictor")) {
      return {
        reply: "🎯 **nexaFit Calorie Predictor Accuracy**\n\nOur Machine Learning algorithm provides **85-90% accuracy** based on key workout factors like heart rate, exercise duration, body temp, age, and weight.\n\n💡 *Make sure your Profile details are up-to-date for best accuracy!*",
        suggested_questions: [
          "How many calories do I burn during a 30-minute HIIT workout?",
          "How do I update my profile with my height, weight, and goals?",
          "What is the best workout split for building lean muscle?"
        ],
        category: "Workouts & Calories"
      };
    }

    if (lower.includes("hiit") || lower.includes("30-minute") || lower.includes("calories")) {
      return {
        reply: "🔥 **HIIT Calorie Burn Guide**\n\nA 30-minute HIIT session burns around **250–450 calories** depending on intensity, heart rate, and body mass. HIIT also triggers EPOC (excess post-exercise oxygen consumption), burning extra calories hours post-workout!",
        suggested_questions: [
          "What should I eat before and after a high-intensity workout?",
          "How accurate is the Calorie Predictor in nexaFit?",
          "How much water should I drink daily when exercising?"
        ],
        category: "Workouts & Calories"
      };
    }

    if (lower.includes("protein") || lower.includes("vegetarian") || lower.includes("vegan")) {
      return {
        reply: "🥗 **Top High-Protein Vegetarian Choices**\n\n1. **Greek Yogurt / Cottage Cheese** (~25g protein)\n2. **Tofu & Edamame Stir-Fry** (~30g protein)\n3. **Chickpea Quinoa Salad** (~20g protein)\n4. **Seitan / Paneer Skewers** (~32g protein)\n\nTry using our **Meal Planner** to automatically generate a full high-protein weekly menu!",
        suggested_questions: [
          "How does nexaFit generate personalized meal plans?",
          "How do I calculate my daily protein and macro targets?",
          "Can I customize meal plans for gluten or lactose intolerance?"
        ],
        category: "Nutrition & Meal Planning"
      };
    }

    if (lower.includes("meal plan") || lower.includes("spoonacular") || lower.includes("gluten")) {
      return {
        reply: "🍽️ **nexaFit Meal Planner**\n\nOur Meal Planner creates tailored weekly nutrition plans based on your target calories, dietary preferences (Vegan, Keto, Vegetarian), and intolerances (Gluten, Dairy, Peanuts).\n\nGo to the **Meal Planner** tab to generate your plan!",
        suggested_questions: [
          "Can I customize meal plans for gluten or lactose intolerance?",
          "What are some high-protein vegetarian meals for muscle recovery?",
          "How do I calculate my daily protein and macro targets?"
        ],
        category: "Nutrition & Meal Planning"
      };
    }

    if (lower.includes("water") || lower.includes("hydration")) {
      return {
        reply: "💧 **Daily Hydration Tips**\n\nAim for **2.5 to 3.5 Liters** of water per day, plus an additional **500–750 ml** per hour of intense workout sweating. Staying hydrated optimizes muscle performance and recovery!",
        suggested_questions: [
          "What should I eat before and after a high-intensity workout?",
          "How does sleep affect muscle recovery and weight loss?",
          "How many calories do I burn during a 30-minute HIIT workout?"
        ],
        category: "Hydration & Recovery"
      };
    }

    return {
      reply: `🤖 **nexaBot AI Assistant**\n\nThank you for asking about **"${message}"**!\n\nnexaFit provides tools like the **Calorie Tracker**, **Meal Planner**, and **Community Forum** to power your fitness journey.\n\nChoose one of the popular questions below to learn more!`,
      suggested_questions: [
        "How accurate is the Calorie Predictor in nexaFit?",
        "How does nexaFit generate personalized meal plans?",
        "What are some high-protein vegetarian meals for muscle recovery?",
        "How do I update my profile with my height, weight, and goals?"
      ],
      category: "General"
    };
  }
}
