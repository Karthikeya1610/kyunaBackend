const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const categories = await Category.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    // Get total count for pagination
    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).select('-__v');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error('Get category by ID error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists',
      });
    }

    const category = await Category.create({
      name,
      image: image || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if new name conflicts with existing category (excluding current category)
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists',
        });
      }
    }

    // Update fields
    if (name !== undefined) category.name = name;
    if (image !== undefined) category.image = image;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('Update category error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
