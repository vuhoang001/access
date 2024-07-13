const express = require("express");
const router = express.Router();
const AsyncHandle = require("../../helpers/AsyncHandle");
const { authentication } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");

router.get("/", AsyncHandle(DiscountController.getDiscountCodesWithProduct));
router.get(
  "/allDiscShop",
  AsyncHandle(DiscountController.getAllDiscountCodesByShop)
);

router.use(authentication);

router.post("/", AsyncHandle(DiscountController.createDiscountCode));
router.post("/:codeId", AsyncHandle(DiscountController.deleteDiscountcode));
module.exports = router;
