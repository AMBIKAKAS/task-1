import mongoose from 'mongoose';

export interface IVaultItem extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  encryptedData: string; // This will contain encrypted JSON of { title, username, password, url, notes }
  createdAt: Date;
  updatedAt: Date;
}

const VaultItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  encryptedData: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
VaultItemSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);