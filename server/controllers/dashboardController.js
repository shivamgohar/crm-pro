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
    const recentOrdersResult = await db.query(

      `
SELECT

customers.name AS customer_name,

products.name AS product_name,

orders.quantity,

orders.total,

orders.created_at

FROM orders

JOIN customers

ON orders.customer_id = customers.id

JOIN products

ON orders.product_id = products.id

ORDER BY orders.created_at DESC

LIMIT 5

`

    );

    const lowStockResult = await db.query(

      `
SELECT

id,

name,

stock

FROM products

WHERE stock <= 10

ORDER BY stock ASC

LIMIT 5

`

    );

    const topSellingResult = await db.query(

      `
SELECT

products.id,

products.name,

SUM(orders.quantity) AS total_sold

FROM orders

JOIN products

ON orders.product_id = products.id

GROUP BY products.id, products.name

ORDER BY total_sold DESC

LIMIT 5

`

    );

    res.json({

      success: true,

      customers: Number(customerResult.rows[0].count),

      products: Number(productResult.rows[0].count),

      orders: Number(orderResult.rows[0].count),

      revenue: Number(revenueResult.rows[0].coalesce),
      recentOrders: recentOrdersResult.rows,
      lowStockProducts: lowStockResult.rows,
      topSellingProducts: topSellingResult.rows,

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