import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  ShieldCheck, 
  LogOut,
  TrendingUp
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', id: 'dashboard', path: '/' },
    { icon: <TrendingUp size={20} />, label: 'KPIs', id: 'kpis', path: '/stats' },
    { icon: <ShieldCheck size={20} />, label: 'Validation KYC', id: 'kyc', path: '/kyc' },
    { icon: <ShoppingCart size={20} />, label: 'Commandes', id: 'orders', path: '/orders' },
    { icon: <Package size={20} />, label: 'Produits', id: 'products', path: '/products' },
    { icon: <Users size={20} />, label: 'Utilisateurs', id: 'users', path: '/users' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-50">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">
          Y
        </div>
        <span className="font-bold text-xl tracking-tight">Yango <span className="text-primary">Admin</span></span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / Account */}
      <div className="p-4 border-t border-slate-800 m-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-200 group">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
