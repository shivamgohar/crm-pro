const db = require("../config/db");

const addCustomer = async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            address,
        } = req.body;

        await db.query(
            `INSERT INTO customers
            (name, phone, email, address)
            VALUES ($1, $2, $3, $4)`,
            [name, phone, email, address]
        );

        res.json({
            success: true,
            message: "Customer Added Successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};


const getCustomers = async (req, res) => {

    try {

        const result = await db.query(
            "SELECT * FROM customers ORDER BY id DESC"
        );

        res.json({
            success: true,
            customers: result.rows,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

const updateCustomer = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, phone, email, address } = req.body;

    await db.query(
      `UPDATE customers
       SET name=$1,
           phone=$2,
           email=$3,
           address=$4
       WHERE id=$5`,
      [name, phone, email, address, id]
    );

    res.json({
      success: true,
      message: "Customer Updated Successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
};

const deleteCustomer = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      "DELETE FROM customers WHERE id = $1",
      [id]
    );

    res.json({
      success: true,
      message: "Customer Deleted Successfully",
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
    addCustomer,
    getCustomers,
    updateCustomer,
    deleteCustomer
};