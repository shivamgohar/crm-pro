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

module.exports = {
    addCustomer,
    getCustomers,
};