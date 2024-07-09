const { ForbiddenError } = require("../core/error.response");
const ApiKeyService = require("../services/apiKey.service");
const HEADER = {
  API_KEY: "x-api-key",
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    throw new ForbiddenError("Forbidden API KEY");
  }

  const objKey = await ApiKeyService.findByKey(key);
  if (!objKey) throw new ForbiddenError("Forbidden ObjKey");
  req.objKey = objKey;
  next();
};

const permission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      if (!req.objKey || !req.objKey.permission) {
        throw new ForbiddenError(
          "Permission denied: No objKey or permission found"
        );
      }

      const validPermission =
        req.objKey.permission.includes(requiredPermission);
      if (!validPermission) {
        throw new ForbiddenError(
          `Permission denied: Required permission '${requiredPermission}'`
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  apiKey,
  permission,
};
