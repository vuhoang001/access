const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");
const AsyncHandle = require("../helpers/AsyncHandle");

router.use(AsyncHandle(apiKey));
router.use(permission("1111"));

router.use("/v1/api/", require("./access/index"));
router.use("/v1/api/product", require("./product/index"));
module.exports = router;
