import mockDB from '@/lib/mongodb-mock';

export interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
}

export class MockUser {
  static async create(userData: { email: string; password: string }): Promise<IUser> {
    return await mockDB.createUser(userData);
  }

  static async findOne({ email }: { email: string }): Promise<IUser | null> {
    return await mockDB.findUserByEmail(email);
  }

  static async findById(id: string): Promise<IUser | null> {
    return await mockDB.findUserById(id);
  }
}

export default MockUser;