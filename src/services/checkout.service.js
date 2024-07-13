const { findCartById } = require("../models/repository/cart.repo");
const { checkProductByServer } = require("../models/repository/product.repo");
const { BadRequestError } = require("../core/error.response");

class CheckoutService {
  static async checkoutReview(cartId, userId, shop_order_ids) {
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exists!");

    const checkout_order = {
      totalPrice: 0,
      freeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };

    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids_new.length; i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductByServer = await checkProductByServer(item_products);
      console.log(`checkProductByServer`, checkProductByServer);
      if (!checkProductByServer[0]) throw new BadRequestError("Order wrong!!!");

      const checkoutPrice = checkProductByServer.reduce((acc, product) => {
        res = product.quantity * product.price;
        return acc + res;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductByServer,
      };
    }
  }
}

module.exports = CheckoutService;
