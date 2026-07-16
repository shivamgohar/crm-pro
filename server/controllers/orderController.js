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


const getOrders = async (req, res) => {

  try {

    const result = await db.query(

      `SELECT
          orders.id,
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
      ORDER BY orders.id DESC`

    );

    res.json({

      success: true,

      orders: result.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

const deleteOrder = async (req, res) => {

    try {

        const orderId = req.params.id;

        const orderResult = await db.query(

            `SELECT product_id, quantity
             FROM orders
             WHERE id=$1`,

            [orderId]

        );

        if(orderResult.rows.length===0){

            return res.status(404).json({

                success:false,

                message:"Order Not Found"

            });

        }

        const productId = orderResult.rows[0].product_id;

        const quantity = orderResult.rows[0].quantity;

        await db.query(

            `UPDATE products
             SET stock = stock + $1
             WHERE id=$2`,

            [quantity,productId]

        );

        await db.query(

            `DELETE FROM orders
             WHERE id=$1`,

            [orderId]

        );

        res.json({

            success:true,

            message:"Order Deleted Successfully"

        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({

            success:false,

            message:"Server Error"

        });

    }

};



module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
};