import fs from 'fs';
import path from 'path';

import Ingredient from '../models/Ingredients.js';

class IngredientController {
  static async create(req, res) {
    try {
      let data = JSON.parse(req.body.ingredient);
      if (req.file) {
        data.imageUrl = `http://${req.get('host')}/images/${req.file.filename}`;
        data.isImageModified = true;
      }

      const ingredient = new Ingredient({
        ingredient_name: data.name,
        ingredient_fat: data.fat,
        ingredient_calories: data.calories,
        ingredient_carbohydrates: data.carbohydrates,
        imageUrl: data.imageUrl,
        isImageModified: data.isImageModified,
        userId: req.user.id,
      });

      await ingredient.save();
      res.status(201).json({ message: 'ingredient added successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  static async getSingleIngredient(req, res) {
    try {
      const ingredient = await Ingredient.findById({ _id: req.params.id });
      if (!ingredient) return res.status(404).json({ error: 'Ingredient information not found' });
      if (String(ingredient.userId) !== String(req.user.id))
        return res.status(403).json({ error: 'Request Forbidden.' });
      return res.status(200).json(ingredient);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  static async getAllIngredients(req, res) {
    try {
      const ingredients = await Ingredient.find({ userId: req.user.id }).sort({
        created_at: 'desc',
      });
      return res.status(200).json(ingredients);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  static async updateIngredient(req, res) {
    try {
      const ingredient = await Ingredient.findById({ _id: req.params.id });
      if (!ingredient) return res.status(404).json({ error: 'Ingredient information not found' });
      if (String(ingredient.userId) !== String(req.user.id))
        return res.status(403).json({ error: 'Request Forbidden.' });

      let data = JSON.parse(req.body.ingredient);
      if (req.file) {
        if (ingredient.imageUrl.includes('localhost')) {
          const imgUrl = ingredient.imageUrl.split('/images/').pop();
          if (fs.existsSync(path.resolve(`images/${imgUrl}`))) {
            fs.unlinkSync(path.resolve(`images/${imgUrl}`));
          }
        }
        data.imageUrl = `http://${req.get('host')}/images/${req.file.filename}`;
        data.isImageModified = true;
      }
      await Ingredient.findByIdAndUpdate(req.params.id, {
        _id: req.params.id,
        ingredient_name: data.name || ingredient.ingredient_name,
        ingredient_fat: data.fat || ingredient.ingredient_fat,
        ingredient_calories: data.calories || ingredient.ingredient_calories,
        ingredient_carbohydrates: data.carbohydrates || ingredient.ingredient_carbohydrates,
        imageUrl: data.imageUrl || ingredient.imageUrl,
        isImageModified: data.isImageModified || ingredient.isImageModified,
      });
      return res.status(200).json({ message: 'ingredient updated successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }

  static async deleteSingleIngredient(req, res) {
    try {
      const ingredient = await Ingredient.findById({ _id: req.params.id });
      if (!ingredient) return res.status(404).json({ error: 'Ingredient information not found' });
      if (String(ingredient.userId) !== String(req.user.id))
        return res.status(403).json({ error: 'Request Forbidden.' });
      if (ingredient.imageUrl.includes('localhost')) {
        const imgUrl = ingredient.imageUrl.split('/images/').pop();
        if (fs.existsSync(path.resolve(`images/${imgUrl}`))) {
          fs.unlinkSync(path.resolve(`images/${imgUrl}`));
        }
      }
      await Ingredient.deleteOne({ _id: ingredient._id });
      return res.status(200).json({ message: 'Ingredient was deleted successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong!' });
    }
  }
}

export default IngredientController;
