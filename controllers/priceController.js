const Price = require('../models/Price');
const Item = require('../models/Items');

const createPrice = async (req, res) => {
  try {
    const { originalPrice, discountedPrice } = req.body;

    // Validation
    if (!originalPrice || !discountedPrice) {
      return res.status(400).json({
        message: 'originalPrice and discountedPrice are required fields',
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

    // Check if there's already an active global price
    const existingPrice = await Price.findOne({
      isActive: true,
    });

    if (existingPrice) {
      return res.status(400).json({
        message:
          'An active global price already exists. Please update or deactivate the existing price first.',
      });
    }

    const price = await Price.create({
      originalPrice,
      discountedPrice,
    });

    res.status(201).json({
      message: 'Global price created successfully',
      price,
    });
  } catch (error) {
    console.error('createPrice error:', error);
    res.status(500).json({
      message: 'Server error while creating price',
      error: error.message,
    });
  }
};

const getAllPrices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isActive,
      minDiscountPercentage,
      maxDiscountPercentage,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (minDiscountPercentage || maxDiscountPercentage) {
      filter.discountPercentage = {};
      if (minDiscountPercentage)
        filter.discountPercentage.$gte = parseFloat(minDiscountPercentage);
      if (maxDiscountPercentage)
        filter.discountPercentage.$lte = parseFloat(maxDiscountPercentage);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const prices = await Price.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const totalPrices = await Price.countDocuments(filter);
    const totalPages = Math.ceil(totalPrices / parseInt(limit));

    res.status(200).json({
      message: 'Global prices retrieved successfully',
      prices,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalPrices,
        pricesPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('getAllPrices error:', error);
    res.status(500).json({
      message: 'Server error while retrieving prices',
      error: error.message,
    });
  }
};

const getPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    const price = await Price.findById(id);

    if (!price) {
      return res.status(404).json({
        message: 'Price not found',
      });
    }

    res.status(200).json({
      message: 'Price retrieved successfully',
      price,
    });
  } catch (error) {
    console.error('getPriceById error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid price ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while retrieving price',
      error: error.message,
    });
  }
};

const getActivePrice = async (req, res) => {
  try {
    const price = await Price.findOne({
      isActive: true,
    });

    if (!price) {
      return res.status(404).json({
        message: 'No active global price found',
      });
    }

    res.status(200).json({
      message: 'Active global price retrieved successfully',
      price,
    });
  } catch (error) {
    console.error('getActivePrice error:', error);
    res.status(500).json({
      message: 'Server error while retrieving active price',
      error: error.message,
    });
  }
};

const updatePrice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    // Validation for price updates
    if (updateData.originalPrice && updateData.originalPrice <= 0) {
      return res.status(400).json({
        message: 'Original price must be greater than 0',
      });
    }

    if (updateData.discountedPrice && updateData.discountedPrice <= 0) {
      return res.status(400).json({
        message: 'Discounted price must be greater than 0',
      });
    }

    // Check if discounted price is less than original price
    const currentPrice = await Price.findById(id);
    if (!currentPrice) {
      return res.status(404).json({
        message: 'Price not found',
      });
    }

    const originalPrice =
      updateData.originalPrice || currentPrice.originalPrice;
    const discountedPrice =
      updateData.discountedPrice || currentPrice.discountedPrice;

    if (discountedPrice >= originalPrice) {
      return res.status(400).json({
        message: 'Discounted price must be less than original price',
      });
    }

    const updatedPrice = await Price.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: 'Price updated successfully',
      price: updatedPrice,
    });
  } catch (error) {
    console.error('updatePrice error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid price ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while updating price',
      error: error.message,
    });
  }
};

const deletePrice = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    const deletedPrice = await Price.findByIdAndDelete(id);

    if (!deletedPrice) {
      return res.status(404).json({
        message: 'Price not found',
      });
    }

    res.status(200).json({
      message: 'Price deleted successfully',
      price: deletedPrice,
    });
  } catch (error) {
    console.error('deletePrice error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid price ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while deleting price',
      error: error.message,
    });
  }
};

const togglePriceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Price ID is required',
      });
    }

    const price = await Price.findById(id);
    if (!price) {
      return res.status(404).json({
        message: 'Price not found',
      });
    }

    price.isActive = !price.isActive;
    await price.save();

    res.status(200).json({
      message: `Price ${price.isActive ? 'activated' : 'deactivated'} successfully`,
      price,
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
  createPrice,
  getAllPrices,
  getPriceById,
  getActivePrice,
  updatePrice,
  deletePrice,
  togglePriceStatus,
};
