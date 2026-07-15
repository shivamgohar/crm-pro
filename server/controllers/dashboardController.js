const db = require("../config/db");

const getDashboard = async (req, res) => {

  try {

    const customerResult = await db.query(
      "SELECT COUNT(*) FROM customers"
    );

    const productResult = await db.query(
      "SELECT COUNT(*) FROM products"
    );

    const orderResult = await db.query(
      "SELECT COUNT(*) FROM orders"
    );

    const revenueResult = await db.query(
      "SELECT COALESCE(SUM(total),0) FROM orders"
    );

    res.json({

      success: true,

      customers: Number(customerResult.rows[0].count),

      products: Number(productResult.rows[0].count),

      orders: Number(orderResult.rows[0].count),

      revenue: Number(revenueResult.rows[0].coalesce),

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

module.exports = {
  getDashboard,
};