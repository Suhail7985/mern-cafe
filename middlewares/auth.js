import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "something";

const authenticate = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Access Denied - No token provided" });
    }
    token = token.split(" ")[1];
    const user = jwt.verify(token, SECRET);
    req.user = user; // Set full user object
    req.role = user.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Access Denied - Invalid token" });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.role === role) {
      next();
    } else {
      return res.json({ message: "Unauthorized Access" });
    }
  };
};

export {authenticate,authorize}