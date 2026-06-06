const store = require("../store/mongoStore");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.get("authorization") ?? "";
    const [, token] = authHeader.match(/^Bearer\s+(.+)$/i) ?? [];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing bearer token",
      });
    }

    const user = await store.getUserByToken(token);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    req.authToken = token;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  requireAuth,
};
