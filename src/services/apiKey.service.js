const apiKeyModel = require("../models/apiKey.model");
const crypro = require("crypto");
class ApiKeyService {
  static findByKey = async (key) => {
    // const createKey = crypro.randomBytes(64).toString("hex");
    // const newkey = await apiKeyModel.create({
    //   key: createKey,
    //   permission: ["1111"],
    // });
    const objKey = await apiKeyModel.findOne({
      key: key,
      status: true,
    });
    return objKey;
  };
}

module.exports = ApiKeyService;
