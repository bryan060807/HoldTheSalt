import React, { useState, useContext } from 'react';
import { ChefHat, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppContext } from '../App';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Recipe } from '../lib/data';

export default function SubmitRecipe() {
  const { user } = useContext(AppContext);
  const [recipeText, setRecipeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    if (!user) {
      alert("Please sign in first to submit to Chef Julia!");
      return;
    }
    if (!recipeText.trim() || recipeText.length < 20) {
      setFeedback("Oh darling, you need to actually give me a recipe, not just a whisper of one.");
      setIsApproved(false);
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);
    setIsApproved(null);

    try {
      const response = await fetch('/api/review-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRecipe: recipeText })
      });
      const data = await response.json();
      
      if (data.error) {
        setFeedback("Something went wrong with our connection to Chef Julia's kitchen. Try again later.");
        setIsApproved(false);
        setIsSubmitting(false);
        return;
      }

      setFeedback(data.feedback);
      setIsApproved(data.approved);

      if (data.approved && data.polishedRecipe) {
        // Save to Firebase
        const id = 'r' + Date.now();
        const newRecipe: Recipe = {
          ...data.polishedRecipe,
          id,
          author: user.displayName || 'Aspiring Chef',
          authorId: user.uid,
          image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80",
          reviews: [],
          averageRating: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'recipes', id), newRecipe);
      }
    } catch (e) {
      console.error(e);
      setFeedback("The kitchen staff dropped your recipe on the floor. Let's try that again.");
      setIsApproved(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 min-h-[80vh] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-accent-gold text-black rounded-2xl shrink-0">
          <ChefHat size={32} />
        </div>
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-light italic text-text-main">Submit to Chef Julia</h1>
          <p className="text-white/40">Only the best recipes make it into the collection.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div className="glass rounded-3xl p-6 relative flex flex-col shrink-0 group">
          <label className="text-sm font-bold tracking-wider text-accent-gold uppercase mb-4 block">Your Recipe Draft</label>
          <textarea
            value={recipeText}
            onChange={(e) => setRecipeText(e.target.value)}
            disabled={isSubmitting}
            placeholder="Type or paste your recipe here... Ingredients, instructions, a short description. Sell it to me."
            className="w-full h-64 bg-transparent resize-none outline-none text-text-main placeholder-white/20 text-lg leading-relaxed focus:bg-white/5 p-4 rounded-xl transition"
          />
          <div className="absolute bottom-6 right-6 flex gap-2">
            {recipeText.length > 0 && (
              <button 
                onClick={() => setRecipeText('')}
                disabled={isSubmitting}
                className="px-4 py-3 bg-white/5 text-white/50 rounded-2xl hover:text-white/80 hover:bg-white/10 transition uppercase text-xs font-bold tracking-wider"
              >
                Clear
              </button>
            )}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || !recipeText.trim()}
              className="px-6 py-3 bg-accent-gold text-black rounded-2xl hover:bg-[#b08c48] transition flex items-center gap-2 uppercase text-xs font-bold tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="animate-spin" size={16} /> Reviewing...</>
              ) : (
                <><Send size={16} /> Submit</>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-3xl p-6 border ${isApproved ? 'bg-green-950/30 border-green-500/30 text-green-100' : 'bg-red-950/30 border-rose-500/30 text-rose-100'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${isApproved ? 'bg-green-500/20 text-green-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  <ChefHat size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl italic mb-2">Chef Julia says...</h3>
                  <p className="opacity-90 leading-relaxed text-lg">"{feedback}"</p>
                  
                  {isApproved && (
                    <p className="mt-4 text-sm opacity-60 uppercase tracking-wide font-bold">
                      Your recipe has been polished and added to the Discover feed!
                    </p>
                  )}
                  {!isApproved && (
                    <p className="mt-4 text-sm opacity-60 uppercase tracking-wide font-bold">
                      Recipe rejected. Please refine and try again.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
