const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

// Product sales report data fetch
const getProductReport = async (req, res) => {
  try {
    // Step 1: Fetch all products
    const products = await Product.find({}).lean();

    // Step 2: Prepare product report (sold, stock, revenue)
    const report = products.map((prod) => {
      const sold = prod?.sold || 0;
      const revenue = sold * prod.price;
      return {
        id: prod._id,
        title: prod?.title,
        sold,
        stock: prod?.stock,
        revenue,
      };
    });

    // Step 3: Define Date Ranges
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Step 4: Today's Sales (paid = true)
    const todaySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart, $lte: todayEnd },
          paid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Step 5: This Month's Sales
    const monthSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart },
          paid: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Step 6: Successful Payments
    const successfulPayments = await Order.aggregate([
      {
        $match: { paid: true },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Step 7: Failed Payments
    const failedPayments = await Order.aggregate([
      {
        $match: { paid: false },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    // Step 8: Send Response
    res.json({
      success: true,
      data: {
        report, // product wise report
        analytics: {
          todaySales: todaySales[0]?.total || 0,
          thisMonth: monthSales[0]?.total || 0,
          successfulPayments: successfulPayments[0]?.total || 0,
          failedPayments: failedPayments[0]?.total || 0,
        },
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    // All Customers Count
    const totalCustomers = await User.countDocuments();

    // All Orders Count
    const totalOrders = await Order.countDocuments();

    // Last Month Stats for comparison (optional logic)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const lastMonthCustomers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Calculate percentage change
    const customerGrowth =
      lastMonthCustomers > 0
        ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
        : 0;

    const orderGrowth =
      lastMonthOrders > 0
        ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
        : 0;

    res.json({
      success: true,
      data: {
        totalCustomers,
        customerGrowth: parseFloat(customerGrowth.toFixed(2)),
        totalOrders,
        orderGrowth: parseFloat(orderGrowth.toFixed(2)),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const getMonthlySales = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Aggregate sales by month for the current year
    const monthlySales = await Order.aggregate([
      {
        $match: {
          paid: true,
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalSales: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Fill missing months with 0
    const salesData = Array.from({ length: 12 }, (_, i) => {
      const monthData = monthlySales.find((m) => m.month === i + 1);
      return monthData ? monthData.totalSales : 0;
    });

    res.json({
      success: true,
      data: salesData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const getMonthlyReport = async (req, res) => {
  try {
    const now = new Date();

    // মাসের শুরু ও শেষ তারিখ
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    // আজকের শুরু ও শেষ সময়
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999
    );

    // গতকালের শুরু ও শেষ সময় (আজ থেকে ১ দিন আগের দিন)
    const yesterday = new Date(startOfToday);
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59,
      999
    );

    // মাসিক রেভেন্যু (paid=true)
    const monthlyAgg = await Order.aggregate([
      {
        $match: {
          paid: true,
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const monthlyRevenue = monthlyAgg.length ? monthlyAgg[0].monthlyRevenue : 0;

    // আজকের রেভেন্যু
    const todayAgg = await Order.aggregate([
      {
        $match: {
          paid: true,
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const todayRevenue = todayAgg.length ? todayAgg[0].todayRevenue : 0;

    // গতকালের রেভেন্যু
    const yesterdayAgg = await Order.aggregate([
      {
        $match: {
          paid: true,
          createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
        },
      },
      {
        $group: {
          _id: null,
          yesterdayRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    const yesterdayRevenue = yesterdayAgg.length
      ? yesterdayAgg[0].yesterdayRevenue
      : 0;

    // আজকের রেভেন্যু গ্রোথ (percentage)
    let todayGrowthPercent = 0;
    if (yesterdayRevenue > 0) {
      todayGrowthPercent =
        ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    } else if (todayRevenue > 0) {
      todayGrowthPercent = 100; // আগের দিন 0 হলে আজকে যেকোনো ইনকাম 100% growth হিসেবে ধরা যেতে পারে
    }

    // মাসিক টার্গেট (fixed example)
    const monthlyTarget = 20000;

    res.json({
      success: true,
      data: {
        monthlyTarget,
        monthlyRevenue,
        todayRevenue,
        todayGrowthPercent: parseFloat(todayGrowthPercent.toFixed(2)),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
module.exports = {
  getProductReport,
  getDashboardStats,
  getMonthlySales,
  getMonthlyReport,
};
