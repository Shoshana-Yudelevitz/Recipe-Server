const express= require('express');
const { getAllCategory, getAllCategoryByRecipes, getCategoryById } = require('../controller/category.controller');
const router=express.Router();


router.get('/',getAllCategory)
router.get('/getAllCategoryByRecipes/:name',getAllCategoryByRecipes)
router.get('/getCategoryById/:id',getCategoryById)
module.exports=router;

