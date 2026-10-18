import os
import re
from typing import List, Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter(prefix="/chat", tags=["chat"])

# Built-in diet FAQ: always shown as suggestions, and used to answer when no ANTHROPIC_API_KEY is set.
FAQ = [
    ("How many calories should I eat per day?", "It depends on age, sex, weight, height and activity. Most adults need roughly 1,600-2,400 kcal (women) or 2,000-3,000 kcal (men). Estimate your maintenance with an online TDEE calculator, then adjust about 500 kcal down to lose or up to gain weight."),
    ("How much protein do I need daily?", "A common target is 1.2-2.0 g of protein per kg of body weight if you train regularly, and about 0.8 g/kg for sedentary adults. Spread it across 3-5 meals."),
    ("What is a calorie deficit?", "A calorie deficit means eating fewer calories than you burn. A deficit of about 300-500 kcal per day typically leads to 0.25-0.5 kg of fat loss per week."),
    ("How much water should I drink a day?", "Around 2-3 litres per day for most adults, more if you sweat a lot or live somewhere hot. Pale yellow urine is a good sign you're hydrated."),
    ("What are macronutrients?", "Macronutrients are protein, carbohydrates and fat. Protein provides 4 kcal/g, carbs 4 kcal/g and fat 9 kcal/g. Alcohol (7 kcal/g) is sometimes counted as a fourth."),
    ("What are micronutrients?", "Micronutrients are vitamins and minerals such as iron, calcium, vitamin D and B12. You need small amounts, but they matter for energy, immunity and bone health. A varied diet of whole foods covers most of them."),
    ("What should I eat before a workout?", "1-3 hours before training, eat a meal with carbs and some protein, like oats with yogurt, a banana with peanut butter, or rice with chicken. Keep fat and fibre moderate so you don't feel heavy."),
    ("What should I eat after a workout?", "Within a couple of hours, have 20-40 g of protein plus some carbs to refuel glycogen. Examples: chicken and rice, a protein shake with fruit, or eggs on toast."),
    ("Is breakfast the most important meal of the day?", "Not necessarily. Total daily intake matters more than meal timing. If breakfast helps you control hunger and energy, eat it; if you're not hungry, skipping it is fine for most people."),
    ("What is intermittent fasting?", "Intermittent fasting restricts eating to a time window, like 16:8 (16 hours fasting, 8 hours eating). It can help some people eat fewer calories, but it isn't magic. Results come from the overall deficit."),
    ("Is the keto diet good for weight loss?", "Keto (very low carb, high fat) can cause quick early weight loss, mostly water. Long-term fat loss is similar to other diets with equal calories. It suits some people but can be hard to sustain."),
    ("What is a vegan diet?", "A vegan diet excludes all animal products: meat, fish, dairy, eggs and often honey. Plan protein (legumes, tofu, tempeh), and supplement vitamin B12. Also watch iron, omega-3, calcium and vitamin D."),
    ("What is the difference between vegan and vegetarian?", "Vegetarians avoid meat and fish but usually eat dairy and eggs. Vegans avoid all animal-derived foods."),
    ("How can I get enough protein as a vegetarian?", "Combine eggs, Greek yogurt, cottage cheese, paneer, lentils, chickpeas, beans, tofu, tempeh, seitan and soy milk. Including a protein source at every meal makes it easy."),
    ("What is the Mediterranean diet?", "It emphasizes vegetables, fruit, whole grains, legumes, nuts, olive oil and fish, with moderate dairy and little red meat or sugar. It is one of the best-researched diets for heart health and longevity."),
    ("What is the paleo diet?", "Paleo focuses on meat, fish, eggs, vegetables, fruit, nuts and seeds. It excludes grains, legumes, dairy and processed foods. It can be healthy but cuts out some nutritious food groups."),
    ("Are carbs bad for you?", "No. Carbs are the body's main fuel, especially for exercise. Prefer whole grains, fruit, vegetables and legumes over refined sugar and white flour, and match portions to your activity level."),
    ("What are healthy fats?", "Unsaturated fats from olive oil, avocado, nuts, seeds and oily fish (omega-3) support heart and brain health. Limit trans fats, and keep saturated fat moderate."),
    ("Is sugar bad for me?", "Added sugar in excess raises the risk of weight gain, tooth decay and metabolic issues. Aim for under 10% of calories (ideally under 5%) from added sugars. Natural sugar in whole fruit is fine."),
    ("How much fibre should I eat?", "Aim for about 25-38 g per day from vegetables, fruit, whole grains, legumes, nuts and seeds. Increase gradually and drink enough water."),
    ("What are good high-protein snacks?", "Greek yogurt, cottage cheese, boiled eggs, jerky, edamame, roasted chickpeas, protein bars, tuna packs, cheese sticks, or a protein shake."),
    ("What are healthy low-calorie snacks?", "Fruit, carrot or cucumber sticks with hummus, air-popped popcorn, Greek yogurt, a boiled egg, or a small handful of nuts."),
    ("How do I lose belly fat?", "You can't spot-reduce fat. Belly fat goes down with overall fat loss: a calorie deficit, enough protein, strength training, good sleep and lower stress."),
    ("How do I gain weight healthily?", "Eat 300-500 kcal above maintenance, prioritise protein, and add calorie-dense whole foods like nuts, nut butter, olive oil, rice, oats, whole milk and dried fruit. Combine this with strength training so the gain is mostly muscle."),
    ("How do I build muscle through diet?", "Eat in a slight calorie surplus and get 1.6-2.2 g of protein per kg body weight. Get enough carbs to fuel training, and stay consistent with progressive strength training and sleep."),
    ("Should I take protein powder?", "It's optional. Protein powder is just a convenient food that helps if you struggle to hit your protein target from meals. Whey and pea/soy blends are common choices."),
    ("Is creatine safe?", "Creatine monohydrate is one of the most researched supplements and is safe for healthy adults at 3-5 g per day. It improves strength and power. Check with a doctor if you have kidney issues."),
    ("Do I need to take vitamins or supplements?", "Most people can meet their needs from a balanced diet. Common exceptions are vitamin D (low sun exposure), B12 (vegans), iron (some women) and omega-3 (if you don't eat fish). Get blood tests before supplementing heavily."),
    ("What foods are high in iron?", "Red meat, liver, shellfish, lentils, chickpeas, beans, tofu, spinach, pumpkin seeds and fortified cereals. Pair plant iron with vitamin C (citrus, peppers) to improve absorption."),
    ("What foods are high in calcium?", "Milk, yogurt, cheese, fortified plant milks, tofu set with calcium, sardines with bones, almonds, broccoli and leafy greens like kale."),
    ("How can I get more vitamin D?", "Sensible sun exposure, oily fish, egg yolks, fortified milk or cereals, and UV-exposed mushrooms. Many people in low-sun climates benefit from a 1,000-2,000 IU daily supplement."),
    ("What foods are rich in omega-3?", "Salmon, mackerel, sardines, trout, anchovies, plus plant sources like flaxseed, chia seeds, hemp seeds and walnuts."),
    ("How do I start meal prepping?", "Pick 2-3 simple recipes, cook a protein, a carb and roasted veggies in bulk, and portion into containers for 3-4 days. Keep sauces separate so food stays fresh. Our Meal Planner can generate a weekly plan for you."),
    ("How can I reduce sugar cravings?", "Eat regular balanced meals with protein and fibre, sleep well, and don't keep sweets in easy reach. Swap in fruit or dark chocolate, and stay hydrated. Cravings usually fade after a couple of weeks of lower sugar intake."),
    ("Is eating late at night bad?", "Calories count the same at any time. Late eating only becomes a problem if it leads to overeating or poor sleep, so keep late meals light if they affect your sleep."),
    ("How many meals a day should I eat?", "Whatever suits your schedule. 2-5 meals can all work. What matters most is total calories, protein and food quality."),
    ("What is a balanced plate?", "Fill half the plate with vegetables, a quarter with lean protein and a quarter with whole-grain carbs, plus a small amount of healthy fat."),
    ("Are eggs healthy?", "Yes. Eggs are an affordable source of high-quality protein, choline and vitamins. For most healthy people, 1-3 eggs a day is fine."),
    ("Is coffee bad for health?", "For most adults, up to about 400 mg of caffeine (3-4 cups of coffee) a day is safe and may even have health benefits. Avoid it late in the day if it disrupts sleep, and watch added sugar and cream."),
    ("Does alcohol affect weight loss?", "Yes. Alcohol adds calories (7 kcal/g), lowers inhibitions around food, and can impair sleep and recovery. Limit drinks and choose lower-calorie options if you're cutting."),
    ("What is the glycemic index?", "The glycemic index (GI) ranks carbs by how fast they raise blood sugar. Low-GI foods like oats, legumes and most fruit give steadier energy than high-GI foods like white bread and sugary drinks."),
    ("What diet is good for diabetes?", "Focus on consistent, portion-controlled carbs from low-GI sources, plenty of vegetables, lean protein and healthy fats. Limit sugary drinks and refined carbs. Work with a doctor or dietitian, especially if you take medication."),
    ("What diet helps lower cholesterol?", "Eat more soluble fibre (oats, beans, barley), nuts, olive oil, oily fish and plant sterols. Reduce saturated and trans fats from fried and processed foods and fatty meats."),
    ("What diet helps with high blood pressure?", "The DASH diet: plenty of fruit, vegetables, whole grains, low-fat dairy and nuts. Keep sodium under about 2,300 mg a day (ideally 1,500 mg) and limit alcohol."),
    ("How much salt should I eat per day?", "Keep salt under about 5-6 g per day (around 2,000-2,300 mg sodium). Most salt comes from processed and restaurant food, not the salt shaker."),
    ("What is a gluten-free diet?", "It excludes gluten, a protein in wheat, barley and rye. It's essential for people with celiac disease or gluten sensitivity, but offers no proven benefit for others."),
    ("What foods help with digestion?", "Fibre-rich foods (vegetables, fruit, whole grains, legumes), fermented foods (yogurt, kefir, kimchi, sauerkraut), and enough water and movement support healthy digestion."),
    ("How can I eat healthy on a budget?", "Buy staples like oats, rice, lentils, beans, eggs, frozen vegetables and seasonal fruit. Cook in batches, plan meals, and buy store brands."),
    ("How fast can I safely lose weight?", "About 0.5-1% of body weight per week (roughly 0.25-1 kg) is a safe and sustainable rate. Faster loss increases muscle loss and makes the weight easier to regain."),
    ("Why am I not losing weight on my diet?", "Common reasons: underestimating portions or snacks, water retention, eating more on weekends, less daily movement, or a plateau as weight drops. Track intake accurately for 2 weeks and check the trend, not single weigh-ins."),
]
assert len(FAQ) == 50

STOP = {"a", "an", "the", "i", "my", "me", "is", "are", "do", "does", "to", "of", "for", "in", "on", "and", "or",
        "what", "how", "should", "can", "much", "many", "it", "be", "with", "you", "your", "good", "about", "per"}


def _words(text: str) -> set:
    return {w.rstrip("s") for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOP}


def faq_answer(message: str) -> str:
    msg = _words(message)
    best, score = None, 0
    for q, a in FAQ:
        s = len(msg & _words(q))
        if s > score:
            best, score = a, s
    if best:
        return best
    return ("I'm not sure about that one. Try one of the suggested questions, or ask about calories, protein, "
            "macros, diets (keto, vegan, Mediterranean), meal timing, supplements or weight goals.")


SYSTEM = ("You are nexaFit's friendly diet and nutrition assistant. Give concise, practical, evidence-based answers "
          "(under 150 words). The nexaFit app has a Calorie Tracker (predicts calories burned from a workout), "
          "a Meal Planner (weekly plans by diet and intolerances), a Profile page and a community Forum - "
          "point users to them when relevant. For medical conditions, recommend seeing a doctor or dietitian.")


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(..., max_length=4000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    history: List[ChatTurn] = Field(default_factory=list, max_length=20)


@router.get("/questions")
async def list_questions():
    return [q for q, _ in FAQ]


@router.post("")
async def chat(req: ChatRequest):
    if os.getenv("ANTHROPIC_API_KEY"):
        try:
            import anthropic
            client = anthropic.AsyncAnthropic()
            response = await client.beta.messages.create(
                model="claude-opus-5-5",
                max_tokens=2000,
                output_config={"effort": "low"},
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",
                system=SYSTEM,
                messages=[*[t.model_dump() for t in req.history], {"role": "user", "content": req.message}],
            )
            if response.stop_reason != "refusal":
                text = "".join(b.text for b in response.content if b.type == "text").strip()
                if text:
                    return {"reply": text, "source": "claude"}
        except Exception as e:  # network/auth/rate-limit: keep the chat usable with the built-in answers
            print(f"Claude API error, using FAQ fallback: {e}")
    return {"reply": faq_answer(req.message), "source": "faq"}


if __name__ == "__main__":
    assert faq_answer("How many calories should I eat per day?") == FAQ[0][1]
    assert faq_answer("how much protein do I need") == FAQ[1][1]
    assert faq_answer("tell me about keto") == FAQ[10][1]
    assert "not sure" in faq_answer("zzz qqq")
    print("ok")
