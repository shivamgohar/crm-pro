const db = require("../config/db");

// Add Service
const addService = async (req, res) => {
  try {

    // 1. Sabse pehle request se data lo
    const {
      customer_code,
      service_date,
      service,
      engineer,
      remark,
      amount,
      received_amount,
      pending_amount,
      status,
      products,
    } = req.body;


    // Duplicate product check
    const productIds = products.map(product => product.productId);

    if (new Set(productIds).size !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate products are not allowed."
      });
    }

    // 2. Transaction start
    await db.query("BEGIN");

    // 3. Service insert
    const serviceResult = await db.query(
      `
      INSERT INTO services
      (
        customer_code,
        service_date,
        service,
        engineer,
        remark,
        amount,
        received_amount,
        pending_amount,
        status
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      )
      RETURNING id
      `,
      [
        customer_code,
        service_date,
        service,
        engineer,
        remark,
        amount,
        received_amount,
        pending_amount,
        status,
      ]
    );

    const serviceId = serviceResult.rows[0].id;

    // console.log(serviceId);
    console.log("Service ID:", serviceId);

    for (const product of products) {

      // Product ki price nikalo
      const productResult = await db.query(
        `
    SELECT name, price, stock
    FROM products
    WHERE id = $1
    `,
        [product.productId]
      );

      if (productResult.rows.length === 0) {
        throw new Error(`Product not found: ${product.productId}`);
      }
      const productName = productResult.rows[0].name;
      const unitPrice = productResult.rows[0].price;

      console.log({
        productId: product.productId,
        unitPrice,
      });

      const availableStock = Number(productResult.rows[0].stock);
      const requestedQty = Number(product.quantity);

      if (requestedQty > availableStock) {
        throw new Error(
          `${productName} has only ${availableStock} item(s) in stock.`
        );
      }



      await db.query(
        `
    INSERT INTO service_products
    (
        service_id,
        product_id,
        quantity,
        unit_price
    )
    VALUES
    ($1,$2,$3,$4)
    `,
        [
          serviceId,
          product.productId,
          Number(product.quantity),
          unitPrice,
        ]
      );

      console.log("Inserted Product:", product.productId);

      const updateResult = await db.query(
        `
  UPDATE products
  SET stock = stock - $1
  WHERE id = $2
  RETURNING id, stock
  `,
        [
          Number(product.quantity),
          product.productId,
        ]
      );

      console.log("Stock Updated:", updateResult.rows);

    }

    await db.query("COMMIT");
    console.log("COMMIT SUCCESS");

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      serviceId,
    });


    // console.log(req.body);

  } catch (error) {

    await db.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateService = async (req, res) => {

    try {

        const { id } = req.params;

        const {

            service_date,
            service,
            engineer,
            remark,
            amount,
            received_amount,
            pending_amount,
            status,

        } = req.body;

        await db.query(
            `
            UPDATE services
            SET

                service_date = $1,
                service = $2,
                engineer = $3,
                remark = $4,
                amount = $5,
                received_amount = $6,
                pending_amount = $7,
                status = $8

            WHERE id = $9
            `,
            [
                service_date,
                service,
                engineer,
                remark,
                amount,
                received_amount,
                pending_amount,
                status,
                id,
            ]
        );

        res.json({
            success: true,
            message: "Service Updated Successfully",
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });

    }

};

const getCustomerSummary = async (req, res) => {
  try {

    const { customerCode } = req.params;

    console.log("Customer Code:", customerCode);

    const result = await db.query(
      `
      SELECT
        COALESCE(SUM(pending_amount),0) AS pending_amount,
        MAX(service_date) AS last_service,
        COUNT(*) AS total_services
      FROM services
      WHERE customer_code = $1
      `,
      [customerCode]
    );

    console.log(result.rows);

    const data = result.rows[0];


    const lastService = data.last_service;

    let nextService = null;

    if (lastService) {
      nextService = new Date(lastService);
      nextService.setDate(nextService.getDate() + 90);
    }

    const today = new Date();

    const amcActive = nextService ? nextService >= today : false;

    res.json({
      pendingAmount: Number(data.pending_amount),

      lastService: data.last_service,

      totalServices: Number(data.total_services),

      nextService,

      customerActive: true,

      amcActive,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
module.exports = {
  addService,
  updateService,
  getCustomerSummary,
};