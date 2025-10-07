// Mock MongoDB connection for development/testing
// Replace this with real MongoDB connection in production

interface MockUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface MockVaultItem {
  _id: string;
  userId: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

class MockDB {
  private users: MockUser[] = [];
  private vaultItems: MockVaultItem[] = [];
  private nextId = 1;

  generateId(): string {
    return (this.nextId++).toString().padStart(24, '0');
  }

  // User operations
  async createUser(userData: Omit<MockUser, '_id' | 'createdAt'>): Promise<MockUser> {
    const user: MockUser = {
      _id: this.generateId(),
      ...userData,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<MockUser | null> {
    return this.users.find(user => user.email === email) || null;
  }

  async findUserById(id: string): Promise<MockUser | null> {
    return this.users.find(user => user._id === id) || null;
  }

  // Vault operations
  async createVaultItem(itemData: Omit<MockVaultItem, '_id' | 'createdAt' | 'updatedAt'>): Promise<MockVaultItem> {
    const item: MockVaultItem = {
      _id: this.generateId(),
      ...itemData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.vaultItems.push(item);
    return item;
  }

  async findVaultItemsByUserId(userId: string): Promise<MockVaultItem[]> {
    return this.vaultItems
      .filter(item => item.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async findVaultItemById(id: string, userId: string): Promise<MockVaultItem | null> {
    return this.vaultItems.find(item => item._id === id && item.userId === userId) || null;
  }

  async updateVaultItem(id: string, userId: string, updates: Partial<MockVaultItem>): Promise<MockVaultItem | null> {
    const itemIndex = this.vaultItems.findIndex(item => item._id === id && item.userId === userId);
    if (itemIndex === -1) return null;

    this.vaultItems[itemIndex] = {
      ...this.vaultItems[itemIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return this.vaultItems[itemIndex];
  }

  async deleteVaultItem(id: string, userId: string): Promise<boolean> {
    const itemIndex = this.vaultItems.findIndex(item => item._id === id && item.userId === userId);
    if (itemIndex === -1) return false;

    this.vaultItems.splice(itemIndex, 1);
    return true;
  }
}

// Global instance
const mockDB = new MockDB();

export default mockDB;

// Mock connection function
export async function dbConnect() {
  console.log('Using mock database (development mode)');
  return mockDB;
}