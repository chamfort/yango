import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ShoppingBag,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  User,
  Phone,
  ArrowRight,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const API_URL = 'http://localhost:3000/orders';
const USERS_API = 'http://localhost:3000/users';

type OrderStatus = 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [availableTransporteurs, setAvailableTransporteurs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigningAuto, setAssigningAuto] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransporteurs = async () => {
    try {
      const response = await axios.get(`${USERS_API}/available-transporteurs`);
      setAvailableTransporteurs(response.data);
    } catch (error) {
      console.error('Error fetching transporteurs:', error);
      // Mock data
      setAvailableTransporteurs([
        { id: 't1', nom: 'Paul Transporteur', phone: '237600000005' },
        { id: 't2', nom: 'Jacques Livreur', phone: '237600000006' },
      ]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTransporteurs();
  }, []);

  const handleAssignTransporteur = async (orderId: string, transporteurId: string) => {
    try {
      await axios.patch(`${API_URL}/${orderId}/assign-transporteur`, { transporteur_id: transporteurId });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error assigning transporteur:', error);
      // Update locally for demo
      setOrders(orders.map(o =>
        o.id === orderId
          ? { ...o, transporteur: availableTransporteurs.find(t => t.id === transporteurId), statut: 'en_livraison' }
          : o
      ));
      setSelectedOrder(null);
    }
  };

  const handleAutoAssign = async (orderId: string) => {
    if (availableTransporteurs.length === 0) {
      alert('Aucun transporteur disponible');
      return;
    }
    setAssigningAuto(true);
    try {
      // Auto-assign to first available transporteur
      const randomTransporteur = availableTransporteurs[Math.floor(Math.random() * availableTransporteurs.length)];
      await axios.patch(`${API_URL}/${orderId}/assign-transporteur`, { transporteur_id: randomTransporteur.id });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error auto-assigning:', error);
      // Demo update
      const randomTransporteur = availableTransporteurs[Math.floor(Math.random() * availableTransporteurs.length)];
      setOrders(orders.map(o =>
        o.id === orderId
          ? { ...o, transporteur: randomTransporteur, statut: 'en_livraison' }
          : o
      ));
      setSelectedOrder(null);
    } finally {
      setAssigningAuto(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await axios.patch(`${API_URL}/${orderId}/status`, { statut: newStatus });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating status:', error);
      // Update locally for demo
      setOrders(orders.map(o => o.id === orderId ? { ...o, statut: newStatus } : o));
      setSelectedOrder(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'en_attente': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'confirmee': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'en_livraison': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'livree': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'annulee': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client?.nom?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Commandes</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <ShoppingBag size={16} /> {orders.length} commandes enregistrées
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Rechercher par ID ou nom client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center gap-3 hover:bg-slate-200 transition-colors cursor-pointer outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_livraison">En livraison</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Commande</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">Chargement...</td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">Aucune commande trouvée.</td></tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <p className="font-bold text-slate-900 leading-tight">#{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <p className="font-medium text-slate-700">{order.client?.nom || 'Client inconnu'}</p>
                          <p className="text-xs text-slate-400">{order.client?.phone || ''}</p>
                        </td>
                        <td className="px-6 py-5 font-bold text-slate-900">
                          {order.montant_total?.toLocaleString() || 0} FCFA
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(order.statut)}`}>
                            {order.statut?.toUpperCase().replace('_', ' ') || 'INCONNU'}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                          >
                            <ArrowRight size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Details and Actions */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-24 animate-scale-up">
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${getStatusStyle(selectedOrder.statut)}`}>
                    {selectedOrder.statut?.toUpperCase().replace('_', ' ') || ''}
                  </span>
                  <button onClick={() => setSelectedOrder(null)} className="text-white/50 hover:text-white">
                    <XCircle size={20} />
                  </button>
                </div>
                <h3 className="text-xl font-bold">Détails Commande</h3>
                <p className="text-white/60 text-sm mt-1">ID: #{selectedOrder.id}</p>
              </div>

              <div className="p-6 space-y-8">
                {/* Client Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <User size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Informations Client</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900">{selectedOrder.client?.nom || 'Client inconnu'}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <Phone size={14} /> {selectedOrder.client?.phone || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <MapPin size={14} /> {selectedOrder.client?.ville || 'Position GPS active'}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <ShoppingBag size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Articles ({selectedOrder.items?.length || 0})</span>
                  </div>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded-lg">
                        <span className="text-slate-600">x{item.quantite} {item.product?.nom || 'Produit'}</span>
                        <span className="font-bold text-slate-900">{((item.prix_unitaire || 0) * (item.quantite || 0)).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-bold text-lg text-primary">
                      <span>Total</span>
                      <span>{(selectedOrder.montant_total || 0).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>

                {/* Transporter Assignment */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Truck size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Assignation Transporteur</span>
                  </div>
                  {selectedOrder.transporteur ? (
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-emerald-900">{selectedOrder.transporteur.nom}</p>
                        <p className="text-xs text-emerald-600">{selectedOrder.transporteur.phone}</p>
                      </div>
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <select
                        onChange={(e) => handleAssignTransporteur(selectedOrder.id, e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                      >
                        <option value="">Sélectionner un transporteur...</option>
                        {availableTransporteurs.map(t => (
                          <option key={t.id} value={t.id}>{t.nom} ({t.phone})</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAutoAssign(selectedOrder.id)}
                        disabled={assigningAuto}
                        className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                      >
                        <RefreshCw size={20} className={assigningAuto ? 'animate-spin' : ''} />
                        Assignation Automatique
                      </button>
                    </div>
                  )}
                </div>

                {/* Status Update Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <CheckCircle2 size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Modifier le Statut</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedOrder.statut === 'en_attente' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmee')}
                        className="py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors text-sm"
                      >
                        Confirmer
                      </button>
                    )}
                    {selectedOrder.statut === 'confirmee' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'en_livraison')}
                        className="py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors text-sm"
                      >
                        Livrer
                      </button>
                    )}
                    {selectedOrder.statut === 'en_livraison' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'livree')}
                        className="py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors text-sm"
                      >
                        Terminer
                      </button>
                    )}
                    {selectedOrder.statut !== 'annulee' && selectedOrder.statut !== 'livree' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'annulee')}
                        className="py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition-colors text-sm"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center space-y-4 text-slate-400 min-h-[400px]">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <ShoppingBag size={48} />
              </div>
              <div>
                <p className="font-bold text-slate-600 text-lg">Aucune commande sélectionnée</p>
                <p className="text-sm max-w-[200px]">Cliquez sur une commande pour voir les détails et agir.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;