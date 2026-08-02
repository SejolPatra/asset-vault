const express = require('express');
const cors = require('cors');

const app = express();

// Enable CORS for frontend requests
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    /\.vercel\.app$/ // 👈 Allows any Vercel preview/production URL for your app
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/assets', require('./src/routes/assetRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});