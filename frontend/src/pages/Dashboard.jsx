import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssets, createAsset, updateAsset, deleteAsset } from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // New Asset Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Real Estate',
    value: '',
    description: '',
  });

  // Edit Modal State
  const [editingAsset, setEditingAsset] = useState(null);

  // Helper function for re-fetching assets after actions (Create/Update/Delete)
  const loadAssets = async () => {
    try {
      const response = await getAssets();
      setAssets(response.data);
    } catch (err) {
      console.error('Failed to fetch assets', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assets on mount without triggering cascading render warnings
  useEffect(() => {
    let isMounted = true;

    const fetchAssetsOnMount = async () => {
      try {
        const response = await getAssets();
        if (isMounted) {
          setAssets(response.data);
        }
      } catch (err) {
        console.error('Failed to fetch assets', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssetsOnMount();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditingAsset({ ...editingAsset, [e.target.name]: e.target.value });
  };

  const handleCreateAsset = async (e) => {
    e.preventDefault();
    try {
      await createAsset(formData);
      setFormData({ title: '', category: 'Real Estate', value: '', description: '' });
      await loadAssets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating asset');
    }
  };

  const handleUpdateAsset = async (e) => {
    e.preventDefault();
    try {
      await updateAsset(editingAsset.id, {
        title: editingAsset.title,
        category: editingAsset.category,
        value: editingAsset.value,
        description: editingAsset.description,
      });
      setEditingAsset(null); // Close edit modal
      await loadAssets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating asset');
    }
  };

  const handleDeleteAsset = async (id) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;
    try {
      await deleteAsset(id);
      await loadAssets();
    } catch {
      alert('Error deleting asset');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 🔍 Filter assets based on search input & category filter
  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'All' || asset.category === selectedCategory;

    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.description &&
        asset.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const totalValue = assets.reduce((sum, asset) => sum + Number(asset.value), 0);
  const filteredValue = filteredAssets.reduce((sum, asset) => sum + Number(asset.value), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-lg shadow flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Asset Vault Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome, {user.name || 'User'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Portfolio Overview Banner */}
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-sm uppercase tracking-wider font-semibold opacity-80">Total Vault Value</h2>
            <p className="text-4xl font-extrabold mt-1">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {(selectedCategory !== 'All' || searchQuery !== '') && (
            <div className="bg-blue-700 p-3 rounded-lg border border-blue-500">
              <span className="text-xs uppercase font-semibold text-blue-200">Filtered Value:</span>
              <p className="text-xl font-bold">
                ${filteredValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}
        </div>

        {/* Add New Asset Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Asset</h2>
          <form onSubmit={handleCreateAsset} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Asset Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Downtown Apartment"
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Category</label>
              <select
                name="category"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Real Estate">Real Estate</option>
                <option value="Stocks">Stocks</option>
                <option value="Crypto">Crypto</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Cash/Savings">Cash/Savings</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Estimated Value ($)</label>
              <input
                type="number"
                name="value"
                placeholder="e.g., 250000"
                required
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.value}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Description (Optional)</label>
              <input
                type="text"
                name="description"
                placeholder="e.g., 2-bedroom rental property"
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition"
              >
                + Add Asset
              </button>
            </div>
          </form>
        </div>

        {/* Search, Filter & Asset Table Section */}
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800">
              Your Assets ({filteredAssets.length} of {assets.length})
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Field */}
              <input
                type="text"
                placeholder="🔍 Search assets..."
                className="border px-3 py-2 rounded text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Category Dropdown */}
              <select
                className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Stocks">Stocks</option>
                <option value="Crypto">Crypto</option>
                <option value="Vehicle">Vehicle</option>
                <option value="Cash/Savings">Cash/Savings</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-gray-500 py-4 text-center">Loading assets...</p>
          ) : filteredAssets.length === 0 ? (
            <p className="text-gray-500 py-6 text-center">
              {assets.length === 0
                ? 'No assets found. Add your first asset above!'
                : 'No assets match your search/filter criteria.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Value</th>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3 font-semibold text-gray-800">{asset.title}</td>
                      <td className="p-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {asset.category}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-gray-700">${Number(asset.value).toLocaleString()}</td>
                      <td className="p-3 text-sm text-gray-500">{asset.description || '—'}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingAsset(asset)}
                          className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded text-xs font-semibold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 px-3 py-1 rounded text-xs font-semibold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ✏️ Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Edit Asset</h2>
            <form onSubmit={handleUpdateAsset} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Asset Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingAsset.title}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select
                  name="category"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingAsset.category}
                  onChange={handleEditChange}
                >
                  <option value="Real Estate">Real Estate</option>
                  <option value="Stocks">Stocks</option>
                  <option value="Crypto">Crypto</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Cash/Savings">Cash/Savings</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Value ($)</label>
                <input
                  type="number"
                  name="value"
                  required
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingAsset.value}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={editingAsset.description || ''}
                  onChange={handleEditChange}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}