const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "JWT TOKEN"

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    // Add the user's ID to the request object
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };