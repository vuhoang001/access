const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");

const { Types } = require("mongoose");

const { getSelectData, getUnSelectData } = require("../../utils/index");
const { convertToObjectIdMongose } = require("../../utils/index");

const queryProduct = async (query, limit, skip) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip);
};

const findAllDraftsForShop = async (query, limit, skip) => {
  return await queryProduct(query, limit, skip);
};

const findAllPublishForShop = async (query, limit, skip) => {
  return await queryProduct(query, limit, skip);
};

const searchProductsByUser = async (keySearch) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } });
  return results;
};

const publishProductByShop = async (product_shop, product_id) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductByShop = async (product_shop, product_id) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const findAllProducts = async (limit, sort, page, filter, select) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select));

  return products;
};

const findProduct = async (product_id, unSelect) => {
  return await product
    .findOne({ _id: product_id })
    .select(getUnSelectData(unSelect));
};

const updateProductById = async (
  productId,
  bodyUpdate,
  model,
  isNew = true
) => {
  const updatedProduct = await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });

  return updatedProduct;
};

const getProductById = async (productId) => {
  return await product.findOne({ _id: convertToObjectIdMongose(productId) });
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          product: product.productId,
        };
      }
    })
  );
};
module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
};
