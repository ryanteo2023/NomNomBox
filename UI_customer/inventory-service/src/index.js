require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require('../../firebase-config');
const { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc,
  updateDoc,
  query,
  where 
} = require('firebase/firestore');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/meals/available', async (req, res) => {
  try {
    const inventoryRef = collection(db, 'Inventory');
    const q = query(
      inventoryRef,
      where('numAvailable', '>', 0)
    );

    const querySnapshot = await getDocs(q);
    const meals = [];
    querySnapshot.forEach((doc) => {
      meals.push({ id: doc.id, ...doc.data() });
    });

    res.json(meals);
  } catch (error) {
    console.error('Error fetching available meals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      ingredients, 
      nutritionalInfo,
      dietaryInfo,
      preparationTime,
      servings,
      imageUrl,
      numAvailable 
    } = req.body;

    const mealData = {
      name,
      description,
      price,
      ingredients,
      nutritionalInfo,
      dietaryInfo,
      preparationTime,
      servings,
      imageUrl,
      numAvailable: numAvailable || 0
    };

    // Create a new document with auto-generated ID
    const mealRef = doc(collection(db, 'Inventory'));
    await setDoc(mealRef, mealData);

    res.status(201).json({ 
      id: mealRef.id,
      ...mealData 
    });
  } catch (error) {
    console.error('Error creating meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update inventory quantity
app.put('/api/meals/:mealId/quantity', async (req, res) => {
  try {
    const { numAvailable } = req.body;
    const mealRef = doc(db, 'Inventory', req.params.mealId);
    const mealDoc = await getDoc(mealRef);

    if (!mealDoc.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    await updateDoc(mealRef, {
      numAvailable: parseInt(numAvailable)
    });

    const updatedDoc = await getDoc(mealRef);
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating meal quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Decrement inventory when order is placed
app.put('/api/meals/:mealId/decrement', async (req, res) => {
  try {
    const { quantity } = req.body;
    const mealRef = doc(db, 'Inventory', req.params.mealId);
    const mealDoc = await getDoc(mealRef);

    if (!mealDoc.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const currentQuantity = mealDoc.data().numAvailable;
    const decrementBy = parseInt(quantity) || 1;

    if (currentQuantity < decrementBy) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    await updateDoc(mealRef, {
      numAvailable: currentQuantity - decrementBy
    });

    const updatedDoc = await getDoc(mealRef);
    res.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error decrementing inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/meals/:mealId', async (req, res) => {
  try {
    const mealRef = doc(db, 'Inventory', req.params.mealId);
    const mealDoc = await getDoc(mealRef);

    if (!mealDoc.exists()) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({
      id: mealDoc.id,
      ...mealDoc.data()
    });
  } catch (error) {
    console.error('Error fetching meal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Inventory service running on port ${PORT}`);
}); 