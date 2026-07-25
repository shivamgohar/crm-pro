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


// const getServicesByCustomerCode = async (req, res) => {
//     try {
//         const {
//             customer_id,
//             service_date,
//             service_type,
//             engineer,
//             remark,
//             amount,
//         } = req.body;

//         const result = await db.query(
//             `
//       INSERT INTO services
//       (
//         customer_id,
//         service_date,
//         service_type,
//         engineer,
//         remark,
//         amount
//       )
//       VALUES ($1, $2, $3, $4, $5, $6)
//       RETURNING *;
//       `,
//             [
//                 customer_id,
//                 service_date,
//                 service_type,
//                 engineer,
//                 remark,
//                 amount,
//             ]
//         );

//         res.status(201).json({
//             message: "Service added successfully",
//             service: result.rows[0],
//         });
//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Failed to add service",
//         });
//     }
// };



module.exports = {
    addService,
};