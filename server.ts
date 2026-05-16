import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Route: Find Substitute
  app.post('/api/substitute', async (req, res) => {
    try {
      const { ingredient, recipeContext } = req.body;
      if (!ingredient) {
        return res.status(400).json({ error: 'Ingredient is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          substitutes: [
            { name: "Mock Substitute 1", reasoning: "Since API key is missing, this is a mock." },
            { name: "Mock Substitute 2", reasoning: "Provide an API key to get real substitutes." }
          ]
        });
      }

      const prompt = `I am cooking ${recipeContext ? recipeContext : 'a dish'}. I need a substitute for: ${ingredient}. 
Provide the 3 best substitutes. Format the output as JSON with the following schema:
{
  "substitutes": [
    {
      "name": "Name of substitute ingredient",
      "amount": "Equivalent amount (e.g., Use 1 cup of X for 1 cup of Y)",
      "reasoning": "Why it works well in this context"
    }
  ]
}
Ensure it is valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText.trim());
      
      res.json(parsed);
    } catch (error) {
      console.error('Error generating substitute:', error);
      res.status(500).json({ error: 'Failed to find substitute' });
    }
  });

  // API Route: Generate Recipes (Optional - used when searching for unknown recipes)
  app.post('/api/generate-recipe', async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
         return res.json({ error: "Missing API key for generation" });
      }

      const prompt = `Generate a high quality recipe based on this query: "${query}".
Return ONLY valid JSON matching this schema:
{
  "title": "Recipe Name",
  "description": "Short appetizing description",
  "prepTime": "XX mins",
  "cookTime": "XX mins",
  "servings": 4,
  "difficulty": "Easy | Medium | Hard",
  "cuisine": "Cuisine type",
  "dietary": ["Vegan", "Gluten-Free", "etc"],
  "ingredients": [
    { "name": "Ingredient name", "amount": "Quantity", "unit": "Unit" }
  ],
  "instructions": ["Step 1", "Step 2"],
  "nutritionalInfo": { "calories": 400, "protein": "20g", "carbs": "30g", "fat": "15g" }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
      
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      console.error('Error generating recipe:', error);
      res.status(500).json({ error: 'Failed to generate recipe' });
    }
  });

  // API Route: Review User Submitted Recipe
  app.post('/api/review-recipe', async (req, res) => {
    try {
      const { userRecipe } = req.body;
      if (!userRecipe) {
        return res.status(400).json({ error: 'Recipe content is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(403).json({ error: "Missing API key for generation" });
      }

      let parsedInput = {};
      try {
        parsedInput = typeof userRecipe === 'string' ? JSON.parse(userRecipe) : userRecipe;
      } catch(e) {
        parsedInput = { rawText: userRecipe };
      }

      const prompt = `You are Chef Julia, a strict but encouraging culinary expert. A user has submitted a recipe.
Review the recipe. If it's a genuine, decent recipe (or can be easily improved to be decent), approve it, clean it up into a professional format, and return some friendly but chef-like feedback.
If it's obvious nonsense, spam, or a terrible recipe (e.g. "dirt and water soup"), reject it and give snarky feedback.

Submitted Recipe:
${JSON.stringify(parsedInput)}

Return ONLY valid JSON matching this schema:
{
  "approved": true/false,
  "feedback": "Chef Julia's feedback directly to the user (e.g. 'Darling, this looks fabulous but...').",
  "polishedRecipe": {
    "title": "Recipe Name (improved)",
    "description": "Appetizing description",
    "prepTime": "XX mins",
    "cookTime": "XX mins",
    "servings": 4,
    "difficulty": "Easy | Medium | Hard",
    "cuisine": "Cuisine type",
    "dietary": [],
    "ingredients": [
      { "name": "Ingredient name", "amount": "Quantity", "unit": "Unit" }
    ],
    "instructions": ["Step 1", "Step 2"],
    "nutritionalInfo": { "calories": 400, "protein": "20g", "carbs": "30g", "fat": "15g" }
  }
}
If approved=false, polishedRecipe can be null or empty.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });
      
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error) {
      console.error('Error reviewing recipe:', error);
      res.status(500).json({ error: 'Failed to review recipe' });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
