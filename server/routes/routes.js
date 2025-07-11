const express = require("express");
const router = express.Router();
const {
  login,
  singUP,
  logOut,
  updatePassword,
  forgotPassword,
  confromCode,
} = require("../controller/auth.controller");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controller/product.controller");
const {
  createOrder,
  getAllOrders,
  getAllOrdersByAdmin,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controller/order.controller");
const { verifyToken, verifyAdminToken } = require("../utils/verifyToken");
const {
  initiatePayment,
  response,
  createCheckoutSession,
} = require("../controller/Payment.controller");
const {
  getSetting,
  updateSetting,
  deleteLogo,
} = require("../controller/setting.controller");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserByPhone,
} = require("../controller/user.controller");
const {
  getProductReport,
  getDashboardStats,
  getMonthlySales,
  getMonthlyReport,
} = require("../controller/productReport.controller");
const {
  createSlider,
  getSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
} = require("../controller/slider.controller");

// auth routes
router.post("/login", login);
router.post("/signup", singUP);
router.post("/logout", logOut);
router.post("/updatePassword", updatePassword);
router.post("/forgotPassword", forgotPassword);
router.post("/confirmCode", confromCode);

// user get category routes
router.get("/category", getAllCategories);

// admin category routes
router.post("/admin/category", verifyAdminToken, createCategory);
router.get("/admin/category/:id", verifyAdminToken, getCategoryById);
router.put("/admin/category/:id", verifyAdminToken, updateCategory);
router.delete("/admin/category/:id", verifyAdminToken, deleteCategory);

// user product routes
router.get("/product", getAllProducts);
router.get("/product/:id", getProductById);

// admin product routes
router.post("/product", verifyAdminToken, createProduct);
router.put("/product/:id", verifyAdminToken, updateProduct);
router.delete("/product/:id", verifyAdminToken, deleteProduct);

// order routes
router.post("/order", createOrder);
router.get("/order", getAllOrders);
router.get("/order/admin", getAllOrdersByAdmin);
router.get("/order/:id", getOrderById);
router.put("/order/:id", updateOrder);
router.delete("/order/:id", deleteOrder);

// payments routes
// ssl commerz initiate payment
router.post("/payment", initiatePayment);
router.post("/payment/response", response);
// stripe initiate payment
router.post("/stripe", createCheckoutSession);

// get user profile
router.get("/getUsers", getUsers);
router.get("/getUser/:id", getUser);
router.get("/getUserByEmail/:email", getUserByEmail);
router.get("/getUserByPhone/:phone", getUserByPhone);
router.post("/createUser", createUser);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", verifyAdminToken, deleteUser);
// report route for admin
router.get("/productReport", verifyAdminToken, getProductReport);
router.get("/getDashboardStats", verifyAdminToken, getDashboardStats);
router.get("/getMonthlySales", verifyAdminToken, getMonthlySales);
router.get("/getMonthlyTarget", verifyAdminToken, getMonthlyReport);
// website settings route for admin
router.get("/getSetting", verifyAdminToken, getSetting);
router.put("/updateSetting", verifyAdminToken, updateSetting);
router.delete("/deleteLogo", verifyAdminToken, deleteLogo);
// slider routes
router.post("/slider", verifyAdminToken, createSlider);
router.get("/slider", getSliders);
router.get("/slider/:id", verifyAdminToken, getSliderById);
router.put("/slider/:id", verifyAdminToken, updateSlider);
router.delete("/slider/:id", verifyAdminToken, deleteSlider);
module.exports = router;
