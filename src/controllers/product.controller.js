const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
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
}

module.exports = new ProductController();
