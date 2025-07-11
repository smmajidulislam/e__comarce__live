const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const sendMail = require("../utils/sendEmail");

// Create new order
const createOrder = async (req, res) => {
  const { user, products, totalAmount, deliveryAddress, email } = req.body;
  try {
    if (!user) {
      const order = new Order({
        products,
        totalAmount,
        deliveryAddress,
        email,
      });

      const savedOrder = await order.save();
      const mailData = {
        email: email,
        subject: "Order Confirmation",
        message: `Your order has been placed successfully. Order ID: ${savedOrder?._id}, Delivery Address: ${savedOrder?.deliveryAddress}, Total Amount: ${savedOrder?.totalAmount}`,
      };

      if (email) await sendMail(mailData);
      await Promise.all(
        products.map(async (product) => {
          const updatedProduct = await Product.findById(product?.product);
          updatedProduct.sold += product?.quantity;
          await updatedProduct.save();
          return updatedProduct;
        })
      );

      res.status(201).json({ success: true, data: savedOrder });
    } else {
      const order = new Order({
        user,
        products,
        totalAmount,
        deliveryAddress,
      });

      const savedOrder = await order.save();
      const userEmail = await User.findById(user);
      const mailData = {
        email: userEmail?.email,
        subject: "Order Confirmation",
        message: `Your order has been placed successfully. Order ID: ${savedOrder?._id}, Delivery Address: ${savedOrder?.deliveryAddress}, Total Amount: ${savedOrder?.totalAmount}`,
      };
      if (user) await sendMail(mailData);
      await Promise.all(
        products.map(async (product) => {
          const updatedProduct = await Product.findById(product?.product);
          updatedProduct.sold += product?.quantity;
          await updatedProduct.save();
          return updatedProduct;
        })
      );

      res.status(201).json({ success: true, data: savedOrder });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, user } = req.query; // Default pagination

    const filter = user ? { user } : {};

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("products.product", "title price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pageSize: orders.length,
      totalPages: Math.ceil(total / limit),
      data: orders,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const getAllOrdersByAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "title price")
      .sort({ createdAt: -1 });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update order by ID
const updateOrder = async (req, res) => {
  try {
    const { orderStatus, adminApprovalStatus, paid } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (adminApprovalStatus) order.adminApprovalStatus = adminApprovalStatus;
    if (paid || paid === false) order.paid = paid;

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getAllOrdersByAdmin,
};
