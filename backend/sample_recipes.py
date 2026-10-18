# Offline meal-plan fallback used when SPOONACULAR_API_KEY is unset. Shaped like Spoonacular recipe info.
from urllib.parse import quote


def _image(emoji):
    # Inline SVG so sample recipes have a picture without any network access
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#FDECEE"/>'
           f'<text x="200" y="190" font-size="130" text-anchor="middle">{emoji}</text></svg>')
    return "data:image/svg+xml;charset=utf-8," + quote(svg)


def _r(id, title, img, mins, servings, cal, score, diets, contains):
    return {
        "id": id, "title": title, "image": _image(img),
        "sourceUrl": f"https://www.google.com/search?q={title.replace(' ', '+')}+recipe",
        "readyInMinutes": mins, "servings": servings, "healthScore": score,
        "summary": f"{title} is a balanced dish with about {cal} calories per serving.",
        "diets": diets, "contains": contains,
    }

SAMPLE_RECIPES = [
    _r(1, "Overnight Oats with Berries", "🥣", 10, 1, 350, 78, ["vegetarian"], ["dairy", "gluten", "grain"]),
    _r(2, "Tofu Veggie Stir Fry", "🥢", 25, 2, 420, 85, ["vegan", "vegetarian", "dairy free"], ["soy", "sesame"]),
    _r(3, "Grilled Salmon with Asparagus", "🐟", 30, 2, 510, 90, ["gluten free", "pescetarian", "paleo", "primal", "ketogenic", "whole30"], ["seafood"]),
    _r(4, "Chicken Quinoa Bowl", "🍗", 35, 2, 560, 82, ["gluten free"], ["grain"]),
    _r(5, "Chickpea Spinach Curry", "🍛", 40, 4, 390, 88, ["vegan", "vegetarian", "gluten free"], []),
    _r(6, "Avocado Egg Toast", "🥑", 10, 1, 330, 70, ["vegetarian"], ["egg", "gluten", "wheat", "grain"]),
    _r(7, "Beef and Broccoli Skillet", "🥦", 25, 3, 480, 75, ["gluten free", "paleo", "primal", "whole30", "ketogenic"], ["soy"]),
    _r(8, "Greek Yogurt Parfait", "🍨", 5, 1, 280, 72, ["vegetarian", "gluten free"], ["dairy", "tree-nut"]),
    _r(9, "Shrimp Zucchini Noodles", "🍤", 20, 2, 340, 86, ["gluten free", "pescetarian", "ketogenic", "paleo", "low-fodmap"], ["shellfish", "seafood"]),
]


def sample_meal_plan(diet=None, intolerances=None):
    diet = diet.replace("-", " ").lower() if diet else None
    avoid = set(intolerances or [])
    return [
        r for r in SAMPLE_RECIPES
        if (not diet or diet in r["diets"]) and not avoid & set(r["contains"])
    ]


if __name__ == "__main__":
    assert len(sample_meal_plan()) == len(SAMPLE_RECIPES)
    assert all("vegan" in r["diets"] for r in sample_meal_plan("vegan"))
    assert not any("seafood" in r["contains"] for r in sample_meal_plan(intolerances=["seafood"]))
    assert [r["id"] for r in sample_meal_plan("gluten-free", ["grain"])] == [3, 5, 7, 8, 9]
    print("ok")
