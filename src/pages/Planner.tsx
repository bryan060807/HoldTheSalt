import React, { useState } from 'react';
import { AppContext } from '../App';
import { motion } from 'motion/react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';

export default function Planner() {
  const { recipes } = React.useContext(AppContext);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['Breakfast', 'Lunch', 'Dinner'];
  
  // mock state for planned meals
  const [planner, setPlanner] = useState<Record<string, Record<string, string | null>>>(() => {
    try {
      const saved = localStorage.getItem('chefjulia_planner');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    
    let initial: Record<string, Record<string, string | null>> = {};
    days.forEach(d => {
      initial[d] = {};
      meals.forEach(m => {
        initial[d][m] = null;
      });
    });
    return initial;
  });

  const [activeSlot, setActiveSlot] = useState<{day: string, meal: string} | null>(null);

  const savePlanner = (newPlanner: any) => {
    setPlanner(newPlanner);
    localStorage.setItem('chefjulia_planner', JSON.stringify(newPlanner));
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (!activeSlot) return;
    const updated = { ...planner };
    updated[activeSlot.day][activeSlot.meal] = recipeId;
    savePlanner(updated);
    setActiveSlot(null);
  };

  const clearSlot = (day: string, meal: string) => {
    const updated = { ...planner };
    updated[day][meal] = null;
    savePlanner(updated);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-accent-gold text-black rounded-2xl">
          <Calendar size={32} />
        </div>
        <div>
          <h1 className="font-serif text-4xl font-light italic text-text-main">Meal Planner</h1>
          <p className="text-white/40">Plan your week of deliciousness.</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[800px] grid grid-cols-8 gap-4">
          <div className="font-bold text-white/40 uppercase tracking-widest text-[10px] pt-16">
            <div className="h-32 mb-4 flex items-center">Breakfast</div>
            <div className="h-32 mb-4 flex items-center">Lunch</div>
            <div className="h-32 flex items-center">Dinner</div>
          </div>
          
          {days.map(day => (
            <div key={day} className="flex flex-col gap-4">
              <div className="font-bold text-[10px] uppercase tracking-widest text-center text-accent-gold border-b border-white/10 pb-2 mb-2">
                {day.substring(0, 3)}
              </div>
              
              {meals.map(meal => {
                const recipeId = planner[day][meal];
                const recipe = recipes.find(r => r.id === recipeId);

                return (
                  <div 
                    key={meal} 
                    className="h-32 glass rounded-2xl p-2 relative group overflow-hidden"
                  >
                    {recipe ? (
                       <div className="h-full w-full flex flex-col items-center justify-center text-center relative z-10">
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            <button onClick={() => clearSlot(day, meal)} className="bg-white/10 border border-white/20 p-2 rounded-full text-rose-500 hover:bg-white/20"><Trash2 size={16} /></button>
                            <Link to={`/recipe/${recipe.id}`} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-text-main hover:bg-white/20">View</Link>
                         </div>
                         <img src={recipe.image} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-[2px]" />
                         <span className="relative z-10 font-bold text-[11px] px-2 py-0.5 text-text-main bg-black/80 rounded backdrop-blur-sm line-clamp-3 leading-snug">{recipe.title}</span>
                       </div>
                    ) : (
                      <button 
                        onClick={() => setActiveSlot({ day, meal })}
                        className="w-full h-full border border-dashed border-white/10 rounded-xl flex items-center justify-center text-white/20 hover:border-accent-gold hover:text-accent-gold hover:bg-white/5 transition"
                      >
                        <Plus size={24} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {activeSlot && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex justify-center items-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-bg-dark border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-light italic text-accent-gold">Select for {activeSlot.day} {activeSlot.meal}</h2>
              <button onClick={() => setActiveSlot(null)} className="text-white/40 hover:text-white">Close</button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {recipes.map(r => (
                <button 
                  key={r.id} 
                  onClick={() => handleSelectRecipe(r.id)}
                  className="text-left flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition"
                >
                  <img src={r.image} className="w-16 h-16 rounded-lg object-cover border border-white/10" />
                  <div>
                    <span className="font-bold text-sm line-clamp-1 text-text-main">{r.title}</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{r.prepTime}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
