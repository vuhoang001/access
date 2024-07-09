const jwt = require("jsonwebtoken");

const { AuthFailureError } = require("../core/error.response");

const KeyTokenService = require("../services/keyToken.service");
const AsyncHandle = require("../helpers/AsyncHandle");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};

const createTokensPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // jwt.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.log("error verify::", err);
    //   } else {
    //     console.log("decode verify::", decode);
    //   }
    // });
    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};

const authentication = AsyncHandle(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId)
    throw new AuthFailureError("ERROR: Cant find userId (HEADER.CLIENT_ID)");

  const keyStore = await KeyTokenService.findById(userId);
  if (!keyStore) throw new AuthFailureError("ERROR: Cant find keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
    if (decodeUser.UserId !== userId)
      throw new AuthFailureError("ERROR: Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    req.refreshToken = refreshToken;
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (accessToken) {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (decodeUser.UserId !== userId)
      throw new AuthFailureError("ERROR: Invalid UserId");
    req.keyStore = keyStore;
  }
  next();
});

module.exports = {
  createTokensPair,
  authentication,
};
