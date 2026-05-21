import { nutritionDB } from './nutritionDB.js';

export function parseNutritionLocally(mealsText) {

  const text = mealsText.toLowerCase();

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  let matched = false;

  for (const [food, values] of Object.entries(nutritionDB)) {

    if (
      text.includes(food) ||
      text.includes(food + 's')
    ) {

      matched = true;

      let qty = 1;

      const patterns = [

        new RegExp(`(\\d+)\\s*${food}s?`),

        new RegExp(`(\\d+)g\\s*${food}s?`),

        new RegExp(`(\\d+)\\s*g\\s*${food}s?`),

        new RegExp(`(\\d+)ml\\s*${food}s?`),

        new RegExp(`(\\d+)\\s*ml\\s*${food}s?`),

        new RegExp(`(\\d+)\\s*cup[s]?\\s*${food}s?`),

        new RegExp(`(\\d+)\\s*bowl[s]?\\s*${food}s?`),
      ];

      for (const pattern of patterns) {

        const match = text.match(pattern);

        if (match) {
          qty = parseInt(match[1]);
          break;
        }
      }

      if (
        text.includes('g ' + food) ||
        text.includes('g' + food)
      ) {
        qty = qty / 100;
      }

      if (
        text.includes('ml ' + food) ||
        text.includes('ml' + food)
      ) {
        qty = qty / 100;
      }

      calories += values.calories * qty;
      protein += values.protein * qty;
      carbs += values.carbs * qty;
      fat += values.fat * qty;
    }
  }

  if (!matched) {

    calories = 400;
    protein = 15;
    carbs = 50;
    fat = 12;
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),

    suggestionEn:
      protein < 30
        ? 'Add more protein foods like eggs, chicken, paneer, or dal.'
        : 'Good protein intake. Stay hydrated and eat vegetables.',

    suggestionHi:
      protein < 30
        ? 'अधिक प्रोटीन जैसे अंडे, चिकन, पनीर या दाल जोड़ें।'
        : 'अच्छा प्रोटीन सेवन। पानी पिएं और सब्जियां खाएं।',

    goalProtein: 120,
    goalCalories: 2200,
  };
}