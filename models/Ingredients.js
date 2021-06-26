import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    ingredient_name: {
        type: String,
        required:true
    },
    ingredient_fat: {
        type: Number,
        required:true
    },
    ingredient_calories: {
        type: Number,
        required:true
    },
    ingredient_carbohydrates: {
        type: Number,
        required:true
    },
    isImageModified: {
        type: Boolean,
        default: false,
        required:true
    },
    imageUrl: {
        type: String,
        required: true
    },

},{ timestamps: { createdAt: 'created_at' }});

export default mongoose.model("Ingredient", ingredientSchema);

/**
 * 
 * 
 * 

// userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'users'
// },

_id: String— the unique identifier created by MongoDB
 userId: String— the MongoDB unique identifier
 for the user who created the sauce
 name: String— name of the sauce
 manufacturer: String— manufacturer of the sauce
 description: String— description of the sauce
 mainPepper: String— the main pepper ingredient in the sauce
 imageUrl: String— the URL for the picture of the sauce uploaded by the user
 heat: Number— Number between 1 and 10 describing the sauce
 likes: Number— Number of users liking the sauce
 dislikes: Number— Number of users disliking the sauce
 usersLiked: [String]— array of user IDs of users having liked the sauce
 usersDisliked: [String]— array of user IDs of users having disliked the sauce
 */