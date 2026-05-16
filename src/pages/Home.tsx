import React, { useContext, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Search, Filter, Heart, Clock, ChefHat } from 'lucide-react';
import { AppContext } from '../App';

export default function Home() {
  const { recipes, favorites, toggleFavorite } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const cuisines = ['All', 'Italian', 'Mexican', 'Global', 'Asian'];

  const filtered = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'All' || r.cuisine === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="font-serif text-4xl md:text-6xl font-light italic text-text-main mb-4 tracking-tight">
          What are you <span className="text-accent-gold not-italic font-medium">craving</span> today?
        </h1>
        <p className="text-white/60 text-lg max-w-2xl">
          Discover the best recipes from the known universe, hand-picked for everyday cooks and seasoned chefs alike.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40" size={20} />
          <input 
            type="text" 
            placeholder="Search recipes, ingredients..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-main text-sm focus:outline-none focus:border-accent-gold/50 placeholder:text-white/40 transition-colors"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide shrink-0 items-center">
          <Filter className="text-white/40 ml-2 mr-1" size={20} />
          {cuisines.map(c => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-colors border ${
                filter === c 
                  ? 'bg-accent-gold text-black border-accent-gold' 
                  : 'bg-white/10 text-text-main border-white/10 hover:bg-white/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((recipe, i) => (
          <motion.div 
            key={recipe.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="recipe-card p-4 rounded-2xl group relative"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-neutral-800 border border-white/5">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button 
                onClick={(e) => { e.preventDefault(); toggleFavorite(recipe.id); }}
                className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-accent-gold transition-colors border border-white/10"
              >
                <Heart size={16} className={favorites.includes(recipe.id) ? 'fill-accent-gold text-accent-gold' : ''} />
              </button>
            </div>
            
            <Link to={`/recipe/${recipe.id}`} className="block">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-accent-gold mb-2">
                <span>{recipe.cuisine}</span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span>{recipe.difficulty}</span>
              </div>
              <h4 className="text-sm font-bold text-text-main mb-1 line-clamp-1">{recipe.title}</h4>
              <p className="text-[10px] text-white/40 mb-3">{recipe.prepTime} • {recipe.author}</p>
              
              <div className="flex items-center justify-between text-[10px] text-white/40">
                <div className="flex text-yellow-500 tracking-widest gap-0.5">
                  ★★★★★
                </div>
                <span>{recipe.servings} servings</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg">No recipes found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
