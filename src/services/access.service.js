const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ShopService = require("../services/shop.service");
const KeyTokenService = require("../services/keyToken.service");
const { createTokensPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");

const ShopModel = require("../models/shop.model");

class AccessService {
  static signUp = async ({ name, email, password }) => {
    /**
     * 1 - Kiểm tra xem đã tồn tại email này chưa ?
     * 2 - Mã hóa password
     * 3 - Tạo ra publicKey, privateKey
     * 4 - Tạo ra tokens (AT vs RT)
     * 5 - ALL OK => Return
     */
    const holderShop = await ShopService.findByEmail(email);
    if (holderShop) throw new BadRequestError("Error: Shop already registed!");
    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await ShopModel.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    if (!newShop)
      throw new BadRequestError(
        "Error: Something went wrong! Cant create account!"
      );
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const keyStore = await KeyTokenService.createKeys({
      user: newShop,
      publicKey,
      privateKey,
    });

    if (!keyStore)
      throw new BadRequestError(
        "Error: Something went wrong! Cant create keys"
      );

    const tokens = await createTokensPair(
      {
        UserId: newShop._id,
        email,
      },
      publicKey,
      privateKey
    );
    return {
      code: "201",
      metadata: {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      },
    };
  };

  static login = async ({ email, password }) => {
    const foundShop = await ShopService.findByEmail(email);
    if (!foundShop)
      throw new AuthFailureError("Error: Account is not registed!");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match)
      throw new AuthFailureError("Error: Username or password is wrong!");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokensPair(
      {
        UserId: foundShop._id,
        email,
      },
      publicKey,
      privateKey
    );

    const keyStore = await KeyTokenService.createKeys({
      user: foundShop,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    if (!keyStore)
      throw new BadRequestError("Error: cant create or update keyStore");

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = KeyTokenService.removeTokenById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async ({ refreshToken, user, keyStore }) => {
    const email = user.email;
    const userId = user.UserId._id;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.removeTokenByUserId(userId);
      throw new ForbiddenError("Something went wrong! Please relogin");
    }

    const foundShop = await ShopService.findByEmail(email);
    if (!foundShop) throw new AuthFailureError("ERROR: Account isnt registed!");

    if (keyStore.refreshToken != refreshToken)
      throw new AuthFailureError("ERROR: Shop isnt registed!");

    const tokens = await createTokensPair(
      {
        UserId: foundShop._id,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    const holderTokens = await KeyTokenService.findById(foundShop._id);
    const res = await holderTokens.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    if (!res) throw new BadRequestError("ERROR:: cant set and update res");

    return {
      user: {
        userId,
        email,
      },
      tokens: tokens,
    };
  };
}

module.exports = AccessService;
