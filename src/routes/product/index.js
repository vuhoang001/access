const express = require("express");
const router = express.Router();
const AsyncHandle = require("../../helpers/AsyncHandle");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");

router.use(authentication);
router.post("/", AsyncHandle(ProductController.createProduct));

module.exports = router;
