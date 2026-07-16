const db = require("../config/db");

const getInventory = async (req, res) => {

  try {

    const result = await db.query(`

      SELECT

      id,

      name,

      price,

      stock

      FROM products

      ORDER BY name ASC

    `);

    res.json({

      success: true,

      products: result.rows,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

const updateStock = async (req, res) => {

  try {

    const { id } = req.params;

    const { stock } = req.body;

    const result = await db.query(

      `
      UPDATE products
      SET stock = $1
      WHERE id = $2
      RETURNING *
      `,

      [stock, id]

    );

    res.json({

      success: true,

      product: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Server Error",

    });

  }

};

const addStock = async (req, res) => {

  try {

    const { id } = req.params;

    const { quantity } = req.body;

    // Current Stock
    const productResult = await db.query(
      `
      SELECT stock
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    const currentStock = Number(productResult.rows[0].stock);

    const newStock = currentStock + Number(quantity);

    // Update Stock
    const result = await db.query(
      `
      UPDATE products
      SET stock = $1
      WHERE id = $2
      RETURNING *
      `,
      [newStock, id]
    );

    res.json({
      success: true,
      product: result.rows[0],
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

const removeStock = async (req, res) => {

  try {

    const { id } = req.params;

    const { quantity } = req.body;

    const productResult = await db.query(
      `
      SELECT stock
      FROM products
      WHERE id = $1
      `,
      [id]
    );

    const currentStock = Number(productResult.rows[0].stock);

    // Stock negative nahi hona chahiye
    if (Number(quantity) > currentStock) {

      return res.status(400).json({

        success: false,

        message: "Insufficient stock",

      });

    }

    const newStock = currentStock - Number(quantity);

    const result = await db.query(
      `
      UPDATE products
      SET stock = $1
      WHERE id = $2
      RETURNING *
      `,
      [newStock, id]
    );

    res.json({

      success: true,

      product: result.rows[0],

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

  getInventory,
  updateStock,
  addStock,
  removeStock,
  
};