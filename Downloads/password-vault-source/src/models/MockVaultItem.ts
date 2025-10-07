import mockDB from '@/lib/mongodb-mock';

export interface IVaultItem {
  _id: string;
  userId: string;
  encryptedData: string;
  createdAt: Date;
  updatedAt: Date;
}

export class MockVaultItem {
  static async create(itemData: { userId: string; encryptedData: string }): Promise<IVaultItem> {
    return await mockDB.createVaultItem(itemData);
  }

  static async find({ userId }: { userId: string }): Promise<IVaultItem[]> {
    return await mockDB.findVaultItemsByUserId(userId);
  }

  static async findOne({ _id, userId }: { _id: string; userId: string }): Promise<IVaultItem | null> {
    return await mockDB.findVaultItemById(_id, userId);
  }

  static async findOneAndUpdate(
    { _id, userId }: { _id: string; userId: string },
    updates: Partial<IVaultItem>
  ): Promise<IVaultItem | null> {
    return await mockDB.updateVaultItem(_id, userId, updates);
  }

  static async findOneAndDelete({ _id, userId }: { _id: string; userId: string }): Promise<IVaultItem | null> {
    const item = await mockDB.findVaultItemById(_id, userId);
    if (item) {
      await mockDB.deleteVaultItem(_id, userId);
      return item;
    }
    return null;
  }
}

export default MockVaultItem;