const inventoryModel = require("../inventory.model");

const insertInventory = async (
  productId,
  location = "unKnow",
  stock,
  shopId,
  reservations
) => {
  return inventoryModel.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
    inven_reservations: reservations,
  });
};

module.exports = {
  insertInventory,
};
