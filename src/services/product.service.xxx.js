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
  updateProductById,
} = require("../models/repository/product.repo");

const { cleanObject } = require("../utils/index");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);

    return await new productClass(payload).createProductV2();
  }

  static async updateProduct(type, payload, productId) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);

    return await new productClass(payload).updateProduct(productId);
  }

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

  async createProductAndDocument(model, attributes, shopId) {
    const newDocument = await model.create({
      ...attributes.product_attributes,
      product_shop: shopId,
    });
    if (!newDocument) throw new BadRequestError(`Failed to create ${model}`);

    const newProduct = await product.create({
      ...attributes,
      _id: newDocument._id,
    });
    if (!newProduct) throw new BadRequestError(`Failed to create product`);
    return newProduct;
  }

  async updateProductAndDocument(model, bodyUpdate, productShop, productId) {
    const holderProduct = await product.findOne({
      _id: productId,
    });
    if (!holderProduct) throw new BadRequestError("Can not find product");
    if (bodyUpdate.product_attributes) {
      const cleanedProductAttributes = cleanObject(
        bodyUpdate.product_attributes
      );

      await updateProductById(
        productId,
        { product_attributes: cleanedProductAttributes },
        model // furniture , clothing
      );
    }

    const updateProductModel = await updateProductById(
      productId,
      cleanObject(bodyUpdate),
      product
    );

    return updateProductModel;
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

  async createProductV2() {
    return await this.createProductAndDocument(
      clothing,
      this,
      this.product_shop
    );
  }

  async updateProduct(productId) {
    return await this.updateProductAndDocument(
      clothing,
      this,
      this.product_shop,
      productId
    );
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

  async createProductV2() {
    return await this.createProductAndDocument(
      electronic,
      this,
      this.product_shop
    );
  }

  async updateProduct(productId) {
    return await this.updateProductAndDocument(
      electronic,
      this,
      this.product_shop,
      productId
    );
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

  async createProductV2() {
    return await this.createProductAndDocument(
      furniture,
      this,
      this.product_shop
    );
  }

  async updateProduct(productId) {
    return await this.updateProductAndDocument(
      furniture,
      this,
      this.product_shop,
      productId
    );
  }
}

ProductFactory.registerProductType("Electronics", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
