import React, { useContext } from 'react';
import { AppContext } from '../App';
import { motion } from 'motion/react';
import { ShoppingCart, Check, Trash2, Printer } from 'lucide-react';

export default function ShoppingList() {
  const { shoppingList, setShoppingList } = useContext(AppContext);

  const toggleChecked = (index: number) => {
    const updated = [...shoppingList];
    updated[index].checked = !updated[index].checked;
    setShoppingList(updated);
  };

  const removeChecked = () => {
    setShoppingList(shoppingList.filter((item: any) => !item.checked));
  };

  const removeAll = () => {
    if(window.confirm('Clear shopping list?')) {
      setShoppingList([]);
    }
  };

  const handleDelivery = () => {
    const items = shoppingList.filter((i: any) => !i.checked).map((i: any) => i.name).join(' ');
    if (!items) {
      alert("Your list is empty or fully checked off!");
      return;
    }
    const url = `https://www.amazon.com/s?k=fresh+grocery+${encodeURIComponent(items)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 print:p-0 print:m-0 print:space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 print:mb-2 print:border-b print:border-black/10 print:pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-accent-gold text-black rounded-2xl print:bg-transparent print:p-0 print:text-black">
            <ShoppingCart size={32} />
          </div>
          <div>
            <h1 className="font-serif text-4xl font-light italic text-text-main print:text-black">Shopping List</h1>
            <p className="text-white/40 print:text-black/60">Automatically generated from your recipes.</p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap justify-end print:hidden">
          <button onClick={handleDelivery} className="px-4 py-2 bg-accent-gold text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#b08c48] transition">
            Delivery
          </button>
          <button onClick={handlePrint} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition">
            <Printer size={20} className="text-text-main" />
          </button>
          <button onClick={removeChecked} className="px-4 py-2 bg-white/5 text-text-main border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition">
            Remove Checked
          </button>
          <button onClick={removeAll} className="px-4 py-2 bg-red-900/30 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-900/50 transition flex items-center gap-2">
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 md:p-10 print:bg-transparent print:border-none print:shadow-none print:p-0">
        {shoppingList.length === 0 ? (
          <div className="text-center py-20 text-white/40 print:text-black/40">
            <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg text-text-main">Your shopping list is empty.</p>
            <p className="text-sm">Find a recipe and click "Add to List".</p>
          </div>
        ) : (
          <ul className="space-y-3 print:space-y-1">
            {shoppingList.map((item: any, i: number) => (
              <li 
                key={item.id + i} 
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all border print:p-2 print:border-b print:border-l-0 print:border-r-0 print:border-t-0 print:border-black/10 print:rounded-none ${
                  item.checked ? 'bg-white/5 border-white/5 opacity-50 print:opacity-50' : 'bg-white/5 border-white/10 hover:bg-white/10 print:bg-transparent'
                }`}
              >
                <button 
                  onClick={() => toggleChecked(i)}
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border-2 transition-colors print:border-black/20 ${
                    item.checked ? 'bg-accent-gold border-accent-gold text-black print:bg-black/20 print:border-black/20' : 'border-white/20 hover:border-accent-gold print:border-black/20'
                  }`}
                >
                  {item.checked && <Check size={16} className="print:text-black" />}
                </button>
                <span className={`font-medium flex-1 text-base ${item.checked ? 'line-through text-white/40 print:text-black/40' : 'text-text-main print:text-black'}`}>
                  {item.name}
                </span>
                <span className="font-mono text-accent-gold font-medium text-sm print:text-black/60">
                  {item.amount} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
