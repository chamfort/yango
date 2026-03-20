import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users as UsersIcon,
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  XCircle,
  CheckCircle2,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Clock,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

const API_URL = 'http://localhost:3000';
const USERS_API = `${API_URL}/users`;
const ORDERS_API = `${API_URL}/orders`;

type UserRole = 'admin' | 'client' | 'distributeur' | 'transporteur';
type UserStatus = 'active' | 'suspended';

const Users: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Try to fetch from /all endpoint, otherwise get from orders to get unique users
      try {
        const response = await axios.get(`${USERS_API}/all`);
        setUsers(response.data || []);
      } catch (e) {
        // Fallback: get users from orders
        const ordersRes = await axios.get(ORDERS_API);
        const orders = ordersRes.data;
        const uniqueUsers: { [key: string]: any } = {};

        orders.forEach((order: any) => {
          if (order.client && !uniqueUsers[order.client.id]) {
            uniqueUsers[order.client.id] = {
              id: order.client.id,
              nom: order.client.nom,
              phone: order.client.phone,
              role: 'client',
              statut: 'active',
              ville: order.client.ville,
              createdAt: order.createdAt
            };
          }
          if (order.transporteur && !uniqueUsers[order.transporteur.id]) {
            uniqueUsers[order.transporteur.id] = {
              id: order.transporteur.id,
              nom: order.transporteur.nom,
              phone: order.transporteur.phone,
              role: 'transporteur',
              statut: 'active',
              createdAt: order.createdAt
            };
          }
        });

        // Add some mock users for demonstration
        setUsers([
          ...Object.values(uniqueUsers),
          { id: '1', nom: 'Admin Principal', phone: '237600000001', role: 'admin', statut: 'active', email: 'admin@beerlink.cm', createdAt: new Date().toISOString() },
          { id: '2', nom: 'Jean Dupont', phone: '237600000002', role: 'client', statut: 'active', ville: 'Douala', email: 'jean@example.com', createdAt: new Date().toISOString() },
          { id: '3', nom: 'Marie Kotto', phone: '237600000003', role: 'client', statut: 'active', ville: 'Yaoundé', email: 'marie@example.com', createdAt: new Date().toISOString() },
          { id: '4', nom: 'Pierre Distribution', phone: '237600000004', role: 'distributeur', statut: 'active', email: 'pierre@distrib.com', createdAt: new Date().toISOString() },
          { id: '5', nom: 'Paul Transporteur', phone: '237600000005', role: 'transporteur', statut: 'active', est_disponible: true, createdAt: new Date().toISOString() },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data on error
      setUsers([
        { id: '1', nom: 'Admin Principal', phone: '237600000001', role: 'admin', statut: 'active', email: 'admin@beerlink.cm', createdAt: new Date().toISOString() },
        { id: '2', nom: 'Jean Dupont', phone: '237600000002', role: 'client', statut: 'active', ville: 'Douala', email: 'jean@example.com', createdAt: new Date().toISOString() },
        { id: '3', nom: 'Marie Kotto', phone: '237600000003', role: 'client', statut: 'active', ville: 'Yaoundé', email: 'marie@example.com', createdAt: new Date().toISOString() },
        { id: '4', nom: 'Pierre Distribution', phone: '237600000004', role: 'distributeur', statut: 'active', email: 'pierre@distrib.com', createdAt: new Date().toISOString() },
        { id: '5', nom: 'Paul Transporteur', phone: '237600000005', role: 'transporteur', statut: 'active', est_disponible: true, createdAt: new Date().toISOString() },
        { id: '6', nom: 'Alice Client', phone: '237600000006', role: 'client', statut: 'suspended', ville: 'Douala', email: 'alice@example.com', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      await axios.patch(`${USERS_API}/${userId}`, data);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      // Update locally for demo
      setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`${USERS_API}/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setUsers(users.filter(u => u.id !== userId));
      }
    }
  };

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.statut === 'active' ? 'suspended' : 'active';
    handleUpdateUser(user.id, { statut: newStatus });
  };

  const handleRoleChange = async (user: any, newRole: UserRole) => {
    handleUpdateUser(user.id, { role: newRole });
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone?.includes(searchQuery) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRoleBadge = (role: string) => {
    const styles: { [key: string]: string } = {
      admin: 'bg-purple-100 text-purple-700',
      client: 'bg-blue-100 text-blue-700',
      distributeur: 'bg-amber-100 text-amber-700',
      transporteur: 'bg-emerald-100 text-emerald-700'
    };
    return styles[role] || 'bg-slate-100 text-slate-700';
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
      : 'bg-rose-50 text-rose-600 border-rose-100';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <UsersIcon size={16} /> {users.length} utilisateurs enregistrés
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={24} />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-6 py-3.5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Administrateurs</option>
          <option value="client">Clients</option>
          <option value="distributeur">Distributeurs</option>
          <option value="transporteur">Transporteurs</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Users Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Utilisateur</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Rôle</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          Chargement...
                        </div>
                      </td>
                    </tr>
                  ) : paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                        Aucun utilisateur trouvé.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={18} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.nom}</p>
                              <p className="text-xs text-slate-400">{user.email || 'Pas d\'email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getRoleBadge(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(user.statut)} flex items-center gap-1`}
                          >
                            {user.statut === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {user.statut.toUpperCase()}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-sm text-slate-600">
                          {user.phone}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-sm text-slate-500 font-medium">
              <p>Affichage de {((currentPage - 1) * itemsPerPage) + 1} à {Math.min(currentPage * itemsPerPage, filteredUsers.length)} sur {filteredUsers.length}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center border rounded-xl font-bold ${currentPage === page ? 'bg-primary text-white border-primary' : 'border-slate-200 hover:bg-white'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-xl hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Panel */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-24 animate-scale-up">
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${getStatusBadge(selectedUser.statut)}`}>
                    {selectedUser.statut.toUpperCase()}
                  </span>
                  <button onClick={() => setSelectedUser(null)} className="text-white/50 hover:text-white">
                    <XCircle size={20} />
                  </button>
                </div>
                <h3 className="text-xl font-bold">Détails Utilisateur</h3>
                <p className="text-white/60 text-sm mt-1">ID: #{selectedUser.id}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <User size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Informations</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <p className="font-bold text-slate-900">{selectedUser.nom}</p>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Phone size={14} /> {selectedUser.phone}
                    </p>
                    {selectedUser.email && (
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <Mail size={14} /> {selectedUser.email}
                      </p>
                    )}
                    {selectedUser.ville && (
                      <p className="text-sm text-slate-500 flex items-center gap-2">
                        <MapPin size={14} /> {selectedUser.ville}
                      </p>
                    )}
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Clock size={14} /> Créé le {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Role Management */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Shield size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Rôle</span>
                  </div>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => handleRoleChange(selectedUser, e.target.value as UserRole)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="admin">Administrateur</option>
                    <option value="client">Client</option>
                    <option value="distributeur">Distributeur</option>
                    <option value="transporteur">Transporteur</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-400">
                    {selectedUser.statut === 'active' ? <CheckCircle2 size={18} /> : <EyeOff size={18} />}
                    <span className="text-xs font-bold uppercase tracking-widest">Statut du Compte</span>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(selectedUser)}
                    className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedUser.statut === 'active'
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                    }`}
                  >
                    {selectedUser.statut === 'active' ? (
                      <>
                        <EyeOff size={20} />
                        Suspendre le compte
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        Activer le compte
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center space-y-4 text-slate-400 min-h-[400px]">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <UsersIcon size={48} />
              </div>
              <div>
                <p className="font-bold text-slate-600 text-lg">Aucun utilisateur sélectionné</p>
                <p className="text-sm max-w-[200px]">Cliquez sur un utilisateur pour voir les détails et gérer ses paramètres.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <AddUserModal onClose={() => setIsAddModalOpen(false)} onAdd={(user) => {
          setUsers([...users, { ...user, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
          setIsAddModalOpen(false);
        }} />
      )}
    </div>
  );
};

// Add User Modal Component
const AddUserModal: React.FC<{ onClose: () => void; onAdd: (user: any) => void }> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    nom: '',
    phone: '',
    email: '',
    role: 'client' as UserRole,
    ville: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      statut: 'active'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-scale-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Ajouter un Utilisateur</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <XCircle size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="Jean Dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="237600000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              placeholder="jean@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rôle</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="client">Client</option>
              <option value="distributeur">Distributeur</option>
              <option value="transporteur">Transporteur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          {formData.role === 'client' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Douala"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-colors"
          >
            Créer l'utilisateur
          </button>
        </form>
      </div>
    </div>
  );
};

export default Users;