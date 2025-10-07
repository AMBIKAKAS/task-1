'use client';

import { useState } from 'react';
import { Edit, Trash2, Copy, Eye, EyeOff, ExternalLink, Check } from 'lucide-react';
import { DecryptedVaultItem } from '@/hooks/useVault';
import toast from 'react-hot-toast';

interface VaultItemProps {
  item: DecryptedVaultItem;
  onEdit: (item: DecryptedVaultItem) => void;
  onDelete: (id: string) => void;
}

export default function VaultItem({ item, onEdit, onDelete }: VaultItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard!`);
      
      // Auto-clear clipboard after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
        toast.success('Clipboard cleared for security');
      }, 15000);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error(`Failed to copy ${fieldName.toLowerCase()}`);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete(item._id);
    }
  };

  const openUrl = () => {
    if (item.url) {
      let url = item.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Username */}
      {item.username && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700 flex-1 truncate">{item.username}</span>
            <button
              onClick={() => copyToClipboard(item.username, 'Username')}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Copy username"
            >
              {copiedField === 'Username' ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* Password */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 flex-1 font-mono">
            {showPassword ? item.password : '••••••••••••'}
          </span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <button
            onClick={() => copyToClipboard(item.password, 'Password')}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Copy password"
          >
            {copiedField === 'Password' ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* URL */}
      {item.url && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">URL</label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-blue-600 flex-1 truncate">{item.url}</span>
            <button
              onClick={() => copyToClipboard(item.url, 'URL')}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Copy URL"
            >
              {copiedField === 'URL' ? <Check size={16} /> : <Copy size={16} />}
            </button>
            <button
              onClick={openUrl}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Open URL"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Notes */}
      {item.notes && (
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
          <p className="text-sm text-gray-700 break-words">{item.notes}</p>
        </div>
      )}

      {/* Timestamps */}
      <div className="flex justify-between text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100">
        <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
        <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}