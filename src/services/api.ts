import axios from 'axios';
import { Account, Contact } from '../types';

// Configure base API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // In production, use relative path
  : process.env.REACT_APP_API_URL || 'http://localhost:3001/api'; // In development

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Account APIs
export const accountApi = {
  // Get all accounts
  getAccounts: async () => {
    try {
      const response = await api.get('/accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
      throw error;
    }
  },

  // Get account by ID
  getAccount: async (id: string) => {
    try {
      const response = await api.get(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching account ${id}:`, error);
      throw error;
    }
  },

  // Create new account
  createAccount: async (accountData: Account) => {
    try {
      const response = await api.post('/accounts', accountData);
      return response.data;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  },

  // Update existing account
  updateAccount: async (id: string, accountData: Partial<Account>) => {
    try {
      const response = await api.put(`/accounts/${id}`, accountData);
      return response.data;
    } catch (error) {
      console.error(`Error updating account ${id}:`, error);
      throw error;
    }
  },

  // Delete account
  deleteAccount: async (id: string) => {
    try {
      const response = await api.delete(`/accounts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting account ${id}:`, error);
      throw error;
    }
  }
};

// Contact APIs
export const contactApi = {
  // Get all contacts
  getContacts: async () => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  // Get contacts for a specific account
  getContactsByAccount: async (accountId: string) => {
    try {
      const response = await api.get(`/accounts/${accountId}/contacts`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contacts for account ${accountId}:`, error);
      throw error;
    }
  },

  // Get contact by ID
  getContact: async (id: string) => {
    try {
      const response = await api.get(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error);
      throw error;
    }
  },

  // Create new contact
  createContact: async (contactData: Contact) => {
    try {
      const response = await api.post('/contacts', contactData);
      return response.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Update existing contact
  updateContact: async (id: string, contactData: Partial<Contact>) => {
    try {
      const response = await api.put(`/contacts/${id}`, contactData);
      return response.data;
    } catch (error) {
      console.error(`Error updating contact ${id}:`, error);
      throw error;
    }
  },

  // Delete contact
  deleteContact: async (id: string) => {
    try {
      const response = await api.delete(`/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
}; 