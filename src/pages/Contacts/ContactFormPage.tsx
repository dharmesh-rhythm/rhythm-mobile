import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { contactApi, accountApi } from '../../services/api';
import { Contact, Account } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

// Validation schema
const ContactSchema = Yup.object().shape({
  FirstName: Yup.string().required('First name is required'),
  LastName: Yup.string().required('Last name is required'),
  Email: Yup.string().email('Invalid email format'),
  Phone: Yup.string(),
  Title: Yup.string(),
  Department: Yup.string(),
  AccountId: Yup.string(),
  MailingStreet: Yup.string(),
  MailingCity: Yup.string(),
  MailingState: Yup.string(),
  MailingPostalCode: Yup.string(),
  MailingCountry: Yup.string(),
});

const ContactFormPage: React.FC = () => {
  const { id, accountId } = useParams<{ id?: string; accountId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [initialValues, setInitialValues] = useState<Contact>({
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Title: '',
    Department: '',
    AccountId: accountId || '',
    MailingStreet: '',
    MailingCity: '',
    MailingState: '',
    MailingPostalCode: '',
    MailingCountry: '',
  });

  const isEditMode = !!id;
  const pageTitle = isEditMode ? 'Edit Contact' : 'New Contact';

  // Fetch accounts for the dropdown
  useEffect(() => {
    fetchAccounts();
  }, []);

  // If in edit mode, fetch the contact data
  useEffect(() => {
    if (isEditMode && id) {
      fetchContact(id);
    } else {
      setLoading(false);
    }
  }, [id, isEditMode]);

  const fetchAccounts = async () => {
    try {
      const data = await accountApi.getAccounts();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
      // Not setting error as this is not critical
    }
  };

  const fetchContact = async (contactId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactApi.getContact(contactId);
      setInitialValues(data);
      formik.setValues(data);
    } catch (err) {
      console.error('Failed to fetch contact:', err);
      setError('Failed to load contact data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: Contact) => {
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        await contactApi.updateContact(id, values);
        navigate(`/contacts/${id}`);
      } else {
        const newContact = await contactApi.createContact(values);
        // Navigate to the account detail page if created from there, otherwise to the new contact
        if (accountId) {
          navigate(`/accounts/${accountId}`);
        } else {
          navigate(`/contacts/${newContact.id}`);
        }
      }
    } catch (err) {
      console.error('Failed to save contact:', err);
      setError('Failed to save contact. Please try again.');
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const formik = useFormik({
    initialValues,
    validationSchema: ContactSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  if (loading) {
    return <LoadingSpinner message={isEditMode ? "Loading contact data..." : "Preparing form..."} />;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={2} mb={3}>
        <IconButton onClick={handleCancel} edge="start" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {pageTitle}
            </Typography>

            {error && (
              <Box mb={2}>
                <ErrorMessage message={error} />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="FirstName"
                    name="FirstName"
                    label="First Name *"
                    value={formik.values.FirstName}
                    onChange={formik.handleChange}
                    error={formik.touched.FirstName && Boolean(formik.errors.FirstName)}
                    helperText={formik.touched.FirstName && formik.errors.FirstName}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="LastName"
                    name="LastName"
                    label="Last Name *"
                    value={formik.values.LastName}
                    onChange={formik.handleChange}
                    error={formik.touched.LastName && Boolean(formik.errors.LastName)}
                    helperText={formik.touched.LastName && formik.errors.LastName}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box>
                <TextField
                  fullWidth
                  id="Email"
                  name="Email"
                  label="Email"
                  value={formik.values.Email}
                  onChange={formik.handleChange}
                  error={formik.touched.Email && Boolean(formik.errors.Email)}
                  helperText={formik.touched.Email && formik.errors.Email}
                  margin="normal"
                  variant="outlined"
                />
              </Box>
              
              <Box>
                <TextField
                  fullWidth
                  id="Phone"
                  name="Phone"
                  label="Phone"
                  value={formik.values.Phone}
                  onChange={formik.handleChange}
                  margin="normal"
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="Title"
                    name="Title"
                    label="Title"
                    value={formik.values.Title}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="Department"
                    name="Department"
                    label="Department"
                    value={formik.values.Department}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel id="account-label">Account</InputLabel>
                  <Select
                    labelId="account-label"
                    id="AccountId"
                    name="AccountId"
                    value={formik.values.AccountId}
                    onChange={formik.handleChange}
                    label="Account"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {accounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.Name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Mailing Address
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  id="MailingStreet"
                  name="MailingStreet"
                  label="Street"
                  value={formik.values.MailingStreet}
                  onChange={formik.handleChange}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={2}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="MailingCity"
                    name="MailingCity"
                    label="City"
                    value={formik.values.MailingCity}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="MailingState"
                    name="MailingState"
                    label="State/Province"
                    value={formik.values.MailingState}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="MailingPostalCode"
                    name="MailingPostalCode"
                    label="Postal Code"
                    value={formik.values.MailingPostalCode}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="MailingCountry"
                    name="MailingCountry"
                    label="Country"
                    value={formik.values.MailingCountry}
                    onChange={formik.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : isEditMode ? 'Update Contact' : 'Create Contact'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ContactFormPage; 