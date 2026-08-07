const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      "mysecretkey",
      {
        expiresIn: "1h",
      }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const register = async (req, res) => {

  try {

    const { fullName, mobile, email, password } = req.body;

    // Check Email First
    const existingUser = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Email Already Exists",
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
  INSERT INTO users
  (
    full_name,
    mobile,
    email,
    password,
    role,
    is_active
  )
  VALUES
  (
    $1,
    $2,
    $3,
    $4,
    $5,
    $6
  )
  `,
      [
        fullName,
        mobile,
        email,
        hashedPassword,
        "Admin",
        true,
      ]
    );

    res.json({
      success: true,
      message: "User Registered Successfully",
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
  login,
  register,
};