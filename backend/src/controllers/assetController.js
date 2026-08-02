const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all assets for logged-in user
exports.getAssets = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(assets);
  } catch (error) {
    console.error('Get Assets Error:', error);
    res.status(500).json({ message: 'Server error fetching assets.' });
  }
};

// Create a new asset
exports.createAsset = async (req, res) => {
  try {
    const { title, category, value, description } = req.body;

    if (!title || !category || value === undefined) {
      return res.status(400).json({ message: 'Title, category, and value are required.' });
    }

    const asset = await prisma.asset.create({
      data: {
        title,
        category,
        value: parseFloat(value),
        description: description || '',
        userId: req.user.userId,
      },
    });

    res.status(201).json(asset);
  } catch (error) {
    console.error('Create Asset Error:', error);
    res.status(500).json({ message: 'Server error creating asset.' });
  }
};

// Update an existing asset
exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, value, description } = req.body;

    // Verify ownership
    const asset = await prisma.asset.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found or unauthorized.' });
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        title: title || asset.title,
        category: category || asset.category,
        value: value !== undefined ? parseFloat(value) : asset.value,
        description: description !== undefined ? description : asset.description,
      },
    });

    res.json(updatedAsset);
  } catch (error) {
    console.error('Update Asset Error:', error);
    res.status(500).json({ message: 'Server error updating asset.' });
  }
};

// Delete an asset
exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const asset = await prisma.asset.findFirst({
      where: { id, userId: req.user.userId },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found or unauthorized.' });
    }

    await prisma.asset.delete({
      where: { id },
    });

    res.json({ message: 'Asset deleted successfully.' });
  } catch (error) {
    console.error('Delete Asset Error:', error);
    res.status(500).json({ message: 'Server error deleting asset.' });
  }
};