const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Microservice endpoints
const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3001';
const ORDER_HISTORY_URL = process.env.ORDER_HISTORY_URL || 'http://localhost:3002';
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Fetch customer data from microservices
async function getCustomerData(customerId) {
  try {
    const [preferences, orderHistory, availableMeals] = await Promise.all([
      axios.get(`${CUSTOMER_SERVICE_URL}/api/customers/${customerId}/preferences`),
      axios.get(`${ORDER_HISTORY_URL}/api/orders/customer/${customerId}`),
      axios.get(`${INVENTORY_SERVICE_URL}/api/meals/available`)
    ]);

    return {
      preferences: preferences.data,
      orderHistory: orderHistory.data,
      availableMeals: availableMeals.data
    };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    throw error;
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history, customerId } = req.body;

    // Fetch customer data from microservices
    const customerData = await getCustomerData(customerId);

    // Format the data for the AI
    const systemMessage = {
      role: "system",
      content: `You are a helpful meal kit recommendation assistant. Here's the context:
      
Customer Preferences:
${JSON.stringify(customerData.preferences, null, 2)}

Recent Order History:
${JSON.stringify(customerData.orderHistory.slice(0, 3), null, 2)}

Available Meal Kits:
${JSON.stringify(customerData.availableMeals, null, 2)}

Based on this information, provide personalized meal kit recommendations. Consider:
1. Customer's dietary preferences and restrictions
2. Previous order patterns
3. Currently available meal kits
4. Variety (don't recommend items they recently ordered)
5. Any specific requirements mentioned in their message

Be concise, friendly, and specific. Always recommend actual available meal kits from the inventory.`
    };

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage,
        ...history,
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    res.json({ 
      response: completion.data.choices[0].message.content,
      customerData // Optionally return this for frontend use
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 