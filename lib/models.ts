import mongoose, { Schema } from 'mongoose';

const IngredientSchema = new Schema({
  id: String,
  name: String,
  price: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
}, { _id: false });

const ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  ingredients: [IngredientSchema],
  available: { type: Boolean, default: true },
});

const PromotionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
  discount: { type: Number, required: true },
  type: { type: String, enum: ['percentage', 'fixed'], required: true },
  productIds: [String],
  active: { type: Boolean, default: true },
  image: { type: String, default: '' },
});

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', PromotionSchema);
