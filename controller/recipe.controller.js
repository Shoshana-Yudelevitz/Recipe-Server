
const { Recipe, recipeValidators } = require('../models/recipe.model');
const mongoose = require('mongoose');
const { Category, categoryValidators } = require('../models/category.model');
const { token } = require('morgan');
const { User } = require('../models/user.model');
const jwt = require('jsonwebtoken');


// exports.getAllRecipe = async (req, res, next) => {
//     let { search, page, perPage } = req.query;
//     search ??= '';
//     page ??= 1;
//     perPage ??=20 ;

//     console.log("params", search, perPage, page);
//     try {
//         const recipes = await Recipe.find({ recipeName: new RegExp(search), isPrivate: false })
//             .skip((page - 1) * perPage)
//             .limit(perPage)
//             .select('-__v')

//         return res.json(recipes);
//     } catch (error) {
//         next(error)
//     }
// }
exports.getAllRecipe = async (req, res, next) => {
    let { search, page, perPage, isFilter } = req.query;
    search ??= '';
    page ??= 1;
    perPage ??= 20;
    isFilter = isFilter === 'true';

    console.log("params", search, perPage, page, isFilter);
    try {
        let query = Recipe.find({ recipeName: new RegExp(search), isPrivate: false }).select('-__v');
        
        if (!isFilter) {
            query = query.skip((page - 1) * perPage).limit(perPage);
        }

        const recipes = await query;

        return res.json(recipes);
    } catch (error) {
        next(error)
    }
}

// exports.getAllRecipe = async (req, res, next) => {
//     console.log("aaa");
//     try {
//         const recipes = await Recipe.find().select('-__v');
//         return res.json(recipes)
//     } catch {
//         next(error)
//     }
// }


exports.getDetailsById = async (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })
    else {
        console.log(id);
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
        const recipes = await Recipe.find({ 'userRecipe._id': id });
        if (recipes.length > 0) {
            res.json(recipes);
        } else {
            next({ message: 'recipe not found', status: 404 });
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

//של GPT--- פה זה עובד מעולה,באנגולר
exports.addRecipe = async (req, res, next) => {
    const id=req.user.user_id
    const u=await User.findOne({_id:id})
    req.body.userRecipe={UserName:u.userName,_id:id}
    
    
    const v=recipeValidators.addAndUpdateRecipe.validate(req.body);
    if(v.error)
        return next({message:v.error.message})
    try {
        // if (req.user.role === "user" || req.user.role === "manage"||req.user.role === "admin") {

            const r = new Recipe(req.body);
            
            let foundCategory;
            for (let index = 0; index < r.categories.length; index++) {
                foundCategory = await Category.findOne({ description: r.categories[index].categoryName });
            }
  
            if (!foundCategory) {
                try {
                    for (let index = 0; index < r.categories.length; index++) {
                        const c = new Category({
                            description: r.categories[index].categoryName,
                            recipes: { recipeName: r.recipeName, image: r.image }
                        });
                        await c.save();
                       
                    }
                } catch (error) {
                    console.error(error);
                }
            } else {
                console.log(foundCategory);
                foundCategory.recipes.push({ recipeName: r.recipeName, image: r.image });
                await foundCategory.save();
            }
            
            await r.save();
            return res.status(201).json(r);
        // } else {
        //     next({ message: 'only user or admin can do it' });
        // }
    } 
    catch (error) {
        next(error);
    }
};


exports.updateRecipe = async (req, res, next) => {
    const v = recipeValidators.addAndUpdateRecipe.validate(req.body)
    if (v.error)
        return next({ message: v.error.message })

    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    try {
        // if (req.user.role === "manage" || req.body.role === "admin") {
            const r = await Recipe.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true }
            )
            return res.json(r);
        }
        // else {
        //     next({ message: 'only manage or admin can do it' });
        // }
    // }
    catch (error) {
        next(error)
    }
}



exports.deleteRecipe = async (req, res, next) => {
    console.log("נכנס");
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id))
        next({ message: 'id is not valid' })

    else {
        try {
            if (!(await Recipe.findById(id)))
                return next({ message: 'Recipe not found', status: 404 })
            // if (req.user.role === "manage" || req.body.role === "admin") {
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
            // }
            // else {
            //     next({ message: 'only users can ' });
            // }
           console.log("הצליח");
            return res.status(204).send();


        } catch (error) {
            console.log("נכשל");
            return next(error)
        }
    }
   
      
}
// exports.checkRecipeOwner = async (req, res, next) => {
//     console.log("vhhhhh");
//     const token = req.headers.authorization.split(' ')[1];
//     console.log(token,"token");
//     const creatorId = req.body.creatorId;
//     console.log(creatorId,"creatorId");
//     try {
//         // ולבדוק האם הטוקן תקין ומאומת
//         const decodedToken = jwt.verify(token, 'AEAE');
//        console.log(decodedToken,"decodedToken");
//         // אם הטוקן תקין, בדוק האם היוצר הוא אכן המשתמש הנוכחי
//         if (decodedToken.user_id === creatorId) {
//             console.log("true");
//             return res.status(200).json(true);
//         } else {
//             console.log("false");
//             return res.status(200).json(false); // אינו מורשה
//         }
//     } catch (error) {
//         return res.status(200).json(false); // טוקן לא תקין
//     }
// };
exports.checkRecipeOwner = async (req, res, next) => {
    console.log("vhhhhh");

    // בדיקה האם כותרת authorization קיימת
    if (!req.headers.authorization) {
        console.error('Authorization header is missing');
        return res.status(401).json({ error: 'Authorization header is missing' });
    }

    const tokenParts = req.headers.authorization.split(' ');

    // בדיקה האם הכותרת בפורמט הנכון
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        console.error('Invalid authorization header format');
        return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const token = tokenParts[1];
    console.log(token, "token");
    const creatorId = req.body.creatorId;
    console.log(creatorId, "creatorId");

    try {
        // ולבדוק האם הטוקן תקין ומאומת
        const decodedToken = jwt.verify(token, 'AEAE');
        console.log(decodedToken, "decodedToken");

        // אם הטוקן תקין, בדוק האם היוצר הוא אכן המשתמש הנוכחי
        if (decodedToken.user_id === creatorId) {
            console.log("true");
            return res.status(200).json(true);
        } else {
            console.log("false");
            return res.status(200).json(false); // אינו מורשה
        }
    } catch (error) {
        console.error('Token verification failed', error);
        return res.status(401).json({ error: 'Token verification failed' }); // טוקן לא תקין
    }
};
