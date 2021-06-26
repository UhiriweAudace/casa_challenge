import { BaseModel } from '../../../_metronic/shared/crud-table';

export interface Product extends BaseModel {
    id: string;
    product_name: string;
    ingredient_fat: number;
    ingredient_calories: number;
    ingredient_carbohydrates: number;
}

export interface Ingredient {
    results: Result[];
    offset: number;
    number: number;
    totalResults: number;
}

export interface Result {
    id?: number;
    name?: string;
    image?: string;
}

export interface IngredientNutrition {
    id: number;
    original: string;
    originalName: string;
    name: string;
    amount: number;
    unit: Unit;
    unitShort: Unit;
    unitLong: string;
    possibleUnits: string[];
    estimatedCost: EstimatedCost;
    consistency: string;
    aisle: string;
    image: string;
    meta: any[];
    nutrition: Nutrition;
    categoryPath: string[];
}

export interface EstimatedCost {
    value: number;
    unit: string;
}

export interface Nutrition {
    nutrients: Flavonoid[];
    properties: Flavonoid[];
    flavonoids: Flavonoid[];
    caloricBreakdown: CaloricBreakdown;
    weightPerServing: WeightPerServing;
}

export interface CaloricBreakdown {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
}

export interface Flavonoid {
    name: string;
    title: string;
    amount: number;
    unit: Unit;
}

export enum Unit {
    Empty = '',
    G = 'g',
    Iu = 'IU',
    Kcal = 'kcal',
    Mg = 'mg',
    Μg = 'µg',
}

export interface WeightPerServing {
    amount: number;
    unit: Unit;
}
