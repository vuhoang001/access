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
/**
 * @desc Get all Drafts for shop
 * @return {JSON}
 */
router.get("/drafts/all", AsyncHandle(ProductController.getAllDraftsForShop));
router.get("/publish/all", AsyncHandle(ProductController.getAllPublishForShop));

module.exports = router;
