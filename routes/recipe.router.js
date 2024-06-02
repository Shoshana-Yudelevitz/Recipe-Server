const express=require('express');
const { getAllRecipe, getDetailsById, updateRecipe, deleteRecipe, getDetailsByTime, getDetailsByUser, addRecipe } = require('../controller/recipe.controller');
const { auth } = require('../middlewares/auth');


const router=express.Router();
router.get('/',getAllRecipe)
router.get('/:id',getDetailsById);
router.post('/addRecipe',auth,addRecipe)
router.put('/:id',auth,updateRecipe)
router.delete('/:id',auth,deleteRecipe)
router.get('/getDetailsByTime/:time',getDetailsByTime)
router.get('/getDetailsByUser/:id',auth,getDetailsByUser)

module.exports=router;