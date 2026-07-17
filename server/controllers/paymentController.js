const pool = require("../config/db");

// Get All Payments

const getPayments = async (req, res) => {

    try {

        const result = await pool.query(

            `
            SELECT

                payments.id,

                customers.name AS customer_name,

                orders.id AS order_id,

                payments.amount,

                payments.payment_method,

                payments.payment_status,

                payments.payment_date

            FROM payments

            JOIN orders
            ON payments.order_id = orders.id

            JOIN customers
            ON orders.customer_id = customers.id

            ORDER BY payments.id DESC
            `
        );

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

// Add Payment

const addPayment = async (req, res) => {

    try {

        const {

            order_id,
            amount,
            payment_method,
            payment_status

        } = req.body;

        const result = await pool.query(

            `
            INSERT INTO payments
            (order_id, amount, payment_method, payment_status)

            VALUES ($1,$2,$3,$4)

            RETURNING *
            `,

            [

                order_id,
                amount,
                payment_method,
                payment_status

            ]

        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Server Error"

        });

    }

};

module.exports = {

    getPayments,
    addPayment,

};