import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router';
import { User as UserIcon, Heart, Settings, LogOut, Clock, ChefHat, Save, X } from 'lucide-react';
import { motion } from 'motion/react';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Profile() {
  const { user, signIn, logOut, recipes, favorites, toggleFavorite } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.displayName || '');
    }
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName: editName });
      await setDoc(doc(db, 'users', user.uid), { displayName: editName }, { merge: true });
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <div className="p-6 max-w-6xl mx-auto h-[80vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 text-accent-gold flex items-center justify-center shrink-0 mb-4">
          <UserIcon size={48} />
        </div>
        <h1 className="font-serif text-4xl font-light italic text-text-main mb-2">Sign in to Hold the Salt</h1>
        <p className="text-white/60 text-lg mb-8 text-center max-w-md">Save your favorite recipes, create shopping lists, and plan your meals across all your devices.</p>
        <button onClick={signIn} className="bg-accent-gold text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#b08c48] transition">
          Sign In with Google
        </button>
      </div>
    );
  }

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));
  const userMadeCount = recipes.filter(r => r.authorId === user.uid).length;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full bg-accent-gold text-black flex items-center justify-center shrink-0 overflow-hidden">
          {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon size={64} />}
        </div>
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="mb-4">
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full max-w-sm p-3 bg-black/40 border border-white/20 rounded-xl outline-none focus:border-accent-gold text-white font-serif text-2xl italic mb-2"
                placeholder="Your Name"
              />
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <button onClick={saveProfile} className="px-4 py-2 bg-accent-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b08c48] transition flex items-center gap-2">
                  <Save size={14} /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition flex items-center gap-2">
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="font-serif text-4xl font-light italic text-text-main mb-2">{user.displayName || 'Home Chef'}</h1>
              <p className="text-white/60 text-lg mb-4">{user.email}</p>
            </>
          )}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/80 text-sm font-medium">
              <span className="font-bold text-accent-gold mr-1">{favorites.length}</span> Favorites
            </div>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/80 text-sm font-medium">
              <span className="font-bold text-accent-gold mr-1">{userMadeCount}</span> Created
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-text-main transition">
              <Settings size={20} />
            </button>
          )}
          <button onClick={logOut} className="p-3 bg-red-900/30 text-rose-400 border border-rose-500/30 rounded-xl hover:bg-red-900/50 transition">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-accent-gold fill-accent-gold" size={28} />
          <h2 className="font-serif text-3xl font-light italic text-text-main">Your Favorites</h2>
        </div>
        
        {favoriteRecipes.length === 0 ? (
          <div className="text-center py-20 glass rounded-3xl">
            <Heart size={48} className="mx-auto mb-4 text-white/20" />
            <p className="text-lg text-white/60">You haven't saved any recipes yet.</p>
            <Link to="/" className="inline-block mt-4 text-accent-gold text-sm font-bold uppercase tracking-wider hover:text-white transition">Discover recipes</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteRecipes.map((recipe, i) => (
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
                    className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md rounded-full text-accent-gold hover:text-white transition-colors border border-white/10"
                  >
                    <Heart size={16} className="fill-accent-gold" />
                  </button>
                </div>
                
                <Link to={`/recipe/${recipe.id}`} className="block">
                  <h3 className="font-serif text-sm font-bold text-text-main mb-1 line-clamp-1">{recipe.title}</h3>
                  <div className="flex items-center justify-between text-white/40 text-[10px] mt-3">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1.5 uppercase font-bold tracking-wider text-accent-gold">
                      {recipe.cuisine}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
