const { model, Schema, Types } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, //percentage
    discount_value: { type: Number, required: true }, //10.000, 10
    discount_code: { type: String, required: true }, // discount code
    discount_start_date: { type: Date, required: true }, // ngay bat dau
    discount_end_date: { type: Date, required: true }, //Ngay ket thuc
    discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung
    discount_max_value: { type: Number, required: true },
    discount_users_count: { type: Number, required: true }, // so disocunt da su dung
    discount_users_used: { type: Array, default: [] }, // ai da su dung
    discount_max_user_per_users: { type: Number, required: true }, // So luong cho phep toi da duoc su dung
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: { type: Array, default: [] }, // so san pham duoc ap dung
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
