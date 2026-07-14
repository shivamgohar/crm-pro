import { useEffect, useState } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");

      setCustomers(response.data.customers);
    } catch (error) {
      console.error(error);
    }
  };

  const addCustomer = async () => {
    try {
      await axios.post("http://localhost:5000/customers", {
        name,
        phone,
        email,
        address,
      });

      setName("");
      setPhone("");
      setEmail("");
      setAddress("");

      fetchCustomers();

      alert("Customer Added Successfully");
    } catch (error) {
      console.error(error);
      alert("Error Adding Customer");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customers</h1>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "8px",
        }}
      >
        <h2>Add Customer</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <br />
        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <br />
        <br />

        <button onClick={addCustomer}>Add Customer</button>
      </div>

      {customers.length === 0 ? (
        <p>No Customers Found</p>
      ) : (
        customers.map((customer) => (
          <div
            key={customer.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{customer.name}</h3>

            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>

            <p>
              <strong>Email:</strong> {customer.email}
            </p>

            <p>
              <strong>Address:</strong> {customer.address}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Customers;