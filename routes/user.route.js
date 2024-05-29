const express=require('express');
const { signIn, signUp, getAllUsers } = require('../controller/user.controller');
const { auth } = require('../middlewares/auth');


const router = express.Router();
router.post('/signIn',signIn)
router.post('/signUp',signUp)
router.get('/',auth,getAllUsers)


module.exports=router;