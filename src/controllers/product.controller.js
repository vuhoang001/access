const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductService2 = require("../services/product.service.xxx");

const mongoose = require("mongoose");
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

  //QUERY//
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success!",
      metadata: await ProductService2.findAllDraftsForShop({
        product_shop: req.user.UserId,
      }),
    }).send(res);
  };
  // END QUERY
}

module.exports = new ProductController();
