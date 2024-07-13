const express = require("express");
const router = express.Router();
const AsyncHandle = require("../../helpers/AsyncHandle");
const { authentication } = require("../../auth/authUtils");
const CartController = require("../../controllers/cart.controller");

router.use(authentication);

router.post("/", AsyncHandle(CartController.addToCart));
router.delete("/", AsyncHandle(CartController.deleteUserCart));
router.post("/update", AsyncHandle(CartController.udpateToCart));
router.get("/", AsyncHandle(CartController.getListCart));

module.exports = router;
