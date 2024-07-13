const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "addToCart success!",
      metadata: await CartService.addToCart({
        userId: req.user.UserId,
        product: req.body,
      }),
    }).send(res);
  };
  
  udpateToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "udpateToCart success!",
      metadata: await CartService.addToCartV2({
        userId: req.user.UserId,
        product: req.body,
      }),
    }).send(res);
  };

  deleteUserCart = async (req, res, next) => {

    new SuccessResponse({
      message: "deleteUserCart success!",
      metadata: await CartService.deleteUserCart({
        userId: req.user.UserId,
        productId: req.body,
      }),
    }).send(res);
  };

  getListCart = async (req, res, next) => {
    new SuccessResponse({
      message: "getListCart success!",
      metadata: await CartService.getListCart({ userId: req.user.UserId }),
    }).send(res);
  };
}

module.exports = new CartController();
