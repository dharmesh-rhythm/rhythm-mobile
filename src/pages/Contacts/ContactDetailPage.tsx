import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { contactApi, accountApi } from '../../services/api';
import { Contact, Account } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const ContactDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  const fetchContact = async (contactId: string) => {
    setLoading(true);
    setError(null);
    try {
      const contactData = await contactApi.getContact(contactId);
      setContact(contactData);
      
      // If contact has an associated account, fetch it
      if (contactData.AccountId) {
        try {
          const accountData = await accountApi.getAccount(contactData.AccountId);
          setAccount(accountData);
        } catch (accountErr) {
          console.error('Failed to fetch associated account:', accountErr);
          // Not setting an error here since the contact data is still available
        }
      }
    } catch (err) {
      console.error('Failed to fetch contact:', err);
      setError('Failed to load contact details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (id) {
      navigate(`/contacts/${id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await contactApi.deleteContact(id);
      navigate('/contacts');
    } catch (err) {
      console.error('Failed to delete contact:', err);
      setError('Failed to delete contact. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading contact details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} retry={() => id && fetchContact(id)} />;
  }

  if (!contact) {
    return (
      <Container maxWidth="sm">
        <Box mt={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">
                Contact not found
              </Typography>
              <Box mt={2} textAlign="center">
                <Button variant="contained" color="primary" onClick={handleBack}>
                  Go Back
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box mt={2} mb={3}>
        <IconButton onClick={handleBack} edge="start" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              {contact.FirstName} {contact.LastName}
            </Typography>
            <Box>
              <IconButton color="primary" onClick={handleEdit} aria-label="edit">
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={openDeleteDialog} aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          {contact.Title && (
            <Box display="flex" alignItems="center" mb={1}>
              <WorkIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1">{contact.Title}</Typography>
            </Box>
          )}

          {contact.Department && (
            <Box display="flex" alignItems="center" mb={1}>
              <BusinessIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1">{contact.Department}</Typography>
            </Box>
          )}

          {contact.Email && (
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1">
                <a href={`mailto:${contact.Email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {contact.Email}
                </a>
              </Typography>
            </Box>
          )}

          {contact.Phone && (
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body1">
                <a href={`tel:${contact.Phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {contact.Phone}
                </a>
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {account && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Related Account
            </Typography>
            <Box 
              sx={{ 
                p: 2, 
                border: '1px solid #e0e0e0', 
                borderRadius: 1,
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/accounts/${account.id}`)}
            >
              <Typography variant="subtitle1">{account.Name}</Typography>
              {account.Industry && (
                <Typography variant="body2" color="text.secondary">
                  {account.Industry}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Address Section */}
      {(contact.MailingStreet || contact.MailingCity || contact.MailingState || 
        contact.MailingPostalCode || contact.MailingCountry) && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" alignItems="flex-start" mb={1}>
              <LocationOnIcon color="action" sx={{ mr: 1, mt: 0.3, fontSize: 20 }} />
              <div>
                <Typography variant="h6" gutterBottom>
                  Mailing Address
                </Typography>
                {contact.MailingStreet && (
                  <Typography variant="body1">{contact.MailingStreet}</Typography>
                )}
                <Typography variant="body1">
                  {[
                    contact.MailingCity,
                    contact.MailingState,
                    contact.MailingPostalCode
                  ].filter(Boolean).join(', ')}
                </Typography>
                {contact.MailingCountry && (
                  <Typography variant="body1">{contact.MailingCountry}</Typography>
                )}
              </div>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* System Information */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {contact.createdAt && (
              <Box sx={{ flex: '1 0 40%' }}>
                <Typography variant="body2" color="text.secondary">Created</Typography>
                <Typography variant="body1">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
            {contact.updatedAt && (
              <Box sx={{ flex: '1 0 40%' }}>
                <Typography variant="body2" color="text.secondary">Last Modified</Typography>
                <Typography variant="body1">
                  {new Date(contact.updatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Contact
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete {contact.FirstName} {contact.LastName}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ContactDetailPage; 