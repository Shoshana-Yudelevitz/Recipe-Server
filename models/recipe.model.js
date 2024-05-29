
const Joi = require('joi');
const mongoose=require('mongoose');


const layersSchema=new mongoose.Schema({
    descripitionOfLayer:{type:String,require:true},
    ingredients:{type:[String],require:true}
})

const minimalUserSchema=new mongoose.Schema({
    id:{type:Number,require:true},
    UserName:{type:String,require:true}
})
const minimalCategorySchema =new mongoose.Schema({
    id:{type:Number,require:true},
    categoryName:{type:String}
})

const recipeSchema =new mongoose.Schema({
    recipeName:{type:String,require:true},
    descripition:{type:String},
    categories:[minimalCategorySchema],
    time:{type:Number,require:true},
    level:{type:Number,enum:['1','2','3','4','5']},
    dateAdd:{type:Date},
    layers:[layersSchema],
    instructions:{type:String,require:true},
    image:{type:String,require:true},
    isPrivate:{type:Boolean,require:true},
    userRecipe:[minimalUserSchema]
})
module.exports.recipeSchema=recipeSchema
module.exports.Recipe=mongoose.model('recipe',recipeSchema)

module.exports.recipeValidators = {
    addAndUpdateRecipe: Joi.object({
        recipeName:Joi.string().required().min(3).max(20),
        descripition:Joi.string().min(5).max(100),
        categories:Joi.array().items(Joi.object({
                categoryName:Joi.string().required()
        })).required(),
        time:Joi.number().required(),
        level:Joi.number().required(),
        dateAdd:Joi.date().required(),
        layers:Joi.array().items(
            Joi.object({
                descripitionOfLayer: Joi.string().required(),
                ingredients: Joi.array().items(Joi.string()).required()
            })
        ).required(),
        instructions:Joi.string().required().min(10).max(1000),
        image:Joi.string().required(),
        isPrivate:Joi.bool().required(),
        userRecipe:Joi.required()
 })

}