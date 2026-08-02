const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const assetRoutes = require('./src/routes/assetRoutes'); // 👈 Add this line

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assets', assetRoutes); // 👈 Add this line

app.get('/', (req, res) => {
  res.json({ status: 'Asset Vault API is online and healthy', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});