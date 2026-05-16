import React, { useState, useContext } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Plus, MessageSquare } from 'lucide-react';
import { AppContext } from '../App';
import { Recipe } from '../lib/data';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Admin() {
  const { recipes, user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('upload');
  
  // mock form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('Global');
  
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to upload recipes.");
      return;
    }
    
    const id = 'r' + Date.now();
    const newRecipe: Recipe = {
      id,
      title,
      description,
      prepTime: '20 mins',
      cookTime: '30 mins',
      servings: 4,
      difficulty: 'Medium',
      cuisine,
      dietary: [],
      ingredients: [],
      instructions: ['Instructions coming soon...'],
      nutritionalInfo: { calories: 0, protein: '0g', carbs: '0g', fat: '0g' },
      image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
      author: user.displayName || 'Admin',
      authorId: user.uid, // Required for firestore rules
      reviews: [],
      averageRating: 0,
      createdAt: new Date().toISOString()
    };
    
    try {
      await setDoc(doc(db, 'recipes', id), newRecipe);
      setTitle('');
      setDescription('');
      alert('Recipe Uploaded Successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload recipe. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-accent-gold text-black rounded-2xl">
          <ShieldAlert size={32} />
        </div>
        <div>
          <h1 className="font-serif text-4xl font-light italic text-text-main">Admin Panel</h1>
          <p className="text-white/40">Manage recipes and moderate user feedback.</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-white/10">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`pb-4 font-bold uppercase tracking-wider text-xs transition border-b-2 ${activeTab==='upload' ? 'text-accent-gold border-accent-gold' : 'text-white/40 border-transparent hover:text-white'}`}
        >
          Recipe Upload
        </button>
        <button 
          onClick={() => setActiveTab('support')}
          className={`pb-4 font-bold uppercase tracking-wider text-xs transition border-b-2 ${activeTab==='support' ? 'text-accent-gold border-accent-gold' : 'text-white/40 border-transparent hover:text-white'}`}
        >
          User Support & Feedback
        </button>
      </div>

      {activeTab === 'upload' && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="glass p-8 rounded-3xl">
          <h2 className="text-2xl font-light italic text-text-main mb-6 font-serif">Add New Recipe to Universe</h2>
          <form onSubmit={handleUpload} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-xs font-bold text-accent-gold mb-2 uppercase tracking-widest opacity-80">Recipe Title</label>
              <input 
                required
                type="text" 
                value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent-gold/50 text-white placeholder:text-white/40 text-sm" 
                placeholder="e.g. World's Greatest Lasagna" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-accent-gold mb-2 uppercase tracking-widest opacity-80">Description</label>
              <textarea 
                required
                value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent-gold/50 text-white placeholder:text-white/40 min-h-[120px] text-sm" 
                placeholder="Short appetizing description..." 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-accent-gold mb-2 uppercase tracking-widest opacity-80">Cuisine Type</label>
              <select value={cuisine} onChange={(e)=>setCuisine(e.target.value)} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-accent-gold/50 text-white text-sm appearance-none">
                <option className="bg-bg-dark text-white">Italian</option>
                <option className="bg-bg-dark text-white">Mexican</option>
                <option className="bg-bg-dark text-white">Asian</option>
                <option className="bg-bg-dark text-white">Global</option>
                <option className="bg-bg-dark text-white">American</option>
              </select>
            </div>
            <button type="submit" className="bg-accent-gold text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#b08c48] transition">
              <Plus size={18} />
              Publish Recipe
            </button>
          </form>
        </motion.div>
      )}

      {activeTab === 'support' && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
          {[
            { id: 1, user: 'CookingFan99', comment: 'The carbonara recipe is amazing! Can you add more Italian?', date: '2 hours ago', status: 'Pending' },
            { id: 2, user: 'HealthNut', comment: 'Need more vegan meal prep ideas please.', date: '1 day ago', status: 'Resolved' },
            { id: 3, user: 'ChefAnon', comment: 'There is a typo in the spicy tacos recipe formatting.', date: '3 days ago', status: 'Pending' },
          ].map(feedback => (
            <div key={feedback.id} className="glass p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <MessageSquare className="text-accent-gold shrink-0 mt-1 opacity-80" />
                <div>
                  <div className="font-bold flex items-center gap-2 text-text-main">
                    {feedback.user} 
                    <span className="text-xs font-medium text-white/40 font-mono border-l border-white/20 pl-2">{feedback.date}</span>
                  </div>
                  <p className="text-white/60 mt-1 text-sm">{feedback.comment}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center self-start md:self-center">
                <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${feedback.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-accent-gold/20 text-accent-gold border border-accent-gold/30'}`}>
                  {feedback.status}
                </span>
                <button className="text-[11px] font-bold uppercase tracking-wider text-text-main hover:text-accent-gold transition">Reply</button>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
