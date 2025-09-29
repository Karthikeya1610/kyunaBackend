const Price = require('../models/Price');

const getPrices = async (req, res) => {
  try {
    const price = await Price.findOne({ isActive: true });

    if (!price) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    res.status(200).json({
      message: 'Prices retrieved successfully',
      prices: price.prices,
    });
  } catch (error) {
    console.error('getPrices error:', error);
    res.status(500).json({
      message: 'Server error while retrieving prices',
      error: error.message,
    });
  }
};

const addPrice = async (req, res) => {
  try {
    const { originalPrice, discountedPrice, name, description } = req.body;

    // Validation
    if (!originalPrice || !discountedPrice || !name) {
      return res.status(400).json({
        message: 'originalPrice, discountedPrice, and name are required fields',
      });
    }

    if (originalPrice <= 0 || discountedPrice <= 0) {
      return res.status(400).json({
        message: 'Prices must be greater than 0',
      });
    }

    if (discountedPrice >= originalPrice) {
      return res.status(400).json({
        message: 'Discounted price must be less than original price',
      });
    }

    // Find or create the active price configuration
    let priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      priceConfig = await Price.create({
        prices: [],
        isActive: true,
      });
    }

    // Add new price to the array
    const newPrice = {
      originalPrice,
      discountedPrice,
      name,
      description: description || '',
      isActive: true,
    };

    priceConfig.prices.push(newPrice);
    await priceConfig.save();

    res.status(201).json({
      message: 'Price added successfully',
      price: newPrice,
      totalPrices: priceConfig.prices.length,
    });
  } catch (error) {
    console.error('addPrice error:', error);
    res.status(500).json({
      message: 'Server error while adding price',
      error: error.message,
    });
  }
};

const updatePrice = async (req, res) => {
  try {
    const { priceIndex } = req.params;
    const { originalPrice, discountedPrice, name, description } = req.body;

    const index = parseInt(priceIndex);

    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        message: 'Invalid price index',
      });
    }

    // Validation for price updates
    if (originalPrice && originalPrice <= 0) {
      return res.status(400).json({
        message: 'Original price must be greater than 0',
      });
    }

    if (discountedPrice && discountedPrice <= 0) {
      return res.status(400).json({
        message: 'Discounted price must be greater than 0',
      });
    }

    // Find the active price configuration
    const priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    if (index >= priceConfig.prices.length) {
      return res.status(404).json({
        message: 'Price index out of range',
      });
    }

    // Update the price at the specified index
    const currentPrice = priceConfig.prices[index];
    const updatedPrice = {
      originalPrice: originalPrice || currentPrice.originalPrice,
      discountedPrice: discountedPrice || currentPrice.discountedPrice,
      name: name || currentPrice.name,
      description:
        description !== undefined ? description : currentPrice.description,
      isActive: currentPrice.isActive,
    };

    // Validate the updated price
    if (updatedPrice.discountedPrice >= updatedPrice.originalPrice) {
      return res.status(400).json({
        message: 'Discounted price must be less than original price',
      });
    }

    priceConfig.prices[index] = updatedPrice;
    await priceConfig.save();

    res.status(200).json({
      message: 'Price updated successfully',
      price: updatedPrice,
      index: index,
    });
  } catch (error) {
    console.error('updatePrice error:', error);
    res.status(500).json({
      message: 'Server error while updating price',
      error: error.message,
    });
  }
};

const deletePrice = async (req, res) => {
  try {
    const { priceIndex } = req.params;
    const index = parseInt(priceIndex);

    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        message: 'Invalid price index',
      });
    }

    // Find the active price configuration
    const priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    if (index >= priceConfig.prices.length) {
      return res.status(404).json({
        message: 'Price index out of range',
      });
    }

    // Remove the price at the specified index
    const deletedPrice = priceConfig.prices.splice(index, 1)[0];
    await priceConfig.save();

    res.status(200).json({
      message: 'Price deleted successfully',
      deletedPrice,
      remainingPrices: priceConfig.prices.length,
    });
  } catch (error) {
    console.error('deletePrice error:', error);
    res.status(500).json({
      message: 'Server error while deleting price',
      error: error.message,
    });
  }
};

const togglePriceStatus = async (req, res) => {
  try {
    const { priceIndex } = req.params;
    const index = parseInt(priceIndex);

    if (isNaN(index) || index < 0) {
      return res.status(400).json({
        message: 'Invalid price index',
      });
    }

    // Find the active price configuration
    const priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    if (index >= priceConfig.prices.length) {
      return res.status(404).json({
        message: 'Price index out of range',
      });
    }

    // Toggle the price status
    priceConfig.prices[index].isActive = !priceConfig.prices[index].isActive;
    await priceConfig.save();

    res.status(200).json({
      message: `Price ${priceConfig.prices[index].isActive ? 'activated' : 'deactivated'} successfully`,
      price: priceConfig.prices[index],
      index: index,
    });
  } catch (error) {
    console.error('togglePriceStatus error:', error);
    res.status(500).json({
      message: 'Server error while toggling price status',
      error: error.message,
    });
  }
};

module.exports = {
  getPrices,
  addPrice,
  updatePrice,
  deletePrice,
  togglePriceStatus,
};
