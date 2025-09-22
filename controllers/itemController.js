const Item = require('../models/Items');

const createItem = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      discountPrice,
      weight,
      availability,
      images,
      description,
      specifications,
    } = req.body;

    if (!name || !category || !price || !weight) {
      return res.status(400).json({
        message: 'Name, category, price, and weight are required fields',
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        message: 'Price must be greater than 0',
      });
    }

    if (weight <= 0) {
      return res.status(400).json({
        message: 'Weight must be greater than 0',
      });
    }

    if (discountPrice && discountPrice >= price) {
      return res.status(400).json({
        message: 'Discount price must be less than regular price',
      });
    }

    if (images && !Array.isArray(images)) {
      return res.status(400).json({
        message: 'Images must be an array',
      });
    }

    const item = await Item.create({
      name,
      category,
      price,
      discountPrice,
      weight,
      availability: availability || 'In Stock',
      images: images || [],
      description: description || '',
      specifications: specifications || {},
    });

    res.status(201).json({
      message: 'Item created successfully',
      item,
    });
  } catch (error) {
    console.error('createItem error:', error);
    res.status(500).json({
      message: 'Server error while creating item',
      error: error.message,
    });
  }
};

const getAllItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      availability,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (availability) {
      filter.availability = availability;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const totalItems = await Item.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    res.status(200).json({
      message: 'Items retrieved successfully',
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('getAllItems error:', error);
    res.status(500).json({
      message: 'Server error while retrieving items',
      error: error.message,
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Item ID is required',
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    res.status(200).json({
      message: 'Item retrieved successfully',
      item,
    });
  } catch (error) {
    console.error('getItemById error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid item ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while retrieving item',
      error: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        message: 'Item ID is required',
      });
    }

    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        message: 'Price must be greater than 0',
      });
    }

    if (updateData.weight && updateData.weight <= 0) {
      return res.status(400).json({
        message: 'Weight must be greater than 0',
      });
    }

    if (updateData.discountPrice && updateData.price) {
      if (updateData.discountPrice >= updateData.price) {
        return res.status(400).json({
          message: 'Discount price must be less than regular price',
        });
      }
    }

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    res.status(200).json({
      message: 'Item updated successfully',
      item: updatedItem,
    });
  } catch (error) {
    console.error('updateItem error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid item ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while updating item',
      error: error.message,
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'Item ID is required',
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        message: 'Item not found',
      });
    }

    res.status(200).json({
      message: 'Item deleted successfully',
      item: deletedItem,
    });
  } catch (error) {
    console.error('deleteItem error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        message: 'Invalid item ID format',
      });
    }

    res.status(500).json({
      message: 'Server error while deleting item',
      error: error.message,
    });
  }
};

const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!category) {
      return res.status(400).json({
        message: 'Category is required',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const items = await Item.find({ category })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalItems = await Item.countDocuments({ category });
    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.status(200).json({
      message: 'Items retrieved successfully',
      items,
      category,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('getItemsByCategory error:', error);
    res.status(500).json({
      message: 'Server error while retrieving items by category',
      error: error.message,
    });
  }
};

const searchItems = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        message: 'Search query is required',
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchRegex = new RegExp(q, 'i');

    const items = await Item.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalItems = await Item.countDocuments({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    });

    const totalPages = Math.ceil(totalItems / parseInt(limit));

    res.status(200).json({
      message: 'Search completed successfully',
      items,
      query: q,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('searchItems error:', error);
    res.status(500).json({
      message: 'Server error while searching items',
      error: error.message,
    });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getItemsByCategory,
  searchItems,
};
