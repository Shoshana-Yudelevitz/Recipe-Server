const { Category } = require("../models/category.model");
const { User } = require("../models/user.model");


exports.getAllCategory=async (req,res,next)=>{
    try{
        const selectedFields = {
             code:1,
             description: 1, 
          };
        const category=await Category.find().select(selectedFields);
        console.log(category,"category");
        return res.json(category)
    }
    catch{
        next(error)
    }
}

// exports.getCategoryWithRecipes = async (req, res, next) => {
//     const name = req.params.name;
//     try {
//         const category = await Category.findOne({ description: name })
//             .populate('recipes')
//             .select('-__v')
//         return res.json(category)
//     } catch (error) {

//     }
// }

exports.getAllCategoryByRecipes=async (req,res,next)=>{
    const name = req.params.name;

    try{
        const category=await Category.findOne({ description: name })
        .populate({
            path: 'recipes',
            select: '-__v', 
            populate: {
                path:'User' ,
                select: '-__v'
            }
        })
        .select('-__v');
        console.log(category,"category");
        return res.json(category)
    }
    catch(error){
        next(error)
    }
}

exports.getCategoryById=async (req,res,next)=>{
     const id=req.params.id;
 
     try{
      const category = await Category.find();
      const filterCategories=category.filter(category=>category.id==id)
      if(filterCategories.length>0){
         res.json(filterCategories);
      }  else{
         next({message: 'recipe not found', status: 404})
      } 
       
     }
     catch(error){
         next(error)
     }
 }

