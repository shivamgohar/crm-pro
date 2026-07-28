const pool = require("../config/db");

const getStatuses = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM company_customer_status
            ORDER BY display_order
        `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to load customer status"
        });

    }

};


const createStatus = async (req, res) => {

    try {

        const {
    status_name,
    status_color,
    is_default,
    is_active
} = req.body;

if (!status_name || !status_name.trim()) {
    return res.status(400).json({
        message: "Status name is required"
    });
}

const orderResult = await pool.query(`
    SELECT COALESCE(MAX(display_order), 0) + 1 AS display_order
    FROM company_customer_status
`);

const display_order = orderResult.rows[0].display_order;


const result = await pool.query(
    `
    INSERT INTO company_customer_status
    (
        status_name,
        status_color,
        is_default,
        is_active,
        display_order
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
    `,
    [
        status_name.trim(),
        status_color,
        is_default,
        is_active,
        display_order
    ]
);

return res.status(201).json({
    message: "Customer status created successfully",
    status: result.rows[0]
});

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create customer status"
        });

    }

};  



const updateStatus = async (req, res) => {

    try {

        const { id } = req.params;

const {
    status_name,
    status_color,
    is_default,
    is_active
} = req.body;

if (!status_name || !status_name.trim()) {
    return res.status(400).json({
        message: "Status name is required"
    });
}

const result = await pool.query(
    `
    UPDATE company_customer_status
    SET
        status_name = $1,
        status_color = $2,
        is_default = $3,
        is_active = $4,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING *;
    `,
    [
        status_name.trim(),
        status_color,
        is_default,
        is_active,
        id
    ]
);

if (result.rows.length === 0) {
    return res.status(404).json({
        message: "Customer status not found"
    });
}


return res.status(200).json({
    message: "Customer status updated successfully",
    status: result.rows[0]
});

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update customer status"
        });

    }

};



const deleteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM company_customer_status
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer status not found",
            });
        }

        return res.status(200).json({
            message: "Customer status deleted successfully",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


const archiveStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE company_customer_status
             SET is_active = false,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer status not found",
            });
        }

        return res.status(200).json({
            message: "Customer status archived successfully",
            status: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const restoreStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `UPDATE company_customer_status
             SET is_active = true,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer status not found",
            });
        }

        return res.status(200).json({
            message: "Customer status restored successfully",
            status: result.rows[0],
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


const reorderStatus = async (req, res) => {
    const client = await pool.connect();

    try {
        const statuses = req.body;

        await client.query("BEGIN");

        for (const status of statuses) {
            await client.query(
                `UPDATE company_customer_status
                 SET display_order = $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $2`,
                [status.display_order, status.id]
            );
        }

        await client.query("COMMIT");

        return res.status(200).json({
            message: "Customer status order updated successfully",
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });

    } finally {

        client.release();

    }
};

module.exports = {
    getStatuses,
    createStatus,
    updateStatus,
    deleteStatus,
    archiveStatus,
    restoreStatus,
    reorderStatus,

};