const jwt = require("jsonwebtoken");

const config = require("../config");
const { logger } = require("../utils/logger");

async function verifyJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
    req.user_id = decoded.id;
    next();
  }
  catch (error) {
    logger.debug(error);
    return res.status(403).json({ message: "Forbidden" });
  }
}

module.exports = verifyJwt;
