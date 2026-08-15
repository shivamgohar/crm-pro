const db = require("../config/db");



const {
  generateLowStockNotifications,
} = require("../services/notificationService");


// Add Product
const addProduct = async (req, res) => {
  try {

    const { name, category, price, stock } = req.body;

    await db.query(
      `INSERT INTO products
      (name, category, price, stock)
      VALUES ($1, $2, $3, $4)`,
      [name, category, price, stock]
    );
 // Check notification rules
    await generateLowStockNotifications();

    res.json({
      success: true,
      message: "Product Added Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

// Get Products
const getProducts = async (req, res) => {
  try {

    const result = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );

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


const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, category, price, stock } = req.body;

    await db.query(
      `UPDATE products
       SET name=$1,
           category=$2,
           price=$3,
           stock=$4
       WHERE id=$5`,
      [name, category, price, stock, id]
    );
 // Check notification rules
    await generateLowStockNotifications();

    res.json({
      success: true,
      message: "Product Updated Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

const deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM products WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: "Product Deleted Successfully",
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
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct
};