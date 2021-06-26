import Ingredient from '../models/Ingredients.js';
import fs from 'fs';
import path from 'path';

class IngredientController {
    static async create(req, res, next) {
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
            });

            await ingredient.save();
            res.status(201).send({ message: 'ingredient added successfully.' });
        } catch (error) {
            return res.status(500).send({ error: 'Something went wrong!' });
        }
    }

    static async getSingleIngredient(req, res) {
        try {
            const ingredient = await Ingredient.findById({    _id: req.params.id,});
            if (!ingredient) return res.status(404).send({ error: 'Ingredient information not found' });
            return res.status(200).send(ingredient);
        } catch (error) {
            return res.status(500).send({ error: 'Something went wrong!' });
        }
    }

    static async getAllIngredients(req, res) {
        try {
            const ingredients = await Ingredient.find().sort({ created_at: 'desc' });
            return res.status(200).send(ingredients);
        } catch (error) {
            return res.status(500).send({ error: 'Something went wrong!' });
        }
    }

    static async updateIngredient(req, res) {
        try {
            const ingredient = await Ingredient.findById({ _id: req.params.id });
            if (!ingredient) return res.status(404).send({ error: 'Ingredient information not found' });

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
            return res.status(200).send({ message: 'ingredient updated successfully.' });
        } catch (error) {
            return res.status(500).send({ error: 'Something went wrong!' });
        }
    }

    static async deleteSingleIngredient(req, res) {
        try {
            const ingredient = await Ingredient.findById({    _id: req.params.id,});
            if (!ingredient) return res.status(404).send({ error: 'Ingredient information not found' });
            if (ingredient.imageUrl.includes('localhost')) {
                const imgUrl = ingredient.imageUrl.split('/images/').pop();
                if (fs.existsSync(path.resolve(`images/${imgUrl}`))) {
                    fs.unlinkSync(path.resolve(`images/${imgUrl}`));
                }
            }
            await Ingredient.deleteOne({ _id: ingredient._id });
            return res.status(200).send({ message: 'Ingredient was deleted successfully.' });
        } catch (error) {
            return res.status(500).send({ error: 'Something went wrong!' });
        }
    }
}

export default IngredientController;
