import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const fetchCustomers = async () => {

    const response = await axios.get(
      "http://localhost:5000/customers"
    );

    setCustomers(response.data.customers);

  };

  const fetchProducts = async () => {

    const response = await axios.get(
      "http://localhost:5000/products"
    );

    setProducts(response.data.products);

  };

const createOrder = async () => {
  
  try {

    const response = await axios.post(
      "http://localhost:5000/orders",
      {
        customer_id: customerId,
        product_id: productId,
        quantity,
      }
    );

    alert(
      `Order Created Successfully\nTotal = ₹${response.data.total}`
    );

    setCustomerId("");
    setProductId("");
    setQuantity("");

    fetchProducts();

 } catch (error) {

  console.error(error);

  console.log(error.response?.data);

  alert(error.response?.data?.message || "Server Error");

}
};


  useEffect(() => {

    fetchCustomers();

    fetchProducts();

  }, []);



  return (

    <div style={{ padding: "20px" }}>

      <h1>Create Order</h1>

      <br />

      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      >

        <option value="">
          Select Customer
        </option>

        {

          customers.map((customer) => (

            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>

          ))

        }

      </select>

      <br /><br />

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      >

        <option value="">
          Select Product
        </option>

        {

          products.map((product) => (

            <option
              key={product.id}
              value={product.id}
            >
              {product.name}
            </option>

          ))

        }

      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <br /><br />
<button onClick={createOrder}>

    Create Order

</button>

    </div>

  );

}

export default Orders;