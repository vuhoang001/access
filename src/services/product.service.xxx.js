const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
} = require("../models/repository/product.repo");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);

    return await new productClass(payload).createProduct();
  }

  static async updateProduct() {}

  static async publishProductByShop(product_shop, product_id) {
    return await publishProductByShop(product_shop, product_id);
  }

  static async unPublishProductByShop(product_shop, product_id) {
    return await unPublishProductByShop(product_shop, product_id);
  }

  static async findAllDraftsForShop(product_shop, limit = 50, skip = 0) {
    const query = { product_shop: product_shop, isDraft: true };
    return await findAllDraftsForShop(query, limit, skip);
  }

  static async findAllPublishForShop(product_shop, limit = 50, skip = 0) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop(query, limit, skip);
  }

  static async searchProducts(keySearch) {
    return await searchProductsByUser(keySearch);
  }

  static async findAllProducts(
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true }
  ) {
    const select = ["product_name", "product_thumb", "product_price"];
    return await findAllProducts(limit, sort, page, filter, select);
  }

  static async findProduct(product_id) {
    const unSelect = ["__v"];
    return await findProduct(product_id, unSelect);
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Failed to create clothing!");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create Product!");
    }

    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Failed to create electronic!");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create Product!");
    }

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) {
      throw new BadRequestError("Failed to create electronic!");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Failed to create Product!");
    }

    return newProduct;
  }
}

ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
