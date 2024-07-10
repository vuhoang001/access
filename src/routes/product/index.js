const express = require("express");
const router = express.Router();
const AsyncHandle = require("../../helpers/AsyncHandle");
const { authentication } = require("../../auth/authUtils");
const ProductController = require("../../controllers/product.controller");

router.use(authentication);
router.post("/", AsyncHandle(ProductController.createProduct));
router.post(
  "/publish/:id",
  AsyncHandle(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  AsyncHandle(ProductController.unPublishProductByShop)
);
router.get("/drafts/all", AsyncHandle(ProductController.getAllDraftsForShop));
router.get("/publish/all", AsyncHandle(ProductController.getAllPublishForShop));

module.exports = router;
