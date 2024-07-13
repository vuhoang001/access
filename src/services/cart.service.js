const CartModel = require("../models/cart.model");
const { BadRequestError, NotfoundError } = require("../core/error.response");
const {
  createUserCart,
  updateUserCartQuantity,
  getListProductsInCart,
  deleteCartById,
} = require("../models/repository/cart.repo");

const { getProductById } = require("../models/repository/product.repo");

class CartService {
  static async addToCart({ userId, product = {} }) {
    const userCart = await CartModel.findOne({
      cart_userId: userId,
    });

    if (!userCart) {
      return await createUserCart({ userId, product });
    }

    if (userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    return await updateUserCartQuantity({ userId, product });
  }

  /**
   * shop_order_ids: [
   *    {
   *        shopId,
   *        item_products: [
   *            {
   *                quantity,
   *                price,
   *                shopId,
   *                old_quantity,
   *                productId
   *            }
   *        ]
   *    }
   * ]
   */

  static async addToCartV2({ userId, product }) {
    const productId = product.product.productId;
    const shopId = product.product.shopId;
    const quantity = product.product.quantity;
    const price = product.product.price;
    const old_quantity = product.product.old_quantity;
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotfoundError("ERROR: cant find product");

    if (foundProduct.product_shop.toString() !== shopId)
      throw new NotfoundError("Product do not belong to the shop");

    if (quantity === 0) {
      //deleted
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    return await deleteCartById({ userId: userId, productId: productId });
  }

  static async getListCart({ userId }) {
    return await getListProductsInCart({ userId });
  }
}

module.exports = CartService;
