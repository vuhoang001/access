const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await product
    .find({
      product_shop: query.product_shop.product_shop,
      isDraft: query.isDraft,
    })
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip);
};

module.exports = {
  findAllDraftsForShop,
};
