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

const updatePriceById = async (req, res) => {
  try {
    const { priceId } = req.params;
    const { originalPrice, discountedPrice, name, description } = req.body;

    if (!priceId) {
      return res.status(400).json({
        message: 'Price ID is required',
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

    // Find the price by ID
    const priceIndex = priceConfig.prices.findIndex(
      price => price._id.toString() === priceId
    );

    if (priceIndex === -1) {
      return res.status(404).json({
        message: 'Price not found with the provided ID',
      });
    }

    // Update the price at the found index
    const currentPrice = priceConfig.prices[priceIndex];
    const updatedPrice = {
      _id: currentPrice._id, // Keep the same ID
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

    priceConfig.prices[priceIndex] = updatedPrice;
    await priceConfig.save();

    res.status(200).json({
      message: 'Price updated successfully',
      price: updatedPrice,
      priceId: priceId,
    });
  } catch (error) {
    console.error('updatePriceById error:', error);
    res.status(500).json({
      message: 'Server error while updating price',
      error: error.message,
    });
  }
};

const deletePriceById = async (req, res) => {
  try {
    const { priceId } = req.params;

    if (!priceId) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    // Find the active price configuration
    const priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    // Find the price by ID
    const priceIndex = priceConfig.prices.findIndex(
      price => price._id.toString() === priceId
    );

    if (priceIndex === -1) {
      return res.status(404).json({
        message: 'Price not found with the provided ID',
      });
    }

    // Remove the price at the found index
    const deletedPrice = priceConfig.prices.splice(priceIndex, 1)[0];
    await priceConfig.save();

    res.status(200).json({
      message: 'Price deleted successfully',
      deletedPrice,
      priceId: priceId,
      remainingPrices: priceConfig.prices.length,
    });
  } catch (error) {
    console.error('deletePriceById error:', error);
    res.status(500).json({
      message: 'Server error while deleting price',
      error: error.message,
    });
  }
};

const togglePriceStatusById = async (req, res) => {
  try {
    const { priceId } = req.params;

    if (!priceId) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    // Find the active price configuration
    const priceConfig = await Price.findOne({ isActive: true });

    if (!priceConfig) {
      return res.status(404).json({
        message: 'No active price configuration found',
      });
    }

    // Find the price by ID
    const priceIndex = priceConfig.prices.findIndex(
      price => price._id.toString() === priceId
    );

    if (priceIndex === -1) {
      return res.status(404).json({
        message: 'Price not found with the provided ID',
      });
    }

    // Toggle the price status
    priceConfig.prices[priceIndex].isActive =
      !priceConfig.prices[priceIndex].isActive;
    await priceConfig.save();

    res.status(200).json({
      message: `Price ${priceConfig.prices[priceIndex].isActive ? 'activated' : 'deactivated'} successfully`,
      price: priceConfig.prices[priceIndex],
      priceId: priceId,
    });
  } catch (error) {
    console.error('togglePriceStatusById error:', error);
    res.status(500).json({
      message: 'Server error while toggling price status',
      error: error.message,
    });
  }
};

module.exports = {
  getPrices,
  addPrice,
  updatePriceById,
  deletePriceById,
  togglePriceStatusById,
};
