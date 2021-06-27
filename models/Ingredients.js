import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ingredientSchema = new Schema(
  {
    ingredient_name: {
      type: String,
      required: true,
    },
    ingredient_fat: {
      type: Number,
      required: true,
    },
    ingredient_calories: {
      type: Number,
      required: true,
    },
    ingredient_carbohydrates: {
      type: Number,
      required: true,
    },
    isImageModified: {
      type: Boolean,
      default: false,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  { timestamps: { createdAt: 'created_at' } },
);

export default mongoose.model('Ingredient', ingredientSchema);
