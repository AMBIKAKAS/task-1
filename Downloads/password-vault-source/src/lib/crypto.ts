import CryptoJS from 'crypto-js';

export interface VaultItemData {
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

/**
 * Encrypts vault item data using AES encryption
 * Uses the user's password as the encryption key (derived with PBKDF2)
 */
export function encryptVaultItem(data: VaultItemData, userPassword: string): string {
  try {
    const jsonData = JSON.stringify(data);
    
    // Generate a random salt for key derivation
    const salt = CryptoJS.lib.WordArray.random(128/8);
    
    // Derive key from user password using PBKDF2
    const key = CryptoJS.PBKDF2(userPassword, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    // Generate random IV
    const iv = CryptoJS.lib.WordArray.random(128/8);
    
    // Encrypt the data
    const encrypted = CryptoJS.AES.encrypt(jsonData, key, { 
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Combine salt, iv, and encrypted data
    const combined = salt.toString() + ':' + iv.toString() + ':' + encrypted.toString();
    
    return combined;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts vault item data using AES decryption
 */
export function decryptVaultItem(encryptedData: string, userPassword: string): VaultItemData {
  try {
    // Split the combined data
    const parts = encryptedData.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }
    
    const salt = CryptoJS.enc.Hex.parse(parts[0]);
    const iv = CryptoJS.enc.Hex.parse(parts[1]);
    const encrypted = parts[2];
    
    // Derive the same key using the salt
    const key = CryptoJS.PBKDF2(userPassword, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Failed to decrypt data - invalid password or corrupted data');
    }
    
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Generates a strong password with customizable options
 */
export interface PasswordOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeLookAlikes: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  // Basic letters
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Look-alike characters to exclude
  const lookAlikes = '0O1lI';
  
  // Start with letters
  charset += letters;
  
  if (options.includeNumbers) {
    charset += numbers;
  }
  
  if (options.includeSymbols) {
    charset += symbols;
  }
  
  // Remove look-alikes if requested
  if (options.excludeLookAlikes) {
    charset = charset.split('').filter(char => !lookAlikes.includes(char)).join('');
  }
  
  let password = '';
  for (let i = 0; i < options.length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}