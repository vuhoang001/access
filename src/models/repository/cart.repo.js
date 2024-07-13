const { convertToObjectIdMongose } = require("../../utils");
const cartModel = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = { cart_userId: userId, cart_state: "active" },
    updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    },
    options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;

  const query = {
    cart_userId: userId,
    "cart_products.product.productId": productId,
    cart_state: "active",
  };

  const updateSet = {
    $inc: {
      cart_count_product: quantity,
      "cart_products.$.product.quantity": quantity,
    },
  };

  const options = { upsert: true, new: true };

  return await cartModel.findOneAndUpdate(query, updateSet, options);
};

const deleteCartById = async ({ userId, productId }) => {
  const query = { cart_userId: userId, cart_state: "active" };
  const updateSet = {
    $pull: {
      cart_products: {
        productId: productId.productId,
      },
    },
  };

  const deleteCart = await cartModel.updateOne(query, updateSet);
  return deleteCart;
};

const getListProductsInCart = async ({ userId }) => {
  return await cartModel.find({ cart_userId: userId });
};

const findCartById = async (cartId) => {
  return await cartModel.findOne({
    _id: convertToObjectIdMongose(cartId),
    cart_state: "active",
  });
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  deleteCartById,
  getListProductsInCart,
  findCartById,
};
