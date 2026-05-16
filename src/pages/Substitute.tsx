import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

export default function Substitute() {
  const [ingredient, setIngredient] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | any[]>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredient.trim()) return;
    
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredient, recipeContext: context })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResults(data.substitutes || []);
      } else {
        setError(data.error || 'Failed to fetch substitutes.');
      }
    } catch (err) {
      setError('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center p-4 bg-accent-gold text-black rounded-full mb-6">
          <HelpCircle size={40} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-light italic text-text-main mb-4">
          Missing an ingredient?
        </h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Don't panic! Our AI chef can help you find the perfect substitute based on the science of flavor and texture.
        </p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSearch} 
        className="glass p-6 md:p-8 rounded-3xl flex flex-col gap-6"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent-gold mb-2 opacity-80">I am missing...</label>
            <input 
              type="text" 
              placeholder="e.g. Buttermilk, Egg, Soy Sauce..." 
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-accent-gold/50 text-white placeholder:text-white/40"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-accent-gold mb-2 opacity-80">And I am making...</label>
            <input 
              type="text" 
              placeholder="e.g. Pancakes, Fried Rice, Cake... (Optional)" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-accent-gold/50 text-white placeholder:text-white/40"
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !ingredient.trim()}
          className="w-full md:w-auto self-center bg-accent-gold text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#b08c48] transition flex items-center justify-center gap-2 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed border disabled:border-white/10"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Analyzing...</>
          ) : (
            <>Find Substitutes <ArrowRight size={20} /></>
          )}
        </button>
      </motion.form>

      {error && (
        <div className="mt-8 p-4 bg-red-900/30 text-rose-400 border border-rose-500/30 rounded-xl text-center">
          {error}
        </div>
      )}

      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-6"
        >
          <h2 className="font-serif text-3xl font-light italic text-accent-gold text-center mb-8">Generated Substitutes</h2>
          <div className="grid gap-6">
            {results.map((sub, i) => (
              <div key={i} className="glass p-6 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent-gold group-hover:bg-[#b08c48] transition-colors" />
                <div className="pl-4">
                  <h3 className="font-serif text-2xl font-light italic text-text-main mb-2">{sub.name}</h3>
                  <div className="inline-block bg-white/10 text-accent-gold px-3 py-1 rounded text-xs font-mono mb-4 border border-white/5">
                    Amount: {sub.amount}
                  </div>
                  <p className="text-white/80">
                    <strong className="text-accent-gold mr-1 border-b border-accent-gold/30">Why it works:</strong>
                    {sub.reasoning}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <button 
              onClick={() => {setResults(null); setIngredient(''); setContext('');}}
              className="text-white/40 hover:text-accent-gold transition-colors inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
            >
              <RefreshCw size={16} /> Start Over
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
