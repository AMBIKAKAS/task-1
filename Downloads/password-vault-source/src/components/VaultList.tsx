'use client';

import { useState } from 'react';
import { Search, Plus, Lock } from 'lucide-react';
import { useVault, DecryptedVaultItem } from '@/hooks/useVault';
import { VaultItemData } from '@/lib/crypto';
import VaultItem from './VaultItem';
import VaultItemForm from './VaultItemForm';

interface VaultListProps {
  userPassword: string;
  generatedPassword?: string;
  onPasswordUsed?: () => void;
}

export default function VaultList({ userPassword, generatedPassword, onPasswordUsed }: VaultListProps) {
  const {
    items,
    loading,
    searchTerm,
    setSearchTerm,
    addItem,
    updateItem,
    deleteItem,
  } = useVault(userPassword);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
    setShowForm(true);
  };

  const handleEdit = (item: DecryptedVaultItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
    setShowForm(true);
  };

  const handleSave = async (data: VaultItemData): Promise<boolean> => {
    let success = false;
    
    if (editingItem) {
      success = await updateItem(editingItem._id, data);
    } else {
      success = await addItem(data);
      if (success && generatedPassword && data.password === generatedPassword) {
        onPasswordUsed?.();
      }
    }
    
    if (success) {
      setIsFormOpen(false);
      setShowForm(false);
      setEditingItem(null);
    }
    
    return success;
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading vault items...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Lock className="mr-2" size={24} />
            Your Vault
          </h2>
          <button
            onClick={handleAddNew}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Item
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your vault..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <Lock className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {searchTerm ? 'No items found' : 'Your vault is empty'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Generate a password and save it to get started'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Your First Item
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              {searchTerm && (
                <>
                  {items.length} result{items.length !== 1 ? 's' : ''} for &quot;{searchTerm}&quot;
                </>
              )}
            </div>

            {/* Items grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <VaultItem
                  key={item._id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <VaultItemForm
          item={editingItem}
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSave}
          generatedPassword={generatedPassword}
        />
      )}
    </div>
  );
}