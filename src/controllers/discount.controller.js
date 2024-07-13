const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    const result = await DiscountService.createDiscountCode(req.body);
    new SuccessResponse({
      message: "Registed success!",
      metadata: result,
    }).send(res);
  };

  getDiscountCodesWithProduct = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesWithProduct(
      req.body
    );
    new SuccessResponse({
      message: "getDiscountCodesWithProduct success!",
      metadata: result,
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    const result = await DiscountService.getAllDiscountCodesByShop(req.body);
    new SuccessResponse({
      message: "getAllDiscountCodesByShop success!",
      metadata: result,
    }).send(res);
  };

  deleteDiscountcode = async (req, res, next) => {
    const result = await DiscountService.deleteDiscountcode({
      shopId: req.user.UserId,
      codeId: req.params.codeId,
    });
    new SuccessResponse({
      message: "deleteDiscountcode success!",
      metadata: result,
    }).send(res);
  };
}

module.exports = new DiscountController();
