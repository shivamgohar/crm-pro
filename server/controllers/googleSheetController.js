const db = require("../config/db");

// Save Google Sheet Mapping
const saveGoogleSheetMapping = async (req, res) => {
    try {

        const {
            spreadsheetId,
            sheetName,
            mapping,
        } = req.body;

        if (!spreadsheetId) {
            return res.status(400).json({
                success: false,
                message: "Spreadsheet ID is required.",
            });
        }

        if (!sheetName) {
            return res.status(400).json({
                success: false,
                message: "Sheet name is required.",
            });
        }

        if (!mapping || typeof mapping !== "object") {
            return res.status(400).json({
                success: false,
                message: "Mapping is required.",
            });
        }

        const result = await db.query(
            `
            INSERT INTO google_sheet_mappings
            (
                spreadsheet_id,
                sheet_name,
                mapping,
                updated_at
            )
            VALUES
            ($1, $2, $3, NOW())
            ON CONFLICT (spreadsheet_id, sheet_name)
            DO UPDATE SET
                mapping = EXCLUDED.mapping,
                updated_at = NOW()
            RETURNING *
            `,
            [
                spreadsheetId,
                sheetName,
                JSON.stringify(mapping),
            ]
        );

        res.json({
            success: true,
            message: "Google Sheet mapping saved successfully.",
            mapping: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Save Google Sheet Mapping Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to save Google Sheet mapping.",
        });
    }
};


// Get Google Sheet Mapping
const getGoogleSheetMapping = async (req, res) => {
    try {

        const {
            spreadsheetId,
            sheetName,
        } = req.query;

        if (!spreadsheetId || !sheetName) {
            return res.status(400).json({
                success: false,
                message: "Spreadsheet ID and sheet name are required.",
            });
        }

        const result = await db.query(
            `
            SELECT
                id,
                spreadsheet_id,
                sheet_name,
                mapping,
                created_at,
                updated_at
            FROM google_sheet_mappings
            WHERE spreadsheet_id = $1
              AND sheet_name = $2
            LIMIT 1
            `,
            [
                spreadsheetId,
                sheetName,
            ]
        );

        if (result.rows.length === 0) {
            return res.json({
                success: true,
                mapping: null,
            });
        }

        res.json({
            success: true,
            mapping: result.rows[0],
        });

    } catch (error) {

        console.error(
            "Get Google Sheet Mapping Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to fetch Google Sheet mapping.",
        });
    }
};


module.exports = {
    saveGoogleSheetMapping,
    getGoogleSheetMapping,
};