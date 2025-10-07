import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { decryptVaultItem, VaultItemData } from '@/lib/crypto';

export interface VaultItem {
  _id: string;
  encryptedData: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedVaultItem extends VaultItemData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export function useVault(userPassword: string | null) {
  const [items, setItems] = useState<VaultItem[]>([]);
  const [decryptedItems, setDecryptedItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (userPassword) {
      fetchItems();
    }
  }, [userPassword]);

  useEffect(() => {
    if (userPassword) {
      decryptItems();
    }
  }, [items, userPassword]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vault', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      } else {
        toast.error('Failed to fetch vault items');
      }
    } catch (error) {
      toast.error('Failed to fetch vault items');
    } finally {
      setLoading(false);
    }
  };

  const decryptItems = async () => {
    if (!userPassword) return;

    const decrypted: DecryptedVaultItem[] = [];
    
    for (const item of items) {
      try {
        const decryptedData = decryptVaultItem(item.encryptedData, userPassword);
        decrypted.push({
          ...decryptedData,
          _id: item._id,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      } catch (error) {
        console.error('Failed to decrypt item:', item._id, error);
        // Skip items that can't be decrypted
      }
    }
    
    setDecryptedItems(decrypted);
  };

  const addItem = async (vaultData: VaultItemData): Promise<boolean> => {
    if (!userPassword) {
      toast.error('User password required');
      return false;
    }

    try {
      const response = await fetch('/api/vault', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ vaultData, userPassword }),
      });

      if (response.ok) {
        toast.success('Item added successfully');
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add item');
        return false;
      }
    } catch (error) {
      toast.error('Failed to add item');
      return false;
    }
  };

  const updateItem = async (id: string, vaultData: VaultItemData): Promise<boolean> => {
    if (!userPassword) {
      toast.error('User password required');
      return false;
    }

    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ vaultData, userPassword }),
      });

      if (response.ok) {
        toast.success('Item updated successfully');
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update item');
        return false;
      }
    } catch (error) {
      toast.error('Failed to update item');
      return false;
    }
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        toast.success('Item deleted successfully');
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete item');
        return false;
      }
    } catch (error) {
      toast.error('Failed to delete item');
      return false;
    }
  };

  // Filter items based on search term
  const filteredItems = decryptedItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    items: filteredItems,
    loading,
    searchTerm,
    setSearchTerm,
    addItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
}