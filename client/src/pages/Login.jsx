import "../styles/Login.css";
import { useState } from "react";
import axios from "axios";



function Login() {


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      email,
      password,
    });

    localStorage.setItem(
    "token",
    response.data.token
);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>CRM Software</h1>

        <input
          type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
        />

       <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>


    <button onClick={handleLogin}>
        Login
    </button>

      </div>

    </div>
  );
}

export default Login;