const { BadRequestError, NotfoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");

const { findAllProducts } = require("../models/repository/product.repo");
const {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnSelect,
} = require("../models/repository/discount.repo");

const { convertToObjectIdMongose } = require("../utils/index");
/**
 * Discount Services
 * 1 - Generator discount code [ Shop | Admin ]
 * 2 - Get discount amount [ User ]
 * 3 - Get all discount codes [ User | Shop ]
 * 4 - Verify discount code [ User ]
 * 5 - Delete discount Code [ Admin | Shop]
 * 6 - Cancel discount code [ User ]
 */

class DiscountClass {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses_per_user,
      max_users,
      uses_count,
      users_used,
    } = payload;

    if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
      throw new BadRequestError("Discount code has exprired");

    //   create index for discount code
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongose(shopId),
    });

    if (new Date(start_date) >= new Date(end_date))
      throw new BadRequestError("Start date me be bofore end date");

    if (foundDiscount && foundDiscount.discount_is_active)
      throw new BadRequestError("Discount already registed!");

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value || 0,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_users,
      discount_users_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_user_per_users: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async getAllDiscountCodesWithProduct(payload) {
    const { code, shopId } = payload;
    const foundDiscount = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertToObjectIdMongose(shopId),
    });

    if (!foundDiscount || !foundDiscount.discount_is_active)
      throw new NotfoundError("ERROR:: Discount isnt exists!");

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products;
    if (discount_applies_to === "all") {
      const limit = 50;
      const sort = "ctime";
      const page = 1;
      const filter = { isPublished: true };
      const select = ["product_name", "product_thumb", "product_price"];
      products = await findAllProducts(limit, sort, page, filter, select);
    }

    if (discount_applies_to === "specific") {
      const limit = 50;
      const sort = "ctime";
      const page = 1;
      const filter = {
        _id: { $in: discount_product_ids },
        isPublished: true,
      };
      const select = ["product_name", "product_thumb", "product_price"];
      products = await findAllProducts(limit, sort, page, filter, select);
    }
    return products;
  }

  static async getAllDiscountCodesByShop(payload) {
    const { shopId } = payload;
    const discounts = await findAllDiscountCodeUnSelect({
      limit: 50,
      page: 1,
      filter: {
        discount_shopId: convertToObjectIdMongose(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"]
    });

    return discounts;
  }
}

module.exports = DiscountClass;
