const jwt = require("jsonwebtoken");

const authenticateCleanupToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Cleanup authorization required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.purpose !== "cleanup-imported-data") {
      return res.status(403).json({
        success: false,
        message: "Invalid cleanup authorization",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "Cleanup token verification error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Cleanup authorization expired or invalid",
    });
  }
};

module.exports = authenticateCleanupToken;