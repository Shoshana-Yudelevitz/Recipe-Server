const mongoose=require('mongoose');
const Joi = require('joi');

const minimalRecipe=new mongoose.Schema({
    id:{type:Number},
    recipeName:{type:String},
    image:{type:String}
})

const categorySchema=new mongoose.Schema({
   description:{type:String,require:true},
   recipes:[minimalRecipe]

})

module.exports.categorySchema=categorySchema
module.exports.Category=mongoose.model('categories',categorySchema)

module.exports.categoryValidators={
    addAndUpdateCategory:Joi.object({
        description: Joi.string().required().min(3).max(20),
        recipes: Joi.array().items(
            Joi.object({
                recipeName: Joi.string().required(),
                image: Joi.string().required(),
            })
        ).required(),
    })
    
}