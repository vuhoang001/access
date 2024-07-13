const { getSelectData, getUnSelectData } = require("../../utils/index");
const discountModel = require("../discount.model");

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select));

  return products;
};

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await discountModel
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getUnSelectData(unSelect));

  return products;
};

const checkDiscountExists = async (filter) => {
  return await discountModel.findOne({ filter });
};

module.exports = {
  findAllDiscountCodeUnSelect,
  findAllDiscountCodeSelect,
  checkDiscountExists,
};
