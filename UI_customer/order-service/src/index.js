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
  query,
  where,
  orderBy,
  limit,
  runTransaction
} = require('firebase/firestore');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate order ID
async function generateOrderId() {
  try {
    const counterRef = doc(db, 'counters', 'orders');
    let newCounter = 1;

    await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (counterDoc.exists()) {
        newCounter = counterDoc.data().value + 1;
        transaction.update(counterRef, { value: newCounter });
      } else {
        transaction.set(counterRef, { value: 1 });
      }
    });

    const year = new Date().getFullYear();
    return `ORD_${year}_${String(newCounter).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating order ID:', error);
    throw error;
  }
}

// Routes
app.get('/api/orders/customer/:customerId', async (req, res) => {
  try {
    const ordersRef = collection(db, 'Order');
    const q = query(
      ordersRef,
      where('customerId', '==', doc(db, 'Customer', req.params.customerId)),
      orderBy('orderDate', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, items, deliveryAddress, deliveryDate } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    // Generate order ID
    const orderId = await generateOrderId();
    
    const timestamp = new Date().toISOString();
    const orderData = {
      orderId,
      customerId: doc(db, 'Customer', customerId), // Reference type
      items: items.map(item => ({
        mealId: doc(db, 'Inventory', item.mealId), // Reference type
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      status: 'PENDING',
      totalAmount,
      deliveryAddress: {
        street: deliveryAddress.street,
        postalCode: deliveryAddress.postalCode,
        country: "Singapore"
      },
      deliveryDate,
      orderDate: timestamp
    };

    // Create a new document with auto-generated ID
    const orderRef = doc(collection(db, 'Order'));
    await setDoc(orderRef, orderData);

    res.status(201).json({ 
      id: orderRef.id,
      ...orderData 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const ordersRef = collection(db, 'Order');
    const q = query(ordersRef, where('orderId', '==', req.params.orderId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const orderDoc = querySnapshot.docs[0];
    res.json({
      id: orderDoc.id,
      ...orderDoc.data()
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
}); 