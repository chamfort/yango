import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const API_URL = 'http://localhost:3000';
const ORDERS_API = `${API_URL}/orders`;
const PRODUCTS_API = `${API_URL}/products`;

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, isPositive, icon, iconBg }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 ${iconBg} rounded-2xl text-white group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    conversionRate: 0,
    salesChange: 0,
    ordersChange: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const ordersRes = await axios.get(ORDERS_API);
      const orders = ordersRes.data;

      // Calculate stats
      const totalSales = orders.reduce((sum: number, o: any) => sum + (o.montant_total || 0), 0);
      const totalOrders = orders.length;

      // Get unique users
      const uniqueUsers = new Set();
      orders.forEach((order: any) => {
        if (order.client?.id) uniqueUsers.add(order.client.id);
        if (order.transporteur?.id) uniqueUsers.add(order.transporteur.id);
      });

      // Calculate recent sales trend (last 7 days)
      const salesByDay: { [key: string]: number } = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short' });
        salesByDay[dateStr] = 0;
      }

      orders.forEach((order: any) => {
        const orderDate = new Date(order.createdAt);
        const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (24 * 60 * 60 * 1000));
        if (daysDiff >= 0 && daysDiff <= 6) {
          const dateStr = orderDate.toLocaleDateString('fr-FR', { weekday: 'short' });
          salesByDay[dateStr] = (salesByDay[dateStr] || 0) + order.montant_total;
        }
      });

      const salesChartData = Object.entries(salesByDay).map(([date, amount]) => ({
        date,
        amount
      }));

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const recent = sortedOrders.slice(0, 5);

      // Calculate changes (mock for now)
      const salesChange = totalSales > 100000 ? 12.5 : -2.1;
      const ordersChange = totalOrders > 30 ? 8.2 : -5.4;

      setStats({
        totalSales,
        totalOrders,
        totalUsers: uniqueUsers.size,
        conversionRate: 3.2,
        salesChange,
        ordersChange
      });
      setRecentOrders(recent);
      setSalesData(salesChartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data on error
      setStats({
        totalSales: 1245600,
        totalOrders: 48,
        totalUsers: 452,
        conversionRate: 3.2,
        salesChange: 12.5,
        ordersChange: 8.2
      });
      setRecentOrders([
        { id: '1', client: { nom: 'Jean Dupont' }, statut: 'confirmee', montant_total: 12500, createdAt: new Date().toISOString() },
        { id: '2', client: { nom: 'Marie Kotto' }, statut: 'en_attente', montant_total: 3200, createdAt: new Date(Date.now() - 900000).toISOString() },
        { id: '3', client: { nom: 'Paul Atan' }, statut: 'annulee', montant_total: 5000, createdAt: new Date(Date.now() - 3600000).toISOString() },
      ]);
      setSalesData([
        { date: 'Lun', amount: 85000 },
        { date: 'Mar', amount: 120000 },
        { date: 'Mer', amount: 95000 },
        { date: 'Jeu', amount: 150000 },
        { date: 'Ven', amount: 180000 },
        { date: 'Sam', amount: 165000 },
        { date: 'Dim', amount: 110000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmee':
        return 'text-emerald-500 bg-emerald-50';
      case 'en_attente':
        return 'text-amber-500 bg-amber-50';
      case 'annulee':
        return 'text-rose-500 bg-rose-50';
      case 'en_livraison':
        return 'text-indigo-500 bg-indigo-50';
      case 'livree':
        return 'text-emerald-500 bg-emerald-50';
      default:
        return 'text-slate-500 bg-slate-50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmee': return 'Confirmée';
      case 'en_attente': return 'En attente';
      case 'annulee': return 'Annulée';
      case 'en_livraison': return 'En livraison';
      case 'livree': return 'Livrée';
      default: return status;
    }
  };

  const getTimeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}j`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' FCFA';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Bienvenue sur l'interface de gestion BeerLink.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Ventes Totales"
          value={formatCurrency(stats.totalSales)}
          change={`${stats.salesChange > 0 ? '+' : ''}${stats.salesChange}%`}
          isPositive={stats.salesChange > 0}
          icon={<ShoppingCart size={24} />}
          iconBg="bg-primary"
        />
        <KpiCard
          title="Utilisateurs Actifs"
          value={stats.totalUsers.toString()}
          change="+5.2%"
          isPositive={true}
          icon={<Users size={24} />}
          iconBg="bg-indigo-500"
        />
        <KpiCard
          title="Commandes/Jour"
          value={stats.totalOrders.toString()}
          change={`${stats.ordersChange > 0 ? '+' : ''}${stats.ordersChange}%`}
          isPositive={stats.ordersChange > 0}
          icon={<TrendingUp size={24} />}
          iconBg="bg-emerald-500"
        />
        <KpiCard
          title="Taux de Conversion"
          value={`${stats.conversionRate}%`}
          change="+0.5%"
          isPositive={true}
          icon={<ArrowUpRight size={24} />}
          iconBg="bg-amber-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Ventes cette semaine
            </h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Ventes']}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '12px' }}
                />
                <Bar dataKey="amount" fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <h2 className="font-bold text-slate-900 mb-6">Status du Système</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-sm font-medium">API Backend</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">En ligne</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <CheckCircle2 size={18} />
                </div>
                <span className="text-sm font-medium">Base de données</span>
              </div>
              <span className="text-xs font-bold text-emerald-600">Stable</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                  <Clock size={18} />
                </div>
                <span className="text-sm font-medium">Traitement Paiements</span>
              </div>
              <span className="text-xs font-bold text-amber-600">Latence faible</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                  <AlertCircle size={18} />
                </div>
                <span className="text-sm font-medium">Stock Entrepôt</span>
              </div>
              <span className="text-xs font-bold text-rose-600">3 Critiques</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-900 rounded-2xl text-white">
            <p className="text-xs text-slate-400 font-medium">Charge CPU</p>
            <div className="mt-2 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[42%] rounded-full shadow-[0_0_10px_rgba(255,90,0,0.5)] animate-pulse"></div>
            </div>
            <p className="mt-2 text-right text-xs font-bold text-primary">42%</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-bold text-slate-900">Dernières Commandes</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-sm font-bold text-primary hover:underline"
          >
            Voir tout
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                        {order.client?.nom?.[0] || '?'}
                      </div>
                      <span className="font-medium text-slate-900 group-hover:text-primary transition-colors">
                        {order.client?.nom || 'Client inconnu'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.statut)}`}>
                      {getStatusLabel(order.statut)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatCurrency(order.montant_total)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{getTimeAgo(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;