export interface Account {
  id?: string;
  Name: string;
  Phone?: string;
  Website?: string;
  Industry?: string;
  Description?: string;
  BillingStreet?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostalCode?: string;
  BillingCountry?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Contact {
  id?: string;
  FirstName: string;
  LastName: string;
  Email?: string;
  Phone?: string;
  Title?: string;
  Department?: string;
  AccountId?: string;
  MailingStreet?: string;
  MailingCity?: string;
  MailingState?: string;
  MailingPostalCode?: string;
  MailingCountry?: string;
  createdAt?: string;
  updatedAt?: string;
} 