const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const ProductService2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success",
      metadata: await ProductService2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.UserId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Post publish product by shop success!",
      metadata: await ProductService2.publishProductByShop(
        req.user.UserId,
        req.params.id
      ),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unPublishProductByShop by shop success!",
      metadata: await ProductService2.unPublishProductByShop(
        req.user.UserId,
        req.params.id
      ),
    }).send(res);
  };

  //QUERY//
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list drafts success!",
      metadata: await ProductService2.findAllDraftsForShop(req.user.UserId),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list Publish success!",
      metadata: await ProductService2.findAllPublishForShop(req.user.UserId),
    }).send(res);
  };

  getListSearchProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "getListSearchProducts success!",
      metadata: await ProductService2.searchProducts(req.params.keySearch),
    }).send(res);
  };
  // END QUERY

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "findAllProducts success!",
      metadata: await ProductService2.findAllProducts(req.body),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    const product_id = req.params.product_id;
    new SuccessResponse({
      message: "findProduct success!",
      metadata: await ProductService2.findProduct(product_id),
    }).send(res);
  };
}

module.exports = new ProductController();
