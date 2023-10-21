const jwt = require("jsonwebtoken");

function sign(payload, isAccessToken) {
  console.log("payload", payload);
  return jwt.sign(
    payload,
    isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: 3600,
      algorithm: "HS256",
    }
  );
}

function generateAccessToken(user) {
  return sign({ user }, true);
}
function generateRefreshToken(user) {
  return sign({ user }, false);
}

module.exports = { generateAccessToken, generateRefreshToken };