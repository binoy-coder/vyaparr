const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for all incoming origins
app.use(cors());

// Your inventory route
app.get('/api/inventory', (req, res) => {
  res.json([
    { id: 1, name: "Item A", stock: 12 },
    { id: 2, name: "Item B", stock: 3 }
  ]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
