const Category = require("../models/categoryModel");
// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    // নতুন category তৈরি
    const category = new Category({ name, parent: parent || null });
    await category.save();

    if (parent) {
      const existingCategory = await Category.findById(parent);
      existingCategory.children.push(category?._id);
      await existingCategory.save();
    }

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    // unique name conflict ইত্যাদি handle করা যাবে এখানে
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const buildCategoryTree = (categories) => {
  const idToCategoryMap = {};
  const tree = [];

  // Step 1: ID map তৈরি করা
  categories.forEach((cat) => {
    idToCategoryMap[cat._id] = { ...cat._doc, children: [] };
  });

  // Step 2: Tree তৈরি করা
  categories.forEach((cat) => {
    if (cat.parent) {
      const parentId = cat.parent._id?.toString() || cat.parent.toString();
      if (idToCategoryMap[parentId]) {
        idToCategoryMap[parentId].children.push(idToCategoryMap[cat._id]);
      }
    } else {
      tree.push(idToCategoryMap[cat._id]);
    }
  });

  return tree;
};
// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const exitingData = await Category.find()
      .populate("parent", "name") // parent category র name show করবে
      .populate("children", "name"); // children category র name show করবে
    const categories = buildCategoryTree(exitingData);
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent",
      "name"
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update category by ID
const updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // আগের parent (যদি থাকে)
    const oldParent = category.parent?.toString();
    const newParent = parent?.toString();

    // name update
    category.name = name || category.name;

    // যদি parent পরিবর্তন করা হয়
    if (newParent !== oldParent) {
      // পুরনো parent থেকে এই ক্যাটেগরি remove করব
      if (oldParent) {
        const oldParentCategory = await Category.findById(oldParent);
        if (oldParentCategory) {
          oldParentCategory.children = oldParentCategory.children.filter(
            (childId) => childId.toString() !== category._id.toString()
          );
          await oldParentCategory.save();
        }
      }

      // নতুন parent এ push করব
      if (newParent) {
        const newParentCategory = await Category.findById(newParent);
        if (
          newParentCategory &&
          !newParentCategory.children.includes(category._id)
        ) {
          newParentCategory.children.push(category._id);
          await newParentCategory.save();
        }
      }

      category.parent = parent || null;
    }

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
