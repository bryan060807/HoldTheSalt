export interface Ingredient {
  id: string;
  name: string;
  amount: number | string;
  unit: string;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NutritionalInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  dietary: string[];
  ingredients: Ingredient[];
  instructions: string[];
  nutritionalInfo: NutritionalInfo;
  image: string;
  author: string;
  authorId?: string;
  reviews: Review[];
  averageRating: number;
  createdAt: string;
}

export const initialRecipes: Recipe[] = [
  {
    "id": "r1",
    "title": "Classic Beef Wellington",
    "description": "A traditional English dish of beef tenderloin coated with pâte de champignons, wrapped in puff pastry, and baked.",
    "prepTime": "45 mins",
    "cookTime": "45 mins",
    "servings": 6,
    "difficulty": "Hard",
    "cuisine": "English",
    "dietary": [],
    "ingredients": [
      {
        "name": "Beef tenderloin center cut",
        "amount": 2,
        "unit": "lbs"
      },
      {
        "name": "Mushrooms",
        "amount": 1,
        "unit": "lb"
      },
      {
        "name": "Prosciutto",
        "amount": 6,
        "unit": "slices"
      },
      {
        "name": "Puff pastry",
        "amount": 1,
        "unit": "sheet"
      },
      {
        "name": "Dijon mustard",
        "amount": 2,
        "unit": "tbsp"
      }
    ],
    "instructions": [
      "Sear the beef in a hot pan.",
      "Brush the beef with mustard.",
      "Make the duxelles by finely chopping mushrooms and cooking until dry.",
      "Lay out prosciutto, spread duxelles, and wrap the beef.",
      "Wrap the entire log tightly in puff pastry.",
      "Bake at 400F for 30 minutes, until pastry is golden."
    ],
    "nutritionalInfo": {
      "calories": 650,
      "protein": "45g",
      "carbs": "30g",
      "fat": "35g"
    },
    "image": "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.9,
    "createdAt": "2026-05-10T12:00:00Z"
  },
  {
    "id": "r2",
    "title": "Miso Glazed Black Cod",
    "description": "A sublime, melt-in-your-mouth seafood dish made famous by Nobu.",
    "prepTime": "15 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Medium",
    "cuisine": "Japanese",
    "dietary": [
      "Dairy-Free",
      "Pescatarian"
    ],
    "ingredients": [
      {
        "name": "Black cod fillets",
        "amount": 4,
        "unit": "pcs"
      },
      {
        "name": "White miso paste",
        "amount": 0.25,
        "unit": "cup"
      },
      {
        "name": "Sake",
        "amount": 2,
        "unit": "tbsp"
      },
      {
        "name": "Mirin",
        "amount": 2,
        "unit": "tbsp"
      },
      {
        "name": "Sugar",
        "amount": 1,
        "unit": "tbsp"
      }
    ],
    "instructions": [
      "Mix miso, sake, mirin, and sugar for the marinade.",
      "Marinate the cod for 24-48 hours.",
      "Broil the fish for 10-15 minutes until caramelized."
    ],
    "nutritionalInfo": {
      "calories": 320,
      "protein": "25g",
      "carbs": "10g",
      "fat": "20g"
    },
    "image": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 5,
    "createdAt": "2026-05-11T12:00:00Z"
  },
  {
    "id": "r3",
    "title": "Vegan Lentil Shepherd's Pie",
    "description": "A hearty, plant-based twist on the classic comfort food.",
    "prepTime": "20 mins",
    "cookTime": "40 mins",
    "servings": 6,
    "difficulty": "Easy",
    "cuisine": "British",
    "dietary": [
      "Vegan",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Brown lentils",
        "amount": 1.5,
        "unit": "cups"
      },
      {
        "name": "Carrots",
        "amount": 2,
        "unit": "whole"
      },
      {
        "name": "Peas",
        "amount": 1,
        "unit": "cup"
      },
      {
        "name": "Potatoes",
        "amount": 2,
        "unit": "lbs"
      },
      {
        "name": "Vegetable broth",
        "amount": 3,
        "unit": "cups"
      }
    ],
    "instructions": [
      "Boil and mash the potatoes.",
      "Simmer lentils with carrots, peas, and broth until tender.",
      "Transfer lentil mixture to a baking dish.",
      "Top with mashed potatoes and bake at 400F for 20 mins."
    ],
    "nutritionalInfo": {
      "calories": 310,
      "protein": "15g",
      "carbs": "55g",
      "fat": "3g"
    },
    "image": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.7,
    "createdAt": "2026-05-12T12:00:00Z"
  },
  {
    "id": "r4",
    "title": "Authentic Pad Thai",
    "description": "Street-food style Pad Thai with a perfect balance of sweet, sour, and salty flavors.",
    "prepTime": "20 mins",
    "cookTime": "10 mins",
    "servings": 2,
    "difficulty": "Medium",
    "cuisine": "Thai",
    "dietary": [
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Rice noodles",
        "amount": 8,
        "unit": "oz"
      },
      {
        "name": "Shrimp",
        "amount": 0.5,
        "unit": "lb"
      },
      {
        "name": "Eggs",
        "amount": 2,
        "unit": "large"
      },
      {
        "name": "Tamarind paste",
        "amount": 2,
        "unit": "tbsp"
      },
      {
        "name": "Fish sauce",
        "amount": 2,
        "unit": "tbsp"
      },
      {
        "name": "Peanuts",
        "amount": 0.25,
        "unit": "cup"
      }
    ],
    "instructions": [
      "Soak noodles in warm water until pliable.",
      "Mix tamarind, fish sauce, and a pinch of sugar for the sauce.",
      "Stir-fry shrimp, push aside, and scramble eggs.",
      "Add noodles and sauce, toss well.",
      "Garnish with crushed peanuts and bean sprouts."
    ],
    "nutritionalInfo": {
      "calories": 450,
      "protein": "25g",
      "carbs": "60g",
      "fat": "15g"
    },
    "image": "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.8,
    "createdAt": "2026-05-13T12:00:00Z"
  },
  {
    "id": "r5",
    "title": "Ratatouille Provencal",
    "description": "A beautiful, thinly sliced vegetable medley roasted to perfection.",
    "prepTime": "30 mins",
    "cookTime": "45 mins",
    "servings": 4,
    "difficulty": "Medium",
    "cuisine": "French",
    "dietary": [
      "Vegan",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Eggplant",
        "amount": 1,
        "unit": "whole"
      },
      {
        "name": "Zucchini",
        "amount": 2,
        "unit": "whole"
      },
      {
        "name": "Roma tomatoes",
        "amount": 4,
        "unit": "whole"
      },
      {
        "name": "Tomato sauce",
        "amount": 1,
        "unit": "cup"
      },
      {
        "name": "Olive oil",
        "amount": 3,
        "unit": "tbsp"
      }
    ],
    "instructions": [
      "Spread tomato sauce in a baking dish.",
      "Thinly slice vegetables.",
      "Arrange slices in an alternating pattern over the sauce.",
      "Drizzle with oil and herbs, bake covered at 375F for 40 mins."
    ],
    "nutritionalInfo": {
      "calories": 180,
      "protein": "4g",
      "carbs": "18g",
      "fat": "12g"
    },
    "image": "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.6,
    "createdAt": "2026-05-14T12:00:00Z"
  },
  {
    "id": "r6",
    "title": "Spicy Tuna Crispy Rice",
    "description": "Crispy fried sushi rice topped with spicy tuna, a popular izakaya dish.",
    "prepTime": "30 mins",
    "cookTime": "20 mins",
    "servings": 4,
    "difficulty": "Hard",
    "cuisine": "Japanese",
    "dietary": [
      "Pescatarian",
      "Dairy-Free"
    ],
    "ingredients": [
      {
        "name": "Sushi rice",
        "amount": 1,
        "unit": "cup"
      },
      {
        "name": "Sashimi-grade tuna",
        "amount": 0.5,
        "unit": "lb"
      },
      {
        "name": "Sriracha",
        "amount": 1,
        "unit": "tbsp"
      },
      {
        "name": "Sesame oil",
        "amount": 1,
        "unit": "tsp"
      },
      {
        "name": "Jalapeno",
        "amount": 1,
        "unit": "whole"
      }
    ],
    "instructions": [
      "Cook sushi rice, press into a mold, and refrigerate.",
      "Dice tuna and mix with sriracha and sesame oil.",
      "Cut rice into rectangles and pan-fry until crispy.",
      "Top crispy rice with spicy tuna and a jalapeno slice."
    ],
    "nutritionalInfo": {
      "calories": 250,
      "protein": "18g",
      "carbs": "30g",
      "fat": "6g"
    },
    "image": "https://images.unsplash.com/photo-1626200419188-f56280156110?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.9,
    "createdAt": "2026-05-14T15:00:00Z"
  },
  {
    "id": "r7",
    "title": "Creamy Tuscan Chicken",
    "description": "Pan-seared chicken breasts in a rich garlic, sun-dried tomato, and spinach cream sauce.",
    "prepTime": "10 mins",
    "cookTime": "20 mins",
    "servings": 4,
    "difficulty": "Easy",
    "cuisine": "Italian",
    "dietary": [
      "Keto",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Chicken breast",
        "amount": 2,
        "unit": "lbs"
      },
      {
        "name": "Heavy cream",
        "amount": 1,
        "unit": "cup"
      },
      {
        "name": "Sun-dried tomatoes",
        "amount": 0.5,
        "unit": "cup"
      },
      {
        "name": "Spinach",
        "amount": 2,
        "unit": "cups"
      },
      {
        "name": "Parmesan cheese",
        "amount": 0.5,
        "unit": "cup"
      }
    ],
    "instructions": [
      "Season and pan-sear the chicken until cooked through. Remove from pan.",
      "Deglaze pan, add heavy cream, tomatoes, and parmesan.",
      "Simmer until slightly thickened, wilt in spinach.",
      "Return chicken to pan and serve."
    ],
    "nutritionalInfo": {
      "calories": 480,
      "protein": "45g",
      "carbs": "8g",
      "fat": "30g"
    },
    "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.8,
    "createdAt": "2026-05-15T10:00:00Z"
  },
  {
    "id": "r8",
    "title": "Elote (Mexican Street Corn)",
    "description": "Grilled corn on the cob slathered in mayonnaise, cotija cheese, chili powder, and lime.",
    "prepTime": "10 mins",
    "cookTime": "15 mins",
    "servings": 4,
    "difficulty": "Easy",
    "cuisine": "Mexican",
    "dietary": [
      "Vegetarian",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Ears of corn",
        "amount": 4,
        "unit": "whole"
      },
      {
        "name": "Mayonnaise",
        "amount": 0.25,
        "unit": "cup"
      },
      {
        "name": "Cotija cheese",
        "amount": 0.5,
        "unit": "cup"
      },
      {
        "name": "Chili powder",
        "amount": 1,
        "unit": "tsp"
      },
      {
        "name": "Lime",
        "amount": 1,
        "unit": "whole"
      }
    ],
    "instructions": [
      "Grill corn until charred on all sides.",
      "Brush warm corn with mayonnaise.",
      "Roll in cotija cheese and sprinkle with chili powder.",
      "Serve with lime wedges."
    ],
    "nutritionalInfo": {
      "calories": 220,
      "protein": "6g",
      "carbs": "20g",
      "fat": "14g"
    },
    "image": "https://images.unsplash.com/photo-1599351431202-1e0f0124310d?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.5,
    "createdAt": "2026-05-15T12:00:00Z"
  },
  {
    "id": "r9",
    "title": "Matcha Mille Crepe Cake",
    "description": "A stunning dessert made with layers of thin green tea crepes and matcha pastry cream.",
    "prepTime": "60 mins",
    "cookTime": "30 mins",
    "servings": 8,
    "difficulty": "Hard",
    "cuisine": "French-Japanese",
    "dietary": [
      "Vegetarian"
    ],
    "ingredients": [
      {
        "name": "All-purpose flour",
        "amount": 1.5,
        "unit": "cups"
      },
      {
        "name": "Matcha powder",
        "amount": 3,
        "unit": "tbsp"
      },
      {
        "name": "Milk",
        "amount": 3,
        "unit": "cups"
      },
      {
        "name": "Eggs",
        "amount": 4,
        "unit": "large"
      },
      {
        "name": "Heavy cream",
        "amount": 2,
        "unit": "cups"
      }
    ],
    "instructions": [
      "Blend flour, matcha, milk, and eggs to make a thin batter. Chill 1 hr.",
      "Cook 20-30 thin crepes in a non-stick skillet.",
      "Whip heavy cream with sugar and a bit of matcha.",
      "Layer crepes and cream, stacking high.",
      "Chill for 4 hours to set before slicing."
    ],
    "nutritionalInfo": {
      "calories": 380,
      "protein": "8g",
      "carbs": "35g",
      "fat": "24g"
    },
    "image": "https://images.unsplash.com/photo-1596708781682-12792dc8cf44?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.9,
    "createdAt": "2026-05-15T14:00:00Z"
  },
  {
    "id": "r10",
    "title": "Shakshuka",
    "description": "Eggs gently poached in a simmering, spicy tomato and bell pepper sauce.",
    "prepTime": "10 mins",
    "cookTime": "25 mins",
    "servings": 2,
    "difficulty": "Easy",
    "cuisine": "Middle Eastern",
    "dietary": [
      "Vegetarian",
      "Gluten-Free"
    ],
    "ingredients": [
      {
        "name": "Eggs",
        "amount": 4,
        "unit": "large"
      },
      {
        "name": "Crushed tomatoes",
        "amount": 28,
        "unit": "oz"
      },
      {
        "name": "Bell pepper",
        "amount": 1,
        "unit": "whole"
      },
      {
        "name": "Onion",
        "amount": 1,
        "unit": "whole"
      },
      {
        "name": "Cumin",
        "amount": 1,
        "unit": "tsp"
      }
    ],
    "instructions": [
      "Saute diced onion and bell pepper until soft.",
      "Add cumin and crushed tomatoes, simmer for 15 mins.",
      "Make small wells in the sauce and crack the eggs into them.",
      "Cover and cook until egg whites are set but yolks are runny."
    ],
    "nutritionalInfo": {
      "calories": 280,
      "protein": "16g",
      "carbs": "22g",
      "fat": "14g"
    },
    "image": "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=800&q=80",
    "author": "Chef Julia",
    "reviews": [],
    "averageRating": 4.7,
    "createdAt": "2026-05-16T09:00:00Z"
  }
];

// Helper to get from localstorage sync
export function getSavedRecipes(): Recipe[] {
  try {
    const saved = localStorage.getItem('chefjulia_recipes');
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return initialRecipes;
}
