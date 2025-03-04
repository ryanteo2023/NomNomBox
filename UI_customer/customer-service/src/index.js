require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('../../firebase-config');
const { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} = require('firebase/firestore');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/customers/:userId/preferences', async (req, res) => {
  try {
    const customerRef = doc(db, 'customers', req.params.userId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customerDoc.data().dietaryPreferences || {});
  } catch (error) {
    console.error('Error fetching customer preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/customers/:userId/preferences', async (req, res) => {
  try {
    const customerRef = doc(db, 'customers', req.params.userId);
    const customerDoc = await getDoc(customerRef);

    if (!customerDoc.exists()) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await updateDoc(customerRef, {
      dietaryPreferences: req.body,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await getDoc(customerRef);
    res.json(updatedDoc.data().dietaryPreferences);
  } catch (error) {
    console.error('Error updating customer preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { userId, email, name, dietaryPreferences } = req.body;
    
    const customerRef = doc(db, 'customers', userId);
    const customerDoc = await getDoc(customerRef);

    if (customerDoc.exists()) {
      return res.status(400).json({ error: 'Customer already exists' });
    }

    const timestamp = new Date().toISOString();
    const customerData = {
      userId,
      email,
      name,
      dietaryPreferences: dietaryPreferences || {
        type: 'NONE',
        allergies: [],
        restrictions: [],
        preferences: {
          spiceLevel: 2,
          cuisinePreferences: [],
          dislikedIngredients: []
        }
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await setDoc(customerRef, customerData);
    res.status(201).json(customerData);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Customer service running on port ${PORT}`);
}); 