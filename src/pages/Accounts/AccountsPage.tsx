import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { accountApi } from '../../services/api';
import { Account } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch accounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Filter accounts when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAccounts(accounts);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = accounts.filter(
        account => 
          account.Name.toLowerCase().includes(lowercaseSearch) ||
          (account.Industry && account.Industry.toLowerCase().includes(lowercaseSearch)) ||
          (account.Phone && account.Phone.includes(searchTerm))
      );
      setFilteredAccounts(filtered);
    }
  }, [accounts, searchTerm]);

  // Fetch accounts from API
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await accountApi.getAccounts();
      setAccounts(data);
      setFilteredAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      setError('Failed to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle account selection
  const handleAccountClick = (accountId: string) => {
    navigate(`/accounts/${accountId}`);
  };

  // Create new account
  const handleCreateAccount = () => {
    navigate('/accounts/new');
  };

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <LoadingSpinner message="Loading accounts..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={fetchAccounts} />;
  }

  return (
    <Container maxWidth="sm">
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search accounts..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          size="small"
        />
      </Box>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateAccount}
          fullWidth
        >
          Create New Account
        </Button>
      </Box>

      {filteredAccounts.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="body1" align="center" color="textSecondary">
              {searchTerm ? 'No accounts match your search' : 'No accounts found. Create your first account!'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List disablePadding>
            {filteredAccounts.map((account, index) => (
              <React.Fragment key={account.id || index}>
                {index > 0 && <Divider />}
                <ListItem button onClick={() => handleAccountClick(account.id || '')}>
                  <ListItemText
                    primary={account.Name}
                    secondary={
                      <>
                        {account.Industry && <span>{account.Industry}</span>}
                        {account.Phone && (
                          <>
                            {account.Industry && <span> • </span>}
                            <span>{account.Phone}</span>
                          </>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => handleAccountClick(account.id || '')}>
                      <ChevronRightIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Card>
      )}
    </Container>
  );
};

export default AccountsPage; 