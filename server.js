const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Database files
const ACCOUNTS_FILE = path.join(__dirname, 'data/accounts.json');
const CONTACTS_FILE = path.join(__dirname, 'data/contacts.json');

// Ensure data directory exists
const ensureDataDir = async () => {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    console.error('Error creating data directory:', err);
  }
};

// Initialize empty database files if they don't exist
const initDatabase = async () => {
  await ensureDataDir();

  try {
    await fs.access(ACCOUNTS_FILE);
  } catch (err) {
    // File doesn't exist, create it
    await fs.writeFile(ACCOUNTS_FILE, JSON.stringify([], 'utf8'));
  }

  try {
    await fs.access(CONTACTS_FILE);
  } catch (err) {
    // File doesn't exist, create it
    await fs.writeFile(CONTACTS_FILE, JSON.stringify([], 'utf8'));
  }
};

// Helper functions to read and write data
const readData = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading from ${filePath}:`, err);
    return [];
  }
};

const writeData = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
    throw err;
  }
};

// API Routes

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await readData(ACCOUNTS_FILE);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get account by ID
app.get('/api/accounts/:id', async (req, res) => {
  try {
    const accounts = await readData(ACCOUNTS_FILE);
    const account = accounts.find(a => a.id === req.params.id);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

// Create account
app.post('/api/accounts', async (req, res) => {
  try {
    const accounts = await readData(ACCOUNTS_FILE);
    const newAccount = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    await writeData(ACCOUNTS_FILE, accounts);
    
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Update account
app.put('/api/accounts/:id', async (req, res) => {
  try {
    const accounts = await readData(ACCOUNTS_FILE);
    const index = accounts.findIndex(a => a.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    const updatedAccount = {
      ...accounts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    accounts[index] = updatedAccount;
    await writeData(ACCOUNTS_FILE, accounts);
    
    res.json(updatedAccount);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update account' });
  }
});

// Delete account
app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const accounts = await readData(ACCOUNTS_FILE);
    const filteredAccounts = accounts.filter(a => a.id !== req.params.id);
    
    if (filteredAccounts.length === accounts.length) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    await writeData(ACCOUNTS_FILE, filteredAccounts);
    
    // Also delete all contacts associated with this account
    const contacts = await readData(CONTACTS_FILE);
    const updatedContacts = contacts.filter(c => c.AccountId !== req.params.id);
    await writeData(CONTACTS_FILE, updatedContacts);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get contacts for a specific account
app.get('/api/accounts/:accountId/contacts', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    const accountContacts = contacts.filter(c => c.AccountId === req.params.accountId);
    res.json(accountContacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts for account' });
  }
});

// Get contact by ID
app.get('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    const contact = contacts.find(c => c.id === req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create contact
app.post('/api/contacts', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    const newContact = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    contacts.push(newContact);
    await writeData(CONTACTS_FILE, contacts);
    
    res.status(201).json(newContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
app.put('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    const index = contacts.findIndex(c => c.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    const updatedContact = {
      ...contacts[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    contacts[index] = updatedContact;
    await writeData(CONTACTS_FILE, contacts);
    
    res.json(updatedContact);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
app.delete('/api/contacts/:id', async (req, res) => {
  try {
    const contacts = await readData(CONTACTS_FILE);
    const filteredContacts = contacts.filter(c => c.id !== req.params.id);
    
    if (filteredContacts.length === contacts.length) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await writeData(CONTACTS_FILE, filteredContacts);
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// For any request that doesn't match one above, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Initialize database and start the server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
}); 