const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Vyapar Backend API is running!' });
});

// Sample API route for inventory
app.get('/api/inventory', (req, res) => {
  res.json([
    { id: 1, name: 'Item A', stock: 12 },
    { id: 2, name: 'Item B', stock: 3 }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});