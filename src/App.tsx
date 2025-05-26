import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';

// Pages
import AccountsPage from './pages/Accounts/AccountsPage';
import AccountDetailPage from './pages/Accounts/AccountDetailPage';
import AccountFormPage from './pages/Accounts/AccountFormPage';
import ContactsPage from './pages/Contacts/ContactsPage';
import ContactDetailPage from './pages/Contacts/ContactDetailPage';
import ContactFormPage from './pages/Contacts/ContactFormPage';

// Create a theme with Salesforce-like colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#0176d3', // Salesforce blue
    },
    secondary: {
      main: '#1b96ff', // Salesforce secondary blue
    },
    background: {
      default: '#f3f3f3',
    },
  },
  typography: {
    fontFamily: '"Salesforce Sans", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: 1, padding: '16px', paddingBottom: '72px' }}>
            <Routes>
              {/* Account Routes */}
              <Route path="/" element={<AccountsPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/accounts/new" element={<AccountFormPage />} />
              <Route path="/accounts/:id" element={<AccountDetailPage />} />
              <Route path="/accounts/:id/edit" element={<AccountFormPage />} />
              
              {/* Contact Routes */}
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contacts/new" element={<ContactFormPage />} />
              <Route path="/contacts/:id" element={<ContactDetailPage />} />
              <Route path="/contacts/:id/edit" element={<ContactFormPage />} />
              <Route path="/accounts/:accountId/contacts/new" element={<ContactFormPage />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
