import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40 transition-all">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher une commande, un utilisateur..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors relative group">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full group-hover:scale-110 transition-transform"></span>
        </button>
        
        <div className="h-10 w-[1px] bg-slate-100 mx-2"></div>

        <div className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">Admin Master</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
