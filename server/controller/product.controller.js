const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

// Create new product
const createProduct = async (req, res) => {
  try {
    const { title, description, stock, price, category } = req.body;
    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const product = new Product({
      title,
      description,
      stock,
      price,
      category: existingCategory?._id,
    });

    await product.save();

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      category,
      sold,
      latest,
      page = 1,
      limit = 10,
    } = req.query;

    // Pagination param গুলোকে number এ কনভার্ট এবং ভ্যালিডেট করা
    const pageNum = Number(page) < 1 ? 1 : Number(page);
    const limitNum = Number(limit) > 0 ? Number(limit) : 10;
    const skip = (pageNum - 1) * limitNum;

    // Build dynamic query
    let query = {};

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (category) {
      query.category = category;
    }

    // Total count for pagination metadata
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limitNum);

    // Base find query with populate, skip & limit
    let productQuery = Product.find(query)
      .populate({
        path: "category",
        select: "name",
        populate: {
          path: "parent",
          select: "name",
        },
      })
      .skip(skip)
      .limit(limitNum);

    // Sorting logic
    if (sold === "true") {
      productQuery = productQuery.sort({ sold: -1 });
    } else if (latest === "true") {
      productQuery = productQuery.sort({ createdAt: -1 });
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    const products = await productQuery;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name"
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { title, description, stock, price, category, image } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    product.title = title || product.title;
    product.description =
      description !== undefined ? description : product.description;
    product.stock = stock || product.stock;
    product.price = price !== undefined ? price : product.price;
    product.category = category !== undefined ? category : product.category;
    product.image = image !== undefined ? image : product.image;

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
