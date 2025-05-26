import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { accountApi } from '../../services/api';
import { Account } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

// Industry options (can be expanded as needed)
const industryOptions = [
  'Agriculture',
  'Apparel',
  'Banking',
  'Biotechnology',
  'Chemicals',
  'Communications',
  'Construction',
  'Consulting',
  'Education',
  'Electronics',
  'Energy',
  'Engineering',
  'Entertainment',
  'Environmental',
  'Finance',
  'Food & Beverage',
  'Government',
  'Healthcare',
  'Hospitality',
  'Insurance',
  'Machinery',
  'Manufacturing',
  'Media',
  'Not For Profit',
  'Recreation',
  'Retail',
  'Shipping',
  'Technology',
  'Telecommunications',
  'Transportation',
  'Utilities',
  'Other',
];

// Validation schema
const validationSchema = yup.object({
  Name: yup.string().required('Account name is required'),
  Phone: yup.string().nullable(),
  Website: yup.string().nullable(),
  Industry: yup.string().nullable(),
});

const AccountFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(id);

  // Initialize formik
  const formik = useFormik<Account>({
    initialValues: {
      Name: '',
      Phone: '',
      Website: '',
      Industry: '',
      Description: '',
      BillingStreet: '',
      BillingCity: '',
      BillingState: '',
      BillingPostalCode: '',
      BillingCountry: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  // Fetch account details if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchAccountDetails(id);
    } else {
      setLoading(false);
    }
  }, [isEditMode, id]);

  const fetchAccountDetails = async (accountId: string) => {
    setLoading(true);
    setError(null);
    try {
      const accountData = await accountApi.getAccount(accountId);
      // Set form values from fetched data
      formik.setValues(accountData);
    } catch (err) {
      console.error('Failed to fetch account details:', err);
      setError('Failed to load account details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Account) => {
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        // Update existing account
        await accountApi.updateAccount(id, formData);
        navigate(`/accounts/${id}`);
      } else {
        // Create new account
        const newAccount = await accountApi.createAccount(formData);
        navigate(`/accounts/${newAccount.id}`);
      }
    } catch (err) {
      console.error('Failed to save account:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} account. Please try again.`);
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/accounts/${id}`);
    } else {
      navigate('/accounts');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading account data..." />;
  }

  if (error && !submitting) {
    return <ErrorMessage message={error} retry={() => id ? fetchAccountDetails(id) : null} />;
  }

  return (
    <Container maxWidth="sm">
      <Box mt={2} mb={3}>
        <IconButton onClick={handleCancel} edge="start" aria-label="back">
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" gutterBottom>
            {isEditMode ? 'Edit Account' : 'Create New Account'}
          </Typography>
          
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="Name"
                  name="Name"
                  label="Account Name"
                  value={formik.values.Name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.Name && Boolean(formik.errors.Name)}
                  helperText={formik.touched.Name && formik.errors.Name}
                  required
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="Industry"
                  name="Industry"
                  select
                  label="Industry"
                  value={formik.values.Industry}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {industryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="Phone"
                  name="Phone"
                  label="Phone"
                  value={formik.values.Phone}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="Website"
                  name="Website"
                  label="Website"
                  value={formik.values.Website}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} component="div">
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                  Billing Address
                </Typography>
              </Grid>
              
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="BillingStreet"
                  name="BillingStreet"
                  label="Street"
                  value={formik.values.BillingStreet}
                  onChange={formik.handleChange}
                  multiline
                  rows={2}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  id="BillingCity"
                  name="BillingCity"
                  label="City"
                  value={formik.values.BillingCity}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  id="BillingState"
                  name="BillingState"
                  label="State/Province"
                  value={formik.values.BillingState}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  id="BillingPostalCode"
                  name="BillingPostalCode"
                  label="Postal Code"
                  value={formik.values.BillingPostalCode}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} component="div">
                <TextField
                  fullWidth
                  id="BillingCountry"
                  name="BillingCountry"
                  label="Country"
                  value={formik.values.BillingCountry}
                  onChange={formik.handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} component="div">
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12} component="div">
                <TextField
                  fullWidth
                  id="Description"
                  name="Description"
                  label="Description"
                  value={formik.values.Description}
                  onChange={formik.handleChange}
                  multiline
                  rows={4}
                  margin="normal"
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} component="div">
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button
                    variant="outlined"
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
                    {submitting ? 'Saving...' : (isEditMode ? 'Update Account' : 'Create Account')}
                  </Button>
                </Box>
              </Grid>
              
              {error && submitting && (
                <Grid item xs={12} component="div">
                  <ErrorMessage message={error} />
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AccountFormPage; 