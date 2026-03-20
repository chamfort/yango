import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Box
} from 'lucide-react';
import ProductForm from '../components/products/ProductForm';

const API_URL = 'http://localhost:3000/products';

const Products: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);

      // Extract unique categories
      const uniqueCategories = [...new Set(response.data.map((p: any) => p.categorie).filter(Boolean))];
      setCategories(uniqueCategories as string[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Mock data
      const mockProducts = [
        { id: '1', nom: 'Bière Heineken 33cl', categorie: 'Bières', prix: 750, stock: 150, description: 'Bière blonde premium' },
        { id: '2', nom: 'Bière Castel 50cl', categorie: 'Bières', prix: 500, stock: 8, description: 'Bière locale préférée' },
        { id: '3', nom: 'Bière Guinness 33cl', categorie: 'Bières', prix: 800, stock: 0, description: 'Bière noire artisanale' },
        { id: '4', nom: 'Eau Minérale 1L', categorie: 'Boissons non alcoolisées', prix: 300, stock: 200, description: 'Eau de source naturelle' },
        { id: '5', nom: 'Jus d\'Orange 1L', categorie: 'Boissons non alcoolisées', prix: 450, stock: 50, description: 'Jus frais pressé' },
        { id: '6', nom: 'Cocktail Snaps 25cl', categorie: 'Alcool Cocktail', prix: 1200, stock: 75, description: 'Cocktail prêt à boire' },
        { id: '7', nom: 'Whisky Jameson 70cl', categorie: 'Spiritueux', prix: 4500, stock: 25, description: 'Whisky irlandais premium' },
        { id: '8', nom: 'Rhum Blanc 1L', categorie: 'Spiritueux', prix: 2500, stock: 30, description: 'Rhum blanc artisanal' },
      ];
      setProducts(mockProducts);
      setCategories(['Bières', 'Boissons non alcoolisées', 'Alcool Cocktail', 'Spiritueux']);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      if (editingProduct) {
        await axios.patch(`${API_URL}/${editingProduct.id}`, data);
      } else {
        await axios.post(API_URL, data);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      // Demo: update locally
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
      } else {
        setProducts([...products, { ...data, id: Date.now().toString() }]);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.categorie === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion du Catalogue</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Box size={16} /> {products.length} produits référencés au total
          </p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-primary text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus size={24} />
          Ajouter un produit
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Rechercher par nom ou catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-6 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center gap-3 hover:bg-slate-200 transition-colors cursor-pointer outline-none"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Produit</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Catégorie</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Prix</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Chargement des produits...
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic">
                    Aucun produit trouvé.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                          {p.photo ? (
                            <img src={p.photo} alt={p.nom} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="text-slate-300" size={24} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{p.nom}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{p.description || 'Aucune description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-wide">
                        {p.categorie || 'Non catégorisé'}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-900">
                      {(p.prix || 0).toLocaleString()}fcfa
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
                        <span className="font-bold text-slate-700">{p.stock ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingProduct(p); setIsModalOpen(true); }}
                          className="p-3 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
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

        {/* Pagination Footer */}
        <div className="p-6 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center text-sm text-slate-500 font-medium">
          <p>Affichage de {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} à {Math.min(currentPage * itemsPerPage, filteredProducts.length)} sur {filteredProducts.length}</p>
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

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsModalOpen(false)}
          onSave={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default Products;