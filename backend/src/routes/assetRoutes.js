const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} = require('../controllers/assetController');

// Protect all asset routes with authMiddleware
router.use(authMiddleware);

// CRUD Endpoints
router.get('/', getAssets);
router.post('/', createAsset);
router.put('/:id', updateAsset);
router.delete('/:id', deleteAsset);

module.exports = router;