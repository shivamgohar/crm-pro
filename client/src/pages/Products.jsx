import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post("http://localhost:5000/products", {
        name,
        category,
        price,
        stock,
      });

      setName("");
      setCategory("");
      setPrice("");
      setStock("");

      fetchProducts();

      alert("Product Added Successfully");
    } catch (error) {
      console.error(error);

      alert("Error");
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(`http://localhost:5000/products/${editingId}`, {
        name,
        category,
        price,
        stock,
      });

      setEditingId(null);

      setName("");
      setCategory("");
      setPrice("");
      setStock("");

      fetchProducts();

      alert("Product Updated Successfully");
    } catch (error) {
      console.error(error);

      alert("Error Updating Product");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);

      fetchProducts();

      alert("Product Deleted Successfully");
    } catch (error) {
      console.error(error);

      alert("Error Deleting Product");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Products</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />
        <br />

        <input
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <br />
        <br />

        <button onClick={editingId ? updateProduct : addProduct}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h3>{product.name}</h3>
          <button
            onClick={() => {
              setEditingId(product.id);

              setName(product.name);
              setCategory(product.category);
              setPrice(product.price);
              setStock(product.stock);
            }}
          >
            Edit
          </button>
          {editingId && (
            <button onClick={cancelEdit} style={{ marginLeft: "10px" }}>
              Cancel
            </button>
          )}{" "}
          <button
            onClick={() => {
              if (window.confirm("Delete this product?")) {
                deleteProduct(product.id);
              }
            }}
          >
            Delete
          </button>
          <p>Category : {product.category}</p>
          <p>Price : ₹ {product.price}</p>
          <p>Stock : {product.stock}</p>
        </div>
      ))}
    </div>
  );
}

export default Products;
