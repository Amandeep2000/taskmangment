const jwt = require("jsonwebtoken");
// const {apiresponse}=require('@helper/helper');
const {
  invalidatedTokens,
  addToInvalidatedTokens,
} = require("@helper/tokenmanager");

// const { successResponse, errorResponse } = require("@helper/helper");
// const secretKey = process.env.TOKENKEY;
  const authenticateToken = async (req, res, next) => {
    let token = req.header("Authorization");
  
    // if (!token) {
    //   token = req.query.token;
    // }
  
    if (!token) {
      return res.status(400).json(errorResponse({ message: "No token provided" }));
    }
  
    if (invalidatedTokens.has(token)) {
      return res
        .status(400)
        .json(errorResponse({ message: "Token is no longer valid" }));
    }
  
    try {
      const user = await jwt.verify(token, secretKey);
  
      req.user = user;
  
      next();
    } catch (err) {
      return res
        .status(400)
        .json(errorResponse({ message: "Invalid Token", err }));
    }
  };

//   test() {}
// }

module.exports = { authenticateToken};
