# Password Generator + Secure Vault

A secure password manager built with Next.js, TypeScript, and MongoDB featuring client-side encryption.

## Features

### ✅ Must-haves (Completed)
- **Password Generator**: Customizable length (4-64), include/exclude numbers, symbols, and look-alike characters
- **User Authentication**: Email + password registration and login with JWT tokens
- **Secure Vault**: Store passwords with title, username, password, URL, and notes
- **Client-side Encryption**: All vault data is encrypted before sending to server using AES encryption with PBKDF2 key derivation
- **Copy to Clipboard**: One-click copy with automatic clipboard clearing after 15 seconds
- **Search & Filter**: Real-time search across all vault item fields
- **CRUD Operations**: Add, edit, delete vault items with confirmation prompts

### 🔒 Security Features
- **End-to-end Encryption**: Vault data is encrypted client-side with user's password
- **Zero-knowledge Architecture**: Server never sees plaintext passwords or vault data
- **Secure Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Authentication**: HTTP-only cookies with secure settings
- **Input Validation**: Comprehensive validation on both client and server
- **No Secrets in Logs**: Careful error handling to prevent data leaks

### 🎨 UI/UX Features
- **Minimal & Fast**: Clean, responsive design with Tailwind CSS
- **Instant Feedback**: Real-time password generation and search
- **Security Indicators**: Visual feedback for copy operations and security status
- **Mobile Responsive**: Works seamlessly on all device sizes

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Encryption**: CryptoJS (AES encryption with PBKDF2)
- **State Management**: React hooks and context
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <your-repo-url>
cd password-vault
npm install
```

2. **Set up environment variables**:
Create `.env.local` in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/password-vault
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this
NEXTAUTH_URL=http://localhost:3000
```

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Run the development server**:
```bash
npm run dev
```

5. **Open in browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Register**: Create an account with email and password
2. **Generate Password**: Use the password generator with customizable options
3. **Unlock Vault**: Enter your password to decrypt your vault
4. **Save Password**: Add the generated password to your vault with additional details
5. **Manage Items**: Search, edit, delete, and copy passwords from your vault

## Security Implementation

### Client-side Encryption
The application uses **AES encryption** with the following security measures:

- **Key Derivation**: PBKDF2 with 10,000 iterations and random salt
- **Encryption**: AES-256-CBC with random IV for each item
- **Data Format**: `salt:iv:encryptedData` stored as string
- **Zero-knowledge**: Server only stores encrypted blobs

### Authentication Flow
1. User registers/logs in with email and password
2. Password is hashed with bcrypt (12 rounds) and stored
3. JWT token is issued and stored in HTTP-only cookie
4. User's plain password is used locally for encryption/decryption
5. Server never sees the user's plain password after initial auth

### Copy Security
- Passwords are copied to clipboard on demand
- Clipboard is automatically cleared after 15 seconds
- Visual feedback confirms copy and clear operations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/logout` - Clear authentication
- `GET /api/auth/me` - Get current user info

### Vault Management
- `GET /api/vault` - Fetch user's encrypted vault items
- `POST /api/vault` - Create new vault item
- `PUT /api/vault/[id]` - Update existing vault item
- `DELETE /api/vault/[id]` - Delete vault item

### Utilities
- `POST /api/generate-password` - Generate secure password

## Deployment

### Environment Setup
1. Update environment variables for production
2. Set secure JWT secrets
3. Configure MongoDB connection string
4. Enable HTTPS in production

### Vercel Deployment (Recommended)
```bash
npm run build
# Deploy to Vercel
vercel --prod
```

### Manual Deployment
```bash
npm run build
npm start
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (bcrypt hashed, required),
  createdAt: Date
}
```

### VaultItems Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  encryptedData: String (AES encrypted JSON),
  createdAt: Date,
  updatedAt: Date
}
```

The `encryptedData` field contains encrypted JSON with this structure:
```javascript
{
  title: String,
  username: String,
  password: String,
  url: String,
  notes: String
}
```

## Development Notes

### Crypto Implementation Choice
- **Library**: CryptoJS for client-side encryption
- **Algorithm**: AES-256-CBC for strong encryption
- **Key Derivation**: PBKDF2 with 10,000 iterations for key stretching
- **Random Components**: Each encryption uses unique salt and IV

### Performance Considerations
- Password generation is instant (client-side)
- Vault decryption happens once per session
- Search is client-side for real-time filtering
- Minimal API calls with efficient caching

### Security Considerations
- All encryption/decryption happens client-side
- Server never logs sensitive data
- Clipboard is cleared automatically
- JWT tokens have 7-day expiration
- Password strength validation on client and server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

---

**Security Note**: This application implements client-side encryption to ensure your passwords remain private. However, remember to:
- Use a strong master password
- Keep your master password secure
- Regular backup your data
- Use HTTPS in production