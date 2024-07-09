const express = require("express");
const router = express.Router();
const AsyncHandle = require("../../helpers/AsyncHandle");
const { authentication } = require("../../auth/authUtils");
const AccessController = require("../../controllers/access.controler");

router.post("/shop/signup", AsyncHandle(AccessController.signUp));
router.post("/shop/login", AsyncHandle(AccessController.login));

router.use(authentication);
router.post("/shop/logout", AsyncHandle(AccessController.logout));
router.post(
  "/shop/handleRefreshToken",
  AsyncHandle(AccessController.handleRefreshToken)
);
module.exports = router;
