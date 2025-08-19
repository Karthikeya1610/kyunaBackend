const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Convert buffer to base64
    const base64String = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString('base64')}`;

    const uploadRes = await cloudinary.uploader.upload(base64String, {
      folder: 'kyuna-jewellery/items',
    });

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id,
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ message: 'No publicId provided' });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

const getAllImages = async (req, res) => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload',
      resource_type: 'image',
      prefix: 'kyuna-jewellery/items',
      max_results: 100,
    });

    res.status(200).json({ images: resources });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch images', error: err.message });
  }
};

module.exports = { uploadImage, deleteImage, getAllImages };
