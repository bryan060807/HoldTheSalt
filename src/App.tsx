import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router';
import { ChefHat, Search, Calendar, ShoppingCart, User, HelpCircle, Upload, Settings } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, setDoc, deleteDoc, getDocs, query } from 'firebase/firestore';
import { auth, db, testConnection } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firebaseHelper';

// Placeholder imports for pages we will create shortly
import Home from './pages/Home';
import RecipeDetail from './pages/RecipeDetail';
import Planner from './pages/Planner';
import ShoppingList from './pages/ShoppingList';
import Substitute from './pages/Substitute';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import SubmitRecipe from './pages/SubmitRecipe';
import { initialRecipes, Recipe } from './lib/data';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navItems = [
    { name: 'Discover', path: '/', icon: Search },
    { name: 'Substitute', path: '/substitute', icon: HelpCircle },
    { name: 'Planner', path: '/planner', icon: Calendar },
    { name: 'Shopping', path: '/shopping-list', icon: ShoppingCart },
    { name: 'Submit', path: '/submit', icon: Upload },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-bg-dark border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-text-main">
          <div className="w-8 h-8 bg-accent-gold rounded flex items-center justify-center font-bold text-black">HS</div>
          <h1 className="text-xl font-semibold tracking-tight uppercase italic">Hold the Salt</h1>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-64 border-r border-white/5 h-screen sticky top-0 py-8 px-6">
        <div className="flex items-center gap-3 text-text-main mb-10">
          <div className="w-8 h-8 bg-accent-gold rounded flex items-center justify-center font-bold text-black">HS</div>
          <h1 className="text-xl font-semibold tracking-tight uppercase italic">Hold the Salt</h1>
        </div>
        
        <div className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path || (location.pathname.startsWith('/recipe') && item.path === '/');
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-white/5 text-accent-gold' 
                    : 'text-text-main opacity-70 hover:bg-accent-gold/10 hover:text-accent-gold hover:opacity-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-transparent glass border-t border-white/5 flex justify-around p-2 z-50 pb-safe">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path || (location.pathname.startsWith('/recipe') && item.path === '/');
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 ${
                active ? 'text-accent-gold' : 'text-text-main opacity-70'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export const AppContext = React.createContext<{
  user: FirebaseUser | null;
  loading: boolean;
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  shoppingList: any[]; // using placeholder type
  setShoppingList: (list: any[]) => void;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}>({
  user: null, loading: true,
  recipes: [], setRecipes: () => {},
  favorites: [], toggleFavorite: () => {},
  shoppingList: [], setShoppingList: () => {},
  signIn: async () => {}, logOut: async () => {}
});

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);

  useEffect(() => {
    testConnection();
    
    // Seed initial recipes if empty in firestore (simplified for demo) => Handled on login if necessary
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        // Create user doc if not exists
        setDoc(doc(db, 'users', currentUser.uid), {
          email: currentUser.email,
          displayName: currentUser.displayName || 'User'
        }, { merge: true }).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}`);
        });

        const favUnsub = onSnapshot(collection(db, `users/${currentUser.uid}/favorites`), snapshot => {
          setFavorites(snapshot.docs.map(d => d.id));
        }, err => handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}/favorites`));
        
        const shopUnsub = onSnapshot(collection(db, `users/${currentUser.uid}/shoppingList`), snapshot => {
          setShoppingList(snapshot.docs.map(d => ({id: d.id, ...d.data()})));
        }, err => handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}/shoppingList`));

        return () => {
          favUnsub();
          shopUnsub();
        };
      } else {
        setFavorites([]);
        setShoppingList([]);
      }
    });

    const recipesUnsub = onSnapshot(collection(db, 'recipes'), snapshot => {
      if (snapshot.empty && user) {
        // Sync static to remote if empty (only if logged in just to have authorId)
        initialRecipes.forEach(r => {
          const toAdd = { ...r, authorId: user.uid };
          setDoc(doc(db, 'recipes', r.id), toAdd).catch(e => console.error(e));
        });
      }
      setRecipes(snapshot.docs.map(d => ({id: d.id, ...d.data()} as Recipe)));
    }, err => handleFirestoreError(err, OperationType.GET, `recipes`));

    return () => {
      unsubscribeAuth();
      recipesUnsub();
    };
  }, [user]);

  const toggleFavorite = async (id: string) => {
    if (!user) return alert("Please sign in to save favorites.");
    const isFav = favorites.includes(id);
    try {
      if (isFav) {
        await deleteDoc(doc(db, `users/${user.uid}/favorites`, id));
      } else {
        await setDoc(doc(db, `users/${user.uid}/favorites`, id), { recipeId: id, addedAt: new Date().toISOString() });
      }
    } catch (e) {
      handleFirestoreError(e, isFav ? OperationType.DELETE : OperationType.CREATE, `users/${user.uid}/favorites/${id}`);
    }
  };

  const handleSetShoppingList = async (newList: any[]) => {
    if (!user) return alert("Please sign in to sync shopping list.");
    // Because replacing the whole collection iteratively is tricky, we sync per item locally here
    // But this depends on how the user sets it up in ShoppingList / Planner 
    // In actual implementation, we might want to just set it via custom logic inside the component.
    setShoppingList(newList);
  };

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <AppContext.Provider value={{ user, loading: authLoading, recipes, setRecipes, favorites, toggleFavorite, shoppingList, setShoppingList: handleSetShoppingList, signIn, logOut }}>
      <BrowserRouter>
        <Layout>
          {authLoading ? (
            <div className="flex h-full items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/shopping-list" element={<ShoppingList />} />
              <Route path="/substitute" element={<Substitute />} />
              <Route path="/submit" element={<SubmitRecipe />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          )}
        </Layout>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
