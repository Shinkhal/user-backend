import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controller to create a product
export const createProduct = async (req, res) => {
  const { name, price, description } = req.body;

  // Get the image file path (if uploaded)
  const image = req.file ? req.file.path : null;

  try {
    const product = new Product({
      name,
      price,
      description,
      image,  // Save image path
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

