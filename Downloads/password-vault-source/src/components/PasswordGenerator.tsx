'use client';

import { useState } from 'react';
import { RefreshCw, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void;
}

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatePassword = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          length,
          includeNumbers,
          includeSymbols,
          excludeLookAlikes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPassword(data.password);
        onPasswordGenerated?.(data.password);
      } else {
        toast.error('Failed to generate password');
      }
    } catch (error) {
      toast.error('Failed to generate password');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast.success('Password copied to clipboard!');

      // Auto-clear after 15 seconds
      setTimeout(() => {
        navigator.clipboard.writeText('');
        toast.success('Clipboard cleared for security');
      }, 15000);

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-colors">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Password Generator</h2>
      
      {/* Generated Password Display */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Generated Password
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Click generate to create a password"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 font-mono text-black dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            onClick={copyToClipboard}
            disabled={!password}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Length Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Length: {length}
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer transition-colors"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>4</span>
          <span>64</span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={(e) => setIncludeNumbers(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Numbers (0-9)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeSymbols}
            onChange={(e) => setIncludeSymbols(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include Symbols (!@#$%^&*)
          </span>
        </label>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={excludeLookAlikes}
            onChange={(e) => setExcludeLookAlikes(e.target.checked)}
            className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Exclude Look-alikes (0, O, 1, l, I)
          </span>
        </label>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        disabled={generating}
        className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <RefreshCw size={20} className={`mr-2 ${generating ? 'animate-spin' : ''}`} />
        {generating ? 'Generating...' : 'Generate Password'}
      </button>
    </div>
  );
}
