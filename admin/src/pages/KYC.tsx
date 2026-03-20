import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Eye, 
  FileText, 
  AlertCircle,
  XCircle,
  Clock,
  Search
} from 'lucide-react';

const API_URL = 'http://localhost:3000/users';

const KYC: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [kycNotes, setKycNotes] = useState('');

  const fetchPendingKYC = async () => {
    setLoading(true);
    try {
      // Note: In a real app, you'd have an admin token
      const response = await axios.get(`${API_URL}/pending-kyc`);
      setPendingUsers(response.data);
    } catch (error) {
      console.error('Error fetching pending KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingKYC();
  }, []);

  const handleUpdateStatus = async (id: string, statut: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/kyc-status`, { 
        statut, 
        kycNotes 
      });
      setSelectedUser(null);
      setKycNotes('');
      fetchPendingKYC();
    } catch (error) {
      console.error('Error updating KYC status:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Validation KYC</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <ShieldCheck size={16} /> {pendingUsers.length} dossiers en attente de vérification
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Dossiers Récents</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-20 text-center text-slate-400">Chargement...</div>
              ) : pendingUsers.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic">Aucun dossier en attente.</div>
              ) : (
                pendingUsers.map(user => (
                  <div 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className={`p-6 hover:bg-slate-50 cursor-pointer transition-all flex items-center justify-between group ${selectedUser?.id === user.id ? 'bg-slate-50' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold">
                        {user.nom.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{user.nom}</p>
                        <p className="text-sm text-slate-500">{user.role.replace('_', ' ')} • {user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold flex items-center gap-1.5">
                        <Clock size={12} /> EN ATTENTE
                      </span>
                      <Eye size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Verification Detail Card */}
        <div className="lg:col-span-1">
          {selectedUser ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden sticky top-24 animate-scale-up">
              <div className="p-6 bg-slate-900 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/10 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <button onClick={() => setSelectedUser(null)} className="text-white/50 hover:text-white">
                    <XCircle size={20} />
                  </button>
                </div>
                <h3 className="text-xl font-bold">{selectedUser.nom}</h3>
                <p className="text-white/60 text-sm mt-1 uppercase tracking-wider font-medium">{selectedUser.role}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Documents Section */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Documents fournis</p>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
                          <FileText size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Pièce d'identité (CNI)</span>
                      </div>
                      <Eye size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg">
                          <UserCheck size={18} />
                        </div>
                        <span className="text-sm font-bold text-slate-700">Selfie de vérification</span>
                      </div>
                      <Eye size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Décision</p>
                  <textarea 
                    placeholder="Notes internes (ex: Document flou...)"
                    value={kycNotes}
                    onChange={(e) => setKycNotes(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedUser.id, 'suspendu')}
                      className="flex-1 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <UserX size={18} /> Rejeter
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedUser.id, 'actif')}
                      className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <UserCheck size={18} /> Approuver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center space-y-4 text-slate-400">
              <div className="p-4 bg-white rounded-full shadow-sm">
                <AlertCircle size={32} />
              </div>
              <div>
                <p className="font-bold text-slate-600">Aucune sélection</p>
                <p className="text-sm">Sélectionnez un dossier à gauche pour l'examiner.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KYC;
