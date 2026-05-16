import React, { useContext, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { AppContext } from '../App';
import { Clock, Users, ChefHat, Heart, ArrowLeft, Star, ShoppingBag, CalendarPlus, Activity } from 'lucide-react';

export default function RecipeDetail() {
  const { id } = useParams();
  const { recipes, favorites, toggleFavorite, setShoppingList, shoppingList } = useContext(AppContext);
  const recipe = recipes.find(r => r.id === id);

  const [rating, setRating] = useState(0);

  if (!recipe) {
    return <div className="p-10 text-center">Recipe not found</div>;
  }

  const isFavorite = favorites.includes(recipe.id);

  const addToShoppingList = () => {
    // Add ingredients to shopping list
    const newItems = recipe.ingredients.map(ing => ({
      id: Math.random().toString(),
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      checked: false,
      recipeId: recipe.id
    }));
    setShoppingList([...shoppingList, ...newItems]);
    alert("Added ingredients to shopping list!");
  };

  return (
    <div className="pb-20 max-w-5xl mx-auto">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] w-full">
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 flex items-center justify-between right-6 z-10">
          <Link to="/" className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition border border-white/10">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: recipe.title,
                    text: `Check out this amazing recipe: ${recipe.title}`,
                    url: window.location.href,
                  });
                } else {
                  alert('Share feature is not supported in this browser preview. Pretend this copied a link!');
                }
              }}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition flex items-center justify-center border border-white/10"
              title="Share Recipe"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
            <button 
              onClick={() => toggleFavorite(recipe.id)}
              className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition border border-white/10"
            >
              <Heart size={24} className={isFavorite ? 'fill-accent-gold text-accent-gold' : ''} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white text-center md:text-left z-10">
          <div className="flex gap-2 items-center mb-3 justify-center md:justify-start">
            <span className="bg-accent-gold text-black px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">{recipe.cuisine}</span>
            {recipe.dietary.map(d => (
             <span key={d} className="bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-wider">{d}</span>
            ))}
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light italic mb-2 text-balance leading-tight">{recipe.title}</h1>
          <p className="text-white/80 text-sm md:max-w-2xl line-clamp-2 md:line-clamp-none">{recipe.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-10 -mt-8 relative z-10">
        
        {/* Left Column (Main Info) */}
        <div className="md:col-span-2 space-y-10">
          
          <div className="glass rounded-3xl p-6 flex flex-wrap gap-6 justify-around text-center">
            <div>
              <Clock className="mx-auto text-white/40 mb-2" size={24} />
              <div className="font-bold text-text-main">{recipe.prepTime}</div>
              <div className="text-xs text-white/40 uppercase">Prep</div>
            </div>
            <div>
              <Activity className="mx-auto text-white/40 mb-2" size={24} />
              <div className="font-bold text-text-main">{recipe.difficulty}</div>
              <div className="text-xs text-white/40 uppercase">Difficulty</div>
            </div>
            <div>
              <Users className="mx-auto text-white/40 mb-2" size={24} />
              <div className="font-bold text-text-main">{recipe.servings} serving</div>
              <div className="text-xs text-white/40 uppercase">Yield</div>
            </div>
            <div>
              <Star className="mx-auto text-yellow-500 mb-2 fill-yellow-500" size={24} />
              <div className="font-bold text-text-main">{recipe.averageRating > 0 ? recipe.averageRating : 'New'}</div>
              <div className="text-xs text-white/40 uppercase">Rating</div>
            </div>
          </div>

          <section>
            <h2 className="font-serif text-2xl italic font-light text-accent-gold mb-6 border-b border-white/10 pb-2">Ingredients</h2>
            <ul className="space-y-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold"></div>
                  <span className="flex-1 font-medium">{ing.name}</span>
                  <span className="text-white/60"><span className="font-mono text-xs">{ing.amount}</span> {ing.unit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-4">
              <button onClick={addToShoppingList} className="flex items-center gap-2 bg-accent-gold text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#b08c48] transition flex-1 justify-center">
                <ShoppingBag size={18} /> Add to List
              </button>
              <button className="flex items-center gap-2 bg-white/10 border border-white/20 text-text-main px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition flex-1 justify-center">
                <CalendarPlus size={18} /> Planner
              </button>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl italic font-light text-accent-gold mb-6 border-b border-white/10 pb-2">Instructions</h2>
            <div className="space-y-6">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 text-accent-gold flex items-center justify-center font-bold text-sm border border-white/10">
                    {i + 1}
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pt-1.5">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-4 opacity-80 border-b border-white/10 pb-2">Nutrition</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-white/40">Calories</span><span className="font-bold">{recipe.nutritionalInfo.calories} kcal</span></div>
                <div className="w-full h-1 bg-white/10 rounded-full"><div className="h-full bg-accent-gold rounded-full" style={{ width: '60%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-white/40">Protein</span><span className="font-bold">{recipe.nutritionalInfo.protein}</span></div>
                <div className="w-full h-1 bg-white/10 rounded-full"><div className="h-full bg-accent-gold/80 rounded-full" style={{ width: '40%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-white/40">Carbs</span><span className="font-bold">{recipe.nutritionalInfo.carbs}</span></div>
                <div className="w-full h-1 bg-white/10 rounded-full"><div className="h-full bg-accent-gold/60 rounded-full" style={{ width: '70%' }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] mb-1"><span className="text-white/40">Fat</span><span className="font-bold">{recipe.nutritionalInfo.fat}</span></div>
                <div className="w-full h-1 bg-white/10 rounded-full"><div className="h-full bg-accent-gold/40 rounded-full" style={{ width: '35%' }}></div></div>
              </div>
            </div>
          </div>

          {/* Rate and Review mock */}
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-4 opacity-80 border-b border-white/10 pb-2">Rate & Review</h3>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star size={24} className={rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-white/20 fill-transparent'} />
                </button>
              ))}
            </div>
            {rating > 0 && <p className="text-[11px] text-accent-gold">Thanks for rating!</p>}
            
            <textarea placeholder="Leave a review..." className="w-full mt-2 p-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:ring-1 focus:ring-accent-gold min-h-[80px] placeholder:text-white/40 outline-none"></textarea>
            <button className="w-full mt-3 bg-white/10 border border-white/20 text-white rounded-full py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition">Submit Review</button>
          </div>
        </div>

      </div>
    </div>
  );
}
