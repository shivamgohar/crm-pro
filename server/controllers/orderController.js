const db = require("../config/db");


const createOrder = async (req, res) => {

  try {

    const customerId = Number(req.body.customer_id);
    const productId = Number(req.body.product_id);
    const qty = Number(req.body.quantity);

    const productResult = await db.query(
      "SELECT price, stock FROM products WHERE id=$1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product Not Found",
      });
    }

    const price = Number(productResult.rows[0].price);
    const stock = Number(productResult.rows[0].stock);

    if (qty > stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient Stock",
      });
    }

    const total = price * qty;

    await db.query(
      `INSERT INTO orders
      (customer_id, product_id, quantity, total)
      VALUES ($1,$2,$3,$4)`,
      [customerId, productId, qty, total]
    );

   await db.query(
  `UPDATE products
   SET stock = stock - $1
   WHERE id = $2`,
  [qty, productId]
);

    res.json({
      success: true,
      message: "Order Created Successfully",
      total,
    });

  } catch (error) {

     console.log("=========== ERROR ===========");
    console.error(error);
    console.log("=============================");


    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

module.exports = {
  createOrder,
};