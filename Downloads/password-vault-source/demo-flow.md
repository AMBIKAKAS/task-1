# Password Vault Demo Flow

## Demo Steps (60-90 seconds)

### 1. Register/Login (10 seconds)
- Navigate to http://localhost:3000
- Show the landing page redirecting to login
- Register with email: demo@example.com, password: demopass123
- Show successful registration and redirect to dashboard

### 2. Password Generation (15 seconds)
- Show the password generator interface
- Adjust settings (length slider to 20)
- Enable/disable options (numbers, symbols, exclude look-alikes)
- Click "Generate Password" button
- Show generated password appears instantly
- Click copy button and show "copied" feedback

### 3. Save to Vault (15 seconds)
- Click "Add Item" button
- Show the vault form modal
- Fill in:
  - Title: "Gmail Account"
  - Username: "demo@gmail.com"
  - Password: (auto-filled from generator)
  - URL: "https://gmail.com"
  - Notes: "Personal email account"
- Click "Save" button
- Show success toast and item appears in vault

### 4. Unlock Vault (10 seconds)
- Enter password to unlock vault: "demopass123"
- Show "Vault unlocked successfully" message
- Show the encrypted item gets decrypted and displayed

### 5. Search and Interact (15 seconds)
- Use search box to search for "gmail"
- Show filtered results
- Click on the item to see details
- Click copy password button
- Show "Password copied" and "Clipboard cleared" messages

### 6. Edit Item (10 seconds)
- Click edit button on the vault item
- Modify the notes field
- Click "Update" button
- Show success message and updated timestamp

### 7. Delete Item (5 seconds)
- Click delete button
- Show confirmation dialog
- Confirm deletion
- Show item removed from vault

## Key Security Points to Highlight
- Client-side encryption notice
- Password never stored in plaintext
- Clipboard auto-clear after 15 seconds
- All vault data encrypted before sending to server
- Zero-knowledge architecture

## Technical Features Demonstrated
- Instant password generation
- Real-time search/filtering
- Responsive design
- Form validation
- Toast notifications
- Copy to clipboard functionality
- Modal dialogs
- CRUD operations