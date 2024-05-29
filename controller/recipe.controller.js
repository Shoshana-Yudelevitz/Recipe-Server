
const { Recipe, recipeValidators } = require('../models/recipe.model');
const mongoose = require('mongoose');
const { Category, categoryValidators } = require('../models/category.model');



// exports.getAllRecipe = async (req, res, next) => {
//     try {
//         const recipes = await Recipe.find({recipeName:new RegExp(search),isPrivate:false})
//         .skip((page - 1) * perPage)
//         .limit(perPage)
//         .select('-__v');
//         return res.json(recipes)
//     } catch {
//         next(error)
//     }
// }
// exports.getAllRecipe = async (req, res, next) => {
//     let { search, page, perPage } = req.query;
//     search ??= '';
//     page ??= 1;
//     perPage ??= 3;

//     try {
//         const recipes = await Recipe.find({recipename:new RegExp(search),isPrivate:true})
//            .skip((page - 1) * perPage)
//             .limit(perPage)
//             .select('-__v');
//             console.log(recipes);
//            return res.json(recipes)
//     } catch (error) {
//         next(error);
//     }
// };


exports.getAllRecipe = async (req, res, next) => {
    try {
        const recipes = await Recipe.find().select('-__v');
        return res.json(recipes)
    } catch {
        next(error)
    }
}
exports.getDetailsById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else {
        Recipe.findById(id, { __v: false })
            .then(c => {
                res.json(c);
            })
            .catch(err => {
                next({ message: 'recipe not found', status: 404 })
            })
    }
}

exports.getDetailsByTime = async (req, res, next) => {
    const timeUrl = req.params.time;
    try {
        const recipes = await Recipe.find();
        const filteredRecipes = recipes.filter(recipe => recipe.time <= timeUrl);
        if (filteredRecipes.length > 0) {
            res.json(filteredRecipes);
        } else {
            next({ message: 'recipe not found', status: 404 });
        }
    } catch (err) {
        next(err);
    }
}
exports.getDetailsByUser = async (req, res, next) => {
    const id = req.params.id;
    try {
        if (req.user.role === "manage" || req.body.role === "admin") {
            const user = await Recipe.find();
            const filteredRecipes = user.filter(recipe => recipe.userRecipe._id = id);
            if (filteredRecipes.length > 0) {
                res.json(filteredRecipes);
            } else {
                next({ message: 'recipe not found', status: 404 });
            }

        }
        else {
            next({ message: 'only users can' });
        }

    } catch (err) {
        next(err);
    }
}

// exports.addCategory=async(req,res,next)=>{
//    try{
//     const c=new Category(req.body);
//     console.log(c);
//     await c.save();
//     return res.status(201).json(c); 
//    }
//    catch(error){
//     next(error);
//    }
// }

exports.addRecipe = async (req, res, next) => {

    const v = recipeValidators.addAndUpdateRecipe.validate(req.body)
    if (v.error)
        return next({ message: v.error.message })

    try {

        if (req.user.role === "manage" || req.body.role === "admin") {
            const r = new Recipe(req.body);
            for (let i = 0; i < r.categories.length; i++) {
                const categoryDescription = r.categories[i].categoryName;
                const existingCategory = await Category.findOne({ description: categoryDescription });
                console.log(existingCategory, 'existingCategory')
                if (!existingCategory) {
                    const vc = categoryValidators.addAndUpdateCategory.validate(r.categories[i].categoryName)
                    if (vc.error)
                        return next({ message: vc.error.message })
                    try {
                        const c = new Category({ description: r.categories[i].categoryName, recipes: [{ recipeName: r.recipeName, recipeImage: r.recipeImage }] })
                        await c.save();
                    }
                    catch (error) {
                        next(error);
                    }
                }
                else {
                    existingCategory.recipes.push({ recipeName: r.recipeName, recipeImage: r.recipeImage })
                    await existingCategory.save();
                }
            }
            await r.save();
            return res.status(201).json(r);
        }
        else {
            next({ message: 'only manage or admin can do it' });
        }
    }

    catch (error) {
        next(error);
    }
}

exports.updateRecipe = async (req, res, next) => {
    const v = recipeValidators.addAndUpdateRecipe.validate(req.body)
    if (v.error)
        return next({ message: v.error.message })

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        if (req.user.role === "manage" || req.body.role === "admin") {
            const r = await Recipe.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true }
            )
            return res.json(r);
        }
        else {
            next({ message: 'only manage or admin can do it' });
        }
    }
    catch (error) {
        next(error)
    }
}



exports.deleteRecipe = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Recipe.findById(id)))
                return next({ message: 'Recipe not found', status: 404 })
            if (req.user.role === "manage" || req.body.role === "admin") {
                const c = await Recipe.findByIdAndDelete(id)
                for (let i = 0; i < c.categories.length; i++) {
                    const categoryDescription = c.categories[i].categoryName;
                    console.log(categoryDescription, "categoryDescription")
                    const exCategory = await Category.findOne({ description: categoryDescription });

                    if (exCategory.recipes.length !== 1) {
                        const filteredRecipes = exCategory.recipes.filter(recipe => recipe.recipeName !== c.recipeName);
                        exCategory.recipes = filteredRecipes;
                        await exCategory.save();
                    }
                    else {
                        await Category.findByIdAndDelete(exCategory._id)
                    }
                }
            }
            else {
                next({ message: 'only users can ' });
            }
            return res.status(204).send();


        } catch (error) {
            return next(error)
        }
    }
}
